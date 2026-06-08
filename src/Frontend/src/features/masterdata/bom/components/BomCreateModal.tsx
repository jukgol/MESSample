import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { Item } from '../../item/hooks/useItems';
import type { ProcessStep } from '../../step/hooks/useProcessSteps';

interface BomCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParentItem: Item | null;
  availableChildItems: Item[];
  processSteps: ProcessStep[];
  onSubmit: (dto: { childItemID: number; bomQty: number; processStepID?: number | null }) => Promise<boolean>;
}

const BomCreateModal: React.FC<BomCreateModalProps> = ({
  isOpen,
  onClose,
  selectedParentItem,
  availableChildItems,
  processSteps,
  onSubmit
}) => {
  const [form, setForm] = useState<{ childItemID: string; bomQty: number | ''; processStepID: string }>({
    childItemID: '',
    bomQty: 1,
    processStepID: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        childItemID: '',
        bomQty: 1,
        processStepID: ''
      });
    }
  }, [isOpen]);

  if (!isOpen || !selectedParentItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childItemID) {
      alert('?낅젰 ?덈ぉ???좏깮??二쇱꽭??');
      return;
    }
    if (form.bomQty === '' || Number(form.bomQty) <= 0) {
      alert('?뚯슂?됱? 1媛??댁긽?댁뼱???⑸땲??');
      return;
    }

    const success = await onSubmit({
      childItemID: Number(form.childItemID),
      bomQty: Number(form.bomQty),
      processStepID: form.processStepID === '' ? null : Number(form.processStepID)
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
      <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>BOM 援ъ꽦 ?붿냼 異붽?</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
          <strong>湲곗? 異쒕젰 ?덈ぉ:</strong> {selectedParentItem.name} (ID: {selectedParentItem.id})
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>異붽????낅젰 ?덈ぉ</label>
            {availableChildItems.length > 0 ? (
              <select
                required
                value={form.childItemID}
                onChange={(e) => setForm({ ...form, childItemID: e.target.value })}
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
                <option value="" style={{ background: '#1e1e24' }}>-- ?덈ぉ ?좏깮 --</option>
                {availableChildItems.map((item) => (
                  <option key={item.id} value={item.id} style={{ background: '#1e1e24' }}>
                    [{item.category}] {item.name} (ID: {item.id})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ color: '#fbbf24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                <Info size={16} /> 異붽? 媛?ν븳 ?ㅻⅨ ?낅젰 ?덈ぉ??議댁옱?섏? ?딆뒿?덈떎.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>?ъ엯??怨듭젙 ?④퀎 (?좏깮)</label>
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
              <option value="" style={{ background: '#1e1e24' }}>-- ?곌껐 ?놁쓬 (誘몄??? --</option>
              {processSteps.map((step) => (
                <option key={step.stepID} value={step.stepID} style={{ background: '#1e1e24' }}>
                  Seq {step.seqNo}: {step.stepName} ({step.stepType})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>?뚯슂 ?섎웾 (Qty)</label>
            <input
              type="number"
              required
              min={1}
              placeholder="?? 1"
              value={form.bomQty}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, bomQty: val === '' ? '' : Number(val) });
              }}
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
              痍⑥냼
            </button>
            <button 
              type="submit"
              disabled={availableChildItems.length === 0}
            >
              異붽?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BomCreateModal;
