document.addEventListener('DOMContentLoaded', () => {
    const tableListMenu = document.getElementById('table-list-menu');
    const tableTitle = document.getElementById('current-table-title');
    const tableSubtitle = document.getElementById('current-table-subtitle');
    const dataHead = document.getElementById('data-table-head');
    const dataBody = document.getElementById('data-table-body');

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
        // UI 상태 업데이트
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        tableTitle.textContent = `TABLE: ${tableName}`;
        tableSubtitle.textContent = '데이터를 불러오는 중입니다...';
        dataHead.innerHTML = '';
        dataBody.innerHTML = '<tr><td class="empty-message">로딩 중...</td></tr>';

        try {
            const response = await fetch(`/api/Navigator/tables/${tableName}/data`);
            if (!response.ok) throw new Error('데이터 요청 실패');

            const result = await response.json(); // { Columns: [], Rows: [] }
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

        // 헤더 생성
        dataHead.innerHTML = `<tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>`;

        // 본문 생성
        if (!rows || rows.length === 0) {
            tableSubtitle.textContent = `조회 결과: 0건`;
            dataBody.innerHTML = `<tr><td colspan="${columns.length}" class="empty-message">조회된 데이터가 없습니다.</td></tr>`;
            return;
        }

        tableSubtitle.textContent = `최근 데이터 ${rows.length}건을 표시합니다.`;
        dataBody.innerHTML = rows.map(row => `
            <tr>
                ${columns.map(col => `<td>${row[col] === null ? '' : row[col]}</td>`).join('')}
            </tr>
        `).join('');
    }
});

