document.addEventListener('DOMContentLoaded', () => {
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

    if (scrollContainer && headerArea) {
        scrollContainer.addEventListener('scroll', () => {
            headerArea.scrollLeft = scrollContainer.scrollLeft;
        });
    }

    fetchTables();
    loadInsertForm();

    async function loadInsertForm() {
        try {
            console.log('Loading insert form HTML...');
            const response = await fetch('section_insert_row.html');
            if (response.ok) {
                formPlaceholder.innerHTML = await response.text();
                console.log('Insert form HTML loaded successfully.');
            } else {
                console.error('Failed to load section_insert_row.html:', response.status);
                // 실패 시 내장 템플릿이라도 삽입
                formPlaceholder.innerHTML = `
                    <div id="insert-container" class="insert-container">
                        <div class="insert-header"><span class="icon">➕</span> 데이터 추가</div>
                        <div id="insert-fields" class="insert-fields"></div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn-primary" onclick="handleInsertRow()" style="width: auto; padding: 10px 30px;">추가하기</button>
                        </div>
                    </div>`;
            }
        } catch (error) {
            console.error('Error loading insert form:', error);
        }
    }

    async function fetchTables() {
        try {
            const response = await fetch('/api/TableData');
            if (!response.ok) throw new Error(`오류: ${response.status}`);
            const tables = await response.json();
            displayTableList(tables);
        } catch (error) {
            if (tableListMenu) tableListMenu.innerHTML = `<p style="padding:20px; color:#ff6b6b;">${error.message}</p>`;
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

        tableTitle.textContent = `TABLE: ${tableName}`;
        tableSubtitle.textContent = '조회 중...';
        dataHead.innerHTML = '';
        dataBody.innerHTML = '<tr><td class="empty-message">로딩 중...</td></tr>';
        
        const insertContainer = document.getElementById('insert-container');
        if (insertContainer) insertContainer.style.display = 'none';

        try {
            const response = await fetch(`/api/TableData/${tableName}/data`);
            if (!response.ok) throw new Error('데이터 요청 실패');
            const result = await response.json();
            
            console.log('Table Data Result:', result);

            displayData(result);
            
            // 메타데이터가 있으면 상세 폼, 없으면 기본 컬럼 기반 폼 생성
            const meta = result.metadata || [];
            if (meta.length > 0) {
                setupInsertForm(meta); 
            } else {
                // 메타데이터가 없을 경우 컬럼 이름만으로라도 폼 생성 (하위 호환성)
                const fallbackMeta = (result.columns || []).map(c => ({ name: c, isIdentity: false, hasDefault: false }));
                setupInsertForm(fallbackMeta);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            tableSubtitle.textContent = '조회 실패';
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
            dataBody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="empty-message">데이터 없음</td></tr>`;
            return;
        }

        tableSubtitle.textContent = `최근 데이터 ${rows.length}건`;
        dataBody.innerHTML = rows.map((row, i) => `
            <tr>
                <td class="col-check"><input type="checkbox" class="row-check"></td>
                ${columns.map(col => `<td>${row[col] === null ? '' : row[col]}</td>`).join('')}
            </tr>
        `).join('');

        document.querySelectorAll('.row-check').forEach(cb => cb.addEventListener('change', updateSelectionState));
    }

    async function setupInsertForm(metadata, retry = 0) {
        const container = document.getElementById('insert-container');
        const fields = document.getElementById('insert-fields');

        if ((!container || !fields) && retry < 10) {
            console.log('Form container not ready, retrying...', retry);
            setTimeout(() => setupInsertForm(metadata, retry + 1), 100);
            return;
        }

        if (!container || !fields) {
            console.error('Could not find insert-fields even after retries.');
            return;
        }
        
        console.log('Rendering fields for metadata:', metadata);

        if (!metadata || metadata.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        fields.innerHTML = metadata.map(col => {
            const isAuto = col.isIdentity || col.hasDefault || col.IsIdentity || col.HasDefault;
            const colName = col.name || col.Name;
            const placeholder = isAuto ? `자동 입력` : `입력하세요`;
            const disabledAttr = isAuto ? 'disabled style="opacity: 0.4;"' : '';
            
            return `
                <div class="field-group">
                    <label>${colName}${isAuto ? ' <small>(AUTO)</small>' : ''}</label>
                    <input type="text" class="insert-input" data-column="${colName}" placeholder="${placeholder}" ${disabledAttr}>
                </div>`;
        }).join('');
    }

    window.handleInsertRow = async () => {
        const inputs = document.querySelectorAll('.insert-input:not([disabled])');
        const rowData = {};
        let hasValue = false;

        inputs.forEach(input => {
            const val = input.value.trim();
            if (val) { rowData[input.dataset.column] = val; hasValue = true; }
        });

        if (!hasValue) { alert('데이터를 입력해 주세요.'); return; }

        try {
            const response = await fetch(`/api/TableData/${currentTableName}/row`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rowData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                document.querySelectorAll('.insert-input').forEach(i => i.value = '');
                window.fetchTableData(currentTableName, document.querySelector('.menu-item.active'));
            } else { alert('오류: ' + result.message); }
        } catch (error) { alert('통신 오류'); }
    };

    function updateSelectionState() {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        if (selectedCountSpan) selectedCountSpan.textContent = checkedCount;
        if (selectionBar) selectionBar.style.display = checkedCount > 0 ? 'flex' : 'none';
    }

    window.handleDeleteSelected = () => {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        if (confirm(`${checkedCount}개 행을 삭제하시겠습니까?`)) {
            alert('삭제 기능 준비 중');
        }
    };
});
