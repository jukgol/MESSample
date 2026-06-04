import React, { useState, useEffect, useMemo } from 'react';
import { useLots } from '../hooks/useLots';
import { useItems } from '../../../masterdata/item/hooks/useItems';
import LotHeader from '../components/LotHeader';
import LotTable from '../components/LotTable';
import LotCreateModal from '../components/LotCreateModal';
import LotUpdateModal from '../components/LotUpdateModal';
import { Search, Loader2, Database, RotateCw, Plus } from 'lucide-react';
import type { LotDto } from '../../../../api/generated-api';

const LotList: React.FC = () => {
  const { lots, loading: lotsLoading, error: lotsError, fetchLots, createLot, updateLot, deleteLot, generateDummyLots } = useLots();
  const { items, fetchItems } = useItems();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotDto | null>(null);

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
  const handleDelete = async (id: number) => {
    if (window.confirm(`정말로 LOT ID [${id}] 번을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      const success = await deleteLot(id);
      if (success) {
        alert('LOT이 삭제되었습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <LotHeader />

      {/* 1. 버튼 컨테이너 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          onClick={async () => {
            const success = await generateDummyLots(10);
            if (success) {
              alert('10개의 테스트 데이터가 성공적으로 생성되었습니다.');
            }
          }}
          disabled={lotsLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', boxShadow: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          {lotsLoading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />} 테스트 데이터 10개 생성
        </button>
        <button
          onClick={fetchLots}
          disabled={lotsLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', boxShadow: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          {lotsLoading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />} 새로고침
        </button>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <Plus size={16} /> LOT 신규 등록
        </button>
      </div>

      {/* 2. 검색창 */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="자재명 또는 LOT 번호로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.5rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            color: 'white',
            outline: 'none'
          }}
        />
      </div>

      {/* 3. 테이블 컴포넌트 */}
      <LotTable
        lots={filteredLots}
        loading={lotsLoading}
        error={lotsError}
        onOpenUpdateModal={(lot) => {
          setSelectedLot(lot);
          setIsUpdateOpen(true);
        }}
        onDelete={handleDelete}
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
    </div>
  );
};

export default LotList;
