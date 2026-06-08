import React, { useState, useMemo, useEffect } from 'react';
import { useProcessSteps } from './useProcessSteps';
import type { ProcessStep } from './useProcessSteps';
import ProcessStepHeader from './ProcessStepHeader';
import ProcessStepTable from './ProcessStepTable';
import ProcessStepNodeMap from './ProcessStepNodeMap';
import { Search, Plus, RotateCw, Database, LayoutGrid, List, Loader2, Link, X } from 'lucide-react';
import { useBoms } from '../bom/hooks/useBoms';
import type { Bom } from '../bom/hooks/useBoms';
import { useItems } from '../../masterdata/item/hooks/useItems';

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
    updateBomProcess,
    createBom
  } = useBoms();

  const { items, fetchItems } = useItems();

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

  // 현재 공정에 연결된 전체 BOM 리스트 및 로딩 상태
  const [connectedBoms, setConnectedBoms] = useState<Bom[]>([]);
  const [bomsLoading, setBomsLoading] = useState(false);

  // 패널 2 내에서 선택된 출력(부모) 품목 ID
  const [selectedParentID, setSelectedParentID] = useState<number | null>(null);

  // 미니 윈도우 (BOM 매핑 추가용 우측 서브패널) 상태
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorMode, setSelectorMode] = useState<'output' | 'input' | null>(null);
  const [allBoms, setAllBoms] = useState<Bom[]>([]);
  const [selectorSearch, setSelectorSearch] = useState('');

  // 입력 추가 폼용 로컬 필드
  const [newInputForm, setNewInputForm] = useState({
    childItemID: '',
    bomQty: 1
  });

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

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
    setSelectorMode(null);
    setSelectedParentID(null);
    
    // 이 공정에 연결된 BOM 로드
    setBomsLoading(true);
    try {
      const list = await fetchBomsByStep(step.stepID);
      setConnectedBoms(list);
      // 첫 번째 부모 항목이 있다면 자동 선택 처리
      if (list.length > 0) {
        setSelectedParentID(list[0].parentItemID);
      }
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

  // 중복이 제거된 출력(부모 품목) 목록 추출
  const uniqueOutputs = useMemo(() => {
    const seen = new Set<number>();
    const outputs: { parentItemID: number; parentItemName: string }[] = [];
    connectedBoms.forEach(bom => {
      if (!seen.has(bom.parentItemID)) {
        seen.add(bom.parentItemID);
        outputs.push({
          parentItemID: bom.parentItemID,
          parentItemName: bom.parentItemName
        });
      }
    });
    return outputs;
  }, [connectedBoms]);

  // 선택된 출력(부모)에 매핑되는 입력(자식) 자재 목록 필터링
  const filteredInputs = useMemo(() => {
    if (selectedParentID === null) return [];
    return connectedBoms.filter(bom => bom.parentItemID === selectedParentID);
  }, [connectedBoms, selectedParentID]);

  // 신규 출력 추가 모드로 선택기 열기
  const handleOpenOutputSelector = async () => {
    setIsSelectorOpen(true);
    setSelectorMode('output');
    setSelectorSearch('');
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

  // 신규 입력 추가 모드로 선택기 열기
  const handleOpenInputSelector = () => {
    if (selectedParentID === null) {
      alert('먼저 입력 자재를 추가할 대상 출력(부모) 품목을 선택해 주세요.');
      return;
    }
    setIsSelectorOpen(true);
    setSelectorMode('input');
    setSelectorSearch('');
    setNewInputForm({
      childItemID: '',
      bomQty: 1
    });
  };

  // 전체 BOM 중 아직 이 공정에 매핑되지 않은 부모 품목 목록 필터링
  const availableBomsForOutputSelector = useMemo(() => {
    const registeredParentIDs = new Set(uniqueOutputs.map(o => o.parentItemID));
    // 부모 기준으로 전체 리스트 중 현재 공정에 연결되지 않은 품목들을 필터링
    const seenParents = new Set<number>();
    const list: Bom[] = [];
    allBoms.forEach(bom => {
      if (!registeredParentIDs.has(bom.parentItemID) && !seenParents.has(bom.parentItemID)) {
        seenParents.add(bom.parentItemID);
        list.push(bom);
      }
    });
    return list.filter(b => b.parentItemName.toLowerCase().includes(selectorSearch.toLowerCase()));
  }, [allBoms, uniqueOutputs, selectorSearch]);

  // 신규 출력(부모) 품목을 공정에 연동 (해당 부모를 소유한 모든 BOM 항목 연계)
  const handleAttachOutput = async (parentItemID: number) => {
    if (!selectedStep) return;
    setBomsLoading(true);
    try {
      // 해당 부모 품목이 가진 모든 BOM을 찾아와서 이 공정 ID를 매핑해 줍니다.
      const bomsToUpdate = allBoms.filter(bom => bom.parentItemID === parentItemID);
      if (bomsToUpdate.length === 0) {
        // 만약 해당 품목의 BOM이 정의되어 있지 않다면, 더미 BOM 항목을 최소한 생성하거나 안내
        alert('선택한 품목에 등록된 자재(BOM)가 없습니다. 먼저 품목의 BOM 레시피를 설계해 주세요.');
        return;
      }
      for (const bom of bomsToUpdate) {
        await updateBomProcess(bom.bomID, selectedStep.stepID);
      }
      // 리스트 갱신
      const updatedList = await fetchBomsByStep(selectedStep.stepID);
      setConnectedBoms(updatedList);
      setSelectedParentID(parentItemID);
      setIsSelectorOpen(false);
      setSelectorMode(null);
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  // 출력 품목 공정 매핑 해제 (해당 부모의 모든 매핑 해제)
  const handleDetachOutput = async (parentItemID: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedStep) return;
    if (!confirm('해당 출력 품목의 공정 연동을 해제하시겠습니까? 관련 투입 자재 매핑도 모두 해제됩니다.')) return;
    setBomsLoading(true);
    try {
      const bomsToDetach = connectedBoms.filter(bom => bom.parentItemID === parentItemID);
      for (const bom of bomsToDetach) {
        await updateBomProcess(bom.bomID, null);
      }
      const updatedList = await fetchBomsByStep(selectedStep.stepID);
      setConnectedBoms(updatedList);
      if (selectedParentID === parentItemID) {
        setSelectedParentID(updatedList.length > 0 ? updatedList[0].parentItemID : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  // 신규 입력 자재(BOM)를 생성하여 공정에 매핑
  const handleCreateAndAttachInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep || selectedParentID === null) return;
    if (!newInputForm.childItemID) {
      alert('투입할 자재 품목을 선택해 주세요.');
      return;
    }
    if (newInputForm.bomQty <= 0) {
      alert('소요량은 1개 이상이어야 합니다.');
      return;
    }

    setBomsLoading(true);
    try {
      // BOM 항목 신규 생성
      const success = await createBom({
        parentItemID: selectedParentID,
        childItemID: Number(newInputForm.childItemID),
        bomQty: Number(newInputForm.bomQty),
        processStepID: selectedStep.stepID
      });

      if (success) {
        // 리스트 갱신
        const updatedList = await fetchBomsByStep(selectedStep.stepID);
        setConnectedBoms(updatedList);
        setIsSelectorOpen(false);
        setSelectorMode(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  // 입력 자재 단일 항목 매핑 해제
  const handleDetachInput = async (bomID: number) => {
    if (!selectedStep) return;
    if (!confirm('해당 투입 자재의 공정 매핑을 해제하시겠습니까?')) return;
    setBomsLoading(true);
    try {
      await updateBomProcess(bomID, null);
      const updatedList = await fetchBomsByStep(selectedStep.stepID);
      setConnectedBoms(updatedList);
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  // 입력 추가 드롭다운에 노출될 자재 품목 후보군
  const availableChildItems = useMemo(() => {
    if (selectedParentID === null) return [];
    // 이미 등록된 입력 자재 ID들 제외
    const registeredChildIDs = new Set(filteredInputs.map(i => i.childItemID));
    return items.filter(item => {
      const itemIdNum = Number(item.id);
      return itemIdNum !== selectedParentID && !registeredChildIDs.has(itemIdNum);
    });
  }, [items, selectedParentID, filteredInputs]);

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

      {/* 2. 정보 수정 및 BOM 매핑 모달 (3-윈도우 레이아웃) */}
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
          {/* 3개의 패널이 가로로 결합되는 모달 컨테이너 (고정된 윈도우 크기로 동일 세로 높이 유지) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', height: '600px', maxWidth: '95vw' }}>
            
            {/* 좌측 패널 (공정 정보) */}
            <div className="premium-card" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
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
                      height: '100px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateOpen(false);
                      setIsSelectorOpen(false);
                      setSelectorMode(null);
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

            {/* 중앙 패널 (연결된 BOM: 상단 출력 리스트 + 하단 입력 리스트) */}
            <div className="premium-card" style={{ width: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              
              {/* 상단: 출력(Output/부모) 품목 리스트 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>생산 제품 (출력)</h3>
                  <button
                    type="button"
                    onClick={handleOpenOutputSelector}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.8rem',
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: 'var(--accent-primary)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={12} /> 출력 추가
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {bomsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: '6px' }} /> 조회 중...
                    </div>
                  ) : uniqueOutputs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {uniqueOutputs.map((out) => {
                        const isSelected = selectedParentID === out.parentItemID;
                        return (
                          <div
                            key={out.parentItemID}
                            onClick={() => setSelectedParentID(out.parentItemID)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            <span style={{ fontWeight: isSelected ? '600' : '400', color: isSelected ? 'var(--accent-primary)' : 'white' }}>
                              {out.parentItemName}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDetachOutput(out.parentItemID, e)}
                              style={{
                                padding: '2px 6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                boxShadow: 'none'
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                      등록된 생산 제품이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 구분선 */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

              {/* 하단: 입력(Input/자식) 투입 자재 리스트 */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', minHeight: 0, gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>투입 자재 (입력)</h3>
                  <button
                    type="button"
                    onClick={handleOpenInputSelector}
                    disabled={selectedParentID === null}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.8rem',
                      background: selectedParentID ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${selectedParentID ? 'rgba(99,102,241,0.3)' : 'var(--border-color)'}`,
                      color: selectedParentID ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: selectedParentID ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Plus size={12} /> 입력 추가
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {bomsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: '6px' }} /> 조회 중...
                    </div>
                  ) : filteredInputs.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>투입 자재</th>
                          <th style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>소요량</th>
                          <th style={{ padding: '0.4rem 0.5rem', textAlign: 'center' }}>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInputs.map((bom) => (
                          <tr key={bom.bomID} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '0.5rem', fontWeight: '500', color: 'var(--accent-primary)' }}>{bom.childItemName}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600' }}>{bom.bomQty}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleDetachInput(bom.bomID)}
                                style={{
                                  padding: '2px 6px',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  boxShadow: 'none'
                                }}
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1.5rem', textAlign: 'center' }}>
                      {selectedParentID ? '선택된 생산 제품의 투입 자재가 없습니다. "+ 입력 추가"로 자재를 투입하세요.' : '상단에서 생산 제품을 먼저 선택해 주세요.'}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 우측 패널 (BOM 선택 미니 윈도우 - 동일한 세로 높이) */}
            {isSelectorOpen && (
              <div className="premium-card" style={{ width: '400px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#1c1c21', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Link size={16} /> {selectorMode === 'output' ? '출력 제품 추가' : '투입 자재 추가'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsSelectorOpen(false);
                      setSelectorMode(null);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 1. 출력 추가 모드 */}
                {selectorMode === 'output' && (
                  <>
                    <input
                      type="text"
                      placeholder="제품명으로 검색..."
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
                      {availableBomsForOutputSelector.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {availableBomsForOutputSelector.map(bom => (
                            <div
                              key={bom.bomID}
                              style={{
                                padding: '8px 10px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.8rem'
                              }}
                            >
                              <span style={{ fontWeight: '500', color: 'white' }}>{bom.parentItemName}</span>
                              <button
                                type="button"
                                onClick={() => handleAttachOutput(bom.parentItemID)}
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
                                추가
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          추가할 수 있는 생산 제품이 없습니다. (품목의 BOM 레시피 구조를 먼저 생성해 주세요.)
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 2. 입력 추가 모드 (부모 품목이 이미 고정된 상태에서, 소요량과 자식을 입력받아 등록) */}
                {selectorMode === 'input' && (
                  <form onSubmit={handleCreateAndAttachInput} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
                      <strong>생산 제품 (출력):</strong> {uniqueOutputs.find(o => o.parentItemID === selectedParentID)?.parentItemName}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>선택할 투입 자재 (입력)</label>
                      {availableChildItems.length > 0 ? (
                        <select
                          required
                          value={newInputForm.childItemID}
                          onChange={(e) => setNewInputForm({ ...newInputForm, childItemID: e.target.value })}
                          style={{
                            padding: '0.7rem',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'white',
                            outline: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="" style={{ background: '#1c1c21' }}>-- 자재 선택 --</option>
                          {availableChildItems.map((item) => (
                            <option key={item.id} value={item.id} style={{ background: '#1c1c21' }}>
                              [{item.category}] {item.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div style={{ color: '#fbbf24', fontSize: '0.8rem', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                          추가 가능한 자재 품목이 존재하지 않습니다.
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>투입 소요량 (Qty)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newInputForm.bomQty}
                        onChange={(e) => setNewInputForm({ ...newInputForm, bomQty: Math.max(1, Number(e.target.value)) })}
                        style={{
                          padding: '0.7rem',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSelectorOpen(false);
                          setSelectorMode(null);
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
                      <button type="submit" disabled={availableChildItems.length === 0}>
                        추가
                      </button>
                    </div>
                  </form>
                )}
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
