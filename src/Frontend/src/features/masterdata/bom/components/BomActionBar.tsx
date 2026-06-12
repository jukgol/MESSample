import React from 'react';
import { Loader2, RotateCw, Plus } from 'lucide-react';

interface BomActionBarProps {
  onRefresh: () => void;
  onOpenCreate: () => void;
  loading: boolean;
}

const BomActionBar: React.FC<BomActionBarProps> = ({
  onRefresh,
  onOpenCreate,
  loading
}) => {
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
      
      <button
        onClick={onOpenCreate}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'var(--primary-color, #6366f1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
        }}
        title="새로운 BOM 레시피(껍데기)를 추가합니다."
      >
        <Plus size={16} /> 레시피 추가
      </button>
    </div>
  );
};

export default BomActionBar;
