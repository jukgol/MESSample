async function checkConnectionStatus() {
    console.log('--- DB 상태 및 유저 정보 체크 시작 ---');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    if (!statusDot || !statusText) return;

    try {
        // 1. 연결 테스트 및 유저 정보 동시 요청 (또는 순차 요청)
        const [testRes, userRes] = await Promise.all([
            fetch('/api/admin/Navigator/test'),
            fetch('/api/admin/Navigator/current-user')
        ]);
        
        const testData = await testRes.json();
        const userData = await userRes.json();

        if (testRes.ok) {
            statusDot.style.backgroundColor = '#10b981'; // 초록색
            statusDot.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.6)';
            statusText.innerHTML = `User: <strong>${userData.UserId}</strong> | Status: <strong>Connected</strong>`;
        } else {
            statusDot.style.backgroundColor = '#ef4444'; // 빨간색
            statusText.innerHTML = `User: <strong>${userData.UserId}</strong> | Status: <strong style="color:#ff6b6b;">Disconnected</strong>`;
        }

    } catch (err) {
        console.error('CheckConnectionStatus Error:', err);
        statusDot.style.backgroundColor = '#ef4444';
        statusText.innerHTML = `<span style="color:#ff6b6b;">서버 통신 오류</span>`;
    }
}

window.addEventListener('load', () => {
    checkConnectionStatus();
    
    // DB 연결 버튼 이벤트 리스너 추가
    const btnDbConnect = document.getElementById('btn-db-connect');
    if (btnDbConnect) {
        btnDbConnect.addEventListener('click', () => {
            const statusText = document.getElementById('status-text');
            if (statusText) statusText.innerText = '재연결 확인 중...';
            checkConnectionStatus();
        });
    }
});
