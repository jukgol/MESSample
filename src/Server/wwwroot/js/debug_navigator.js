async function checkConnectionStatus() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    try {
        // 1. 서버에 저장된 로컬 접속 정보 가져오기
        const dataResponse = await fetch('/api/DbTest/local-data');
        if (!dataResponse.ok) throw new Error('저장된 접속 정보를 가져올 수 없습니다.');
        
        const config = await dataResponse.json();
        
        if (!config.userId) {
            statusText.innerHTML = '저장된 접속 정보가 없습니다. <strong>로그인 페이지</strong>에서 먼저 접속하세요.';
            return;
        }

        // 2. 저장된 정보로 DB 연결 테스트 수행
        // (현재 API 구조상 /api/DbTest/test가 기본 설정을 테스트하므로 이를 활용)
        const testResponse = await fetch('/api/DbTest/test');
        
        if (testResponse.ok) {
            statusDot.className = 'status-dot online';
            statusText.innerHTML = `Connected: <strong>${config.userId}</strong> | Oracle DB 연동 성공`;
        } else {
            statusDot.className = 'status-dot offline';
            statusText.innerHTML = `ID: <strong>${config.userId}</strong> | DB 연결 실패 (설정 확인 필요)`;
        }

    } catch (err) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = '서버 통신 오류: DB 상태를 확인할 수 없습니다.';
        console.error(err);
    }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', checkConnectionStatus);
