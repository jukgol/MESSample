// component_table_schema.js

/**
 * 테이블 스키마 관리 UI 템플릿 컴포넌트
 */
const Components = {
    // 좌측 테이블 목록 아이템
    tableMenuItem: (name) => `
        <button class="menu-item" onclick="App.loadTableSchema('${name}', this)">
            <span class="icon">🏗️</span>
            <span class="name">${name}</span>
        </button>`,

    // 중앙 스키마 테이블 행
    schemaTableRow: (col) => {
        const isIdentity = col.isIdentity || col.IsIdentity;
        const hasDefault = col.hasDefault || col.HasDefault;
        const colName = col.name || col.Name;
        const dataType = col.dataType || col.DataType;
        const isNullable = col.isNullable || col.IsNullable;

        return `
            <tr onclick="App.selectColumn('${colName}')" data-col="${colName}">
                <td><strong>${colName}</strong></td>
                <td>${dataType}</td>
                <td>${isNullable ? 'Yes' : 'No'}</td>
                <td>
                    ${isIdentity ? '<span class="badge identity">IDENTITY</span>' : ''}
                    ${hasDefault ? '<span class="badge default">DEFAULT</span>' : ''}
                </td>
            </tr>`;
    },

    // 우측 속성 변경 스크립트 아이템
    attributeScriptItem: (file, colOptions) => `
        <div class="query-item" style="margin-bottom:8px;">
            <div class="query-box" style="display:flex; align-items:center; gap:10px; padding:8px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:6px;">
                <!-- 1. 파일명 -->
                <div style="flex: 1.2; font-size:0.75rem; font-weight:bold; color:var(--accent-color); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${file}">
                    <span style="opacity:0.6; margin-right:4px;">📄</span>${file}
                </div>
                
                <!-- 2. 컬럼 선택 -->
                <div style="flex: 1; display:flex; align-items:center;">
                    <select id="select-col-${file}" class="script-col-select" style="width:100%; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); color:white; padding:4px 6px; border-radius:4px; font-size:0.75rem; min-width:0;">
                        ${colOptions}
                    </select>
                </div>

                <!-- 3. 실행 버튼 -->
                <button class="btn-primary" onclick="AttributeManager.execute('${file}')" style="width:auto; padding:4px 12px; font-size:0.7rem; font-weight:bold; white-space:nowrap; border-radius:4px;">
                    Run
                </button>
            </div>
        </div>`
};

// 전역 노출
window.Components = Components;
