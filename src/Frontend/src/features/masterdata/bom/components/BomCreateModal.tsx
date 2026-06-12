import React, { useState, useEffect } from 'react';
import type { Item } from '../../item/hooks/useItems';
import type { ProcessStep } from '../../step/hooks/useProcessSteps';

interface BomCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  processSteps: ProcessStep[];
  onSubmit: (dto: { recipeCode?: string; recipeName: string; processStepID?: number | null; outputItemID?: number | null }) => Promise<boolean>;
}

const BomCreateModal: React.FC<BomCreateModalProps> = ({
  isOpen,
  onClose,
  items,
  processSteps,
  onSubmit
}) => {
  const [form, setForm] = useState<{
    recipeCode: string;
    recipeName: string;
    processStepID: string;
    outputItemID: string;
  }>({
    recipeCode: '',
    recipeName: '',
    processStepID: '',
    outputItemID: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        recipeCode: '',
        recipeName: '',
        processStepID: '',
        outputItemID: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipeName.trim()) {
      alert('레시피 이름을 입력해 주세요.');
      return;
    }

    const success = await onSubmit({
      recipeCode: form.recipeCode.trim() || undefined,
      recipeName: form.recipeName.trim(),
      processStepID: form.processStepID === '' ? null : Number(form.processStepID),
      outputItemID: form.outputItemID === '' ? null : Number(form.outputItemID)
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="premium-card" style={{ width: '480px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>새 BOM 레시피 추가</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          기본 정보 및 선택적으로 출력 품목/공정을 입력하여 새로운 레시피 껍데기를 생성합니다.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>레시피명 (필수)</label>
            <input
              type="text"
              required
              placeholder="예: 신라면 레시피"
              value={form.recipeName}
              onChange={(e) => setForm({ ...form, recipeName: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>레시피 코드 (선택)</label>
            <input
              type="text"
              placeholder="예: RECIPE_SHIN_01 (미입력 시 자동 생성)"
              value={form.recipeCode}
              onChange={(e) => setForm({ ...form, recipeCode: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>출력 품목 (선택)</label>
            <select
              value={form.outputItemID}
              onChange={(e) => setForm({ ...form, outputItemID: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            >
              <option value="" style={{ background: '#1e1e24' }}>-- 출력 품목 선택 안함 --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id} style={{ background: '#1e1e24' }}>
                  [{item.category}] {item.name} (ID: {item.id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>연결 공정 단계 (선택)</label>
            <select
              value={form.processStepID}
              onChange={(e) => setForm({ ...form, processStepID: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            >
              <option value="" style={{ background: '#1e1e24' }}>-- 연결 공정 선택 안함 --</option>
              {processSteps.map((step) => (
                <option key={step.stepID} value={step.stepID} style={{ background: '#1e1e24' }}>
                  Seq {step.seqNo}: {step.stepName} ({step.stepType})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
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
              취소
            </button>
            <button 
              type="submit"
              style={{
                background: 'var(--primary-color, #6366f1)',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              레시피 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BomCreateModal;
