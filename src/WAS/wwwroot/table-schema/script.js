// manager_table_schema.js

/**
 * 테이블 스키마 관리 메인 모듈
 * 구조: State(데이터) -> Managers(로직) -> App(컨트롤러)
 * UI 템플릿은 component_table_schema.js에 정의됨
 */

// 1. 전역 상태 관리
const State = {
    currentTableName: '',
    currentMetadata: [],
    attribScripts: []
};

// 2. 좌측 테이블 목록 관리 (Navigator)
const TableNavigator = {
    init: async function() {
        try {
            const response = await fetch('/api/TableData');
            if (!response.ok) throw new Error('목록 조회 실패');
            const tables = await response.json();
            this.render(tables);
        } catch (error) {
            const menu = document.getElementById('table-list-menu');
            if (menu) menu.innerHTML = `<p style="padding:20px; color:#ff6b6b;">${error.message}</p>`;
        }
    },
    render: function(tables) {
        const menu = document.getElementById('table-list-menu');
        if (!menu) return;
        menu.innerHTML = tables.map(name => Components.tableMenuItem(name)).join('');
    }
};

// 3. 중앙 테이블 구조 표시 (Viewer)
const SchemaViewer = {
    render: function(metadata) {
        const body = document.getElementById('schema-body');
        if (!metadata || metadata.length === 0) {
            body.innerHTML = '<tr><td colspan="4" class="empty-message">정보가 없습니다.</td></tr>';
            return;
        }

        body.innerHTML = metadata.map(col => Components.schemaTableRow(col)).join('');
    },
    highlightRow: function(colName) {
        document.querySelectorAll('#schema-body tr').forEach(tr => {
            tr.classList.toggle('selected', tr.dataset.col === colName);
        });
    }
};

// 4. 우측 속성 변경 관리 (AttributeManager)
const AttributeManager = {
    init: async function() {
        try {
            const response = await fetch('/api/TableAttribute/scripts');
            if (response.ok) {
                State.attribScripts = await response.json();
            }
        } catch (error) {
            console.error('Failed to fetch attrib scripts:', error);
        }
    },
    render: function(metadata) {
        const container = document.getElementById('query-list-container');
        if (!State.attribScripts || State.attribScripts.length === 0) {
            container.innerHTML = '<p style="padding:20px; color:#ff6b6b;">Attrib 폴더에 SQL 스크립트가 없습니다.</p>';
            return;
        }

        const colOptions = metadata.map(col => `<option value="${col.name || col.Name}">${col.name || col.Name}</option>`).join('');
        
        // 1. 일반 스크립트 목록 (ADD_COLUMN.sql 제외)
        const generalScripts = State.attribScripts
            .filter(file => file !== 'ADD_COLUMN.sql')
            .map(file => Components.attributeScriptItem(file, colOptions))
            .join('');

        // 2. 새 컬럼 추가 폼 (항상 또는 특정 조건에서 표시)
        const addColumnForm = Components.addColumnForm();

        container.innerHTML = generalScripts + addColumnForm;
    },
    syncColumn: function(colName) {
        document.querySelectorAll('.script-col-select').forEach(select => {
            select.value = colName;
        });
    },
    execute: async function(filename, isNewColumn = false) {
        let requestBody = {
            fileName: filename,
            tableName: State.currentTableName,
            columnName: 'NONE' // 기본값
        };

        if (isNewColumn) {
            const newName = document.getElementById('new-col-name').value.trim();
            if (!newName) { alert('추가할 컬럼명을 입력하세요.'); return; }
            
            requestBody.newColumnName = newName;
            requestBody.dataType = document.getElementById('new-col-type').value;
            requestBody.isNotNull = document.getElementById('new-col-notnull').checked;
            requestBody.isUnique = document.getElementById('new-col-unique').checked;
        } else {
            const selectEl = document.getElementById(`select-col-${filename}`);
            requestBody.columnName = selectEl.value;
        }

        if (!confirm(`[${State.currentTableName}] 테이블에 대해 스크립트를 실행하시겠습니까?`)) return;

        try {
            const response = await fetch('/api/TableAttribute/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            if (response.ok) {
                alert('성공: ' + result.message);
                App.loadTableSchema(State.currentTableName);
            } else {
                console.error('Script execution failed!', result);
                alert('실패: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('통신 오류가 발생했습니다.');
        }
    }
};

// 5. 메인 컨트롤러 (App)
const App = {
    init: async function() {
        await Promise.all([
            TableNavigator.init(),
            AttributeManager.init()
        ]);
        this.loadModalContainer();
    },
    loadModalContainer: async function() {
        try {
            const response = await fetch('create/modal_create_table.html');
            if (response.ok) {
                const html = await response.text();
                document.getElementById('modal-container').innerHTML = html;
                
                // 모달 JS 로드
                const script = document.createElement('script');
                script.src = 'create/modal_create_table.js';
                document.body.appendChild(script);
            }
        } catch (e) {
            console.error('Failed to load modal container', e);
        }
    },
    loadTableSchema: async function(tableName, element) {
        State.currentTableName = tableName;
        
        // UI 초기화
        this._updateSidebarSelection(element, tableName);
        this._showLoadingStates(tableName);

        try {
            const response = await fetch(`/api/TableData/${tableName}/data`);
            if (!response.ok) throw new Error('조회 실패');
            const result = await response.json();
            
            State.currentMetadata = result.metadata || [];
            
            // 데이터 렌더링
            SchemaViewer.render(State.currentMetadata);
            AttributeManager.render(State.currentMetadata);
            
            document.getElementById('current-table-subtitle').textContent = `총 ${State.currentMetadata.length}개의 컬럼이 정의되어 있습니다.`;
        } catch (error) {
            document.getElementById('schema-body').innerHTML = `<tr><td colspan="4" class="empty-message" style="color:#ff6b6b;">오류: ${error.message}</td></tr>`;
        }
    },
    selectColumn: function(colName) {
        SchemaViewer.highlightRow(colName);
        AttributeManager.syncColumn(colName);
    },
    _updateSidebarSelection: function(element, tableName) {
        if (element) {
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        } else {
            const activeItem = Array.from(document.querySelectorAll('.menu-item')).find(el => el.innerText.includes(tableName));
            if (activeItem) activeItem.classList.add('active');
        }
    },
    _showLoadingStates: function(tableName) {
        document.getElementById('current-table-title').textContent = `STRUCTURE: ${tableName}`;
        document.getElementById('current-table-subtitle').textContent = '조회 중...';
        document.getElementById('schema-body').innerHTML = '<tr><td colspan="4" class="empty-message">로딩 중...</td></tr>';
        document.getElementById('query-list-container').innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.1); padding-top: 50px;">스크립트를 로딩 중입니다...</p>';
    }
};

// 전역 노출 (HTML 인라인 onclick 대응)
window.App = App;
window.AttributeManager = AttributeManager;

// 초기화 시작
document.addEventListener('DOMContentLoaded', () => App.init());
