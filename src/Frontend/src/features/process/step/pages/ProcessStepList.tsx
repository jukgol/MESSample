import React, { useState, useMemo } from 'react';
import { useProcessSteps } from '../hooks/useProcessSteps';
import type { ProcessStep } from '../hooks/useProcessSteps';
import { Search, Plus, RotateCw, Database } from 'lucide-react';

// Split Components
import ProcessStepHeader from '../components/ProcessStepHeader';
import ProcessStepTable from '../components/ProcessStepTable';
import StepCreateModal from '../components/StepCreateModal';
import StepUpdateMappingModal from '../components/StepUpdateMappingModal';

const ProcessStepList: React.FC = () => {
  const {
    processSteps,
    loading,
    error,
    fetchProcessSteps,
    createProcessStep,
    updateProcessStep,
    deleteProcessStep,
    generateDummyProcessSteps
  } = useProcessSteps();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  // 검색어 필터링
  const filteredSteps = useMemo(() => {
    return processSteps.filter((step) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = step.stepName?.toLowerCase().includes(searchLower) ?? false;
      const typeMatch = step.stepType?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = step.stepID?.toString().includes(searchLower) ?? false;
      return nameMatch || typeMatch || idMatch;
    });
  }, [processSteps, searchTerm]);

  // 등록 처리
  const handleCreateSubmit = async (form: { stepName: string; seqNo: number; stepType: string; description: string }) => {
    const success = await createProcessStep(form);
    if (success) {
      setIsCreateOpen(false);
    }
  };

  // 수정 모달 열기
  const handleOpenUpdate = (step: ProcessStep) => {
    setSelectedStep(step);
    setIsUpdateOpen(true);
  };

  // 삭제 처리
  const handleDeleteConfirm = async (id: number) => {
    if (confirm('해당 공정 단계를 삭제하시겠습니까?')) {
      await deleteProcessStep(id);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <ProcessStepHeader />

      {/* 버튼 컨트롤 영역 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          onClick={generateDummyProcessSteps}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--accent-primary)', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <Database size={16} /> 공정 시나리오 로드
        </button>
        <button
          onClick={fetchProcessSteps}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', boxShadow: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <RotateCw size={16} className={loading ? "animate-spin" : ""} /> 새로고침
        </button>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <Plus size={16} /> 공정 신규 등록
        </button>
      </div>

      {/* 검색창 */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="공정명 또는 유형으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.5rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            color: 'white',
            outline: 'none'
          }}
        />
      </div>

      {/* 리스트 테이블 */}
      <ProcessStepTable
        processSteps={filteredSteps}
        loading={loading}
        error={error}
        onOpenUpdateModal={handleOpenUpdate}
        onDelete={handleDeleteConfirm}
      />

      {/* 1. 신규 등록 모달 */}
      <StepCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        defaultSeq={(processSteps.length + 1) * 10}
      />

      {/* 2. 정보 수정 및 BOM 매핑 모달 */}
      <StepUpdateMappingModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        selectedStep={selectedStep}
        onUpdateStep={updateProcessStep}
      />
    </div>
  );
};

export default ProcessStepList;
