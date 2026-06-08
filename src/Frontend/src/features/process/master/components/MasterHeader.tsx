import React from 'react';
import { RotateCw, Plus } from 'lucide-react';

interface MasterHeaderProps {
  onRefresh: () => Promise<void>;
  onOpenCreate: () => void;
}

const MasterHeader: React.FC<MasterHeaderProps> = ({ onRefresh, onOpenCreate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <h1 className="gradient-text" style={{ margin: 0, fontSize: '1.8rem' }}>제품별 공정 관리</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          생산라인(제품군)별 제조 공정 마스터를 설계하고 개별 작업 공정 단계들을 순서에 맞게 배치합니다.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
        <button
          onClick={onRefresh}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          <RotateCw size={16} /> 새로고침
        </button>
        <button
          onClick={onOpenCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          <Plus size={16} /> 신규 전체공정 생성
        </button>
      </div>
    </div>
  );
};

export default MasterHeader;
