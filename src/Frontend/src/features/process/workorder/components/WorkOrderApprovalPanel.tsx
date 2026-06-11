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
    <section className="premium-card" style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: '1.5rem', alignItems: 'end', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}>
          <UserRound size={16} />
          작업자
        </span>
        <input
          type="text"
          placeholder="로그인 사용자"
          value={operatorName}
          readOnly
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(11, 14, 20, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            color: 'white',
            outline: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'default'
          }}
        />
      </label>
      <button
        type="button"
        onClick={onApprove}
        disabled={disabled}
        style={{
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          height: 48,
          padding: '0 2rem',
          fontSize: '1rem',
          fontWeight: 700,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: disabled 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          border: disabled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          color: disabled ? 'var(--text-secondary)' : 'white',
          boxShadow: disabled ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <CheckCircle2 size={18} />
        승인
      </button>
    </section>
  );
};

export default WorkOrderApprovalPanel;
