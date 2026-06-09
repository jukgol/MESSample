import React from 'react';
import { Calculator } from 'lucide-react';
import type { MrpStepDetail } from '../../hooks/useMrp';
import MrpSimulationStepCard from './MrpSimulationStepCard';

interface MrpSimulationStepResultsProps {
  mrpDetails: MrpStepDetail[];
  loading: boolean;
}

const MrpSimulationStepResults: React.FC<MrpSimulationStepResultsProps> = ({
  mrpDetails,
  loading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: 0 }}>
      <h4 style={{ margin: 0, fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Calculator size={16} style={{ color: 'var(--accent-primary)' }} /> 공정 단계별 시뮬레이션 결과
      </h4>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '4px 0 8px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
        {mrpDetails.length === 0 && !loading ? (
          <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            이 공정에 연결된 공정 단계(Step)가 존재하지 않거나 소요 자재 정보가 없습니다.
          </div>
        ) : (
          mrpDetails.map(step => (
            <MrpSimulationStepCard key={step.stepID} step={step} />
          ))
        )}
      </div>
    </div>
  );
};

export default MrpSimulationStepResults;
