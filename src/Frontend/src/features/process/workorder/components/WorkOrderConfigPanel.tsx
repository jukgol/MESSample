import React from 'react';
import type { ProcessMasterDto } from '../../../../api/data-contracts';

interface WorkOrderConfigPanelProps {
  selectedMaster: ProcessMasterDto | null;
  orderQty: number;
  onOrderQtyChange: (qty: number) => void;
}

const WorkOrderConfigPanel: React.FC<WorkOrderConfigPanelProps> = ({
  selectedMaster,
  orderQty,
  onOrderQtyChange
}) => {
  return (
    <section className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 180px', gap: '1rem', alignItems: 'end' }}>
      <div>
        <h2 style={{ margin: 0, color: 'white', fontSize: '1.15rem' }}>{selectedMaster?.processName || '공정 선택'}</h2>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {selectedMaster?.description || '작업지시를 생성할 공정 마스터를 선택하세요.'}
        </p>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        생산 수량
        <input
          type="number"
          min={1}
          value={orderQty}
          onChange={(event) => onOrderQtyChange(Math.max(1, Number(event.target.value) || 1))}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            background: 'rgba(0, 0, 0, 0.22)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            outline: 'none',
            fontSize: '0.95rem'
          }}
        />
      </label>
    </section>
  );
};

export default WorkOrderConfigPanel;
