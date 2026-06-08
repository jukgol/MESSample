import React from 'react';
import MrpHeader from '../components/MrpHeader';
import MrpLayout from '../components/MrpLayout';
import MrpMasterList from '../components/MrpMasterList';
import MrpSimulationTable from '../components/MrpSimulationTable';
import { useMrp } from '../hooks/useMrp';

const MrpContainerPage: React.FC = () => {
  const {
    processMasters,
    selectedMaster,
    setSelectedMaster,
    targetQty,
    setTargetQty,
    mrpDetails,
    summary,
    isLoading,
    handleRefresh
  } = useMrp();

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <MrpHeader />
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="premium-btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px' }}
        >
          <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
          새로고침
        </button>
      </div>

      {/* 2. Layout */}
      <MrpLayout
        left={
          <MrpMasterList
            masters={processMasters}
            loading={isLoading}
            selectedMasterId={selectedMaster?.processID || null}
            onSelectMaster={setSelectedMaster}
          />
        }
        right={
          <MrpSimulationTable
            selectedMaster={selectedMaster}
            targetQty={targetQty}
            onTargetQtyChange={setTargetQty}
            mrpDetails={mrpDetails}
            summary={summary}
            loading={isLoading}
          />
        }
      />
    </div>
  );
};

export default MrpContainerPage;
