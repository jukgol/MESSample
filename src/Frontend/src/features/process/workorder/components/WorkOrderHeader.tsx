import React from 'react';

const WorkOrderHeader: React.FC = () => {
  return (
    <div>
      <h1 className="gradient-text" style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>작업 지시 (Work Order)</h1>
      <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.9rem' }}>
        공정별 작업 가능 여부를 확인하고 작업지시를 승인합니다.
      </p>
    </div>
  );
};

export default WorkOrderHeader;
