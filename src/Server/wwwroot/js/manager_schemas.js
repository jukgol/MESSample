// 팝업 열기 함수
window.openEditModal = async (schemaName) => {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-schema-name');
    const privsBody = document.getElementById('modal-privs-body');

    if (modal && modalTitle && privsBody) {
        modalTitle.textContent = `대상 스키마: ${schemaName}`;
        modal.style.display = 'flex';
        
        // 권한 목록 초기화 및 로딩 표시
        privsBody.innerHTML = '<tr><td colspan="2" class="empty-message">권한 로딩 중...</td></tr>';

        try {
            // 권한 조회 API 호출 (특수문자 처리를 위해 인코딩 적용)
            const encodedName = encodeURIComponent(schemaName);
            const response = await fetch(`/api/DbTest/schemas/${encodedName}/privileges`);
            
            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.message || `HTTP 오류: ${response.status}`);
            }

            const privs = await response.json();
            
            if (privs.length === 0) {
                privsBody.innerHTML = '<tr><td colspan="2" class="empty-message">부여된 권한이 없습니다.</td></tr>';
            } else {
                privsBody.innerHTML = privs.map(p => `
                    <tr>
                        <td style="padding: 8px 15px;"><span class="badge ${p.type.toLowerCase()}">${p.type}</span></td>
                        <td style="padding: 8px 15px;">${p.name}</td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            privsBody.innerHTML = `<tr><td colspan="2" class="empty-message" style="color: #ff6b6b;">${error.message}</td></tr>`;
        }
    }
};

// 팝업 닫기 함수
window.closeModal = () => {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const btnFetch = document.getElementById('btn-fetch-schemas');
    const schemaBody = document.getElementById('schema-body');
    const modal = document.getElementById('edit-modal');

    if (btnFetch) {
        btnFetch.addEventListener('click', fetchSchemas);
    }

    async function fetchSchemas() {
        btnFetch.disabled = true;
        btnFetch.textContent = '조회 중...';
        schemaBody.innerHTML = '<tr><td colspan="3" class="empty-message">데이터를 불러오는 중입니다...</td></tr>';

        try {
            const response = await fetch('/api/DbTest/schemas');
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

    // 배경 클릭 시 닫기
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
});
