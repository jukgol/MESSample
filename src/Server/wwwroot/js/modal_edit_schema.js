/**
 * 스키마 정보 수정 모달 관련 로직
 */

// 팝업 열기 함수
window.openEditModal = async (schemaName) => {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-schema-name');
    const privsBody = document.getElementById('modal-privs-body');
    const scriptsList = document.getElementById('setup-scripts-list');

    if (modal && modalTitle && privsBody) {
        modalTitle.textContent = `대상 스키마: ${schemaName}`;
        modal.style.display = 'flex';
        
        // 권한 목록 초기화 및 로딩 표시
        privsBody.innerHTML = '<tr><td colspan="2" class="empty-message">권한 로딩 중...</td></tr>';
        
        // 스크립트 목록 초기화
        if (scriptsList) {
            scriptsList.innerHTML = '<li style="padding: 15px; text-align: center; color: rgba(255,255,255,0.2); font-style: italic;">스크립트 로딩 중...</li>';
        }

        // 병렬 처리: 권한 조회 + 스크립트 목록 조회
        try {
            const encodedName = encodeURIComponent(schemaName);
            
            const [privsRes, scriptsRes] = await Promise.all([
                fetch(`/api/DbTest/schemas/${encodedName}/privileges`),
                fetch('/api/Scripts/setup')
            ]);

            // 1. 권한 목록 처리
            if (privsRes.ok) {
                const privs = await privsRes.json();
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
            } else {
                throw new Error('권한 조회 실패');
            }

            // 2. 스크립트 목록 처리
            if (scriptsList) {
                if (scriptsRes.ok) {
                    const scripts = await scriptsRes.json();
                    if (scripts.length === 0) {
                        scriptsList.innerHTML = '<li style="padding: 15px; text-align: center; color: rgba(255,255,255,0.2);">등록된 스크립트가 없습니다.</li>';
                    } else {
                        scriptsList.innerHTML = scripts.map(filename => `
                            <li class="script-item">
                                <div class="script-info">
                                    <span class="icon">📜</span>
                                    <span class="name">${filename}</span>
                                </div>
                                <button class="btn-add-script" onclick="handleAddScript('${filename}')">추가</button>
                            </li>
                        `).join('');
                    }
                } else {
                    const errData = await scriptsRes.json().catch(() => ({}));
                    console.error('Scripts API Error:', errData);
                    scriptsList.innerHTML = `<li style="padding: 15px; text-align: center; color: #ff6b6b;">목록 로드 실패: ${errData.message || scriptsRes.status}</li>`;
                }
            }
        } catch (error) {
            console.error('Modal Data Fetch Error:', error);
            privsBody.innerHTML = `<tr><td colspan="2" class="empty-message" style="color: #ff6b6b;">${error.message}</td></tr>`;
        }
    }
};

// 팝업 닫기 함수
window.closeModal = () => {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.style.display = 'none';
};

// [추가] 스크립트 추가 버튼 클릭 핸들러
window.handleAddScript = (filename) => {
    console.log('추가 클릭된 파일:', filename);
    // 향후 로직 구현 예정
};

// 모달 초기화 (배경 클릭 이벤트 등)
window.initEditModal = () => {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
};
