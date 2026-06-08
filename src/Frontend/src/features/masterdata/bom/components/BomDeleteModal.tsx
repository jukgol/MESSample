import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BomDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bomId: number | null;
  onConfirm: () => Promise<boolean>;
}

const BomDeleteModal: React.FC<BomDeleteModalProps> = ({ isOpen, onClose, bomId, onConfirm }) => {
  if (!isOpen || bomId === null) return null;

  const handleConfirm = async () => {
    const success = await onConfirm();
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
      <div className="premium-card" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          color: '#ef4444', marginBottom: '0.5rem'
        }}>
          <AlertTriangle size={28} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>BOM 항목 해제</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
            정말로 이 BOM 항목을 해제하시겠습니까?<br />
            이 품목이 공정 단계 마스터 등에 연동되어 있을 경우 영향을 미칠 수 있습니다.
          </p>
        </div>

        <div style={{
          width: '100%',
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px',
          border: '1px solid var(--border-color)', textAlign: 'left'
        }}>
          <strong>BOM 매핑 ID:</strong> {bomId}
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'white',
              boxShadow: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1,
              background: '#ef4444',
              border: 'none',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            해제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BomDeleteModal;
