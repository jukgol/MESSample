import React from 'react';
import { Activity } from 'lucide-react';

const LotTraceHistoryHeader: React.FC = () => {
  return (
    <div>
      <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={28} /> LOT 추적 이력 조회
      </h1>
      <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
        전체 LOT의 생산 계보 및 상/하위 흐름을 추적하여 목록 형태로 일괄 조회합니다.
      </p>
    </div>
  );
};

export default LotTraceHistoryHeader;
