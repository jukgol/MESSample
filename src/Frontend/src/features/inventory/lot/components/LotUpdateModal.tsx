import React, { useState, useEffect } from 'react';
import type { LotDto } from '../../../../api/generated-api';

interface LotUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLot: LotDto | null;
  onSubmit: (id: number, dto: { qty: number; status: string }) => Promise<boolean>;
}

const LotUpdateModal: React.FC<LotUpdateModalProps> = ({ isOpen, onClose, selectedLot, onSubmit }) => {
  const [form, setForm] = useState({
    qty: 0,
    status: '입고대기'
  });

  useEffect(() => {
    if (isOpen && selectedLot) {
      setForm({
        qty: selectedLot.qty ?? 0,
        status: selectedLot.status ?? '입고대기'
      });
    }
  }, [isOpen, selectedLot]);

  if (!isOpen || !selectedLot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLot.lotID === undefined) return;
    const success = await onSubmit(selectedLot.lotID, {
      qty: form.qty,
      status: form.status
    });
    if (success) {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>LOT 정보 수정</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div><strong>LOT ID:</strong> {selectedLot.lotID}</div>
          <div><strong>자재명:</strong> {selectedLot.itemName}</div>
          <div><strong>LOT 번호:</strong> {selectedLot.lotNo}</div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>수량</label>
            <input
              type="number"
              min="0"
              required
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 0 })}
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
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
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
              onClick={onClose}
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
  );
};

export default LotUpdateModal;
