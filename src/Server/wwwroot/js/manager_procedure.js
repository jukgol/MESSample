// 탭 전환 로직
function switchTab(tabId) {
    const title = document.getElementById('current-tab-title');
    const desc = document.getElementById('current-tab-desc');
    const display = document.getElementById('main-display');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!title || !desc || !display) return;

    // 활성 메뉴 표시 변경
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(tabId)) {
            item.classList.add('active');
        }
    });

    // 콘텐츠 변경
    switch(tabId) {
        case 'search':
            title.textContent = '프로시저 조회';
            desc.textContent = '데이터베이스에 등록된 프로시저 목록을 확인합니다.';
            display.innerHTML = '<p>조회된 프로시저 리스트가 여기에 표시됩니다.</p>';
            break;
        case 'create':
            title.textContent = '프로시저 생성';
            desc.textContent = '새로운 오라클 프로시저를 작성하고 등록합니다.';
            display.innerHTML = '<p>프로시저 작성 폼이 여기에 표시됩니다.</p>';
            break;
        case 'delete':
            title.textContent = '프로시저 삭제';
            desc.textContent = '불필요한 프로시저를 안전하게 제거합니다.';
            display.innerHTML = '<p>삭제할 프로시저를 선택하세요.</p>';
            break;
    }
    
    LogManager.info(`탭 전환: ${tabId}`);
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    LogManager.system('프로시저 관리자 로드됨');
    
    // URL 파라미터 확인 (?tab=...)
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');
    
    if (targetTab) {
        switchTab(targetTab);
    } else {
        switchTab('search'); // 기본값
    }
});
