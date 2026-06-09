import React from 'react';
import type { ProcessMaster } from '../../../../masterdata/master/hooks/useProcessMasters';

interface MrpSimulationConfigBarProps {
  selectedMaster: ProcessMaster;
  targetQty: number;
  onTargetQtyChange: (qty: number) => void;
}

const MrpSimulationConfigBar: React.FC<MrpSimulationConfigBarProps> = ({
  selectedMaster,
  targetQty,
  onTargetQtyChange
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>선택된 공정:</span>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{selectedMaster.processName} ({selectedMaster.processCode})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label htmlFor="target-qty-input" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>목표 생산량 (EA):</label>
        <input
          id="target-qty-input"
          type="number"
          min="1"
          value={targetQty}
          onChange={(e) => onTargetQtyChange(Math.max(1, Number(e.target.value)))}
          style={{
            width: '120px',
            padding: '6px 12px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            outline: 'none',
            textAlign: 'right'
          }}
        />
      </div>
    </div>
  );
};

export default MrpSimulationConfigBar;
