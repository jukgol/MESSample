import React from 'react';
import { Search } from 'lucide-react';

interface LotRelationHistorySearchBarProps {
  searchParentLot: string;
  setSearchParentLot: (val: string) => void;
  searchChildLot: string;
  setSearchChildLot: (val: string) => void;
  searchItemName: string;
  setSearchItemName: (val: string) => void;
}

const LotRelationHistorySearchBar: React.FC<LotRelationHistorySearchBarProps> = ({
  searchParentLot,
  setSearchParentLot,
  searchChildLot,
  setSearchChildLot,
  searchItemName,
  setSearchItemName,
}) => {
  return (
    <div className="premium-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>부모 LOT 번호</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="부모 LOT 번호..."
            value={searchParentLot}
            onChange={(e) => setSearchParentLot(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>자식 LOT 번호</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="자식 LOT 번호..."
            value={searchChildLot}
            onChange={(e) => setSearchChildLot(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>품목명</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="품목명 검색..."
            value={searchItemName}
            onChange={(e) => setSearchItemName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LotRelationHistorySearchBar;
