import React from 'react';

const RoleHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
        직책 권한 매핑 설정
      </h1>
      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
        각 사용자 직책별로 대분류 카테고리화된 세부 기능에 대한 접근 권한을 매핑합니다.
      </p>
    </div>
  );
};

export default RoleHeader;
