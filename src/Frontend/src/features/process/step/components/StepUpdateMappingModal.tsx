import React, { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { useBoms } from '../../bom/hooks/useBoms';
import type { Bom } from '../../bom/hooks/useBoms';
import { useItems } from '../../../masterdata/item/hooks/useItems';
import type { Item } from '../../../masterdata/item/hooks/useItems';
import type { ProcessStep } from '../hooks/useProcessSteps';

interface StepUpdateMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStep: ProcessStep | null;
  onUpdateStep: (id: number, dto: { stepName: string; seqNo: number; stepType: string; description: string }) => Promise<boolean>;
}

const StepUpdateMappingModal: React.FC<StepUpdateMappingModalProps> = ({
  isOpen,
  onClose,
  selectedStep,
  onUpdateStep
}) => {
  // BOM CRUD 훅
  const {
    fetchBomsByStep,
    fetchAllBoms,
    updateBomProcess,
    createBom
  } = useBoms();

  // 품목 훅
  const { items, fetchItems } = useItems();

  // 폼 입력 상태
  const [updateForm, setUpdateForm] = useState({
    stepName: '',
    seqNo: 10,
    stepType: '생산',
    description: ''
  });

  // 상태 관리
  const [connectedBoms, setConnectedBoms] = useState<Bom[]>([]);
  const [bomsLoading, setBomsLoading] = useState(false);
  const [selectedParentID, setSelectedParentID] = useState<number | null>(null);

  // 미니 윈도우 선택기 상태
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorMode, setSelectorMode] = useState<'output' | 'input' | null>(null);
  const [allBoms, setAllBoms] = useState<Bom[]>([]);
  const [selectorSearch, setSelectorSearch] = useState('');

  // 입력 추가 폼 로컬 필드
  const [newInputForm, setNewInputForm] = useState({
    childItemID: '',
    bomQty: 1
  });

  useEffect(() => {
    if (isOpen && selectedStep) {
      setUpdateForm({
        stepName: selectedStep.stepName,
        seqNo: selectedStep.seqNo,
        stepType: selectedStep.stepType,
        description: selectedStep.description === '-' ? '' : selectedStep.description
      });
      setIsSelectorOpen(false);
      setSelectorMode(null);
      setSelectedParentID(null);
      fetchItems();
      loadConnectedBoms(selectedStep.stepID);
    }
  }, [isOpen, selectedStep]);

  const loadConnectedBoms = async (stepId: number) => {
    setBomsLoading(true);
    try {
      const list = await fetchBomsByStep(stepId);
      setConnectedBoms(list);
      if (list.length > 0) {
        setSelectedParentID(list[0].parentItemID);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBomsLoading(false);
    }
  };

  if (!isOpen || !selectedStep) return null;

  // 수정 핸들러
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep.stepID) return;
    const success = await onUpdateStep(selectedStep.stepID, {
      stepName: updateForm.stepName,
      seqNo: Number(updateForm.seqNo),
      stepType: updateForm.stepType,
      description: updateForm.description
    });
    if (success) {
      onClose();
    }
  };

  // 중복이 제거된 출력(부모 품목) 목록 추출
  const uniqueOutputs = () => {
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
  };

  const outputsList = uniqueOutputs();

  // 선택된 출력(부모)에 매핑되는 입력(자식) 자재 목록 필터링
  const filteredInputs = () => {
    if (selectedParentID === null) return [];
    return connectedBoms.filter(bom => bom.parentItemID === selectedParentID);
  };

  const inputsList = filteredInputs();

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
  const availableBomsForOutputSelector = () => {
    const registeredParentIDs = new Set(outputsList.map(o => o.parentItemID));
    const seenParents = new Set<number>();
    const list: Bom[] = [];
    allBoms.forEach(bom => {
      if (!registeredParentIDs.has(bom.parentItemID) && !seenParents.has(bom.parentItemID)) {
        seenParents.add(bom.parentItemID);
        list.push(bom);
      }
    });
    return list.filter(b => b.parentItemName.toLowerCase().includes(selectorSearch.toLowerCase()));
  };

  const outputsSelectorList = availableBomsForOutputSelector();

  // 신규 출력(부모) 품목을 공정에 연동 (해당 부모를 소유한 모든 BOM 항목 연계)
  const handleAttachOutput = async (parentItemID: number) => {
    setBomsLoading(true);
    try {
      const bomsToUpdate = allBoms.filter(bom => bom.parentItemID === parentItemID);
      if (bomsToUpdate.length === 0) {
        alert('선택한 품목에 등록된 자재(BOM)가 없습니다. 먼저 품목의 BOM 레시피를 설계해 주세요.');
        return;
      }
      for (const bom of bomsToUpdate) {
        await updateBomProcess(bom.bomID, selectedStep.stepID);
      }
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
    if (selectedParentID === null) return;
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
      const success = await createBom({
        parentItemID: selectedParentID,
        childItemID: Number(newInputForm.childItemID),
        bomQty: Number(newInputForm.bomQty),
        processStepID: selectedStep.stepID
      });

      if (success) {
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
  const availableChildItems = () => {
    if (selectedParentID === null) return [];
    const registeredChildIDs = new Set(inputsList.map(i => i.childItemID));
    return items.filter((item: Item) => {
      const itemIdNum = Number(item.id);
      return itemIdNum !== selectedParentID && !registeredChildIDs.has(itemIdNum);
    });
  };

  const childItemsList = availableChildItems();

  return (
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
      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', height: '600px', maxWidth: '95vw' }}>
        
        {/* 좌측 패널 (공정 단계 정보 수정) */}
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
                onClick={onClose}
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
              ) : outputsList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {outputsList.map((out) => {
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

          {/* 하단: 투입 자재(Input/자식) 목록 */}
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
                  background: selectedParentID ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                  border: selectedParentID ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  color: selectedParentID ? '#34d399' : 'var(--text-secondary)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: selectedParentID ? 'pointer' : 'not-allowed'
                }}
              >
                <Plus size={12} /> 자재 추가
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              {selectedParentID === null ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                  상단 생산 제품을 먼저 선택하시면<br />투입 자재 구성이 표시됩니다.
                </div>
              ) : inputsList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {inputsList.map((bom) => (
                    <div
                      key={bom.bomID}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'white' }}>{bom.childItemName}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {bom.bomQty} Qty
                        </span>
                      </div>
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
                        매핑해제
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                  해당 제품 생산에 매핑된 자재가 없습니다.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 우측 패널 (BOM 연동 및 매핑 신규 추가 전용 윈도우) */}
        {isSelectorOpen && (
          <div className="premium-card" style={{ width: '360px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#1c1c21', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setIsSelectorOpen(false);
                setSelectorMode(null);
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h3 className="gradient-text" style={{ margin: 0, fontSize: '1.2rem' }}>
              {selectorMode === 'output' ? '생산 제품 연동 추가' : '투입 자재 매핑 추가'}
            </h3>

            {/* 1. 출력 추가 모드 (기존 BOM 레시피 구조에서 선택) */}
            {selectorMode === 'output' && (
              <>
                <input
                  type="text"
                  placeholder="제품명 검색..."
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                
                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {outputsSelectorList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {outputsSelectorList.map((bom) => (
                        <div
                          key={bom.parentItemID}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 10px',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <span style={{ color: 'white', maxWidth: '70%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {bom.parentItemName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAttachOutput(bom.parentItemID)}
                            style={{
                              padding: '2px 8px',
                              background: 'rgba(99,102,241,0.15)',
                              border: '1px solid rgba(99,102,241,0.3)',
                              color: 'var(--accent-primary)',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              boxShadow: 'none'
                            }}
                          >
                            연동
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

            {/* 2. 입력 추가 모드 */}
            {selectorMode === 'input' && (
              <form onSubmit={handleCreateAndAttachInput} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
                  <strong>생산 제품 (출력):</strong> {outputsList.find(o => o.parentItemID === selectedParentID)?.parentItemName}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>선택할 투입 자재 (입력)</label>
                  {childItemsList.length > 0 ? (
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
                      {childItemsList.map((item) => (
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

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectorOpen(false);
                      setSelectorMode(null);
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      boxShadow: 'none'
                    }}
                  >
                    취소
                  </button>
                  <button type="submit" style={{ flex: 1 }}>
                    추가
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default StepUpdateMappingModal;
