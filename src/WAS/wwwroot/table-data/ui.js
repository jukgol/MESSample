/**
 * UI Rendering Layer (Pure View Layer)
 */

export function renderTableList(tables, menuElement) {
    if (!menuElement) return;
    menuElement.innerHTML = tables.map(name => `
        <button class="menu-item" data-table="${name}">
            <span class="icon">📄</span>
            <span class="name">${name}</span>
        </button>
    `).join('');
}

export function renderTableData(result, headEl, bodyEl, subtitleEl, printBtn) {
    const { columns, rows } = result;
    if (!headEl || !bodyEl) return;

    headEl.innerHTML = `<tr><th class="col-check"><input type="checkbox" id="check-all"></th>${columns.map(col => `<th>${col}</th>`).join('')}</tr>`;
    
    if (!rows || rows.length === 0) {
        bodyEl.innerHTML = `<tr><td colspan="${columns.length + 1}" class="empty-message">데이터 없음</td></tr>`;
        if (subtitleEl) subtitleEl.textContent = `최근 데이터 0건`;
        if (printBtn) printBtn.style.display = 'none';
        return;
    }

    if (subtitleEl) subtitleEl.textContent = `최근 데이터 ${rows.length}건`;
    if (printBtn) printBtn.style.display = 'inline-block';

    bodyEl.innerHTML = rows.map(row => `
        <tr>
            <td class="col-check"><input type="checkbox" class="row-check"></td>
            ${columns.map(col => `<td>${row[col] === null ? '' : row[col]}</td>`).join('')}
        </tr>
    `).join('');
}

export function renderInsertForm(metadata, container, fieldsEl) {
    if (!container || !fieldsEl) return;
    
    if (!metadata || metadata.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    fieldsEl.innerHTML = metadata.map(col => {
        const isAuto = col.isIdentity || col.hasDefault || col.IsIdentity || col.HasDefault;
        const colName = col.name || col.Name;
        return `
            <div class="field-group">
                <label>${colName}${isAuto ? ' <small>(AUTO)</small>' : ''}</label>
                <input type="text" class="insert-input" data-column="${colName}" ${isAuto ? 'disabled style="opacity: 0.4;"' : ''}>
            </div>`;
    }).join('');
}
