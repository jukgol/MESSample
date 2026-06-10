import React from 'react';
import { ClipboardList, Clock, Factory } from 'lucide-react';
import type { CurrentWorkOrderStateDto } from '../../../../api/data-contracts';

interface CurrentWorkOrderListProps {
  workOrders: CurrentWorkOrderStateDto[];
  selectedWorkOrderId: number | null;
  loading: boolean;
  onSelectWorkOrder: (workOrderId: number) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const statusLabel = (status?: string | null) => {
  switch (status) {
    case 'RUNNING':
      return '진행 중';
    case 'PAUSED':
      return '일시정지';
    case 'WAITING':
      return '대기';
    default:
      return status || '-';
  }
};

const statusStyle = (status?: string | null): React.CSSProperties => {
  if (status === 'RUNNING') {
    return { color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.28)' };
  }

  if (status === 'PAUSED') {
    return { color: '#f97316', background: 'rgba(249, 115, 22, 0.12)', border: '1px solid rgba(249, 115, 22, 0.28)' };
  }

  return { color: '#93c5fd', background: 'rgba(147, 197, 253, 0.12)', border: '1px solid rgba(147, 197, 253, 0.28)' };
};

const CurrentWorkOrderList: React.FC<CurrentWorkOrderListProps> = ({
  workOrders,
  selectedWorkOrderId,
  loading,
  onSelectWorkOrder
}) => {
  if (workOrders.length === 0) {
    return (
      <section className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', color: 'var(--text-secondary)' }}>
        {loading ? '현재 작업지시를 조회하고 있습니다.' : '현재 모니터링할 작업지시가 없습니다.'}
      </section>
    );
  }

  return (
    <section style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
      {workOrders.map((workOrder) => {
        const isSelected = selectedWorkOrderId === workOrder.workOrderID;
        const stepCount = workOrder.steps?.length || 0;

        return (
          <button
            key={workOrder.workOrderID}
            type="button"
            onClick={() => workOrder.workOrderID && onSelectWorkOrder(workOrder.workOrderID)}
            style={{
              minWidth: '300px',
              maxWidth: '340px',
              textAlign: 'left',
              borderRadius: '8px',
              padding: '1rem',
              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              boxShadow: isSelected ? '0 10px 28px rgba(99, 102, 241, 0.2)' : 'none',
              transform: 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <ClipboardList size={17} />
                <span style={{ fontSize: '0.82rem' }}>{workOrder.workOrderNo || '-'}</span>
              </div>
              <span style={{ ...statusStyle(workOrder.status), borderRadius: '8px', padding: '0.25rem 0.5rem', fontSize: '0.78rem', fontWeight: 700 }}>
                {statusLabel(workOrder.status)}
              </span>
            </div>

            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>
              {workOrder.processMasterName || '공정명 없음'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.9rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <div>
                <div>지시 수량</div>
                <strong style={{ color: 'white' }}>{workOrder.orderQty || 0}</strong>
              </div>
              <div>
                <div>공정 수</div>
                <strong style={{ color: 'white' }}>{stepCount}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <Factory size={14} />
              <span>{workOrder.workerName || '작업자 미지정'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <Clock size={14} />
              <span>{formatDateTime(workOrder.lastUpdatedAt)}</span>
            </div>
          </button>
        );
      })}
    </section>
  );
};

export default CurrentWorkOrderList;
