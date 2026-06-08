import React, { useState, useMemo } from 'react';
import { Search, Layers, ArrowRight, Loader2 } from 'lucide-react';
import type { ProcessMaster } from '../../../masterdata/master/hooks/useProcessMasters';

interface MrpMasterListProps {
  masters: ProcessMaster[];
  loading: boolean;
  selectedMasterId: number | null;
  onSelectMaster: (master: ProcessMaster) => void;
}

const MrpMasterList: React.FC<MrpMasterListProps> = ({
  masters,
  loading,
  selectedMasterId,
  onSelectMaster
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMasters = useMemo(() => {
    return masters.filter(m => 
      m.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.processCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [masters, searchTerm]);

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: 'var(--accent-primary)' }} /> 공정 마스터 목록
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
          {filteredMasters.length}개
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
        자재 소요량을 진단할 공정 마스터를 아래 목록에서 선택하세요.
      </p>

      {/* 검색 바 */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="공정명 또는 코드 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
      </div>

      {/* 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 8px' }} size={24} />
            공정 조회 중...
          </div>
        ) : filteredMasters.length > 0 ? (
          filteredMasters.map(master => {
            const isSelected = selectedMasterId === master.processID;
            return (
              <div
                key={master.processID}
                onClick={() => onSelectMaster(master)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: isSelected ? 'white' : 'var(--text-primary)' }}>
                    {master.processName}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {master.processCode}
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)', opacity: isSelected ? 1 : 0.3 }} />
              </div>
            );
          })
        ) : (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MrpMasterList;
