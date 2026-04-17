document.addEventListener('DOMContentLoaded', () => {
    const btnFetch = document.getElementById('btn-fetch-tables');
    const tableBody = document.getElementById('table-body');

    if (btnFetch) {
        btnFetch.addEventListener('click', fetchTables);
    }

    async function fetchTables() {
        btnFetch.disabled = true;
        btnFetch.textContent = '조회 중...';
        tableBody.innerHTML = '<tr><td colspan="2" class="empty-message">데이터를 불러오는 중입니다...</td></tr>';

        try {
            const response = await fetch('/api/DbTest/tables');
            if (!response.ok) throw new Error('데이터 요청 실패');

            const tables = await response.json();
            displayTables(tables);
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="2" class="empty-message" style="color: #ff6b6b;">오류: ${error.message}</td></tr>`;
        } finally {
            btnFetch.disabled = false;
            btnFetch.textContent = '조회 (Refresh)';
        }
    }

    function displayTables(tables) {
        if (!tables || tables.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2" class="empty-message">생성된 테이블이 없습니다.</td></tr>';
            return;
        }

        tableBody.innerHTML = tables.map((name, i) => `
            <tr>
                <td class="col-idx">${i + 1}</td>
                <td>${name}</td>
            </tr>
        `).join('');
    }
});
