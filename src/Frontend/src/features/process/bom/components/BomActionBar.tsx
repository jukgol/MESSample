import React from 'react';
import { Loader2, Database, RotateCw, Plus } from 'lucide-react';

interface BomActionBarProps {
  onGenerateDummy: () => void;
  onRefresh: () => void;
  onOpenCreate: () => void;
  loading: boolean;
  hasParentSelected: boolean;
}

const BomActionBar: React.FC<BomActionBarProps> = ({
  onGenerateDummy,
  onRefresh,
  onOpenCreate,
  loading,
  hasParentSelected
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
        title="시나리오 표준 BOM 데이터를 일괄 생성합니다."
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />} BOM 시나리오 로드
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
        disabled={!hasParentSelected || loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          cursor: hasParentSelected ? 'pointer' : 'not-allowed',
          opacity: hasParentSelected ? 1 : 0.5,
          background: hasParentSelected ? undefined : 'rgba(255,255,255,0.05)',
          border: hasParentSelected ? undefined : '1px solid var(--border-color)',
          color: hasParentSelected ? 'white' : 'var(--text-secondary)',
          boxShadow: hasParentSelected ? undefined : 'none'
        }}
        title={hasParentSelected ? '출력 품목에 새로운 입력 구성 요소를 추가합니다.' : '먼저 왼쪽에서 출력 품목을 선택해 주세요.'}
      >
        <Plus size={16} /> 구성 요소 추가
      </button>
    </div>
  );
};

export default BomActionBar;
