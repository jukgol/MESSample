import React, { useState, useMemo } from 'react';
import { RefreshCw, Plus, Search } from 'lucide-react';
import { useItemTypes } from '../hooks/useItemTypes';
import type { ItemType } from '../hooks/useItemTypes';
import ItemTypeHeader from '../components/ItemTypeHeader';
import ItemTypeTable from '../components/ItemTypeTable';
import ItemTypeCreateModal from '../components/ItemTypeCreateModal';
import ItemTypeUpdateModal from '../components/ItemTypeUpdateModal';
import ItemTypeDeleteModal from '../components/ItemTypeDeleteModal';

const ItemTypeList: React.FC = () => {
  const { itemTypes, loading, error, fetchItemTypes, createItemType, updateItemType, deleteItemType } = useItemTypes();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<number | null>(null);

  // 검색 필터링
  const filteredItemTypes = useMemo(() => {
    return itemTypes.filter(type => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = type.typeName?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = type.itemTypeID?.toString().toLowerCase().includes(searchLower) ?? false;
      return nameMatch || idMatch;
    });
  }, [itemTypes, searchTerm]);

  // 등록 처리 핸들러
  const handleCreateSubmit = async (dto: { typeName: string }) => {
    return await createItemType(dto);
  };

  // 수정 처리 핸들러
  const handleUpdateSubmit = async (id: number, dto: { typeName: string }) => {
    return await updateItemType(id, dto);
  };

  // 삭제 처리 핸들러
  const handleDeleteConfirm = async (id: number) => {
    return await deleteItemType(id);
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* 1. 헤더 */}
      <ItemTypeHeader />

      {/* 2. 액션 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> 신규 등록
          </button>
          <button
            onClick={fetchItemTypes}
            disabled={loading}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'none'
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>
      </div>

      {/* 3. 검색창 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0 1rem',
        marginBottom: '1.5rem',
        maxWidth: '400px'
      }}>
        <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
        <input
          type="text"
          placeholder="유형명 또는 ID로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 0',
            background: 'transparent',
            border: 'none',
            color: 'white',
            outline: 'none'
          }}
        />
      </div>

      {/* 4. 테이블 */}
      <ItemTypeTable
        itemTypes={filteredItemTypes}
        loading={loading}
        error={error}
        onOpenUpdateModal={(type) => {
          setSelectedItemType(type);
          setIsUpdateOpen(true);
        }}
        onDelete={(id) => {
          setSelectedIdForDelete(id);
          setIsDeleteOpen(true);
        }}
      />

      {/* 신규 등록 모달 */}
      <ItemTypeCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* 정보 수정 모달 */}
      <ItemTypeUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedItemType(null);
        }}
        selectedItemType={selectedItemType}
        onSubmit={handleUpdateSubmit}
      />

      {/* 정보 삭제 모달 */}
      <ItemTypeDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedIdForDelete(null);
        }}
        itemTypeId={selectedIdForDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ItemTypeList;
