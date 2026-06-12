import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import type { LotTraceHistoryDto } from '../../../../api/data-contracts';

interface LotTraceHistoryTableProps {
  traceList: LotTraceHistoryDto[];
  loading: boolean;
  error: string | null;
}

const LotTraceHistoryTable: React.FC<LotTraceHistoryTableProps> = ({ traceList, loading, error }) => {
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
      {error && (
        <div style={{ color: '#ef4444', padding: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
          전체 LOT 계보를 추적 중입니다...
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              총 <strong style={{ color: 'var(--accent-primary)' }}>{traceList.length}</strong>건의 추적 계보 노드가 확인되었습니다.
            </div>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                  <th style={{ padding: '1rem', width: '90px' }}>방향</th>
                  <th style={{ padding: '1rem', width: '80px', textAlign: 'center' }}>깊이(Depth)</th>
                  <th style={{ padding: '1rem' }}>부모 LOT (품목)</th>
                  <th style={{ padding: '1rem', textAlign: 'center', width: '80px' }}>연결</th>
                  <th style={{ padding: '1rem' }}>자식 LOT (품목)</th>
                  <th style={{ padding: '1rem', textAlign: 'right', width: '100px' }}>수량</th>
                  <th style={{ padding: '1rem' }}>공정 / 작업지시</th>
                  <th style={{ padding: '1rem' }}>생성 일시</th>
                </tr>
              </thead>
              <tbody>
                {traceList.length > 0 ? (
                  traceList.map((item, index) => {
                    const isForward = item.direction === 'FORWARD' || item.direction === 'Forward';

                    return (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '2px 8px',
                            background: isForward ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            border: `1px solid ${isForward ? 'rgba(99, 102, 241, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                            color: isForward ? '#818cf8' : '#fbbf24',
                            fontWeight: 500
                          }}>
                            {isForward ? '자식방향' : '부모방향'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {item.traceDepth}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {!isForward && <span style={{ color: 'var(--text-secondary)', marginRight: '6px', fontFamily: 'monospace' }}>{'─'.repeat(item.traceDepth || 0)}</span>}
                            <div>
                              <div style={{ fontWeight: '500', color: '#60a5fa' }}>{item.parentLotNo || '입고/최초원천'}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.parentItemName || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isForward && <span style={{ color: 'var(--text-secondary)', marginRight: '6px', fontFamily: 'monospace' }}>{'─'.repeat(item.traceDepth || 0)}</span>}
                            <div>
                              <div style={{ fontWeight: '500', color: '#10b981' }}>{item.childLotNo}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.childItemName}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500', color: 'white' }}>
                          {item.relationType === 'Input' ? `투입: ${item.inputQty || 0}` : `산출: ${item.outputQty}`}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: 'white', fontWeight: 500 }}>{item.stepName || '-'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.workOrderNo || '-'}</div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      조회된 추적 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotTraceHistoryTable;
