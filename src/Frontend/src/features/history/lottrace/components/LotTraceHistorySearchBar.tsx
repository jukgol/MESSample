import React from 'react';
import { Search } from 'lucide-react';

interface LotTraceHistorySearchBarProps {
  searchText: string;
  setSearchText: (val: string) => void;
}

const LotTraceHistorySearchBar: React.FC<LotTraceHistorySearchBarProps> = ({
  searchText,
  setSearchText,
}) => {
  return (
    <div className="premium-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '400px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>LOT 번호 / 품목명 검색 (UI 전용)</label>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="검색할 LOT 번호 또는 품목명 입력..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: '#151720',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LotTraceHistorySearchBar;
