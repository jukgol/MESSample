import React from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';

interface UserActionBarProps {
  onRefresh: () => void;
  onOpenCreate: () => void;
  loading: boolean;
}

const UserActionBar: React.FC<UserActionBarProps> = ({
  onRefresh,
  onOpenCreate,
  loading
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.6rem 1rem',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'none',
          cursor: 'pointer'
        }}
        title="새로고침"
      >
        <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
      </button>

      <button
        onClick={onOpenCreate}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.6rem 1.2rem',
          fontSize: '0.9rem'
        }}
      >
        <UserPlus size={16} />
        신규 사용자 등록
      </button>
    </div>
  );
};

export default UserActionBar;
