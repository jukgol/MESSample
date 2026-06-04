import React from 'react';
import { Loader2, Database, RotateCw, Plus } from 'lucide-react';

interface ItemActionBarProps {
  onGenerateDummy: () => void;
  onRefresh: () => void;
  onOpenCreate: () => void;
  loading: boolean;
}

const ItemActionBar: React.FC<ItemActionBarProps> = ({
  onGenerateDummy,
  onRefresh,
  onOpenCreate,
  loading
}) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '1rem' }}>
      <button
        onClick={onGenerateDummy}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          boxShadow: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px'
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />} 테스트 데이터 10개 생성
      </button>
      
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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px'
        }}
      >
        <Plus size={16} /> 품목 신규 등록
      </button>
    </div>
  );
};

export default ItemActionBar;
