/**
 * API Data Layer (Pure Data Layer)
 */

export async function fetchTables() {
    const response = await fetch('/api/admin/TableData');
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.Message || result.message || `HTTP ${response.status}`);
    }
    return result;
}

export async function fetchTableData(tableName) {
    const response = await fetch(`/api/admin/TableData/${tableName}/data`);
    const rawText = await response.text();
    
    let result;
    try {
        result = JSON.parse(rawText);
    } catch (e) {
        throw new Error(`서버 응답이 JSON 형식이 아닙니다: ${rawText.substring(0, 100)}...`);
    }

    if (!response.ok) {
        throw new Error(result.Message || result.message || `HTTP ${response.status}: ${rawText}`);
    }
    return result;
}

export async function insertRow(tableName, rowData) {
    const response = await fetch(`/api/admin/TableData/${tableName}/row`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.Message || result.message || '데이터 추가 실패');
    }
    return result;
}

export async function saveCsv(tableName) {
    const response = await fetch(`/api/admin/TableData/${tableName}/save-csv`, {
        method: 'POST'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.Message || result.message || 'CSV 저장 실패');
    }
    return result;
}

export async function loadInsertFormTemplate() {
    const response = await fetch('section_insert_row.html');
    if (!response.ok) {
        throw new Error(`Failed to load section_insert_row.html: ${response.status}`);
    }
    return await response.text();
}
