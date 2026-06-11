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
  padding: '5px 12px',
  borderRadius: '20px',
  color: isAvailable ? '#4ade80' : '#f87171',
  background: isAvailable ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  border: `1px solid ${isAvailable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
  fontSize: '0.8rem',
  fontWeight: 600
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
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {steps.length > 0 ? (
          steps.map((step, index) => {
            const isSelected = selectedStepId === step.stepID;

            return (
              <button
                key={step.stepID}
                type="button"
                onClick={() => onSelectStep(step)}
                className="premium-card workorder-selectable"
                style={{
                  padding: '1.25rem',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  textAlign: 'left',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 10px 28px rgba(99, 102, 241, 0.25)' : 'none',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'grid',
                    placeItems: 'center',
                    color: isSelected ? 'white' : 'var(--accent-primary)',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    {index + 1}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'white', lineHeight: 1.3, fontWeight: 600 }}>{step.stepName}</h3>
                </div>
                <span style={statusStyle(step.isAvailable)}>{step.isAvailable ? '가능' : '불가'}</span>
              </button>
            );
          })
        ) : (
          <div className="premium-card" style={{ padding: '1.5rem', color: 'var(--text-secondary)', borderRadius: '16px', textAlign: 'center' }}>
            {loading ? '확인 중입니다.' : '표시할 공정이 없습니다.'}
          </div>
        )}
      </div>

      {selectedStep && (
        <div
          className="premium-card"
          style={{
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(3, minmax(120px, 0.6fr))',
            gap: '1.25rem',
            alignItems: 'center',
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--accent-primary)' }}>
              <Route size={22} />
            </span>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>선택 공정</div>
              <strong style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>{selectedStep.stepName}</strong>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>공정 순서</div>
            <strong style={{ color: 'white', fontSize: '1.15rem' }}>{selectedIndex + 1}</strong>
          </div>

          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>공정 ID</div>
            <strong style={{ color: 'white', fontSize: '1.15rem', fontFamily: 'monospace' }}>{selectedStep.stepID}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {selectedStep.isAvailable ? (
              <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
            ) : (
              <AlertTriangle size={20} style={{ color: '#f87171' }} />
            )}
            <span style={statusStyle(selectedStep.isAvailable)}>{selectedStep.isAvailable ? '작업 가능' : '작업 불가'}</span>
          </div>

          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Info size={16} className="text-indigo-400" style={{ color: 'var(--accent-primary)' }} />
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
