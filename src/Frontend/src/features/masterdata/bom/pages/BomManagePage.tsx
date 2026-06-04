import React, { useState, useMemo } from 'react';
import { useItems } from '../../item/hooks/useItems';
import { useBoms } from '../hooks/useBoms';
import type { Bom } from '../hooks/useBoms';
import BomParentList from '../components/BomParentList';
import BomDetailTable from '../components/BomDetailTable';
import BomCreateModal from '../components/BomCreateModal';
import BomUpdateModal from '../components/BomUpdateModal';
import BomDeleteModal from '../components/BomDeleteModal';
import BomHeader from '../components/BomHeader';
import BomErrorAlert from '../components/BomErrorAlert';
import BomLayout from '../components/BomLayout';

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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 선택된 대상 BOM 객체 상태
  const [selectedBomForUpdate, setSelectedBomForUpdate] = useState<Bom | null>(null);
  const [selectedBomIdForDelete, setSelectedBomIdForDelete] = useState<number | null>(null);

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

  // 등록 처리
  const handleCreateSubmit = async (dto: { childItemID: number; bomQty: number }) => {
    if (!selectedParentId) return false;
    
    const success = await createBom({
      parentItemID: selectedParentId,
      childItemID: dto.childItemID,
      bomQty: dto.bomQty
    });

    return success;
  };

  // 수정 처리
  const handleUpdateSubmit = async (dto: { bomQty: number }) => {
    if (!selectedParentId || !selectedBomForUpdate) return false;

    const success = await updateBom(selectedBomForUpdate.bomID, selectedParentId, {
      bomQty: dto.bomQty
    });

    return success;
  };

  // 삭제 처리
  const handleDeleteConfirm = async () => {
    if (!selectedParentId || selectedBomIdForDelete === null) return false;

    const success = await deleteBom(selectedBomIdForDelete, selectedParentId);
    return success;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* 1. 타이틀 헤더 */}
      <BomHeader />

      {/* 2. 에러 피드백 */}
      <BomErrorAlert message={itemsError} />

      {/* 3. 2-Pane 레이아웃 그리드 */}
      <BomLayout
        left={
          <BomParentList
            items={items}
            loading={itemsLoading}
            selectedItemId={selectedParentId}
            onSelectItem={handleSelectParent}
          />
        }
        right={
          <BomDetailTable
            selectedItem={selectedParentItem}
            boms={boms}
            loading={bomsLoading}
            error={bomsError}
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onOpenUpdateModal={(bom) => {
              setSelectedBomForUpdate(bom);
              setIsUpdateOpen(true);
            }}
            onDelete={(id) => {
              setSelectedBomIdForDelete(id);
              setIsDeleteOpen(true);
            }}
          />
        }
      />

      {/* BOM 항목 신규 등록 모달 */}
      <BomCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        selectedParentItem={selectedParentItem}
        availableChildItems={availableChildItems}
        onSubmit={handleCreateSubmit}
      />

      {/* BOM 소요량 수정 모달 */}
      <BomUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedBomForUpdate(null);
        }}
        selectedParentItem={selectedParentItem}
        selectedBomForUpdate={selectedBomForUpdate}
        onSubmit={handleUpdateSubmit}
      />

      {/* BOM 항목 삭제 확인 모달 */}
      <BomDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedBomIdForDelete(null);
        }}
        bomId={selectedBomIdForDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BomManagePage;
