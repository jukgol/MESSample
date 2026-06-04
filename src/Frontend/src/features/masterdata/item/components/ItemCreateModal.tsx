import React, { useState, useEffect } from 'react';
import { useItemTypes } from '../../itemtype/hooks/useItemTypes';

interface ItemCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: { itemCode: string; itemName: string; itemType: string; unit: string; description: string }) => Promise<boolean>;
}

const ItemCreateModal: React.FC<ItemCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { itemTypes } = useItemTypes();
  const [form, setForm] = useState({
    itemCode: '',
    itemName: '',
    itemType: '',
    unit: 'EA',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        itemCode: '',
        itemName: '',
        itemType: itemTypes[0]?.typeName || 'RawMaterial',
        unit: 'EA',
        description: ''
      });
    }
  }, [isOpen, itemTypes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemCode) {
      alert('품목 코드는 필수 입력 항목입니다.');
      return;
    }
    if (!form.itemName) {
      alert('품목명은 필수 입력 항목입니다.');
      return;
    }
    const success = await onSubmit({
      itemCode: form.itemCode,
      itemName: form.itemName,
      itemType: form.itemType,
      unit: form.unit,
      description: form.description
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
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>품목 신규 등록</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>품목 코드</label>
            <input
              type="text"
              required
              placeholder="예: ITEM_101"
              value={form.itemCode}
              onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
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
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>품목명</label>
            <input
              type="text"
              required
              placeholder="예: PCB Type A"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
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
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>구분</label>
            <select
              value={form.itemType}
              onChange={(e) => setForm({ ...form, itemType: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            >
              {itemTypes.map((type) => (
                <option key={type.itemTypeID} value={type.typeName} style={{ background: '#1e1e24' }}>
                  {type.typeName}
                </option>
              ))}
              {form.itemType && !itemTypes.some(t => t.typeName === form.itemType) && (
                <option value={form.itemType} style={{ background: '#1e1e24' }}>
                  {form.itemType}
                </option>
              )}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>단위</label>
            <input
              type="text"
              required
              placeholder="예: EA, KG, M"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
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
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명 (규격)</label>
            <textarea
              placeholder="품목 설명을 입력하세요..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
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
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemCreateModal;
