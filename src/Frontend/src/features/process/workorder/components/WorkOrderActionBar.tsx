import React from 'react';
import { Loader2, RotateCw } from 'lucide-react';

interface WorkOrderActionBarProps {
  onRefresh: () => void;
  loading: boolean;
}

const WorkOrderActionBar: React.FC<WorkOrderActionBarProps> = ({ onRefresh, loading }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '1rem' }}>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border-color)',
          color: 'white',
          boxShadow: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px'
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />} 새로고침
      </button>
    </div>
  );
};

export default WorkOrderActionBar;
