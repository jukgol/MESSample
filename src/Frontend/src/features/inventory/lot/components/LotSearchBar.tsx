import React from 'react';
import { Search } from 'lucide-react';

interface LotSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const LotSearchBar: React.FC<LotSearchBarProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      <input
        type="text"
        placeholder="자재명 또는 LOT 번호로 검색..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.8rem 1rem 0.8rem 2.5rem',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          color: 'white',
          outline: 'none'
        }}
      />
    </div>
  );
};

export default LotSearchBar;
