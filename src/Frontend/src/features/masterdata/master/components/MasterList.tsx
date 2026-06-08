import React from 'react';
import { Activity, Loader2, Trash2 } from 'lucide-react';
import type { ProcessMaster } from '../hooks/useProcessMasters';

interface MasterListProps {
  masters: ProcessMaster[];
  selectedMaster: ProcessMaster | null;
  onSelectMaster: (master: ProcessMaster) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  onDeleteMaster: (master: ProcessMaster, e: React.MouseEvent) => void;
}

const MasterList: React.FC<MasterListProps> = ({
  masters,
  selectedMaster,
  onSelectMaster,
  searchTerm,
  onSearchChange,
  loading,
  onDeleteMaster
}) => {
  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg, #1a1a24)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} style={{ color: 'var(--accent-primary)' }} /> 1. 전체 공정 목록
        </h3>
        <input
          type="text"
          placeholder="공정명 또는 코드로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: 'var(--text-secondary)' }}>
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : masters.length > 0 ? (
          masters.map((master) => {
            const isSelected = selectedMaster?.processID === master.processID;
            return (
              <div
                key={master.processID}
                onClick={() => onSelectMaster(master)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {master.processCode}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
                    {master.processName}
                  </span>
                </div>
                <button
                  onClick={(e) => onDeleteMaster(master, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  title="공정 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
            등록된 공정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterList;
