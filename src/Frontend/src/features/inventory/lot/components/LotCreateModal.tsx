import React, { useState, useEffect } from 'react';
import type { Item } from '../../../masterdata/item/hooks/useItems';

interface LotCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSubmit: (dto: { itemID: number; lotNo: string; qty: number; status: string }) => Promise<boolean>;
}

const LotCreateModal: React.FC<LotCreateModalProps> = ({ isOpen, onClose, items, onSubmit }) => {
  const [form, setForm] = useState({
    itemID: '',
    lotNo: '',
    qty: 0,
    status: '입고대기'
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        itemID: items.length > 0 ? items[0].id.toString() : '',
        lotNo: `LOT-${Date.now().toString().slice(-6)}`,
        qty: 0,
        status: '입고대기'
      });
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemID || !form.lotNo) {
      alert('자재와 LOT 번호는 필수 입력 항목입니다.');
      return;
    }
    const success = await onSubmit({
      itemID: parseInt(form.itemID),
      lotNo: form.lotNo,
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
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>LOT 신규 등록</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>대상 자재 (ITEM)</label>
            <select
              value={form.itemID}
              onChange={(e) => setForm({ ...form, itemID: e.target.value })}
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
              value={form.lotNo}
              onChange={(e) => setForm({ ...form, lotNo: e.target.value })}
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
            <button type="submit" disabled={items.length === 0}>
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LotCreateModal;
