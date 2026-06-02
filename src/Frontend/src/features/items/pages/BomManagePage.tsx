import React, { useState, useMemo } from 'react';
import { useItems } from './useItems';
import { useBoms } from './useBoms';
import type { Bom } from './useBoms';
import BomParentList from './BomParentList';
import BomDetailTable from './BomDetailTable';
import { Settings, Info } from 'lucide-react';

const BomManagePage: React.FC = () => {
  // 전체 품목 리스트 가져오기
  const { items, loading: itemsLoading, error: itemsError } = useItems();
  
  // BOM CRUD 훅
  const {
    boms,
    loading: bomsLoading,
    error: bomsError,
    fetchBomsByParent,
    createBom,
    updateBom,
    deleteBom
  } = useBoms();

  // 선택된 부모 품목 ID 상태
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // 모달 활성화 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // 선택된 수정 대상 BOM 객체
  const [selectedBomForUpdate, setSelectedBomForUpdate] = useState<Bom | null>(null);

  // 폼 입력 상태
  const [createForm, setCreateForm] = useState({
    childItemID: '',
    bomQty: 1
  });

  const [updateForm, setUpdateForm] = useState({
    bomQty: 1
  });

  // 현재 선택된 부모 품목 정보 객체
  const selectedParentItem = useMemo(() => {
    if (!selectedParentId) return null;
    return items.find(item => Number(item.id) === selectedParentId) || null;
  }, [items, selectedParentId]);

  // 자식 품목으로 선택 가능한 리스트 (부모 품목 및 이미 등록된 자식 품목을 제외하고 드롭다운에 출력)
  const availableChildItems = useMemo(() => {
    if (!selectedParentId) return [];
    
    // 이미 등록된 자식 품목 ID 세트
    const registeredChildIds = new Set(boms.map(bom => bom.childItemID));

    // 자기 자신(부모) 및 이미 등록된 자식 품목을 제외
    return items.filter(item => {
      const itemIdNum = Number(item.id);
      return itemIdNum !== selectedParentId && !registeredChildIds.has(itemIdNum);
    });
  }, [items, selectedParentId, boms]);

  // 부모 품목 선택 핸들러
  const handleSelectParent = (id: number) => {
    setSelectedParentId(id);
    fetchBomsByParent(id);
  };

  // 등록 모달 열기
  const handleOpenCreateModal = () => {
    if (!selectedParentId) return;
    
    setCreateForm({
      childItemID: '',
      bomQty: 1
    });
    setIsCreateOpen(true);
  };

  // 등록 처리
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId) return;
    
    if (!createForm.childItemID) {
      alert('자식 품목을 선택해 주세요.');
      return;
    }

    if (Number(createForm.bomQty) <= 0) {
      alert('소요량은 1개 이상이어야 합니다.');
      return;
    }

    const success = await createBom({
      parentItemID: selectedParentId,
      childItemID: Number(createForm.childItemID),
      bomQty: Number(createForm.bomQty)
    });

    if (success) {
      setIsCreateOpen(false);
      alert('BOM 레시피 항목이 성공적으로 등록되었습니다.');
    }
  };

  // 수정 모달 열기
  const handleOpenUpdateModal = (bom: Bom) => {
    setSelectedBomForUpdate(bom);
    setUpdateForm({
      bomQty: bom.bomQty
    });
    setIsUpdateOpen(true);
  };

  // 수정 처리
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId || !selectedBomForUpdate) return;

    if (Number(updateForm.bomQty) <= 0) {
      alert('소요량은 1개 이상이어야 합니다.');
      return;
    }

    const success = await updateBom(selectedBomForUpdate.bomID, selectedParentId, {
      bomQty: Number(updateForm.bomQty)
    });

    if (success) {
      setIsUpdateOpen(false);
      alert('소요량이 성공적으로 수정되었습니다.');
    }
  };

  // 삭제 처리
  const handleDelete = async (id: number) => {
    if (!selectedParentId) return;

    if (window.confirm(`정말로 이 BOM 항목을 해제하시겠습니까?\n이 품목이 공정 단계 마스터 등에 연동되어 있을 경우 영향을 미칠 수 있습니다.`)) {
      const success = await deleteBom(id, selectedParentId);
      if (success) {
        alert('BOM 레시피 항목이 해제되었습니다.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* 타이틀 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={28} className="gradient-text" /> BOM 레시피 관리
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0' }}>
            완제품 및 반제품에 소요되는 원자재와 반제품의 레시피 구성(Bill of Materials)을 설정합니다.
          </p>
        </div>
      </div>

      {/* 에러 피드백 */}
      {itemsError && (
        <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {itemsError}
        </div>
      )}

      {/* 2-Pane 레이아웃 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
        gap: '20px',
        alignItems: 'stretch',
        flex: 1
      }}>
        {/* 좌측 Pane - 품목 목록 */}
        <div>
          <BomParentList
            items={items}
            loading={itemsLoading}
            selectedItemId={selectedParentId}
            onSelectItem={handleSelectParent}
          />
        </div>

        {/* 우측 Pane - BOM 상세 테이블 */}
        <div>
          <BomDetailTable
            selectedItem={selectedParentItem}
            boms={boms}
            loading={bomsLoading}
            error={bomsError}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenUpdateModal={handleOpenUpdateModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* 1. BOM 항목 신규 등록 모달 */}
      {isCreateOpen && selectedParentItem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>BOM 구성 요소 추가</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
              <strong>기준 부모 품목:</strong> {selectedParentItem.name} (ID: {selectedParentItem.id})
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>추가할 자식 품목</label>
                {availableChildItems.length > 0 ? (
                  <select
                    required
                    value={createForm.childItemID}
                    onChange={(e) => setCreateForm({ ...createForm, childItemID: e.target.value })}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="" style={{ background: '#1e1e24' }}>-- 품목 선택 --</option>
                    {availableChildItems.map((item) => (
                      <option key={item.id} value={item.id} style={{ background: '#1e1e24' }}>
                        [{item.category}] {item.name} (ID: {item.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ color: '#fbbf24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                    <Info size={16} /> 추가 가능한 다른 자식 품목이 존재하지 않습니다.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>소요 수량 (Qty)</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="예: 1"
                  value={createForm.bomQty}
                  onChange={(e) => setCreateForm({ ...createForm, bomQty: Math.max(1, Number(e.target.value)) })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={availableChildItems.length === 0}
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BOM 소요량 수정 모달 */}
      {isUpdateOpen && selectedBomForUpdate && selectedParentItem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>BOM 소요량 수정</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
              <div><strong>기준 부모 품목:</strong> {selectedParentItem.name}</div>
              <div><strong>대상 자식 품목:</strong> {selectedBomForUpdate.childItemName || `품목 #${selectedBomForUpdate.childItemID}`}</div>
              <div><strong>BOM 매핑 ID:</strong> {selectedBomForUpdate.bomID}</div>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>수정할 소요 수량 (Qty)</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="예: 1"
                  value={updateForm.bomQty}
                  onChange={(e) => setUpdateForm({ ...updateForm, bomQty: Math.max(1, Number(e.target.value)) })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button type="submit">
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BomManagePage;
