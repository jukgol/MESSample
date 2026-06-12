import React from 'react';
import { ClipboardList } from 'lucide-react';

const WorkOrderHistoryHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ClipboardList size={28} /> 작업지시 이력 조회
      </h1>
      <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
        시스템에서 승인 및 진행된 작업지시의 전체 목록과 상태 이력을 조회합니다.
      </p>
    </div>
  );
};

export default WorkOrderHistoryHeader;
