import React, { useState, useMemo } from 'react';
import { useProcessMasters } from '../hooks/useProcessMasters';
import { useProcessSteps } from '../../step/pages/useProcessSteps';
import type { ProcessMaster } from '../hooks/useProcessMasters';
import type { ProcessStep } from '../../step/pages/useProcessSteps';

// Split Components
import MasterHeader from '../components/MasterHeader';
import MasterList from '../components/MasterList';
import MasterStepAssigned from '../components/MasterStepAssigned';
import MasterStepUnassigned from '../components/MasterStepUnassigned';
import MasterCreateModal from '../components/MasterCreateModal';

const ProductProcessList: React.FC = () => {
  const {
    processMasters,
    loading: mastersLoading,
    fetchProcessMasters,
    createProcessMaster,
    deleteProcessMaster
  } = useProcessMasters();

  const {
    processSteps,
    loading: stepsLoading,
    fetchProcessSteps,
    updateProcessStep
  } = useProcessSteps();

  // Selected Process Master state
  const [selectedMaster, setSelectedMaster] = useState<ProcessMaster | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Load both data sources on refresh
  const handleRefresh = async () => {
    await Promise.all([fetchProcessMasters(), fetchProcessSteps()]);
  };

  // Filtered Process Masters
  const filteredMasters = useMemo(() => {
    return processMasters.filter(m => 
      m.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.processCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processMasters, searchTerm]);

  // Center Column: Steps assigned to the selected master
  const assignedSteps = useMemo(() => {
    if (!selectedMaster) return [];
    return processSteps
      .filter(step => step.processMasterID === selectedMaster.processID)
      .sort((a, b) => a.seqNo - b.seqNo);
  }, [processSteps, selectedMaster]);

  // Right Column: Unassigned Steps (processMasterID is null or undefined)
  const unassignedSteps = useMemo(() => {
    return processSteps
      .filter(step => !step.processMasterID)
      .sort((a, b) => a.seqNo - b.seqNo);
  }, [processSteps]);

  // Handle assigning a step to the selected master
  const handleAssignStep = async (step: ProcessStep) => {
    if (!selectedMaster) {
      alert('먼저 좌측에서 전체 공정을 선택해 주세요.');
      return;
    }

    const success = await updateProcessStep(step.stepID, {
      stepName: step.stepName,
      seqNo: step.seqNo,
      stepType: step.stepType,
      description: step.description === '-' ? '' : step.description,
      processMasterID: selectedMaster.processID
    });

    if (!success) {
      alert('공정 단계 지정에 실패했습니다.');
    }
  };

  // Handle unassigning a step from the master
  const handleUnassignStep = async (step: ProcessStep) => {
    const success = await updateProcessStep(step.stepID, {
      stepName: step.stepName,
      seqNo: step.seqNo,
      stepType: step.stepType,
      description: step.description === '-' ? '' : step.description,
      processMasterID: null
    });

    if (!success) {
      alert('공정 단계 지정 해제에 실패했습니다.');
    }
  };

  // Submit New Process Master
  const handleCreateSubmit = async (form: { processCode: string; processName: string; description: string }) => {
    const success = await createProcessMaster(form);
    if (success) {
      setIsCreateOpen(false);
    }
  };

  // Handle Delete Process Master
  const handleDeleteMaster = async (master: ProcessMaster, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`공정 [${master.processName}]을 삭제하시겠습니까?\n이 공정에 소속된 단계들은 모두 미연결 상태로 해제됩니다.`)) {
      return;
    }

    // Unassign steps locally first in UI representation, backend will set to null automatically due to ON DELETE SET NULL migration constraint
    const success = await deleteProcessMaster(master.processID);
    if (success) {
      if (selectedMaster?.processID === master.processID) {
        setSelectedMaster(null);
      }
      fetchProcessSteps(); // Refresh steps to update unassigned list
    } else {
      alert('공정 마스터 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {/* Header */}
      <MasterHeader 
        onRefresh={handleRefresh} 
        onOpenCreate={() => setIsCreateOpen(true)} 
      />

      {/* 3-Column layout container */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: '550px' }}>
        
        {/* 1열: 좌측 - 전체 공정 목록 */}
        <MasterList
          masters={filteredMasters}
          selectedMaster={selectedMaster}
          onSelectMaster={setSelectedMaster}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          loading={mastersLoading}
          onDeleteMaster={handleDeleteMaster}
        />

        {/* 2열: 중앙 - 연결된 공정 단계 목록 */}
        <MasterStepAssigned
          selectedMaster={selectedMaster}
          assignedSteps={assignedSteps}
          loading={stepsLoading}
          onUnassignStep={handleUnassignStep}
        />

        {/* 3열: 우측 - 미연결 공정 단계 목록 */}
        <MasterStepUnassigned
          unassignedSteps={unassignedSteps}
          selectedMasterId={selectedMaster?.processID}
          loading={stepsLoading}
          onAssignStep={handleAssignStep}
        />

      </div>

      {/* 신규 전체공정 마스터 생성 모달 */}
      <MasterCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default ProductProcessList;
