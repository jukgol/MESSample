import React from 'react';
import { CheckCircle2, UserRound } from 'lucide-react';
import type { ProcessMasterDto } from '../../../../api/data-contracts';

interface WorkOrderConfigPanelProps {
  selectedMaster: ProcessMasterDto | null;
  orderQty: number;
  onOrderQtyChange: (qty: number) => void;
  operatorName: string;
  onApprove: () => void;
  disabled: boolean;
}

const WorkOrderConfigPanel: React.FC<WorkOrderConfigPanelProps> = ({
  selectedMaster,
  orderQty,
  onOrderQtyChange,
  operatorName,
  onApprove,
  disabled
}) => {
  return (
    <section className="premium-card" style={{ 
      padding: '1rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center', 
      gap: '1.5rem', 
      borderRadius: '14px', 
      background: 'rgba(255, 255, 255, 0.02)', 
      borderColor: 'rgba(255, 255, 255, 0.05)', 
      boxShadow: 'none',
      flexWrap: 'wrap'
    }}>
      <div>
        <h2 style={{ margin: 0, color: 'white', fontSize: '1.15rem', fontWeight: 600 }}>{selectedMaster?.processName || '공정 선택'} 설정</h2>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4 }}>
          {selectedMaster?.description || '작업지시를 생성할 공정 마스터를 선택하세요.'}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
          생산 수량
          <input
            type="number"
            min={1}
            value={orderQty}
            onChange={(event) => onOrderQtyChange(Math.max(1, Number(event.target.value) || 1))}
            style={{
              width: '100px',
              padding: '0.55rem 0.75rem',
              background: 'rgba(11, 14, 20, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              textAlign: 'right',
              transition: 'all 0.2s ease',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)' }}>
            <UserRound size={14} />
            작업자
          </span>
          <input
            type="text"
            value={operatorName}
            readOnly
            style={{
              width: '120px',
              padding: '0.55rem 0.75rem',
              background: 'rgba(11, 14, 20, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'default',
              textAlign: 'center'
            }}
          />
        </label>

        <button
          type="button"
          onClick={onApprove}
          disabled={disabled}
          style={{
            alignSelf: 'flex-end',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            height: 36,
            padding: '0 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            opacity: disabled ? 0.45 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: disabled 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            border: disabled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            color: disabled ? 'var(--text-secondary)' : 'white',
            boxShadow: disabled ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.2)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <CheckCircle2 size={16} />
          승인
        </button>
      </div>
    </section>
  );
};

export default WorkOrderConfigPanel;
