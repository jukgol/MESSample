import React from 'react';
import { Settings, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import type { ProcessMaster } from '../hooks/useProcessMasters';
import type { ProcessStep } from '../../step/hooks/useProcessSteps';

interface MasterStepAssignedProps {
  selectedMaster: ProcessMaster | null;
  assignedSteps: ProcessStep[];
  loading: boolean;
  onUnassignStep: (step: ProcessStep) => void;
}

const MasterStepAssigned: React.FC<MasterStepAssignedProps> = ({
  selectedMaster,
  assignedSteps,
  loading,
  onUnassignStep
}) => {
  return (
    <div className="premium-card" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg, #1a1a24)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={18} style={{ color: '#10b981' }} /> 2. 연결된 공정 단계
      </h3>

      {!selectedMaster ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          <HelpCircle size={32} style={{ opacity: 0.5 }} />
          <span style={{ fontSize: '0.9rem' }}>좌측 목록에서 전체 공정(Master)을 선택하시면<br />연결된 세부 단계들이 노출됩니다.</span>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.85rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', padding: '8px 12px', borderRadius: '6px', color: 'var(--accent-primary)', fontWeight: 500 }}>
            선택된 공정: {selectedMaster.processName} ({selectedMaster.processCode})
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : assignedSteps.length > 0 ? (
              assignedSteps.map((step) => (
                <div
                  key={step.stepID}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      Seq {step.seqNo}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'white' }}>
                      {step.stepName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      ({step.stepType})
                    </span>
                  </div>
                  <button
                    onClick={() => onUnassignStep(step)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.8rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: 'none'
                    }}
                  >
                    해제 <ArrowRight size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem', fontSize: '0.9rem' }}>
                공정에 소속된 단계가 없습니다.<br />우측의 미연결 공정 단계에서 추가해 주세요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterStepAssigned;
