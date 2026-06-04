import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface LotDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotId: number | null;
  lotNo: string;
  onConfirm: (id: number) => Promise<boolean>;
}

const LotDeleteModal: React.FC<LotDeleteModalProps> = ({ isOpen, onClose, lotId, lotNo, onConfirm }) => {
  if (!isOpen || lotId === null) return null;

  const handleConfirm = async () => {
    const success = await onConfirm(lotId);
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
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>LOT 정보 삭제</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
            정말로 이 LOT 정보를 삭제하시겠습니까?<br />
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div style={{
          width: '100%',
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px',
          display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left',
          border: '1px solid var(--border-color)'
        }}>
          <div><strong>LOT ID:</strong> {lotId}</div>
          <div><strong>LOT 번호:</strong> {lotNo}</div>
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
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default LotDeleteModal;
