import React from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import type { LotDto } from '../../../../api/data-contracts';

interface LotTableProps {
  lots: LotDto[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (lot: LotDto) => void;
  onDelete: (id: number) => void;
}

const LotTable: React.FC<LotTableProps> = ({ lots, loading, error, onOpenUpdateModal, onDelete }) => {
  // 날짜 포맷팅 함수 (YYYY-MM-DD HH:mm:ss)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="premium-card" style={{ padding: '1.5rem' }}>
      {error && (
        <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                position: 'sticky',
                top: 0,
                background: '#151720',
                zIndex: 1
              }}>
                <th style={{ padding: '1rem' }}>LOT ID</th>
                <th style={{ padding: '1rem' }}>자재 ID</th>
                <th style={{ padding: '1rem' }}>자재명</th>
                <th style={{ padding: '1rem' }}>LOT 번호</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>수량</th>
                <th style={{ padding: '1rem' }}>입고 일시</th>
                <th style={{ padding: '1rem' }}>상태</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {lots.length > 0 ? (
                lots.map((lot) => (
                  <tr key={lot.lotID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{lot.lotID}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{lot.itemID}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{lot.itemName}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{lot.lotNo}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>{lot.qty?.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{formatDate(lot.receivedAt)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: lot.status === '완료' ? 'rgba(34, 197, 94, 0.1)' : lot.status === '공정중' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        border: `1px solid ${lot.status === '완료' ? 'rgba(34, 197, 94, 0.2)' : lot.status === '공정중' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
                        color: lot.status === '완료' ? '#4ade80' : lot.status === '공정중' ? '#facc15' : '#818cf8'
                      }}>
                        {lot.status || '입고대기'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => onOpenUpdateModal(lot)}
                          style={{
                            padding: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            boxShadow: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="수정"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => lot.lotID && onDelete(lot.lotID)}
                          style={{
                            padding: '6px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            boxShadow: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    등록된 LOT 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LotTable;
