import React, { useState, useEffect, useMemo } from 'react';
import { useLots } from '../hooks/useLots';
import { useItems } from '../../../masterdata/item/hooks/useItems';
import LotHeader from '../components/LotHeader';
import LotTable from '../components/LotTable';
import LotCreateModal from '../components/LotCreateModal';
import LotUpdateModal from '../components/LotUpdateModal';
import LotDeleteModal from '../components/LotDeleteModal';
import LotActionBar from '../components/LotActionBar';
import LotSearchBar from '../components/LotSearchBar';
import type { LotDto } from '../../../../api/generated-api';

const LotList: React.FC = () => {
  const { lots, loading: lotsLoading, error: lotsError, fetchLots, createLot, updateLot, deleteLot, generateDummyLots, deleteAllLots } = useLots();
  const { items, fetchItems } = useItems();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotDto | null>(null);
  const [selectedLotForDelete, setSelectedLotForDelete] = useState<LotDto | null>(null);

  // 컴포넌트 마운트 시 자재 목록도 백엔드에서 미리 가져옴
  useEffect(() => {
    fetchItems();
  }, []);

  // 검색어 필터링
  const filteredLots = useMemo(() => {
    return lots.filter(lot => {
      const searchLower = searchTerm.toLowerCase();
      const lotNoMatch = lot.lotNo?.toLowerCase().includes(searchLower) ?? false;
      const itemNameMatch = lot.itemName?.toLowerCase().includes(searchLower) ?? false;
      return lotNoMatch || itemNameMatch;
    });
  }, [lots, searchTerm]);

  // 등록 처리 핸들러
  const handleCreateSubmit = async (dto: { itemID: number; lotNo: string; qty: number; status: string }) => {
    const success = await createLot(dto);
    if (success) {
      alert('LOT이 성공적으로 등록되었습니다.');
    }
    return success;
  };

  // 수정 처리 핸들러
  const handleUpdateSubmit = async (id: number, dto: { qty: number; status: string }) => {
    const success = await updateLot(id, dto);
    if (success) {
      alert('LOT 정보가 성공적으로 수정되었습니다.');
    }
    return success;
  };

  // 삭제 처리 핸들러
  const handleDeleteConfirm = async (id: number) => {
    const success = await deleteLot(id);
    if (success) {
      alert('LOT이 삭제되었습니다.');
    }
    return success;
  };

  // 전체 삭제 핸들러
  const handleDeleteAll = async () => {
    if (lots.length === 0) {
      alert('삭제할 LOT이 없습니다.');
      return;
    }
    if (window.confirm(`정말로 모든 LOT(${lots.length}개)을 삭제하시겠습니까?\n이 작업은 프런트엔드에서 순차적으로 삭제 처리를 진행합니다.`)) {
      const success = await deleteAllLots(lots);
      if (success) {
        alert('모든 LOT이 성공적으로 삭제되었습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <LotHeader />

      {/* 1. 액션 버튼 그룹 */}
      <LotActionBar
        onGenerateDummy={async () => {
          const success = await generateDummyLots(10);
          if (success) {
            alert('10개의 테스트 데이터가 성공적으로 생성되었습니다.');
          }
        }}
        onRefresh={fetchLots}
        onOpenCreate={() => setIsCreateOpen(true)}
        onDeleteAll={handleDeleteAll}
        loading={lotsLoading}
      />

      {/* 2. 검색창 */}
      <LotSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* 3. 테이블 컴포넌트 */}
      <LotTable
        lots={filteredLots}
        loading={lotsLoading}
        error={lotsError}
        onOpenUpdateModal={(lot) => {
          setSelectedLot(lot);
          setIsUpdateOpen(true);
        }}
        onDelete={(id) => {
          const lot = lots.find(l => l.lotID === id);
          if (lot) {
            setSelectedLotForDelete(lot);
            setIsDeleteOpen(true);
          }
        }}
      />

      {/* 신규 등록 모달 */}
      <LotCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        items={items}
        onSubmit={handleCreateSubmit}
      />

      {/* 정보 수정 모달 */}
      <LotUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedLot(null);
        }}
        selectedLot={selectedLot}
        onSubmit={handleUpdateSubmit}
      />

      {/* 정보 삭제 모달 */}
      <LotDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedLotForDelete(null);
        }}
        lotId={selectedLotForDelete?.lotID ?? null}
        lotNo={selectedLotForDelete?.lotNo ?? ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default LotList;
