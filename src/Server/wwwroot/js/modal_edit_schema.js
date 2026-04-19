/**
 * 스키마 정보 수정 모달 관련 로직
 */

// 팝업 열기 함수
window.openEditModal = async (schemaName) => {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-schema-name');
    const privsBody = document.getElementById('modal-privs-body');
    const scriptsList = document.getElementById('setup-scripts-list');
    const systemSection = document.getElementById('modal-system-section');

    if (modal && modalTitle && privsBody) {
        modalTitle.textContent = `대상 스키마: ${schemaName}`;
        modal.style.display = 'flex';
        
        // 권한 목록 초기화 및 로딩 표시
        privsBody.innerHTML = '<tr><td colspan="2" class="empty-message">권한 로딩 중...</td></tr>';
        
        // 시스템 섹션 기본 숨김 (권한 확인 전까지)
        if (systemSection) systemSection.style.display = 'none';

        try {
            const encodedName = encodeURIComponent(schemaName);
            
            // 1. 권한 조회 및 현재 유저 정보 병렬 요청
            const [privsRes, userRes] = await Promise.all([
                fetch(`/api/Schemas/${encodedName}/privileges`),
                fetch('/api/Navigator/current-user')
            ]);

            // 2. 권한 목록 처리
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

            // 3. 사용자 권한에 따른 스크립트 목록 처리
            if (userRes.ok && systemSection && scriptsList) {
                const userData = await userRes.json();
                const isSystemUser = userData.userId && userData.userId.toUpperCase() === 'SYSTEM';

                if (isSystemUser) {
                    systemSection.style.display = 'flex';
                    scriptsList.innerHTML = '<li style="padding: 15px; text-align: center; color: rgba(255,255,255,0.2); font-style: italic;">스크립트 로딩 중...</li>';

                    const scriptsRes = await fetch('/api/Scripts/setup');
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
                        scriptsList.innerHTML = '<li style="padding: 15px; text-align: center; color: #ff6b6b;">목록 로드 실패</li>';
                    }
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

// [수정] 스크립트 추가 버튼 클릭 핸들러 (실제 실행)
window.handleAddScript = async (filename) => {
    const modalTitle = document.getElementById('modal-schema-name');
    if (!modalTitle) return;

    // "대상 스키마: SCHEMANAME" 형식에서 이름만 추출
    const schemaName = modalTitle.textContent.replace('대상 스키마: ', '').trim();

    if (!confirm(`[${schemaName}] 스키마에 대해 [${filename}] 스크립트를 실행하시겠습니까?`)) {
        return;
    }

    const btn = event.target; // 클릭된 버튼
    const originalText = btn.textContent;
    
    try {
        btn.disabled = true;
        btn.textContent = '실행 중...';

        const response = await fetch('/api/Scripts/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName: filename,
                schemaName: schemaName
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`성공: ${result.message}`);
            // 권한 정보 갱신을 위해 팝업 데이터를 다시 불러옴
            if (window.openEditModal) window.openEditModal(schemaName);
        } else {
            alert(`오류: ${result.message}`);
        }
    } catch (error) {
        console.error('Script Execution Error:', error);
        alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
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
