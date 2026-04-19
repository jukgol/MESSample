document.addEventListener('DOMContentLoaded', () => {
    // 요소 참조
    const tableListMenu = document.getElementById('table-list-menu');
    const tableTitle = document.getElementById('current-table-title');
    const tableSubtitle = document.getElementById('current-table-subtitle');
    const dataHead = document.getElementById('data-table-head');
    const dataBody = document.getElementById('data-table-body');
    const selectionBar = document.getElementById('selection-bar');
    const selectedCountSpan = document.getElementById('selected-count');
    const formPlaceholder = document.getElementById('insert-form-placeholder');
    const scrollContainer = document.getElementById('table-scroll-container');
    const headerArea = document.querySelector('.table-header-area');

    let currentTableName = '';

    // 가로 스크롤 동기화
    if (scrollContainer && headerArea) {
        scrollContainer.addEventListener('scroll', () => {
            headerArea.scrollLeft = scrollContainer.scrollLeft;
        });
    }

    // 1. 초기 실행
    fetchTables();
    loadInsertForm();

    // 외부 입력 폼 HTML 로드
    async function loadInsertForm() {
        try {
            const response = await fetch('section_insert_row.html');
            if (response.ok) {
                formPlaceholder.innerHTML = await response.text();
            }
        } catch (error) {
            console.error('Failed to load insert form:', error);
        }
    }

    async function fetchTables() {
        try {
            const response = await fetch('/api/Tables');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`서버 응답 오류 (${response.status}): ${errorText}`);
            }
            const tables = await response.json();
            displayTableList(tables);
        } catch (error) {
            console.error('FetchTables Error Detail:', error);
            if (tableListMenu) tableListMenu.innerHTML = `<p style="padding:20px; color:#ff6b6b; font-size:0.8rem;">오류: ${error.message}</p>`;
        }
    }


    function displayTableList(tables) {
        if (!tableListMenu) return;
        tableListMenu.innerHTML = tables.map(name => `
            <button class="menu-item" onclick="fetchTableData('${name}', this)">
                <span class="icon">📄</span>
                <span class="name">${name}</span>
            </button>
        `).join('');
    }

    window.fetchTableData = async (tableName, element) => {
        currentTableName = tableName;
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        if (tableTitle) tableTitle.textContent = `TABLE: ${tableName}`;
        if (tableSubtitle) tableSubtitle.textContent = '데이터를 불러오는 중입니다...';
        if (dataHead) dataHead.innerHTML = '';
        if (dataBody) dataBody.innerHTML = '<tr><td class="empty-message">로딩 중...</td></tr>';
        if (selectionBar) selectionBar.style.display = 'none'; 
        
        const insertContainer = document.getElementById('insert-container');
        if (insertContainer) insertContainer.style.display = 'none';

        try {
            const response = await fetch(`/api/Tables/${tableName}/data`);
            if (!response.ok) throw new Error('데이터 요청 실패');
            const result = await response.json();
            displayData(result);
            setupInsertForm(result.columns);
        } catch (error) {
            if (tableSubtitle) tableSubtitle.textContent = '데이터를 불러오지 못했습니다.';
            if (dataBody) dataBody.innerHTML = `<tr><td class="empty-message" style="color:#ff6b6b;">오류: ${error.message}</td></tr>`;
        }
    };

    function displayData(result) {
        const { columns, rows } = result;
        if (!dataHead || !dataBody) return;

        dataHead.innerHTML = `<tr><th class="col-check"><input type="checkbox" id="check-all"></th>${columns.map(col => `<th>${col}</th>`).join('')}</tr>`;
        
        const checkAll = document.getElementById('check-all');
        if (checkAll) {
            checkAll.addEventListener('change', (e) => {
                document.querySelectorAll('.row-check').forEach(cb => cb.checked = e.target.checked);
                updateSelectionState();
            });
        }

        if (!rows || rows.length === 0) {
            if (tableSubtitle) tableSubtitle.textContent = `조회 결과: 0건`;
            dataBody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="empty-message">조회된 데이터가 없습니다.</td></tr>`;
            return;
        }

        if (tableSubtitle) tableSubtitle.textContent = `최근 데이터 ${rows.length}건을 표시합니다.`;
        dataBody.innerHTML = rows.map((row, i) => `
            <tr>
                <td class="col-check"><input type="checkbox" class="row-check" data-index="${i}"></td>
                ${columns.map(col => `<td>${row[col] === null ? '' : row[col]}</td>`).join('')}
            </tr>
        `).join('');

        document.querySelectorAll('.row-check').forEach(cb => cb.addEventListener('change', updateSelectionState));
    }

    function setupInsertForm(columns) {
        const container = document.getElementById('insert-container');
        const fields = document.getElementById('insert-fields');
        if (!container || !fields) return;
        
        container.style.display = 'block';
        fields.innerHTML = columns.map(col => `
            <div class="field-group">
                <label>${col}</label>
                <input type="text" class="insert-input" data-column="${col}" placeholder="${col} 입력">
            </div>
        `).join('');
    }

    window.handleInsertRow = async () => {
        const inputs = document.querySelectorAll('.insert-input');
        const rowData = {};
        let hasValue = false;
        inputs.forEach(input => {
            const val = input.value.trim();
            if (val) { rowData[input.dataset.column] = val; hasValue = true; }
        });

        if (!hasValue) { alert('입력된 데이터가 없습니다.'); return; }

        try {
            const response = await fetch(`/api/Navigator/tables/${currentTableName}/row`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rowData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                inputs.forEach(input => input.value = '');
                window.fetchTableData(currentTableName, document.querySelector('.menu-item.active'));
            } else { alert('추가 실패: ' + result.message); }
        } catch (error) { alert('통신 오류가 발생했습니다.'); }
    };

    function updateSelectionState() {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        if (selectedCountSpan) selectedCountSpan.textContent = checkedCount;
        if (selectionBar) selectionBar.style.display = checkedCount > 0 ? 'flex' : 'none';
        const totalCount = document.querySelectorAll('.row-check').length;
        const checkAll = document.getElementById('check-all');
        if (checkAll) checkAll.checked = (checkedCount === totalCount && totalCount > 0);
    }

    window.handleDeleteSelected = () => {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        if (confirm(`선택한 ${checkedCount}개의 행을 정말 삭제하시겠습니까?`)) {
            alert(`${currentTableName} 테이블의 데이터 삭제 기능은 구현 중입니다.`);
        }
    };
});
