import React from 'react';
import { Plus, RotateCw, Loader2, Database } from 'lucide-react';

interface LotHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onGenerateDummy: (count: number) => void;
}

const LotHeader: React.FC<LotHeaderProps> = ({ loading, onRefresh, onOpenCreateModal, onGenerateDummy }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>LOT 관리</h1>
        <p style={{ color: 'var(--text-secondary)' }}>실제 입고되어 처리 중인 LOT 상태 및 정보를 관리합니다.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onGenerateDummy(10)}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', boxShadow: 'none' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />} 테스트 데이터 10개 생성
        </button>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />} 새로고침
        </button>
        <button
          onClick={onOpenCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> LOT 신규 등록
        </button>
      </div>
    </header>
  );
};

export default LotHeader;
