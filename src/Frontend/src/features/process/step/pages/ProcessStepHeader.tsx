import React from 'react';

const ProcessStepHeader: React.FC = () => {
  return (
    <header style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>공정 단계 관리</h1>
      <p style={{ color: 'var(--text-secondary)' }}>제조 라인을 구성하는 세부 공정 단계 마스터를 조회하고 레시피(BOM)를 연결합니다. (백엔드 실시간 연동)</p>
    </header>
  );
};

export default ProcessStepHeader;
