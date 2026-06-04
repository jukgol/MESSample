import React, { useState, useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import type { Item } from '../hooks/useItems';
import ItemHeader from '../components/ItemHeader';
import ItemTable from '../components/ItemTable';
import ItemCreateModal from '../components/ItemCreateModal';
import ItemUpdateModal from '../components/ItemUpdateModal';
import ItemDeleteModal from '../components/ItemDeleteModal';
import ItemActionBar from '../components/ItemActionBar';
import ItemSearchBar from '../components/ItemSearchBar';

const ItemList: React.FC = () => {
  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem, generateDummyItems } = useItems();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedItemIdForDelete, setSelectedItemIdForDelete] = useState<number | string | null>(null);

  // 검색어 필터링
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = item.id?.toString().toLowerCase().includes(searchLower) ?? false;
      const specMatch = item.spec?.toLowerCase().includes(searchLower) ?? false;
      return nameMatch || idMatch || specMatch;
    });
  }, [items, searchTerm]);

  // 등록 처리 핸들러
  const handleCreateSubmit = async (dto: { itemName: string; itemType: string; unit: string; description: string }) => {
    const success = await createItem(dto);
    if (success) {
      alert('품목이 성공적으로 등록되었습니다.');
    }
    return success;
  };

  // 수정 처리 핸들러
  const handleUpdateSubmit = async (id: number | string, dto: { itemName: string; itemType: string; unit: string; description: string }) => {
    const success = await updateItem(id, dto);
    if (success) {
      alert('품목 정보가 성공적으로 수정되었습니다.');
    }
    return success;
  };

  // 삭제 처리 핸들러
  const handleDeleteConfirm = async (id: number | string) => {
    const success = await deleteItem(id);
    if (success) {
      alert('품목이 삭제되었습니다.');
    }
    return success;
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* 1. 헤더 */}
      <ItemHeader />

      {/* 2. 버튼 액션 그룹 */}
      <ItemActionBar
        onGenerateDummy={async () => {
          const success = await generateDummyItems(10);
          if (success) {
            alert('10개의 테스트 데이터가 성공적으로 생성되었습니다.');
          }
        }}
        onRefresh={fetchItems}
        onOpenCreate={() => setIsCreateOpen(true)}
        loading={loading}
      />

      {/* 3. 검색창 */}
      <ItemSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* 4. 테이블 컴포넌트 */}
      <ItemTable
        items={filteredItems}
        loading={loading}
        error={error}
        onOpenUpdateModal={(item) => {
          setSelectedItem(item);
          setIsUpdateOpen(true);
        }}
        onDelete={(id) => {
          setSelectedItemIdForDelete(id);
          setIsDeleteOpen(true);
        }}
      />

      {/* 신규 등록 모달 */}
      <ItemCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* 정보 수정 모달 */}
      <ItemUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        onSubmit={handleUpdateSubmit}
      />

      {/* 정보 삭제 모달 */}
      <ItemDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedItemIdForDelete(null);
        }}
        itemId={selectedItemIdForDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ItemList;
