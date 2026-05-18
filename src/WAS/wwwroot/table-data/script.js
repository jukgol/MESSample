import * as api from './api.js';
import * as ui from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM 요소 취득
    const tableListMenu = document.getElementById('table-list-menu');
    const tableTitle = document.getElementById('current-table-title');
    const tableSubtitle = document.getElementById('current-table-subtitle');
    const dataHead = document.getElementById('data-table-head');
    const dataBody = document.getElementById('data-table-body');
    const formPlaceholder = document.getElementById('insert-form-placeholder');
    const btnPrint = document.getElementById('btn-print');
    const btnDeleteSelected = document.getElementById('btn-delete-selected');

    // 2. 상태 변수
    let currentTableName = '';

    // 3. 초기 기동
    init();

    async function init() {
        // 테이블 목록 가져오기 및 렌더링
        try {
            const tables = await api.fetchTables();
            ui.renderTableList(tables, tableListMenu);
        } catch (error) {
            if (tableListMenu) {
                tableListMenu.innerHTML = `<p style="padding:20px; color:#ff6b6b; font-size:0.8rem;">목록 조회 실패: <br>${error.message}</p>`;
            }
        }

        // 데이터 추가 HTML 템플릿 로딩 및 바인딩
        await loadInsertForm();

        // 이벤트 리스너 등록
        bindEvents();
    }

    async function loadInsertForm() {
        try {
            console.log('Loading insert form HTML...');
            const templateHtml = await api.loadInsertFormTemplate();
            formPlaceholder.innerHTML = templateHtml;
            console.log('Insert form HTML loaded successfully.');

            // 동적으로 로드된 생성 폼 안의 제출 단추 바인딩
            const btnInsertSubmit = document.getElementById('btn-insert-submit');
            if (btnInsertSubmit) {
                btnInsertSubmit.addEventListener('click', handleInsertRow);
            }
        } catch (error) {
            console.error('Error loading insert form:', error);
            formPlaceholder.innerHTML = `<div id="insert-container" class="insert-container"><div class="insert-header">➕ 데이터 추가</div><div id="insert-fields" class="insert-fields"></div></div>`;
        }
    }

    function bindEvents() {
        // A. 테이블 목록 클릭 시 데이터 로딩 (이벤트 위임)
        if (tableListMenu) {
            tableListMenu.addEventListener('click', async (event) => {
                const menuItem = event.target.closest('.menu-item');
                if (!menuItem) return;

                const tableName = menuItem.dataset.table;
                await fetchTableData(tableName, menuItem);
            });
        }

        // B. CSV 저장 버튼 클릭 이벤트
        if (btnPrint) {
            btnPrint.addEventListener('click', handleSaveCsv);
        }

        // C. 선택 삭제 버튼 클릭 이벤트
        if (btnDeleteSelected) {
            btnDeleteSelected.addEventListener('click', handleDeleteSelected);
        }

        // D. 체크박스 전체 선택/해제 위임 (헤더 영역)
        if (dataHead) {
            dataHead.addEventListener('change', (e) => {
                if (e.target.id === 'check-all') {
                    const isChecked = e.target.checked;
                    const rowChecks = dataBody.querySelectorAll('.row-check');
                    rowChecks.forEach(cb => cb.checked = isChecked);
                    updateSelectionBar();
                }
            });
        }

        // E. 개별 체크박스 선택/해제 위임 (바디 영역)
        if (dataBody) {
            dataBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('row-check')) {
                    updateSelectionBar();
                }
            });
        }
    }

    // 4. 이벤트 핸들러 및 흐름 제어 로직
    async function fetchTableData(tableName, element) {
        currentTableName = tableName;
        
        // 사이드바 활성화 상태 토글
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        // 상태 초기화
        tableTitle.textContent = `TABLE: ${tableName}`;
        tableSubtitle.textContent = '조회 중...';
        dataHead.innerHTML = '';
        dataBody.innerHTML = '<tr><td class="empty-message">로딩 중...</td></tr>';
        
        const insertContainer = document.getElementById('insert-container');
        if (insertContainer) insertContainer.style.display = 'none';
        if (btnPrint) btnPrint.style.display = 'none';
        updateSelectionBar(); // 선택바 닫기

        try {
            const result = await api.fetchTableData(tableName);
            
            // 데이터 그리기
            ui.renderTableData(result, dataHead, dataBody, tableSubtitle, btnPrint);
            
            // 생성 폼 구성
            const fieldsEl = document.getElementById('insert-fields');
            const meta = result.metadata || [];
            if (meta.length > 0) {
                ui.renderInsertForm(meta, insertContainer, fieldsEl); 
            } else {
                const fallbackMeta = (result.columns || []).map(c => ({ name: c, isIdentity: false, hasDefault: false }));
                ui.renderInsertForm(fallbackMeta, insertContainer, fieldsEl);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            tableSubtitle.innerHTML = `<span style="color:#ff6b6b; font-size:0.85rem; background:rgba(255,107,107,0.1); padding:4px 10px; border-radius:4px;">❌ ${error.message}</span>`;
            dataBody.innerHTML = `<tr><td colspan="100" class="empty-message" style="color:#ff6b6b; padding:40px;">${error.message}</td></tr>`;
            if (btnPrint) btnPrint.style.display = 'none';
        }
    }

    async function handleInsertRow() {
        const inputs = document.querySelectorAll('.insert-input:not([disabled])');
        const rowData = {};
        inputs.forEach(input => {
            const val = input.value.trim();
            if (val) rowData[input.dataset.column] = val;
        });

        const btnInsertSubmit = document.getElementById('btn-insert-submit');
        const originalText = btnInsertSubmit ? btnInsertSubmit.textContent : '추가하기 (Insert)';

        try {
            if (btnInsertSubmit) {
                btnInsertSubmit.disabled = true;
                btnInsertSubmit.textContent = '추가 중...';
            }

            const result = await api.insertRow(currentTableName, rowData);
            alert(result.message || '추가 완료');
            
            // 데이터 리로드
            const activeMenuItem = document.querySelector('.menu-item.active');
            await fetchTableData(currentTableName, activeMenuItem);
        } catch (error) {
            alert('오류: ' + error.message);
        } finally {
            if (btnInsertSubmit) {
                btnInsertSubmit.disabled = false;
                btnInsertSubmit.textContent = originalText;
            }
        }
    }

    async function handleSaveCsv() {
        if (!currentTableName) return;
        
        if (btnPrint) {
            btnPrint.disabled = true;
            btnPrint.textContent = '💾 저장 중...';
        }

        try {
            const result = await api.saveCsv(currentTableName);
            alert(result.message || 'CSV 저장 완료!');
        } catch (error) {
            console.error('Save CSV Error:', error);
            alert('오류: ' + error.message);
        } finally {
            if (btnPrint) {
                btnPrint.disabled = false;
                btnPrint.textContent = '💾 CSV 저장';
            }
        }
    }

    async function handleDeleteSelected() {
        const rowChecks = dataBody.querySelectorAll('.row-check');
        const checkedIndexes = Array.from(rowChecks)
            .map((cb, idx) => cb.checked ? idx : -1)
            .filter(idx => idx !== -1);

        if (checkedIndexes.length === 0) {
            alert('선택된 항목이 없습니다.');
            return;
        }

        if (confirm(`선택한 ${checkedIndexes.length}개 항목을 정말 삭제하시겠습니까?\n(실제 삭제 API는 추후 연동됩니다.)`)) {
            alert('삭제 요청이 전송되었습니다.');
        }
    }

    // 5. 유틸리티 함수
    function updateSelectionBar() {
        if (!dataBody) return;
        const rowChecks = dataBody.querySelectorAll('.row-check');
        const checkedCount = Array.from(rowChecks).filter(cb => cb.checked).length;
        
        const selectionBar = document.getElementById('selection-bar');
        const selectedCountSpan = document.getElementById('selected-count');
        
        if (selectedCountSpan) selectedCountSpan.textContent = checkedCount;
        
        if (selectionBar) {
            selectionBar.style.display = checkedCount > 0 ? 'flex' : 'none';
        }
        
        const checkAll = document.getElementById('check-all');
        if (checkAll && rowChecks.length > 0) {
            checkAll.checked = checkedCount === rowChecks.length;
        }
    }
});
