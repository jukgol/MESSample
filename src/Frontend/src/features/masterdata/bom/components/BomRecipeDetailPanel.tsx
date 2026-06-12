import React, { useState } from 'react';
import { Info, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import type { BomRecipe } from '../hooks/useBoms';

interface BomRecipeDetailPanelProps {
  selectedRecipe: BomRecipe | null;
  loading: boolean;
  onRemoveInput: (itemId: number) => void;
  onRemoveOutput: (itemId: number) => void;
  onUpdateInputQty: (itemId: number, qty: number) => void;
  onUpdateOutputQty: (itemId: number, qty: number) => void;
}

const BomRecipeDetailPanel: React.FC<BomRecipeDetailPanelProps> = ({
  selectedRecipe,
  loading,
  onRemoveInput,
  onRemoveOutput,
  onUpdateInputQty,
  onUpdateOutputQty
}) => {
  // Editing state for item quantities
  const [editingItem, setEditingItem] = useState<{ type: 'input' | 'output'; itemId: number; qty: string } | null>(null);

  if (loading) {
    return (
      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem', minHeight: '400px' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>레시피 상세 정보를 조회 중입니다...</p>
      </div>
    );
  }

  if (!selectedRecipe) {
    return (
      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem', textAlign: 'center', minHeight: '400px' }}>
        <Info size={40} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem' }}>선택된 BOM 레시피 없음</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', margin: 0 }}>
          왼쪽 목록에서 조회하거나 관리할 레시피를 선택해 주세요.
        </p>
      </div>
    );
  }

  const handleStartEdit = (type: 'input' | 'output', itemId: number, currentQty: number) => {
    setEditingItem({ type, itemId, qty: currentQty.toString() });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const qtyNum = Number(editingItem.qty);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      alert('수량은 1개 이상이어야 합니다.');
      return;
    }

    if (editingItem.type === 'input') {
      onUpdateInputQty(editingItem.itemId, qtyNum);
    } else {
      onUpdateOutputQty(editingItem.itemId, qtyNum);
    }
    setEditingItem(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', minHeight: 0 }}>
      {/* 1. 상단: 입력물품 (Inputs) */}
      <div className="premium-card" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', padding: '1.2rem', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: '4px', fontWeight: '600' }}>
              입력
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>입력 물품 (투입 자재)</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 {selectedRecipe.inputs.length}개</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem' }}>품목코드</th>
                <th style={{ padding: '0.5rem' }}>품목명</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', width: '110px' }}>소요량</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {selectedRecipe.inputs.length > 0 ? (
                selectedRecipe.inputs.map((inp) => {
                  const isEditing = editingItem?.type === 'input' && editingItem.itemId === inp.itemID;
                  return (
                    <tr key={inp.itemID} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row">
                      <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{inp.itemCode}</td>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: '500', color: 'white' }}>{inp.itemName}</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            value={editingItem.qty}
                            onChange={(e) => setEditingItem({ ...editingItem, qty: e.target.value })}
                            style={{ width: '60px', padding: '2px 6px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', textAlign: 'right' }}
                          />
                        ) : (
                          <span style={{ color: '#34d399', fontWeight: '600' }}>{inp.qty}</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          {isEditing ? (
                            <>
                              <button onClick={handleSaveEdit} style={{ padding: '4px', background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981', borderRadius: '4px', cursor: 'pointer' }}>
                                <Check size={14} />
                              </button>
                              <button onClick={() => setEditingItem(null)} style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleStartEdit('input', inp.itemID, inp.qty)} style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                                <Edit size={12} />
                              </button>
                              <button onClick={() => onRemoveInput(inp.itemID)} style={{ padding: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}>
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    등록된 입력 구성 자재가 없습니다. 우측 품목 목록에서 [입력] 단추를 눌러 투입해 주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. 하단: 출력물품 (Outputs) */}
      <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.2rem', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: '4px', fontWeight: '600' }}>
              출력
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>출력 물품 (생산 제품)</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 {selectedRecipe.outputs.length}개</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem' }}>품목코드</th>
                <th style={{ padding: '0.5rem' }}>품목명</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', width: '110px' }}>생산수량</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {selectedRecipe.outputs.length > 0 ? (
                selectedRecipe.outputs.map((out) => {
                  const isEditing = editingItem?.type === 'output' && editingItem.itemId === out.itemID;
                  return (
                    <tr key={out.itemID} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row">
                      <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{out.itemCode}</td>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: '500', color: 'white' }}>{out.itemName}</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            value={editingItem.qty}
                            onChange={(e) => setEditingItem({ ...editingItem, qty: e.target.value })}
                            style={{ width: '60px', padding: '2px 6px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', textAlign: 'right' }}
                          />
                        ) : (
                          <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{out.qty}</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          {isEditing ? (
                            <>
                              <button onClick={handleSaveEdit} style={{ padding: '4px', background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981', borderRadius: '4px', cursor: 'pointer' }}>
                                <Check size={14} />
                              </button>
                              <button onClick={() => setEditingItem(null)} style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleStartEdit('output', out.itemID, out.qty)} style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                                <Edit size={12} />
                              </button>
                              <button onClick={() => onRemoveOutput(out.itemID)} style={{ padding: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}>
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    등록된 출력 품목이 없습니다. 우측 품목 목록에서 [출력] 단추를 눌러 연동해 주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BomRecipeDetailPanel;
