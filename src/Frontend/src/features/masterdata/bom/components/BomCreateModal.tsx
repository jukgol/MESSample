import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { Item } from '../../item/hooks/useItems';

interface BomCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParentItem: Item | null;
  availableChildItems: Item[];
  onSubmit: (dto: { childItemID: number; bomQty: number }) => Promise<boolean>;
}

const BomCreateModal: React.FC<BomCreateModalProps> = ({
  isOpen,
  onClose,
  selectedParentItem,
  availableChildItems,
  onSubmit
}) => {
  const [form, setForm] = useState<{ childItemID: string; bomQty: number | '' }>({
    childItemID: '',
    bomQty: 1
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        childItemID: '',
        bomQty: 1
      });
    }
  }, [isOpen]);

  if (!isOpen || !selectedParentItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childItemID) {
      alert('자식 품목을 선택해 주세요.');
      return;
    }
    if (form.bomQty === '' || Number(form.bomQty) <= 0) {
      alert('소요량은 1개 이상이어야 합니다.');
      return;
    }

    const success = await onSubmit({
      childItemID: Number(form.childItemID),
      bomQty: Number(form.bomQty)
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
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>BOM 구성 요소 추가</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
          <strong>기준 부모 품목:</strong> {selectedParentItem.name} (ID: {selectedParentItem.id})
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>추가할 자식 품목</label>
            {availableChildItems.length > 0 ? (
              <select
                required
                value={form.childItemID}
                onChange={(e) => setForm({ ...form, childItemID: e.target.value })}
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
              value={form.bomQty}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, bomQty: val === '' ? '' : Number(val) });
              }}
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
  );
};

export default BomCreateModal;
