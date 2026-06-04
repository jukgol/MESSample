import React from 'react';

const LotHeader: React.FC = () => {
  return (
    <header style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>LOT 관리</h1>
      <p style={{ color: 'var(--text-secondary)' }}>실제 입고되어 처리 중인 LOT 상태 및 정보를 관리합니다.</p>
    </header>
  );
};

export default LotHeader;
