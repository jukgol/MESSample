import React, { useState, useMemo, useEffect } from 'react';
import { useItems } from '../../item/hooks/useItems';
import { useBoms } from '../hooks/useBoms';
import { useProcessSteps } from '../../step/hooks/useProcessSteps';
import BomParentList from '../components/BomParentList';
import BomRecipeDetailPanel from '../components/BomRecipeDetailPanel';
import BomItemListPanel from '../components/BomItemListPanel';
import BomCreateModal from '../components/BomCreateModal';
import BomHeader from '../components/BomHeader';
import BomErrorAlert from '../components/BomErrorAlert';
import BomLayout from '../components/BomLayout';
import BomActionBar from '../components/BomActionBar';

const BomManagePage: React.FC = () => {
  // 전체 품목 리스트
  const { items, loading: itemsLoading, error: itemsError, fetchItems } = useItems();

  // 전체 공정 리스트
  const { processSteps } = useProcessSteps();

  // BOM CRUD 및 레시피 조회 훅
  const {
    recipes,
    loading: bomsLoading,
    error: bomsError,
    fetchRecipeList,
    createRecipe,
    addRecipeInput,
    addRecipeOutput,
    removeRecipeInput,
    removeRecipeOutput,
    updateRecipeInputQty,
    updateRecipeOutputQty,
    deleteRecipe
  } = useBoms();

  // 선택된 레시피 ID 상태
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  // 모달 활성화 상태 (레시피 추가 모달)
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchItems();
    fetchRecipeList();
  }, [fetchItems, fetchRecipeList]);

  // 현재 선택된 레시피 객체
  const selectedRecipe = useMemo(() => {
    if (selectedRecipeId === null) return null;
    return recipes.find(r => Number(r.bomRecipeID) === selectedRecipeId) || null;
  }, [recipes, selectedRecipeId]);

  // 레시피 선택 핸들러
  const handleSelectRecipe = (recipeId: number) => {
    setSelectedRecipeId(recipeId);
  };

  // 신규 레시피 등록 처리
  const handleCreateSubmit = async (dto: { recipeCode?: string; recipeName: string; processStepID?: number | null; outputItemID?: number | null }) => {
    const success = await createRecipe(dto);
    if (success) {
      await fetchRecipeList();
    }
    return success;
  };

  // 레시피 입력 품목 추가
  const handleAddInput = async (itemId: number) => {
    if (selectedRecipeId === null) return;
    const success = await addRecipeInput(selectedRecipeId, itemId, 1);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 출력 품목 추가
  const handleAddOutput = async (itemId: number) => {
    if (selectedRecipeId === null) return;
    const success = await addRecipeOutput(selectedRecipeId, itemId, 1);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 입력 품목 제거
  const handleRemoveInput = async (itemId: number) => {
    if (selectedRecipeId === null) return;
    if (!confirm('이 입력 자재를 레시피에서 제외하시겠습니까?')) return;
    const success = await removeRecipeInput(selectedRecipeId, itemId);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 출력 품목 제거
  const handleRemoveOutput = async (itemId: number) => {
    if (selectedRecipeId === null) return;
    if (!confirm('이 출력 제품을 레시피에서 제외하시겠습니까?')) return;
    const success = await removeRecipeOutput(selectedRecipeId, itemId);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 입력 품목 수량 수정
  const handleUpdateInputQty = async (itemId: number, qty: number) => {
    if (selectedRecipeId === null) return;
    const success = await updateRecipeInputQty(selectedRecipeId, itemId, qty);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 출력 품목 수량 수정
  const handleUpdateOutputQty = async (itemId: number, qty: number) => {
    if (selectedRecipeId === null) return;
    const success = await updateRecipeOutputQty(selectedRecipeId, itemId, qty);
    if (success) {
      await fetchRecipeList();
    }
  };

  // 레시피 완전히 삭제
  const handleDeleteRecipe = async (recipeId: number) => {
    const success = await deleteRecipe(recipeId);
    if (success) {
      if (selectedRecipeId === recipeId) {
        setSelectedRecipeId(null);
      }
      await fetchRecipeList();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
      {/* 1. 타이틀 헤더 */}
      <BomHeader />

      {/* 2. 에러 피드백 */}
      <BomErrorAlert message={itemsError || bomsError} />

      {/* 3. 액션 바 */}
      <BomActionBar
        onRefresh={async () => {
          await fetchItems();
          await fetchRecipeList();
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        loading={itemsLoading || bomsLoading}
      />

      {/* 4. 3-Pane 레이아웃 그리드 */}
      <BomLayout
        left={
          <BomParentList
            recipes={recipes}
            loading={bomsLoading}
            selectedRecipeId={selectedRecipeId}
            onSelectRecipe={handleSelectRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        }
        middle={
          <BomRecipeDetailPanel
            selectedRecipe={selectedRecipe}
            loading={bomsLoading}
            onRemoveInput={handleRemoveInput}
            onRemoveOutput={handleRemoveOutput}
            onUpdateInputQty={handleUpdateInputQty}
            onUpdateOutputQty={handleUpdateOutputQty}
          />
        }
        right={
          <BomItemListPanel
            items={items}
            onAddInput={handleAddInput}
            onAddOutput={handleAddOutput}
            hasSelectedRecipe={selectedRecipeId !== null}
          />
        }
      />

      {/* BOM 레시피 신규 등록 모달 */}
      <BomCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        items={items}
        processSteps={processSteps}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default BomManagePage;
