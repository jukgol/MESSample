import React from 'react';
import { Package } from 'lucide-react';
import type { MrpStepDetail } from '../../hooks/useMrp';

interface MrpMaterialTableProps {
  items: MrpStepDetail['items'];
}

const MrpMaterialTable: React.FC<MrpMaterialTableProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        이 단계에 매핑된 BOM 원자재 소요 정보가 없습니다. (BOM 기준정보 등록 필요)
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>원자재명</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>단위 소요량</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>총 필요 수량</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>현재 창고고</th>
          <th style={{ textAlign: 'right', padding: '8px' }}>부족 수량</th>
          <th style={{ textAlign: 'center', padding: '8px', width: '80px' }}>진단</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
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
            <td style={{ textAlign: 'right', padding: '8px', color: '#10b981' }}>{item.currentStock.toLocaleString()} EA</td>
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
                color: item.isSufficient ? '#10b981' : '#ef4444'
              }}>
                {item.isSufficient ? '충분' : '부족'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MrpMaterialTable;
