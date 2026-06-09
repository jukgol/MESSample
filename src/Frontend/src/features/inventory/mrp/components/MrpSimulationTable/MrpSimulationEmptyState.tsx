import React from 'react';
import { HelpCircle } from 'lucide-react';

const MrpSimulationEmptyState: React.FC = () => {
  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
      <HelpCircle size={40} style={{ opacity: 0.4, color: 'var(--accent-primary)' }} />
      <span style={{ fontSize: '1rem', fontWeight: 500, color: 'white' }}>분석 대상 공정 마스터 선택</span>
      <span style={{ fontSize: '0.85rem' }}>좌측 목록에서 분석을 진행할 공정 마스터를 선택해 주세요.</span>
    </div>
  );
};

export default MrpSimulationEmptyState;
