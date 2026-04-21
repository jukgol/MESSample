/**
 * MES Real-time Logger Service
 * 창 간 통신(BroadcastChannel)을 통해 로그를 전송합니다.
 */
const LogManager = (() => {
    const channel = new BroadcastChannel('mes_log_channel');
    let logWindow = null;

    const send = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
        channel.postMessage({ message, type, time });
    };

    return {
        info: (msg) => send(msg, 'info'),
        success: (msg) => send(msg, 'success'),
        error: (msg) => send(msg, 'error'),
        system: (msg) => send(msg, 'system'),
        
        openMonitor: () => {
            const width = 600;
            const height = 400;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);
            
            logWindow = window.open(
                'log.html', 
                'MESMonitor', 
                `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`
            );
            
            if (logWindow) {
                logWindow.focus();
                setTimeout(() => {
                    send('연결됨: 모니터링 시스템이 활성화되었습니다.', 'system');
                }, 1000);
            }
        }
    };
})();
