import React from 'react';
import { CheckCircle2, CircleDashed, PauseCircle, PlayCircle, XCircle } from 'lucide-react';
import type { CurrentProcessStepStateDto } from '../../../../api/data-contracts';
import { api } from '../../../../api/client';

interface ProcessStepStatusGridProps {
  steps: CurrentProcessStepStateDto[];
  loading: boolean;
}

const statusMeta = (status?: string | null) => {
  switch (status) {
    case 'RUNNING':
      return { label: '활성화', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.28)', icon: <PlayCircle size={18} /> };
    case 'PAUSED':
      return { label: '일시정지', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.28)', icon: <PauseCircle size={18} /> };
    case 'DONE':
      return { label: '완료', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.28)', icon: <CheckCircle2 size={18} /> };
    case 'FAILED':
      return { label: '실패', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.28)', icon: <XCircle size={18} /> };
    default:
      return { label: '대기', color: '#c4b5fd', bg: 'rgba(196, 181, 253, 0.12)', border: 'rgba(196, 181, 253, 0.28)', icon: <CircleDashed size={18} /> };
  }
};

const ProcessStepStatusGrid: React.FC<ProcessStepStatusGridProps> = ({ steps, loading }) => {
  const sortedSteps = [...steps].sort((a, b) => (a.seqNo || 0) - (b.seqNo || 0));

  if (sortedSteps.length === 0) {
    return (
      <section className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', color: 'var(--text-secondary)' }}>
        {loading ? '공정 상태를 조회하고 있습니다.' : '선택된 작업지시에 표시할 공정이 없습니다.'}
      </section>
    );
  }

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.85rem' }}>
      {sortedSteps.map((step, index) => {
        const meta = statusMeta(step.status);

        return (
          <article
            key={step.processStepExecutionID || `${step.processStepID}-${index}`}
            className="premium-card"
            style={{
              borderRadius: '8px',
              padding: '1rem',
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              border: `1px solid ${meta.border}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99, 102, 241, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {step.seqNo || index + 1}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', lineHeight: 1.3 }}>{step.stepName || '-'}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    실행 ID {step.processStepExecutionID || '-'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={async () => {
                    const isRunning = step.status === 'RUNNING';
                    try {
                      const reqDto = {
                        equipmentId: step.equipmentID || undefined
                      };
                      const response = isRunning
                        ? await api.api.processMonitoringStarttoolStopCreate(reqDto)
                        : await api.api.processMonitoringStarttoolStartCreate(reqDto);

                      if (response.data?.success) {
                        console.log(`${isRunning ? '정지' : '시작'} 신호 전송 성공: ${response.data.message}`);
                      } else {
                        alert(`${isRunning ? '정지' : '시작'} 신호 전송 실패: ${response.data?.message || '오류 발생'}`);
                      }
                    } catch (err: any) {
                      console.error(err);
                      alert('서버 연결 실패');
                    }
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'white',
                    backgroundColor: step.status === 'RUNNING' ? '#ef4444' : '#4f46e5',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {step.status === 'RUNNING' ? '정지' : '테스트'}
                </button>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: meta.color,
                    background: meta.bg,
                    border: `1px solid ${meta.border}`,
                    borderRadius: '8px',
                    padding: '0.3rem 0.5rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {meta.icon}
                  {meta.label}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <div>
                <div>설비</div>
                <strong style={{ color: 'white' }}>{step.equipmentID || '-'}</strong>
              </div>
              <div>
                <div>작업자</div>
                <strong style={{ color: 'white' }}>{step.workerName || '-'}</strong>
              </div>
            </div>

            {((step.inputs && step.inputs.length > 0) || (step.outputs && step.outputs.length > 0)) && (
              <div style={{
                marginTop: '0.5rem',
                paddingTop: '0.6rem',
                borderTop: '1px dashed rgba(255,255,255,0.08)',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {step.inputs && step.inputs.length > 0 && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#a78bfa' }}></span>
                      투입 LOT ({step.inputs.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {step.inputs.map(input => (
                        <div key={input.processInputID} style={{ 
                          background: 'rgba(167, 139, 250, 0.08)', 
                          border: '1px solid rgba(167, 139, 250, 0.2)', 
                          borderRadius: '4px', 
                          padding: '0.15rem 0.35rem', 
                          color: '#c084fc',
                          fontSize: '0.72rem',
                          display: 'flex',
                          gap: '0.35rem'
                        }}>
                          <span style={{ fontWeight: 600 }}>{input.lotNo || '무명LOT'}</span>
                          <span style={{ opacity: 0.8, color: '#e9d5ff' }}>{input.usedQty}개</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step.outputs && step.outputs.length > 0 && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }}></span>
                      생산 LOT ({step.outputs.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {step.outputs.map(output => (
                        <div key={output.processOutputID} style={{ 
                          background: 'rgba(52, 211, 153, 0.08)', 
                          border: '1px solid rgba(52, 211, 153, 0.2)', 
                          borderRadius: '4px', 
                          padding: '0.15rem 0.35rem', 
                          color: '#34d399',
                          fontSize: '0.72rem',
                          display: 'flex',
                          gap: '0.35rem'
                        }}>
                          <span style={{ fontWeight: 600 }}>{output.lotNo || '무명LOT'}</span>
                          <span style={{ opacity: 0.8, color: '#a7f3d0' }}>{output.outputQty}개</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default ProcessStepStatusGrid;
