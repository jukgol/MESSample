import React, { useState, useEffect } from 'react';
import type { ItemType } from '../hooks/useItemTypes';

interface ItemTypeUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemType: ItemType | null;
  onSubmit: (id: number, dto: { typeName: string }) => Promise<boolean>;
}

const ItemTypeUpdateModal: React.FC<ItemTypeUpdateModalProps> = ({
  isOpen,
  onClose,
  selectedItemType,
  onSubmit
}) => {
  const [typeName, setTypeName] = useState('');

  useEffect(() => {
    if (isOpen && selectedItemType) {
      setTypeName(selectedItemType.typeName);
    }
  }, [isOpen, selectedItemType]);

  if (!isOpen || !selectedItemType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) {
      alert('품목 유형 이름은 필수 입력 항목입니다.');
      return;
    }
    const success = await onSubmit(selectedItemType.itemTypeID, { typeName: typeName.trim() });
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
      <div className="premium-card" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>품목 유형 수정</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <strong>유형 ID:</strong> {selectedItemType.itemTypeID}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>유형명</label>
            <input
              type="text"
              required
              placeholder="예: 반제품, 원자재, 완제품"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
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

export default ItemTypeUpdateModal;
