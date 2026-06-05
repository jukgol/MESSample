import React, { useState } from 'react';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => Promise<boolean>;
  userId: number | null;
  loginId: string;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userId,
  loginId
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || userId === null) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setErrorMsg('');
    const success = await onConfirm(userId);
    setSubmitting(false);

    if (success) {
      onClose();
    } else {
      setErrorMsg('사용자 계정 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="premium-card" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f87171' }}>
          사용자 계정 삭제
        </h3>

        {errorMsg && (
          <div style={{ color: '#f87171', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          정말로 사용자 <strong style={{ color: 'var(--text-primary)' }}>[{loginId}]</strong> 계정을 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              boxShadow: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px'
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              boxShadow: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px'
            }}
          >
            {submitting ? '삭제 중...' : '삭제 확정'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
