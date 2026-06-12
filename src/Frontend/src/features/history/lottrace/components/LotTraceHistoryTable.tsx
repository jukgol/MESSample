import React from 'react';
import { Loader2 } from 'lucide-react';
import type { LotStockHistoryDto } from '../../../../api/data-contracts';

interface LotTraceHistoryTableProps {
  traceList: LotStockHistoryDto[];
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

  const getChangeTypeBadgeStyle = (changeType: string | undefined | null) => {
    const type = changeType ? changeType.toUpperCase() : '';
    switch (type) {
      case 'CREATE':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', text: '생성' };
      case 'INCREASE':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', color: '#34d399', text: '증가' };
      case 'DECREASE':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', text: '차감' };
      case 'CONSUME':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: '소모' };
      case 'ADJUST':
        return { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', text: '조정' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: changeType || '-' };
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
          재고 변동 이력을 불러오는 중입니다...
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              총 <strong style={{ color: 'var(--accent-primary)' }}>{traceList.length}</strong>건의 재고 변동 내역이 확인되었습니다.
            </div>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                  <th style={{ padding: '1rem', width: '80px' }}>ID</th>
                  <th style={{ padding: '1rem' }}>LOT 번호</th>
                  <th style={{ padding: '1rem' }}>품목명</th>
                  <th style={{ padding: '1rem', textAlign: 'center', width: '100px' }}>변동 구분</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>이전 수량</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>변동 수량</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>이후 수량</th>
                  <th style={{ padding: '1rem' }}>사유</th>
                  <th style={{ padding: '1rem' }}>생성 일시</th>
                </tr>
              </thead>
              <tbody>
                {traceList.length > 0 ? (
                  traceList.map((item) => {
                    const badge = getChangeTypeBadgeStyle(item.changeType);
                    const changeQtyText = item.changeQty && item.changeQty > 0 ? `+${item.changeQty.toLocaleString()}` : item.changeQty?.toLocaleString() || '0';
                    const changeQtyColor = item.changeQty && item.changeQty > 0 ? '#34d399' : item.changeQty && item.changeQty < 0 ? '#ef4444' : 'white';

                    return (
                      <tr key={item.lotStockHistoryID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{item.lotStockHistoryID}</td>
                        <td style={{ padding: '1rem', fontWeight: '500', color: 'white' }}>{item.lotNo}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.itemName || '-'}</td>
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
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.beforeQty?.toLocaleString() || 0}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: changeQtyColor }}>{changeQtyText}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.afterQty?.toLocaleString() || 0}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.reason || '-'}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      조회된 재고 변동 내역이 없습니다.
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
