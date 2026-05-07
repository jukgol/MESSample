import React from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface ItemHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ loading, onRefresh }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>품목 리스트</h1>
        <p style={{ color: 'var(--text-secondary)' }}>전체 등록된 품목 마스터 정보를 관리합니다. (백엔드 실시간 연동)</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 품목 새로고침
      </button>
    </header>
  );
};

export default ItemHeader;
