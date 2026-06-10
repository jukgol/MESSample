import React from 'react';
import type { WorkOrderStepAvailabilityDto } from '../../../../api/data-contracts';

interface WorkOrderStepGridProps {
  steps: WorkOrderStepAvailabilityDto[];
  loading: boolean;
}

const statusStyle = (isAvailable?: boolean): React.CSSProperties => ({
  alignSelf: 'flex-start',
  padding: '0.35rem 0.65rem',
  borderRadius: '8px',
  color: isAvailable ? '#22c55e' : '#f97316',
  background: isAvailable ? 'rgba(34, 197, 94, 0.12)' : 'rgba(249, 115, 22, 0.12)',
  border: isAvailable ? '1px solid rgba(34, 197, 94, 0.28)' : '1px solid rgba(249, 115, 22, 0.28)',
  fontSize: '0.88rem',
  fontWeight: 700
});

const WorkOrderStepGrid: React.FC<WorkOrderStepGridProps> = ({ steps, loading }) => {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.85rem' }}>
      {steps.length > 0 ? (
        steps.map((step, index) => (
          <div key={step.stepID} className="premium-card" style={{ borderRadius: '8px', padding: '1rem', minHeight: 128, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>
                {index + 1}
              </span>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', lineHeight: 1.3 }}>{step.stepName}</h3>
            </div>
            <span style={statusStyle(step.isAvailable)}>{step.isAvailable ? '가능' : '불가능'}</span>
          </div>
        ))
      ) : (
        <div className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', color: 'var(--text-secondary)' }}>
          {loading ? '확인 중입니다.' : '표시할 공정이 없습니다.'}
        </div>
      )}
    </section>
  );
};

export default WorkOrderStepGrid;
