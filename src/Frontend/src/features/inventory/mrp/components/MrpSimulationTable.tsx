import React from 'react';
import { Calculator, CheckCircle2, AlertTriangle, HelpCircle, Package } from 'lucide-react';
import type { ProcessMaster } from '../../../masterdata/master/hooks/useProcessMasters';
import type { MrpStepDetail } from '../hooks/useMrp';

interface MrpSimulationTableProps {
  selectedMaster: ProcessMaster | null;
  targetQty: number;
  onTargetQtyChange: (qty: number) => void;
  mrpDetails: MrpStepDetail[];
  summary: {
    totalItemsCount: number;
    shortageItemsCount: number;
    isFeasible: boolean;
  };
  loading: boolean;
}

const MrpSimulationTable: React.FC<MrpSimulationTableProps> = ({
  selectedMaster,
  targetQty,
  onTargetQtyChange,
  mrpDetails,
  summary,
  loading
}) => {
  if (!selectedMaster) {
    return (
      <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
        <HelpCircle size={40} style={{ opacity: 0.4, color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '1rem', fontWeight: 500, color: 'white' }}>분석 대상 공정 마스터 선택</span>
        <span style={{ fontSize: '0.85rem' }}>좌측 목록에서 분석을 진행할 공정 마스터를 선택해 주세요.</span>
      </div>
    );
  }

  return (
    <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'var(--card-bg, #1a1a24)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', overflowY: 'auto' }}>
      {/* Top Configuration Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>선택된 공정:</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{selectedMaster.processName} ({selectedMaster.processCode})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="target-qty-input" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>목표 생산량 (EA):</label>
          <input
            id="target-qty-input"
            type="number"
            min="1"
            value={targetQty}
            onChange={(e) => onTargetQtyChange(Math.max(1, Number(e.target.value)))}
            style={{
              width: '120px',
              padding: '6px 12px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              outline: 'none',
              textAlign: 'right'
            }}
          />
        </div>
      </div>

      {/* Overall Summary Card */}
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

      {/* Process Steps & Consumed Materials Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1, overflowY: 'auto' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calculator size={16} style={{ color: 'var(--accent-primary)' }} /> 공정 단계별 시뮬레이션 결과
        </h4>

        {mrpDetails.length === 0 && !loading ? (
          <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            이 공정에 연결된 공정 단계(Step)가 존재하지 않거나 소요 자재 정보가 없습니다.
          </div>
        ) : (
          mrpDetails.map(step => (
            <div
              key={step.stepID}
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.01)',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              {/* Step Header */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    Seq {step.seqNo}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                    {step.stepName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    ({step.stepType})
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  소요 원자재: {step.items.length}종
                </span>
              </div>

              {/* Step Material Table */}
              <div style={{ padding: '8px' }}>
                {step.items.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', height: '40px' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>원자재명</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>단위 소요량</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>총 필요 수량</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>현재 창고고</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>부족 수량</th>
                        <th style={{ textAlign: 'center', padding: '8px', width: '80px' }}>진단</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.items.map(item => (
                        <tr
                          key={item.bomID}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            color: item.isSufficient ? 'var(--text-primary)' : '#ffb6b6',
                            background: item.isSufficient ? 'transparent' : 'rgba(239, 68, 68, 0.02)'
                          }}
                        >
                          <td style={{ padding: '8px', fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Package size={14} style={{ color: 'var(--text-secondary)' }} />
                              {item.childItemName}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>{item.unitQty.toLocaleString()} EA</td>
                          <td style={{ textAlign: 'right', padding: '8px', fontWeight: 600 }}>{item.requiredQty.toLocaleString()} EA</td>
                          <td style={{ textAlign: 'right', padding: '8px', color: '#10b981' }}>{item.currentStock.toLocaleString()} EA</td>
                          <td style={{ textAlign: 'right', padding: '8px', color: item.isSufficient ? 'var(--text-secondary)' : '#ef4444', fontWeight: item.isSufficient ? 400 : 600 }}>
                            {item.isSufficient ? '-' : `${item.shortage.toLocaleString()} EA`}
                          </td>
                          <td style={{ textAlign: 'center', padding: '8px' }}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: 600,
                              backgroundColor: item.isSufficient ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: item.isSufficient ? '#10b981' : '#ef4444'
                            }}>
                              {item.isSufficient ? '충분' : '부족'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    이 단계에 매핑된 BOM 원자재 소요 정보가 없습니다. (BOM 기준정보 등록 필요)
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MrpSimulationTable;
