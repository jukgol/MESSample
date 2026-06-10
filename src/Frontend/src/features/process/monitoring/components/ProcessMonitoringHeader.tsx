import React from 'react';
import { Activity, Loader2, RotateCw } from 'lucide-react';

interface ProcessMonitoringHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const ProcessMonitoringHeader: React.FC<ProcessMonitoringHeaderProps> = ({ loading, onRefresh }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <Activity size={22} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.6rem' }}>공정 모니터링</h1>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          현재 진행 중인 작업지시와 공정 상태를 확인합니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        title="새로고침"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'rgba(255,255,255,0.05)',
          color: 'white',
          padding: '0.6rem 1rem',
          boxShadow: 'none'
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />}
        새로고침
      </button>
    </header>
  );
};

export default ProcessMonitoringHeader;
