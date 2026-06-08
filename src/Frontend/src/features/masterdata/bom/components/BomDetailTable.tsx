import React from 'react';
import { Loader2, Edit, Trash2, Info } from 'lucide-react';
import type { Bom } from '../hooks/useBoms';
import type { Item } from '../../item/hooks/useItems';

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
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem' }}>?좏깮??異쒕젰 ?덈ぉ ?놁쓬</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', margin: 0 }}>
          ?쇱そ ?덈ぉ 紐⑸줉?먯꽌 ?꾩쓽???덈ぉ???좏깮?섏뿬 ?대떦 ?덈ぉ??BOM ?덉떆??援ъ“瑜?議고쉶?섍굅???뺤쓽??二쇱꽭??
        </p>
      </div>
    );
  }

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1.5rem' }}>
      {/* ?곸꽭 ?곸뿭 ?ㅻ뜑 */}
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
              異쒕젰 ?덈ぉ
            </span>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{selectedItem.name}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            ID: {selectedItem.id} | 援щ텇: {selectedItem.category} | ?⑥쐞: {selectedItem.unit} | ?ㅻ챸: {selectedItem.spec}
          </p>
        </div>
      </div>

      {/* ?뚯씠釉?/ 由ъ뒪???곸뿭 */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        {error ? (
          <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
            BOM ?뺣낫瑜?遺덈윭?ㅻ뒗 以묒엯?덈떎...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.8rem 1rem' }}>BOM ID</th>
                <th style={{ padding: '0.8rem 1rem' }}>?낅젰 ?덈ぉ ID</th>
                <th style={{ padding: '0.8rem 1rem' }}>입력 품목명</th>
                <th style={{ padding: '0.8rem 1rem' }}>?ъ엯 怨듭젙</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>?뚯슂??(BomQty)</th>
                <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>?묒뾽</th>
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
                      {bom.childItemName || `?덈ぉ #${bom.childItemID}`}
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
                          {bom.processStepName || `怨듭젙 #${bom.processStepID}`}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>?곌껐 ?놁쓬</span>
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
                          title="?뚯슂???섏젙"
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
                          title="BOM?먯꽌 ?댁젣"
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
                    ?뺤쓽???낅젰 援ъ꽦 ?붿냼(BOM)媛 ?놁뒿?덈떎. ?덉떆?쇰? ?깅줉?섎젮硫??곷떒 ?≪뀡諛붿쓽 "援ъ꽦 ?붿냼 異붽?" 踰꾪듉???대┃?섏꽭??
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
