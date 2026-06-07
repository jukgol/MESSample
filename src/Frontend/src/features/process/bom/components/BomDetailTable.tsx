import React from 'react';
import { Loader2, Edit, Trash2, Info } from 'lucide-react';
import type { Bom } from '../hooks/useBoms';
import type { Item } from '../../../masterdata/item/hooks/useItems';

interface BomDetailTableProps {
  selectedItem: Item | null;
  boms: Bom[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (bom: Bom) => void;
  onDelete: (id: number) => void;
}

const BomDetailTable: React.FC<BomDetailTableProps> = ({
  selectedItem,
  boms,
  loading,
  error,
  onOpenUpdateModal,
  onDelete
}) => {
  if (!selectedItem) {
    return (
      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem', textAlign: 'center', minHeight: '400px' }}>
        <Info size={40} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem' }}>선택된 부모 품목 없음</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', margin: 0 }}>
          왼쪽 품목 목록에서 임의의 품목을 선택하여 해당 품목의 BOM 레시피 구조를 조회하거나 정의해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1.5rem' }}>
      {/* 상세 영역 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '2px 8px', 
              background: 'rgba(99,102,241,0.15)', 
              color: 'var(--accent-primary)',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              부모 품목
            </span>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{selectedItem.name}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            ID: {selectedItem.id} | 구분: {selectedItem.category} | 단위: {selectedItem.unit} | 설명: {selectedItem.spec}
          </p>
        </div>
      </div>

      {/* 테이블 / 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        {error ? (
          <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
            BOM 정보를 불러오는 중입니다...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.8rem 1rem' }}>BOM ID</th>
                <th style={{ padding: '0.8rem 1rem' }}>자식 품목 ID</th>
                <th style={{ padding: '0.8rem 1rem' }}>자식 품목명</th>
                <th style={{ padding: '0.8rem 1rem' }}>투입 공정</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>소요량 (BomQty)</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {boms.length > 0 ? (
                boms.map((bom) => (
                  <tr key={bom.bomID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {bom.bomID}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {bom.childItemID}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '500' }}>
                      {bom.childItemName || `품목 #${bom.childItemID}`}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {bom.processStepID ? (
                        <span style={{
                          padding: '4px 8px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#818cf8',
                          fontWeight: '600'
                        }}>
                          {bom.processStepName || `공정 #${bom.processStepID}`}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>연결 없음</span>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: 'var(--accent-primary)', textAlign: 'right', fontSize: '1rem' }}>
                      {bom.bomQty.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => onOpenUpdateModal(bom)}
                          style={{
                            padding: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="소요량 수정"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(bom.bomID)}
                          style={{
                            padding: '6px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="BOM에서 해제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    정의된 자식 구성 요소(BOM)가 없습니다. 레시피를 등록하려면 상단 액션바의 "구성 요소 추가" 버튼을 클릭하세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BomDetailTable;
