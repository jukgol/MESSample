import React from 'react';

const UserHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
        사용자 계정 관리
      </h1>
      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
        시스템 접속 사용자 계정을 생성하고, 수정하며 직책 권한을 매핑합니다.
      </p>
    </div>
  );
};

export default UserHeader;
