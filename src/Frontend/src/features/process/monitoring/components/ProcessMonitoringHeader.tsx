import React from 'react';
import { Activity, Loader2, RotateCw, Play } from 'lucide-react';
import { api } from '../../../../api/client';

interface ProcessMonitoringHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onStartExecution?: () => void;
  hasSelection?: boolean;
}

const ProcessMonitoringHeader: React.FC<ProcessMonitoringHeaderProps> = ({ 
  loading, 
  onRefresh,
  onStartExecution,
  hasSelection = false
}) => {
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

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={onStartExecution}
          disabled={!hasSelection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            background: hasSelection ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
            color: hasSelection ? 'white' : 'rgba(255, 255, 255, 0.35)',
            padding: '0.6rem 1rem',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: hasSelection ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Play size={16} fill={hasSelection ? 'white' : 'rgba(255, 255, 255, 0.35)'} />
          선택 공정 실행
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              const response = await api.api.processMonitoringStarttoolLaunchCreate();
              if (!response.data?.success) {
                alert(`TestTool 실행 실패: ${response.data?.message || '오류 발생'}`);
              }
            } catch (err) {
              console.error(err);
              alert('서버 연결 실패 (TestTool 실행 불가)');
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            background: '#6366f1',
            color: 'white',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          <Play size={16} fill="white" />
          테스트툴 실행
        </button>

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
            boxShadow: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />}
          새로고침
        </button>
      </div>
    </header>
  );
};

export default ProcessMonitoringHeader;
