// 폼 제출 이벤트 (로그인 페이지용)
const dbForm = document.getElementById('dbForm');
if (dbForm) {
    dbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('testBtn');
        const resDiv = document.getElementById('result');
        
        btn.classList.add('loading');
        resDiv.style.display = 'none';

        const payload = {
            host: document.getElementById('host').value,
            port: parseInt(document.getElementById('port').value),
            serviceName: document.getElementById('serviceName').value,
            userId: document.getElementById('userId').value,
            password: document.getElementById('password').value
        };

        LogManager.info(`커스텀 연결 시도: ${payload.host}:${payload.port}/${payload.serviceName} (User: ${payload.userId})`);

        try {
            const response = await fetch('/api/DbTest/test-custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            resDiv.style.display = 'block';
            if (response.ok) {
                resDiv.className = 'success';
                resDiv.innerHTML = `<strong>🎉 ${data.message}</strong><br>${data.details}`;
                LogManager.success(`연결 성공: ${data.details}`);
                
                // 1초 후 테이블 관리 페이지로 이동
                setTimeout(() => {
                    window.location.href = 'manager_table.html';
                }, 1000);
            } else {
                resDiv.className = 'error';
                resDiv.textContent = `❌ ${data.message}`;
                LogManager.error(`연결 실패: ${data.message}`);
            }
        } catch (err) {
            resDiv.style.display = 'block';
            resDiv.className = 'error';
            resDiv.textContent = '❌ 서버에 연결할 수 없습니다.';
            LogManager.error('네트워크 오류: 서버에 연결할 수 없습니다.');
        } finally {
            btn.classList.remove('loading');
        }
    });
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', async () => {
    // 로그인 정보 자동 채우기 (로그인 페이지인 경우)
    if (dbForm && !sessionStorage.getItem('mes_data_populated')) {
        try {
            const response = await fetch('/api/DbTest/local-data');
            if (response.ok) {
                const data = await response.json();
                if (data.userId) document.getElementById('userId').value = data.userId;
                if (data.password) document.getElementById('password').value = data.password;
                sessionStorage.setItem('mes_data_populated', 'true');
                LogManager.info('로그인 페이지: 로컬 설정 로드 완료');
            }
        } catch (err) {
            console.error('로컬 데이터를 불러오는 중 오류 발생:', err);
        }
    }
});
