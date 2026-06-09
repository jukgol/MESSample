import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MrpSummary } from './types';

interface MrpSimulationSummaryCardProps {
  summary: MrpSummary;
}

const MrpSimulationSummaryCard: React.FC<MrpSimulationSummaryCardProps> = ({ summary }) => {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '10px',
      background: summary.isFeasible ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
      border: summary.isFeasible ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {summary.isFeasible ? (
          <CheckCircle2 size={24} style={{ color: '#10b981' }} />
        ) : (
          <AlertTriangle size={24} style={{ color: '#ef4444' }} />
        )}
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'white' }}>
            {summary.isFeasible ? '생산 가능 (자재 충분)' : '생산 지연 경고 (자재 부족)'}
          </h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            총 {summary.totalItemsCount}개의 원자재 매핑 중 {summary.shortageItemsCount}개 품목의 재고가 부족합니다.
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>종합 진단</div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: summary.isFeasible ? '#10b981' : '#ef4444'
        }}>
          {summary.isFeasible ? 'FEASIBLE' : 'SHORTAGE'}
        </div>
      </div>
    </div>
  );
};

export default MrpSimulationSummaryCard;
