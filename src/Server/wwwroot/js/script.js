document.getElementById('dbForm').addEventListener('submit', async (e) => {
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

// 페이지 첫 진입 시(세션당 1회) 로컬 데이터 자동 채우기
window.addEventListener('DOMContentLoaded', async () => {
    LogManager.system('메인 대시보드 로드됨');
    
    // 세션 저장소를 확인하여 이번 브라우저 세션에서 이미 채웠는지 확인
    if (!sessionStorage.getItem('mes_data_populated')) {
        try {
            const response = await fetch('/api/DbTest/local-data');
            if (response.ok) {
                const data = await response.json();
                
                if (data.userId) {
                    document.getElementById('userId').value = data.userId;
                    LogManager.info(`로컬 설정 로드 완료: User ID = ${data.userId}`);
                }
                if (data.password) {
                    document.getElementById('password').value = data.password;
                    LogManager.info('로컬 설정 로드 완료: Password가 설정되었습니다.');
                }
                
                // 데이터가 성공적으로 채워졌음을 세션에 기록
                sessionStorage.setItem('mes_data_populated', 'true');
            }
        } catch (err) {
            console.error('로컬 데이터를 불러오는 중 오류 발생:', err);
            LogManager.error('로컬 설정 동기화 실패');
        }
    }
});
