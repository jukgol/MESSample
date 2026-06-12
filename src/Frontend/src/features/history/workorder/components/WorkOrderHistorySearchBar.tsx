import React from 'react';
import { Search } from 'lucide-react';

interface WorkOrderHistorySearchBarProps {
  searchNo: string;
  setSearchNo: (val: string) => void;
  searchWorker: string;
  setSearchWorker: (val: string) => void;
  searchStatus: string;
  setSearchStatus: (val: string) => void;
}

const WorkOrderHistorySearchBar: React.FC<WorkOrderHistorySearchBarProps> = ({
  searchNo,
  setSearchNo,
  searchWorker,
  setSearchWorker,
  searchStatus,
  setSearchStatus,
}) => {
  return (
    <div className="premium-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>작업지시 번호</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="작업지시 번호 검색..."
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>작업자</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="작업자명 검색..."
            value={searchWorker}
            onChange={(e) => setSearchWorker(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '150px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>상태</label>
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          style={{ width: '100%', padding: '8px 12px', background: '#151720', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
        >
          <option value="ALL">전체 상태</option>
          <option value="CREATED">CREATED</option>
          <option value="RUNNING">RUNNING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="DONE">DONE</option>
          <option value="DELETED">DELETED</option>
        </select>
      </div>
    </div>
  );
};

export default WorkOrderHistorySearchBar;
