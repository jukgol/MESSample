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
        } else {
            resDiv.className = 'error';
            resDiv.textContent = `❌ ${data.message}`;
        }
    } catch (err) {
        resDiv.style.display = 'block';
        resDiv.className = 'error';
        resDiv.textContent = '❌ 서버에 연결할 수 없습니다.';
    } finally {
        btn.classList.remove('loading');
    }
});
