import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Route } from 'lucide-react';
import type { WorkOrderStepAvailabilityDto } from '../../../../api/data-contracts';

interface WorkOrderStepGridProps {
  steps: WorkOrderStepAvailabilityDto[];
  loading: boolean;
  selectedStepId: number | null;
  onSelectStep: (step: WorkOrderStepAvailabilityDto) => void;
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

const WorkOrderStepGrid: React.FC<WorkOrderStepGridProps> = ({
  steps,
  loading,
  selectedStepId,
  onSelectStep
}) => {
  const selectedStep = steps.find((step) => step.stepID === selectedStepId) || null;
  const selectedIndex = selectedStep ? steps.findIndex((step) => step.stepID === selectedStep.stepID) : -1;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.85rem' }}>
        {steps.length > 0 ? (
          steps.map((step, index) => {
            const isSelected = selectedStepId === step.stepID;

            return (
              <button
                key={step.stepID}
                type="button"
                onClick={() => onSelectStep(step)}
                className="workorder-panel workorder-selectable"
                style={{
                  padding: '1rem',
                  minHeight: 128,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  textAlign: 'left',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--panel-bg)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 10px 28px rgba(99, 102, 241, 0.22)' : 'none',
                  transform: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {index + 1}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', lineHeight: 1.3 }}>{step.stepName}</h3>
                </div>
                <span style={statusStyle(step.isAvailable)}>{step.isAvailable ? '가능' : '불가'}</span>
              </button>
            );
          })
        ) : (
          <div className="workorder-panel" style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>
            {loading ? '확인 중입니다.' : '표시할 공정이 없습니다.'}
          </div>
        )}
      </div>

      {selectedStep && (
        <div
          className="workorder-panel"
          style={{
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(3, minmax(120px, 0.6fr))',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(99, 102, 241, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--accent-primary)' }}>
              <Route size={20} />
            </span>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>선택 공정</div>
              <strong style={{ color: 'white', fontSize: '1.05rem' }}>{selectedStep.stepName}</strong>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>공정 순서</div>
            <strong style={{ color: 'white' }}>{selectedIndex + 1}</strong>
          </div>

          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>공정 ID</div>
            <strong style={{ color: 'white' }}>{selectedStep.stepID}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedStep.isAvailable ? (
              <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
            ) : (
              <AlertTriangle size={18} style={{ color: '#f97316' }} />
            )}
            <span style={statusStyle(selectedStep.isAvailable)}>{selectedStep.isAvailable ? '작업 가능' : '작업 불가'}</span>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', paddingTop: '0.25rem', borderTop: '1px solid var(--border-color)' }}>
            <Info size={16} />
            {selectedStep.isAvailable
              ? '현재 생산 수량 기준으로 필요한 자재가 충분한 공정입니다.'
              : '현재 생산 수량 기준으로 부족 자재가 있어 승인 대기됩니다.'}
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkOrderStepGrid;
