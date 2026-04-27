document.addEventListener('DOMContentLoaded', () => {
    const btnFetch = document.getElementById('btn-fetch-schemas');
    const schemaBody = document.getElementById('schema-body');
    
    // [수정] 외부 모달 로드 및 초기화 호출
    async function loadExternalModal() {
        try {
            const response = await fetch('modal_edit_schema.html');
            if (!response.ok) throw new Error('모달 파일을 불러오는 데 실패했습니다.');
            const html = await response.text();
            document.getElementById('modal-placeholder').innerHTML = html;
            
            // 분리된 JS 파일의 초기화 함수 호출
            if (window.initEditModal) {
                window.initEditModal();
            }
        } catch (error) {
            console.error('Modal Load Error:', error);
        }
    }

    if (btnFetch) {
        btnFetch.addEventListener('click', fetchSchemas);
    }

    async function fetchSchemas() {
        btnFetch.disabled = true;
        btnFetch.textContent = '조회 중...';
        schemaBody.innerHTML = '<tr><td colspan="3" class="empty-message">데이터를 불러오는 중입니다...</td></tr>';

        try {
            const response = await fetch('/api/system/Schemas');
            if (!response.ok) throw new Error('데이터 요청 실패');

            const schemas = await response.json();
            displaySchemas(schemas);
        } catch (error) {
            schemaBody.innerHTML = `<tr><td colspan="3" class="empty-message" style="color: #ff6b6b;">오류: ${error.message}</td></tr>`;
        } finally {
            btnFetch.disabled = false;
            btnFetch.textContent = '조회 (Refresh)';
        }
    }

    function displaySchemas(schemas) {
        if (!schemas || schemas.length === 0) {
            schemaBody.innerHTML = '<tr><td colspan="3" class="empty-message">등록된 스키마가 없습니다.</td></tr>';
            return;
        }

        schemaBody.innerHTML = schemas.map((name, i) => `
            <tr>
                <td class="col-idx">${i + 1}</td>
                <td><strong>${name}</strong></td>
                <td class="col-action">
                    <button class="btn-edit" onclick="openEditModal('${name}')">수정</button>
                </td>
            </tr>
        `).join('');
    }

    // 초기 실행: 외부 모달 로드
    loadExternalModal();
});
