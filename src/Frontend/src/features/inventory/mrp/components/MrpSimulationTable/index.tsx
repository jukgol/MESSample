import React from 'react';
import MrpSimulationConfigBar from './MrpSimulationConfigBar';
import MrpSimulationEmptyState from './MrpSimulationEmptyState';
import MrpSimulationStepResults from './MrpSimulationStepResults';
import MrpSimulationSummaryCard from './MrpSimulationSummaryCard';
import type { MrpSimulationTableProps } from './types';

const MrpSimulationTable: React.FC<MrpSimulationTableProps> = ({
  selectedMaster,
  targetQty,
  onTargetQtyChange,
  mrpDetails,
  summary,
  loading
}) => {
  if (!selectedMaster) {
    return <MrpSimulationEmptyState />;
  }

  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'var(--card-bg, #1a1a24)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', overflow: 'hidden', height: '100%', minHeight: 0 }}>
      <MrpSimulationConfigBar
        selectedMaster={selectedMaster}
        targetQty={targetQty}
        onTargetQtyChange={onTargetQtyChange}
      />
      <MrpSimulationSummaryCard summary={summary} />
      <MrpSimulationStepResults mrpDetails={mrpDetails} loading={loading} />
    </div>
  );
};

export default MrpSimulationTable;
