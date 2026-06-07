import React, { useState, useMemo } from 'react';
import { useProcessSteps } from './useProcessSteps';
import type { ProcessStep } from './useProcessSteps';
import ProcessStepHeader from './ProcessStepHeader';
import ProcessStepTable from './ProcessStepTable';
import ProcessStepNodeMap from './ProcessStepNodeMap';
import { Search, Plus, RotateCw, Database, LayoutGrid, List, Loader2, Link, X } from 'lucide-react';
import { useBoms } from '../bom/hooks/useBoms';
import type { Bom } from '../bom/hooks/useBoms';

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

  const {
    fetchBomsByStep,
    fetchAllBoms,
    updateBomProcess
  } = useBoms();

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

  // 현재 공정에 연결된 BOM 리스트 및 로딩 상태
  const [connectedBoms, setConnectedBoms] = useState<Bom[]>([]);
  const [bomsLoading, setBomsLoading] = useState(false);

  // 미니 윈도우 (BOM 매핑 추가용 우측 서브패널) 상태
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [allBoms, setAllBoms] = useState<Bom[]>([]);
  const [selectorSearch, setSelectorSearch] = useState('');

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

  // 수정 모달 열기 및 BOM 로드
  const handleOpenUpdate = async (step: ProcessStep) => {
    setSelectedStep(step);
    setUpdateForm({
      stepName: step.stepName,
      seqNo: step.seqNo,
      stepType: step.stepType,
      description: step.description === '-' ? '' : step.description
    });
    setIsUpdateOpen(true);
    setIsSelectorOpen(false);
    
    // 이 공정에 연결된 BOM 로드
    setBomsLoading(true);
    try {
      const list = await fetchBomsByStep(step.stepID);
      setConnectedBoms(list);
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
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

  // BOM 선택기 열기 (전체 BOM 조회)
  const handleOpenSelector = async () => {
    setIsSelectorOpen(true);
    setBomsLoading(true);
    try {
      const list = await fetchAllBoms();
      setAllBoms(list);
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  // BOM을 이 공정에 연동
  const handleAttachBom = async (bom: Bom) => {
    if (!selectedStep) return;
    const success = await updateBomProcess(bom.bomID, selectedStep.stepID);
    if (success) {
      // 리스트 갱신
      const updatedList = await fetchBomsByStep(selectedStep.stepID);
      setConnectedBoms(updatedList);
      // 전체리스트 갱신
      const allList = await fetchAllBoms();
      setAllBoms(allList);
    }
  };

  // BOM 공정 매핑 해제
  const handleDetachBom = async (bomId: number) => {
    if (!selectedStep) return;
    if (!confirm('해당 BOM 항목을 이 공정 단계에서 연결 해제하시겠습니까?')) return;
    const success = await updateBomProcess(bomId, null);
    if (success) {
      // 리스트 갱신
      const updatedList = await fetchBomsByStep(selectedStep.stepID);
      setConnectedBoms(updatedList);
      if (isSelectorOpen) {
        const allList = await fetchAllBoms();
        setAllBoms(allList);
      }
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

  // 선택기 검색 필터링
  const filteredBomsForSelector = useMemo(() => {
    return allBoms.filter(bom => {
      const searchLower = selectorSearch.toLowerCase();
      const parentMatch = bom.parentItemName.toLowerCase().includes(searchLower);
      const childMatch = bom.childItemName.toLowerCase().includes(searchLower);
      // 이미 현재 공정에 연결된 것은 셀렉터에서 구분 또는 제외 표시하기 위해 필터링하지 않고 검색어로만 필터링
      return parentMatch || childMatch;
    });
  }, [allBoms, selectorSearch]);

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

      {/* 2. 정보 수정 및 BOM 매핑 모달 */}
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
          {/* 모달 윈도우 컨테이너 (미니 윈도우 활성화 시 레이아웃을 듀얼패널 옆에 서브패널이 붙는 형태로 렌더링) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', maxHeight: '90vh' }}>
            
            {/* 기본 공정 수정 + BOM 매핑 목록 패널 */}
            <div className="premium-card" style={{ width: '900px', padding: '2rem', display: 'flex', gap: '2rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              
              {/* 좌측 패널: 공정 기본 수정 폼 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '2rem' }}>
                <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>공정 단계 정보 수정</h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>공정 ID:</strong> {selectedStep.stepID}
                </div>
                
                <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  
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
                        resize: 'none',
                        flex: 1,
                        minHeight: '100px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpdateOpen(false);
                        setIsSelectorOpen(false);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        boxShadow: 'none'
                      }}
                    >
                      닫기
                    </button>
                    <button type="submit">
                      저장
                    </button>
                  </div>
                </form>
              </div>

              {/* 우측 패널: 연결된 BOM 목록 조회 및 해제 */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>연결된 BOM 레시피</h3>
                  <button
                    type="button"
                    onClick={handleOpenSelector}
                    disabled={isSelectorOpen}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.85rem',
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: 'var(--accent-primary)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> BOM 연결 추가
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem' }}>
                  {bomsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                      <Loader2 size={24} className="animate-spin" style={{ marginRight: '8px' }} /> 불러오는 중...
                    </div>
                  ) : connectedBoms.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>부모 품목</th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>투입 자재(자식)</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>소요량</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {connectedBoms.map((bom) => (
                          <tr key={bom.bomID} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '0.6rem 0.5rem' }}>{bom.parentItemName}</td>
                            <td style={{ padding: '0.6rem 0.5rem', fontWeight: '500', color: 'var(--accent-primary)' }}>{bom.childItemName}</td>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: '600' }}>{bom.bomQty}</td>
                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleDetachBom(bom.bomID)}
                                style={{
                                  padding: '2px 6px',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                해제
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '2rem', textAlign: 'center' }}>
                      현재 이 공정 단계에 연결된 BOM 레시피 항목이 없습니다. 우측 상단의 "BOM 연결 추가"를 클릭하여 자재를 연결하세요.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 우측 서브패널 (BOM 선택 미니 윈도우) */}
            {isSelectorOpen && (
              <div className="premium-card" style={{ width: '400px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#1c1c21', border: '1px solid var(--border-color)', borderRadius: '12px', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Link size={16} /> BOM 매핑 추가
                  </h3>
                  <button
                    onClick={() => setIsSelectorOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 검색 필터 */}
                <input
                  type="text"
                  placeholder="품목명으로 검색..."
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />

                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem' }}>
                  {filteredBomsForSelector.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {filteredBomsForSelector.map(bom => {
                        const isAttachedToCurrent = bom.processStepID === selectedStep.stepID;
                        return (
                          <div
                            key={bom.bomID}
                            style={{
                              padding: '8px 10px',
                              background: isAttachedToCurrent ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${isAttachedToCurrent ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '70%' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>부모: {bom.parentItemName}</span>
                              <span style={{ fontWeight: '500', color: 'white' }}>투입: {bom.childItemName} (Qty: {bom.bomQty})</span>
                              {bom.processStepID && !isAttachedToCurrent && (
                                <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>연결됨: {bom.processStepName}</span>
                              )}
                            </div>
                            
                            {isAttachedToCurrent ? (
                              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: '600', padding: '4px 8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px' }}>
                                연결 중
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAttachBom(bom)}
                                style={{
                                  padding: '4px 10px',
                                  background: 'var(--accent-primary)',
                                  border: 'none',
                                  color: 'white',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                연결
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      검색 조건에 맞는 BOM 항목이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

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
