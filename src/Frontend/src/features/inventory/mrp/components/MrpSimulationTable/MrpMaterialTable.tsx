import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import type { MrpStepDetail } from '../../hooks/useMrp';

interface MrpMaterialTableProps {
  items: MrpStepDetail['items'];
  recipeID?: number | null;
}

const MrpMaterialTable: React.FC<MrpMaterialTableProps> = ({ items, recipeID }) => {
  if (items.length === 0) {
    const hasRecipe = recipeID !== undefined && recipeID !== null && recipeID !== 0;

    return (
      <div style={{
        margin: '8px 0',
        padding: '18px 20px',
        textAlign: 'center',
        color: '#fca5a5',
        fontSize: '0.85rem',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        {hasRecipe ? (
          <span>BOM 기준정보는 등록되어 있으나, 등록된 소요 원자재(Input)가 없거나 LOT(재고)이 등록되지 않았습니다.</span>
        ) : (
          <span>이 단계에 매핑된 BOM 기준정보가 없습니다. BOM 기준정보 등록이 필요합니다. (BOM 미연결)</span>
        )}
      </div>
    );
  }

  const hasMissingLot = items.some(item => !(item.hasLotStock ?? true));

  return (
    <>
      {hasMissingLot && (
        <div style={{
          margin: '8px 0',
          padding: '12px 16px',
          color: '#fca5a5',
          fontSize: '0.85rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>BOM 기준정보는 등록되어 있으나, LOT(재고)이 없는 원자재가 있어 생산 불가능합니다. LOT 등록이 필요합니다.</span>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>원자재명</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>단위 소요량</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>총 필요 수량</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>현재 창고고</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>부족 수량</th>
          <th style={{ textAlign: 'center', padding: '8px', width: '90px' }}>진단</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          const hasLotStock = item.hasLotStock ?? true;
          const diagnosisText = hasLotStock ? (item.isSufficient ? '충분' : '부족') : 'LOT 없음';

          return (
            <tr
              key={item.bomID}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                color: item.isSufficient ? 'var(--text-primary)' : '#ffb6b6',
                background: item.isSufficient ? 'transparent' : 'rgba(239, 68, 68, 0.02)'
              }}
            >
              <td style={{ padding: '8px', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={14} style={{ color: 'var(--text-secondary)' }} />
                  {item.childItemName}
                </div>
              </td>
              <td style={{ textAlign: 'right', padding: '8px' }}>{item.unitQty.toLocaleString()} EA</td>
              <td style={{ textAlign: 'right', padding: '8px', fontWeight: 600 }}>{item.requiredQty.toLocaleString()} EA</td>
              <td style={{ textAlign: 'right', padding: '8px', color: hasLotStock ? '#10b981' : '#ef4444', fontWeight: hasLotStock ? 400 : 700 }}>
                {hasLotStock ? `${item.currentStock.toLocaleString()} EA` : 'LOT 없음'}
              </td>
              <td style={{ textAlign: 'right', padding: '8px', color: item.isSufficient ? 'var(--text-secondary)' : '#ef4444', fontWeight: item.isSufficient ? 400 : 600 }}>
                {item.isSufficient ? '-' : `${item.shortage.toLocaleString()} EA`}
              </td>
              <td style={{ textAlign: 'center', padding: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  backgroundColor: item.isSufficient ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: item.isSufficient ? '#10b981' : '#ef4444',
                  whiteSpace: 'nowrap'
                }}>
                  {diagnosisText}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
};

export default MrpMaterialTable;
