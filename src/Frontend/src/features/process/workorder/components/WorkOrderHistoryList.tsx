import React from 'react';
import { Eye, Loader2 } from 'lucide-react';
import type { WorkOrderHistoryDto } from '../../../../api/data-contracts';

interface WorkOrderHistoryListProps {
  history: WorkOrderHistoryDto[];
  loading: boolean;
}

const statusLabels: Record<string, string> = {
  APPROVED: '승인',
  WAITING: '대기',
  RUNNING: '진행중',
  PAUSED: '일시정지',
  DONE: '완료'
};

const WorkOrderHistoryList: React.FC<WorkOrderHistoryListProps> = ({ history, loading }) => {
  if (loading) {
    return (
      <section className="workorder-panel" style={{ minHeight: 180, display: 'grid', placeItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Loader2 className="animate-spin" size={18} />
          작업 이력을 불러오는 중입니다.
        </div>
      </section>
    );
  }

  if (history.length === 0) {
    return (
      <section className="workorder-panel" style={{ minHeight: 180, display: 'grid', placeItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)' }}>표시할 작업 이력이 없습니다.</span>
      </section>
    );
  }

  return (
    <section className="workorder-panel" style={{ overflow: 'hidden', padding: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(160px, 1fr) minmax(220px, 1.4fr) 120px 120px',
          gap: '0.75rem',
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          fontWeight: 700
        }}
      >
        <span>작업지시</span>
        <span>공정 마스터</span>
        <span>현재 상태</span>
        <span style={{ textAlign: 'right' }}>상세</span>
      </div>

      {history.map((row) => {
        const status = row.status || '';
        const statusLabel = statusLabels[status] || status || '-';

        return (
          <div
            key={row.workOrderID || row.workOrderNo}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(160px, 1fr) minmax(220px, 1.4fr) 120px 120px',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.95rem 1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
            }}
          >
            <strong style={{ color: 'white' }}>{row.workOrderNo || '-'}</strong>
            <span style={{ color: 'var(--text-primary)' }}>{row.processMasterName || '-'}</span>
            <span
              style={{
                width: 'fit-content',
                minWidth: 72,
                textAlign: 'center',
                padding: '0.35rem 0.65rem',
                borderRadius: 999,
                background: 'rgba(99, 102, 241, 0.14)',
                color: '#c7d2fe',
                fontWeight: 800,
                fontSize: '0.82rem'
              }}
            >
              {statusLabel}
            </span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                title="상세보기"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  minWidth: 92,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontWeight: 800
                }}
              >
                <Eye size={15} />
                상세보기
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default WorkOrderHistoryList;
