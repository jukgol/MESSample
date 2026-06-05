import React from 'react';
import { Search } from 'lucide-react';

interface UserSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', width: '320px', position: 'relative', marginBottom: '1rem' }}>
      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      <input
        type="text"
        placeholder="사용자 ID, 이름, 직책으로 검색..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem 1rem 0.6rem 2.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          background: 'rgba(30, 41, 59, 0.4)',
          color: 'var(--text-primary)',
          outline: 'none',
          fontSize: '0.9rem'
        }}
      />
    </div>
  );
};

export default UserSearchBar;
