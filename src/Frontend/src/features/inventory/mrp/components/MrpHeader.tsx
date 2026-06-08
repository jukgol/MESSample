import React from 'react';

const MrpHeader: React.FC = () => {
  return (
    <div>
      <h1 className="gradient-text" style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>자재 소요량 계획 (MRP)</h1>
      <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
        공정 마스터와 단계별 BOM 레시피, 현재 창고고를 바탕으로 생산 가능 여부와 부족 원자재를 진단합니다.
      </p>
    </div>
  );
};

export default MrpHeader;
