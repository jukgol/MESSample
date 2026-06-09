import React from 'react';
import type { MrpStepDetail } from '../../hooks/useMrp';
import MrpMaterialTable from './MrpMaterialTable';

interface MrpSimulationStepCardProps {
  step: MrpStepDetail;
}

const MrpSimulationStepCard: React.FC<MrpSimulationStepCardProps> = ({ step }) => {
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.01)',
        overflow: 'hidden',
        marginBottom: '10px',
        flexShrink: 0
      }}
    >
      <div style={{
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            Seq {step.seqNo}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
            {step.stepName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ({step.stepType})
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          소요 원자재: {step.items.length}종
        </span>
      </div>

      <div style={{ padding: '0 8px' }}>
        <MrpMaterialTable items={step.items} />
      </div>
    </div>
  );
};

export default MrpSimulationStepCard;
