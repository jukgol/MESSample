import React, { useState, useEffect } from 'react';
import { useLots } from './useLots';
import { useItems } from './useItems';
import LotHeader from './LotHeader';
import LotTable from './LotTable';
import type { LotDto } from '../../../api/generated-api';

const LotList: React.FC = () => {
  const { lots, loading: lotsLoading, error: lotsError, fetchLots, createLot, updateLot, deleteLot, generateDummyLots } = useLots();
  const { items, fetchItems } = useItems();

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotDto | null>(null);

  // 등록 폼 입력 상태
  const [createForm, setCreateForm] = useState({
    itemID: '',
    lotNo: '',
    qty: 0,
    status: '입고대기'
  });

  // 수정 폼 입력 상태
  const [updateForm, setUpdateForm] = useState({
    qty: 0,
    status: '입고대기'
  });

  // 컴포넌트 마운트 시 자재 목록도 백엔드에서 미리 가져옴
  useEffect(() => {
    fetchItems();
  }, []);

  // 등록 모달 열기 핸들러
  const handleOpenCreate = () => {
    setCreateForm({
      itemID: items.length > 0 ? items[0].id.toString() : '',
      lotNo: `LOT-${Date.now().toString().slice(-6)}`, // 기본 난수 바코드 번호 생성
      qty: 0,
      status: '입고대기'
    });
    setIsCreateOpen(true);
  };

  // 등록 처리 핸들러
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.itemID || !createForm.lotNo) {
      alert('자재와 LOT 번호는 필수 입력 항목입니다.');
      return;
    }
    const success = await createLot({
      itemID: parseInt(createForm.itemID),
      lotNo: createForm.lotNo,
      qty: createForm.qty,
      status: createForm.status
    });

    if (success) {
      setIsCreateOpen(false);
      alert('LOT이 성공적으로 등록되었습니다.');
    }
  };

  // 수정 모달 열기 핸들러
  const handleOpenUpdate = (lot: LotDto) => {
    setSelectedLot(lot);
    setUpdateForm({
      qty: lot.qty ?? 0,
      status: lot.status ?? '입고대기'
    });
    setIsUpdateOpen(true);
  };

  // 수정 처리 핸들러
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot || selectedLot.lotID === undefined) return;

    const success = await updateLot(selectedLot.lotID, {
      qty: updateForm.qty,
      status: updateForm.status
    });

    if (success) {
      setIsUpdateOpen(false);
      alert('LOT 정보가 성공적으로 수정되었습니다.');
    }
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
      <LotHeader
        loading={lotsLoading}
        onRefresh={fetchLots}
        onOpenCreateModal={handleOpenCreate}
        onGenerateDummy={async (count) => {
          const success = await generateDummyLots(count);
          if (success) {
            alert(`${count}개의 테스트 데이터가 성공적으로 생성되었습니다.`);
          }
        }}
      />

      <LotTable
        lots={lots}
        loading={lotsLoading}
        error={lotsError}
        onOpenUpdateModal={handleOpenUpdate}
        onDelete={handleDelete}
      />

      {/* 1. 신규 등록 모달 */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>LOT 신규 등록</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>대상 자재 (ITEM)</label>
                <select
                  value={createForm.itemID}
                  onChange={(e) => setCreateForm({ ...createForm, itemID: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  {items.length > 0 ? (
                    items.map(item => (
                      <option key={item.id} value={item.id} style={{ background: '#1e1e24' }}>
                        [{item.id}] {item.name} ({item.category})
                      </option>
                    ))
                  ) : (
                    <option value="" style={{ background: '#1e1e24' }}>등록된 자재 마스터 정보가 없습니다.</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>LOT 번호</label>
                <input
                  type="text"
                  required
                  placeholder="예: LOT-20260531-01"
                  value={createForm.lotNo}
                  onChange={(e) => setCreateForm({ ...createForm, lotNo: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>수량</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={createForm.qty}
                  onChange={(e) => setCreateForm({ ...createForm, qty: parseInt(e.target.value) || 0 })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>상태</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="입고대기" style={{ background: '#1e1e24' }}>입고대기</option>
                  <option value="공정중" style={{ background: '#1e1e24' }}>공정중</option>
                  <option value="검사중" style={{ background: '#1e1e24' }}>검사중</option>
                  <option value="완료" style={{ background: '#1e1e24' }}>완료</option>
                  <option value="출하완료" style={{ background: '#1e1e24' }}>출하완료</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
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
                <button type="submit" disabled={items.length === 0}>
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 정보 수정 모달 */}
      {isUpdateOpen && selectedLot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>LOT 정보 수정</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>LOT ID:</strong> {selectedLot.lotID}</div>
              <div><strong>자재명:</strong> {selectedLot.itemName}</div>
              <div><strong>LOT 번호:</strong> {selectedLot.lotNo}</div>
            </div>
            
            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>수량</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={updateForm.qty}
                  onChange={(e) => setUpdateForm({ ...updateForm, qty: parseInt(e.target.value) || 0 })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>상태</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="입고대기" style={{ background: '#1e1e24' }}>입고대기</option>
                  <option value="공정중" style={{ background: '#1e1e24' }}>공정중</option>
                  <option value="검사중" style={{ background: '#1e1e24' }}>검사중</option>
                  <option value="완료" style={{ background: '#1e1e24' }}>완료</option>
                  <option value="출하완료" style={{ background: '#1e1e24' }}>출하완료</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
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
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotList;
