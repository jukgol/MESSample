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
                formPlaceholder.innerHTML = `<div id="insert-container" class="insert-container"><div class="insert-header">➕ 데이터 추가</div><div id="insert-fields" class="insert-fields"></div></div>`;
            }
        } catch (error) {
            console.error('Error loading insert form:', error);
        }
    }

    async function fetchTables() {
        try {
            const response = await fetch('/api/TableData');
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.Message || result.message || `HTTP ${response.status}`);
            }
            displayTableList(result);
        } catch (error) {
            if (tableListMenu) tableListMenu.innerHTML = `<p style="padding:20px; color:#ff6b6b; font-size:0.8rem;">목록 조회 실패: <br>${error.message}</p>`;
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
            const rawText = await response.text(); // 일단 텍스트로 읽음
            
            let result;
            try {
                result = JSON.parse(rawText);
            } catch (e) {
                throw new Error(`서버 응답이 JSON 형식이 아닙니다: ${rawText.substring(0, 100)}...`);
            }

            if (!response.ok) {
                throw new Error(result.Message || result.message || `HTTP ${response.status}: ${rawText}`);
            }
            
            displayData(result);
            
            const meta = result.metadata || [];
            if (meta.length > 0) {
                setupInsertForm(meta); 
            } else {
                const fallbackMeta = (result.columns || []).map(c => ({ name: c, isIdentity: false, hasDefault: false }));
                setupInsertForm(fallbackMeta);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            tableSubtitle.innerHTML = `<span style="color:#ff6b6b; font-size:0.85rem; background:rgba(255,107,107,0.1); padding:4px 10px; border-radius:4px;">❌ ${error.message}</span>`;
            dataBody.innerHTML = `<tr><td colspan="100" class="empty-message" style="color:#ff6b6b; padding:40px;">${error.message}</td></tr>`;
        }
    };

    function displayData(result) {
        const { columns, rows } = result;
        if (!dataHead || !dataBody) return;

        dataHead.innerHTML = `<tr><th class="col-check"><input type="checkbox" id="check-all"></th>${columns.map(col => `<th>${col}</th>`).join('')}</tr>`;
        
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
    }

    async function setupInsertForm(metadata, retry = 0) {
        const container = document.getElementById('insert-container');
        const fields = document.getElementById('insert-fields');

        if ((!container || !fields) && retry < 10) {
            setTimeout(() => setupInsertForm(metadata, retry + 1), 100);
            return;
        }

        if (!container || !fields) return;
        
        if (!metadata || metadata.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        fields.innerHTML = metadata.map(col => {
            const isAuto = col.isIdentity || col.hasDefault || col.IsIdentity || col.HasDefault;
            const colName = col.name || col.Name;
            return `
                <div class="field-group">
                    <label>${colName}${isAuto ? ' <small>(AUTO)</small>' : ''}</label>
                    <input type="text" class="insert-input" data-column="${colName}" ${isAuto ? 'disabled style="opacity: 0.4;"' : ''}>
                </div>`;
        }).join('');
    }

    window.handleInsertRow = async () => {
        const inputs = document.querySelectorAll('.insert-input:not([disabled])');
        const rowData = {};
        inputs.forEach(input => {
            const val = input.value.trim();
            if (val) rowData[input.dataset.column] = val;
        });

        try {
            const response = await fetch(`/api/TableData/${currentTableName}/row`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rowData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message || '추가 완료');
                window.fetchTableData(currentTableName, document.querySelector('.menu-item.active'));
            } else { alert('오류: ' + (result.Message || result.message)); }
        } catch (error) { alert('통신 오류'); }
    };
});
