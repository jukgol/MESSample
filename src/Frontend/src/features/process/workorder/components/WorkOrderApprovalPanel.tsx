import React from 'react';
import { CheckCircle2, UserRound } from 'lucide-react';

interface WorkOrderApprovalPanelProps {
  operatorName: string;
  onApprove: () => void;
  disabled: boolean;
}

const WorkOrderApprovalPanel: React.FC<WorkOrderApprovalPanelProps> = ({
  operatorName,
  onApprove,
  disabled
}) => {
  return (
    <section className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><UserRound size={15} /> 작업자</span>
        <input
          type="text"
          placeholder="로그인 사용자"
          value={operatorName}
          readOnly
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            color: 'white',
            outline: 'none',
            fontSize: '0.95rem',
            cursor: 'default'
          }}
        />
      </label>
      <button
        type="button"
        onClick={onApprove}
        disabled={disabled}
        style={{
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: 46,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: disabled ? 'rgba(255, 255, 255, 0.08)' : undefined,
          border: disabled ? '1px solid var(--border-color)' : undefined,
          color: disabled ? 'var(--text-secondary)' : undefined,
          boxShadow: disabled ? 'none' : undefined
        }}
      >
        <CheckCircle2 size={18} />
        승인
      </button>
    </section>
  );
};

export default WorkOrderApprovalPanel;
