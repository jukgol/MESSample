import React from 'react';
import { Layers } from 'lucide-react';

const LotRelationHistoryHeader: React.FC = () => {
  return (
    <div>
      <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Layers size={28} /> LOT 관계 이력 조회
      </h1>
      <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
        원자재 투입 및 완제품/반제품 생산 과정에서 생성된 LOT 간의 부모-자식 관계 정보를 조회합니다.
      </p>
    </div>
  );
};

export default LotRelationHistoryHeader;
