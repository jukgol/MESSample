import React, { useState, useMemo } from 'react';
import { useProcessSteps } from './useProcessSteps';
import type { ProcessStep } from './useProcessSteps';
import ProcessStepHeader from './ProcessStepHeader';
import ProcessStepTable from './ProcessStepTable';
import ProcessStepNodeMap from './ProcessStepNodeMap';
import { Search, Plus, RotateCw, Database, LayoutGrid, List } from 'lucide-react';

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

  // 뷰 모드 상태 ('list' | 'node')
  const [viewMode, setViewMode] = useState<'list' | 'node'>('list');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [stepIdToDelete, setStepIdToDelete] = useState<number | null>(null);

  // 등록 폼 입력 상태
  const [createForm, setCreateForm] = useState({
    stepName: '',
    seqNo: 10,
    stepType: '생산',
    description: ''
  });

  // 수정 폼 입력 상태
  const [updateForm, setUpdateForm] = useState({
    stepName: '',
    seqNo: 10,
    stepType: '생산',
    description: ''
  });

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

  // 등록 모달 열기
  const handleOpenCreate = () => {
    setCreateForm({
      stepName: '',
      seqNo: (processSteps.length + 1) * 10, // 자동 다음 Seq 추천
      stepType: '생산',
      description: ''
    });
    setIsCreateOpen(true);
  };

  // 등록 처리
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.stepName) {
      alert('공정 단계명은 필수 입력 항목입니다.');
      return;
    }

    const success = await createProcessStep({
      stepName: createForm.stepName,
      seqNo: Number(createForm.seqNo),
      stepType: createForm.stepType,
      description: createForm.description
    });

    if (success) {
      setIsCreateOpen(false);
    }
  };

  // 수정 모달 열기
  const handleOpenUpdate = (step: ProcessStep) => {
    setSelectedStep(step);
    setUpdateForm({
      stepName: step.stepName,
      seqNo: step.seqNo,
      stepType: step.stepType,
      description: step.description === '-' ? '' : step.description
    });
    setIsUpdateOpen(true);
  };

  // 수정 처리
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep || selectedStep.stepID === undefined) return;

    const success = await updateProcessStep(selectedStep.stepID, {
      stepName: updateForm.stepName,
      seqNo: Number(updateForm.seqNo),
      stepType: updateForm.stepType,
      description: updateForm.description
    });

    if (success) {
      setIsUpdateOpen(false);
    }
  };

  // 삭제 모달 열기
  const handleOpenDelete = (id: number) => {
    setStepIdToDelete(id);
    setIsDeleteOpen(true);
  };

  // 실제 삭제 처리
  const handleDeleteConfirm = async () => {
    if (stepIdToDelete !== null) {
      await deleteProcessStep(stepIdToDelete);
      setIsDeleteOpen(false);
      setStepIdToDelete(null);
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
          onClick={handleOpenCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <Plus size={16} /> 공정 신규 등록
        </button>
      </div>

      {/* 탭 컨트롤 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: viewMode === 'list' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <List size={16} /> 목록 뷰
        </button>
        <button
          onClick={() => setViewMode('node')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: viewMode === 'node' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <LayoutGrid size={16} /> 노드 맵 뷰
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* 검색창 */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
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
            onDelete={handleOpenDelete}
          />
        </>
      ) : (
        <ProcessStepNodeMap processSteps={processSteps} />
      )}

      {/* 1. 신규 등록 모달 */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>공정 단계 신규 등록</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 단계명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 반죽 공정"
                  value={createForm.stepName}
                  onChange={(e) => setCreateForm({ ...createForm, stepName: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>정렬 순서 (Seq)</label>
                  <input
                    type="number"
                    required
                    placeholder="예: 10"
                    value={createForm.seqNo}
                    onChange={(e) => setCreateForm({ ...createForm, seqNo: Number(e.target.value) })}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 유형</label>
                  <select
                    value={createForm.stepType}
                    onChange={(e) => setCreateForm({ ...createForm, stepType: e.target.value })}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="생산" style={{ background: '#1e1e24' }}>생산</option>
                    <option value="포장" style={{ background: '#1e1e24' }}>포장</option>
                    <option value="검사" style={{ background: '#1e1e24' }}>검사</option>
                    <option value="기타" style={{ background: '#1e1e24' }}>기타</option>
                  </select>
                </div>
              </div>



              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명</label>
                <textarea
                  placeholder="공정 상세 설명을 입력하세요..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button type="submit">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 정보 수정 모달 */}
      {isUpdateOpen && selectedStep && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>공정 단계 정보 수정</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>공정 ID:</strong> {selectedStep.stepID}
            </div>
            
            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 단계명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 반죽 공정"
                  value={updateForm.stepName}
                  onChange={(e) => setUpdateForm({ ...updateForm, stepName: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>정렬 순서 (Seq)</label>
                  <input
                    type="number"
                    required
                    placeholder="예: 10"
                    value={updateForm.seqNo}
                    onChange={(e) => setUpdateForm({ ...updateForm, seqNo: Number(e.target.value) })}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 유형</label>
                  <select
                    value={updateForm.stepType}
                    onChange={(e) => setUpdateForm({ ...updateForm, stepType: e.target.value })}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="생산" style={{ background: '#1e1e24' }}>생산</option>
                    <option value="포장" style={{ background: '#1e1e24' }}>포장</option>
                    <option value="검사" style={{ background: '#1e1e24' }}>검사</option>
                    <option value="기타" style={{ background: '#1e1e24' }}>기타</option>
                  </select>
                </div>
              </div>


              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명</label>
                <textarea
                  placeholder="공정 상세 설명을 입력하세요..."
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button type="submit">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. 삭제 확인 모달 */}
      {isDeleteOpen && stepIdToDelete !== null && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#ef4444' }}>공정 단계 삭제 확인</h2>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              정말로 공정 단계 ID [<strong>{stepIdToDelete}</strong>] 번을 삭제하시겠습니까?<br />
              <span style={{ color: '#fbbf24', fontSize: '0.85rem', marginTop: '8px', display: 'block' }}>
                ⚠️ 이 단계와 연계된 공정 이력(LOG)이 존재하는 경우, 데이터 무결성 보존을 위해 삭제되지 않을 수 있습니다.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setStepIdToDelete(null);
                }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  boxShadow: 'none'
                }}
              >
                취소
              </button>
              <button 
                onClick={handleDeleteConfirm}
                style={{
                  background: '#ef4444',
                  border: '1px solid #ef4444',
                  color: 'white'
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessStepList;
