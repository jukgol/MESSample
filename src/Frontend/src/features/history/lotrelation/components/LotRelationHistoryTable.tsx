import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import type { LotRelationHistoryDto } from '../../../../api/data-contracts';

interface LotRelationHistoryTableProps {
  relations: LotRelationHistoryDto[];
  loading: boolean;
  error: string | null;
}

const LotRelationHistoryTable: React.FC<LotRelationHistoryTableProps> = ({ relations, loading, error }) => {
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
          LOT 관계 이력을 불러오는 중입니다...
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                <th style={{ padding: '1rem' }}>관계 ID</th>
                <th style={{ padding: '1rem' }}>부모 LOT (품목)</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>관계 흐름</th>
                <th style={{ padding: '1rem' }}>자식 LOT (품목)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>투입 / 산출 수량</th>
                <th style={{ padding: '1rem' }}>연관 작업지시</th>
                <th style={{ padding: '1rem' }}>공정 단계</th>
                <th style={{ padding: '1rem' }}>생성 일시</th>
              </tr>
            </thead>
            <tbody>
              {relations.length > 0 ? (
                relations.map((item) => {
                  const isInput = item.relationType === 'Input';
                  return (
                    <tr key={item.lotRelationID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                      <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.lotRelationID}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#60a5fa' }}>{item.parentLotNo || '입고/출처없음'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.parentItemName || '-'}</div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                          <span style={{
                            padding: '2px 8px',
                            background: isInput ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            border: `1px solid ${isInput ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            color: isInput ? '#f87171' : '#34d399',
                            fontWeight: 500
                          }}>
                            {item.relationType === 'Input' ? '투입' : '산출'}
                          </span>
                          <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#10b981' }}>{item.childLotNo}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.childItemName}</div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', color: 'white' }}>
                          {item.relationType === 'Input' ? `투입: ${item.inputQty || 0}` : `산출: ${item.outputQty}`}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.workOrderNo || '-'}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.stepName || '-'}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    조회된 LOT 관계 이력이 없습니다.
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

export default LotRelationHistoryTable;
