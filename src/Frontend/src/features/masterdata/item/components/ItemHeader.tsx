import React from 'react';

const ItemHeader: React.FC = () => {
  return (
    <header style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>품목 리스트</h1>
      <p style={{ color: 'var(--text-secondary)' }}>전체 등록된 품목 마스터 정보를 관리합니다. (백엔드 실시간 연동)</p>
    </header>
  );
};

export default ItemHeader;
