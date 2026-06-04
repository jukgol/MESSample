import React from 'react';

const ItemTypeHeader: React.FC = () => {
  return (
    <header style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>품목 유형 관리</h1>
      <p style={{ color: 'var(--text-secondary)' }}>품목의 유형(원자재, 반제품, 제품 등)을 동적으로 등록, 수정, 삭제하고 관리합니다.</p>
    </header>
  );
};

export default ItemTypeHeader;
