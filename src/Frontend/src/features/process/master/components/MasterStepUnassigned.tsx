import React from 'react';
import { FileText, Loader2, ArrowLeft } from 'lucide-react';
import type { ProcessStep } from '../../step/hooks/useProcessSteps';

interface MasterStepUnassignedProps {
  unassignedSteps: ProcessStep[];
  selectedMasterId: number | undefined;
  loading: boolean;
  onAssignStep: (step: ProcessStep) => void;
}

const MasterStepUnassigned: React.FC<MasterStepUnassignedProps> = ({
  unassignedSteps,
  selectedMasterId,
  loading,
  onAssignStep
}) => {
  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg, #1a1a24)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={18} style={{ color: 'var(--text-secondary)' }} /> 3. 미연결 공정 단계
      </h3>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : unassignedSteps.length > 0 ? (
          unassignedSteps.map((step) => (
            <div
              key={step.stepID}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Seq {step.seqNo}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{step.stepName}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{step.description}</span>
              </div>
              <button
                onClick={() => onAssignStep(step)}
                disabled={selectedMasterId === undefined}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  background: selectedMasterId !== undefined ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedMasterId !== undefined ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  color: selectedMasterId !== undefined ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderRadius: '6px',
                  cursor: selectedMasterId !== undefined ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'none'
                }}
              >
                <ArrowLeft size={12} /> 추가
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
            미연결 상태의 공정 단계가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterStepUnassigned;
