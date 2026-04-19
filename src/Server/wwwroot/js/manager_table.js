document.addEventListener('DOMContentLoaded', () => {
    const tableListMenu = document.getElementById('table-list-menu');
    const tableTitle = document.getElementById('current-table-title');
    const tableSubtitle = document.getElementById('current-table-subtitle');
    const dataHead = document.getElementById('data-table-head');
    const dataBody = document.getElementById('data-table-body');
    const selectionBar = document.getElementById('selection-bar');
    const selectedCountSpan = document.getElementById('selected-count');

    let currentTableName = '';

    // 1. 초기 실행: 테이블 목록 가져오기
    fetchTables();

    async function fetchTables() {
        try {
            const response = await fetch('/api/Navigator/tables');
            if (!response.ok) throw new Error('테이블 목록 요청 실패');

            const tables = await response.json();
            displayTableList(tables);
        } catch (error) {
            tableListMenu.innerHTML = `<p style="padding:20px; color:#ff6b6b; font-size:0.8rem;">오류: ${error.message}</p>`;
        }
    }

    function displayTableList(tables) {
        if (!tables || tables.length === 0) {
            tableListMenu.innerHTML = '<p style="padding:20px; color:rgba(255,255,255,0.2); font-size:0.8rem;">테이블이 없습니다.</p>';
            return;
        }

        tableListMenu.innerHTML = tables.map(name => `
            <button class="menu-item" onclick="fetchTableData('${name}', this)">
                <span class="icon">📄</span>
                <span class="name">${name}</span>
            </button>
        `).join('');
    }

    // 2. 특정 테이블 데이터 조회 함수 (글로벌 등록)
    window.fetchTableData = async (tableName, element) => {
        currentTableName = tableName;
        
        // UI 상태 업데이트
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        tableTitle.textContent = `TABLE: ${tableName}`;
        tableSubtitle.textContent = '데이터를 불러오는 중입니다...';
        dataHead.innerHTML = '';
        dataBody.innerHTML = '<tr><td class="empty-message">로딩 중...</td></tr>';
        selectionBar.style.display = 'none'; // 새 테이블 로드 시 선택 바 숨김

        try {
            const response = await fetch(`/api/Navigator/tables/${tableName}/data`);
            if (!response.ok) throw new Error('데이터 요청 실패');

            const result = await response.json();
            displayData(result);
        } catch (error) {
            tableSubtitle.textContent = '데이터를 불러오지 못했습니다.';
            dataBody.innerHTML = `<tr><td class="empty-message" style="color:#ff6b6b;">오류: ${error.message}</td></tr>`;
        }
    };

    function displayData(result) {
        const { columns, rows } = result;

        if (!columns || columns.length === 0) {
            dataBody.innerHTML = '<tr><td class="empty-message">컬럼 정보가 없습니다.</td></tr>';
            return;
        }

        // 헤더 생성 (맨 앞에 전체 선택 체크박스 추가)
        dataHead.innerHTML = `
            <tr>
                <th class="col-check"><input type="checkbox" id="check-all"></th>
                ${columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
        `;

        // 전체 선택 이벤트 바인딩
        document.getElementById('check-all').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.row-check');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
            updateSelectionState();
        });

        // 본문 생성 (맨 앞에 행 체크박스 추가)
        if (!rows || rows.length === 0) {
            tableSubtitle.textContent = `조회 결과: 0건`;
            dataBody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="empty-message">조회된 데이터가 없습니다.</td></tr>`;
            return;
        }

        tableSubtitle.textContent = `최근 데이터 ${rows.length}건을 표시합니다.`;
        dataBody.innerHTML = rows.map((row, i) => `
            <tr>
                <td class="col-check"><input type="checkbox" class="row-check" data-index="${i}"></td>
                ${columns.map(col => `<td>${row[col] === null ? '' : row[col]}</td>`).join('')}
            </tr>
        `).join('');

        // 각 체크박스에 변경 이벤트 바인딩
        document.querySelectorAll('.row-check').forEach(cb => {
            cb.addEventListener('change', updateSelectionState);
        });
    }

    // 선택 상태 업데이트 (개수 표시 및 액션 바 가시성)
    function updateSelectionState() {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        selectedCountSpan.textContent = checkedCount;
        
        if (checkedCount > 0) {
            selectionBar.style.display = 'flex';
        } else {
            selectionBar.style.display = 'none';
        }

        // 전체 선택 체크박스 상태 동기화
        const totalCount = document.querySelectorAll('.row-check').length;
        document.getElementById('check-all').checked = (checkedCount === totalCount);
    }

    // [추가] 삭제 버튼 핸들러
    window.handleDeleteSelected = () => {
        const checkedCount = document.querySelectorAll('.row-check:checked').length;
        if (confirm(`선택한 ${checkedCount}개의 행을 정말 삭제하시겠습니까?`)) {
            alert(`${currentTableName} 테이블의 데이터 삭제 기능은 구현 중입니다.`);
        }
    };
});

