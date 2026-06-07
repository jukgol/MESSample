import React, { useState, useEffect } from 'react';
import type { Item } from '../../item/hooks/useItems';
import type { Bom } from '../hooks/useBoms';

interface BomUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParentItem: Item | null;
  selectedBomForUpdate: Bom | null;
  onSubmit: (dto: { bomQty: number }) => Promise<boolean>;
}

const BomUpdateModal: React.FC<BomUpdateModalProps> = ({
  isOpen,
  onClose,
  selectedParentItem,
  selectedBomForUpdate,
  onSubmit
}) => {
  const [form, setForm] = useState<{ bomQty: number | '' }>({
    bomQty: 1
  });

  useEffect(() => {
    if (isOpen && selectedBomForUpdate) {
      setForm({
        bomQty: selectedBomForUpdate.bomQty
      });
    }
  }, [isOpen, selectedBomForUpdate]);

  if (!isOpen || !selectedParentItem || !selectedBomForUpdate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.bomQty === '' || Number(form.bomQty) <= 0) {
      alert('소요량은 1개 이상이어야 합니다.');
      return;
    }

    const success = await onSubmit({
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
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>BOM 소요량 수정</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
          <div><strong>기준 부모 품목:</strong> {selectedParentItem.name}</div>
          <div><strong>대상 자식 품목:</strong> {selectedBomForUpdate.childItemName || `품목 #${selectedBomForUpdate.childItemID}`}</div>
          <div><strong>BOM 매핑 ID:</strong> {selectedBomForUpdate.bomID}</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>수정할 소요 수량 (Qty)</label>
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
            <button type="submit">
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BomUpdateModal;
