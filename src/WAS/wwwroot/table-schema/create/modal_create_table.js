/**
 * 테이블 생성 모달 제어 JS
 */

(function() {
    console.log("Create Table Modal JS Loaded.");

    function openCreateTableModal() {
        const modal = document.getElementById('create-table-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('new-table-name').value = '';
            document.getElementById('new-table-name').focus();
        } else {
            console.error('Modal element not found');
        }
    }

    function closeCreateTableModal() {
        const modal = document.getElementById('create-table-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // 생성 버튼 이벤트 바인딩 (이벤트 위임)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btn-do-create-table') {
            handleCreateTable();
        }
    });

    async function handleCreateTable() {
        const tableName = document.getElementById('new-table-name').value.trim().toUpperCase();
        
        if (!tableName) {
            alert('테이블 이름을 입력하세요.');
            return;
        }

        if (!confirm(`[${tableName}] 테이블을 생성하시겠습니까?`)) return;

        try {
            const response = await fetch('/api/admin/TableAttribute/create-table', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName: tableName })
            });

            const result = await response.json();
            if (response.ok) {
                alert('테이블 생성 성공: ' + result.message);
                closeCreateTableModal();
                if (window.TableNavigator) {
                    await window.TableNavigator.init();
                }
            } else {
                alert('테이블 생성 실패: ' + (result.message || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Create table error:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    }

    // 전역 노출
    window.openCreateTableModal = openCreateTableModal;
    window.closeCreateTableModal = closeCreateTableModal;
})();
