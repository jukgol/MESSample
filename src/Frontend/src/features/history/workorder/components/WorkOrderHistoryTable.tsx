import React from 'react';
import { Loader2 } from 'lucide-react';
import type { WorkOrderHistoryDto } from '../../../../api/data-contracts';

interface WorkOrderHistoryTableProps {
  historyList: WorkOrderHistoryDto[];
  loading: boolean;
  error: string | null;
}

const WorkOrderHistoryTable: React.FC<WorkOrderHistoryTableProps> = ({ historyList, loading, error }) => {
  const getStatusBadgeStyle = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'COMPLETED':
      case 'DONE':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', color: '#34d399', text: '완료' };
      case 'RUNNING':
        return { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', text: '진행중' };
      case 'CREATED':
      case 'APPROVED':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', text: '승인됨' };
      case 'DELETED':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: '삭제됨' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: status || '대기' };
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('ko-KR');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="premium-card" style={{ padding: '1.5rem' }}>
      {error ? (
        <div style={{ color: '#ef4444', padding: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      ) : loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
          작업지시 이력을 불러오는 중입니다...
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>작업지시 번호</th>
                <th style={{ padding: '1rem' }}>공정 마스터</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>지시 수량</th>
                <th style={{ padding: '1rem' }}>작업자</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>상태</th>
                <th style={{ padding: '1rem' }}>승인 일시</th>
                <th style={{ padding: '1rem' }}>생성 일시</th>
              </tr>
            </thead>
            <tbody>
              {historyList.length > 0 ? (
                historyList.map((item) => {
                  const badge = getStatusBadgeStyle(item.status || '');
                  return (
                    <tr key={item.workOrderID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                      <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.workOrderID}</td>
                      <td style={{ padding: '1rem', fontWeight: '500', color: 'white' }}>{item.workOrderNo}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.processMasterName}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>{item.orderQty?.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>{item.workerName || '-'}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          background: badge.bg,
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          {badge.text}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.approvedAt)}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    조회된 작업지시 이력이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkOrderHistoryTable;
