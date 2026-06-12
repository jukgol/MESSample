import React, { useState } from 'react';
import { CheckCircle2, CircleDashed, PauseCircle, PlayCircle, XCircle, X } from 'lucide-react';
import type { CurrentProcessStepStateDto } from '../../../../api/data-contracts';
import { api } from '../../../../api/client';

interface ProcessStepStatusGridProps {
  steps: CurrentProcessStepStateDto[];
  loading: boolean;
  selectedExecutionId?: number | null;
  onSelectExecution?: (id: number) => void;
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

const ProcessStepStatusGrid: React.FC<ProcessStepStatusGridProps> = ({ 
  steps, 
  loading,
  selectedExecutionId = null,
  onSelectExecution
}) => {
  const [selectedInputStep, setSelectedInputStep] = useState<CurrentProcessStepStateDto | null>(null);
  const sortedSteps = [...steps].sort((a, b) => (a.seqNo || 0) - (b.seqNo || 0));

  if (sortedSteps.length === 0) {
    return (
      <section className="premium-card" style={{ borderRadius: '8px', padding: '1.25rem', color: 'var(--text-secondary)' }}>
        {loading ? '공정 상태를 조회하고 있습니다.' : '선택된 작업지시에 표시할 공정이 없습니다.'}
      </section>
    );
  }

  return (
    <>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.85rem' }}>
        {sortedSteps.map((step, index) => {
          const meta = statusMeta(step.status);
          const isSelected = selectedExecutionId !== null && selectedExecutionId === step.processStepExecutionID;

          return (
            <article
              key={step.processStepExecutionID || `${step.processStepID}-${index}`}
              className="premium-card"
              onClick={() => {
                if (step.processStepExecutionID && onSelectExecution) {
                  onSelectExecution(step.processStepExecutionID);
                }
              }}
              style={{
                borderRadius: '8px',
                padding: '1rem',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                border: isSelected 
                  ? '2px solid var(--accent-primary)' 
                  : `1px solid ${meta.border}`,
                cursor: step.processStepExecutionID ? 'pointer' : 'default',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                boxShadow: isSelected ? '0 8px 20px rgba(99, 102, 241, 0.25)' : 'none',
                transition: 'all 0.2s ease-in-out'
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
                    onClick={async (e) => {
                      e.stopPropagation();
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

              <div style={{
                marginTop: '0.5rem',
                paddingTop: '0.6rem',
                borderTop: '1px dashed rgba(255,255,255,0.08)',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }}></span>
                    출력
                  </div>
                  {step.outputs && step.outputs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {step.outputs.map(output => (
                        <div key={output.processOutputID} style={{ 
                          background: 'rgba(52, 211, 153, 0.06)', 
                          border: '1px solid rgba(52, 211, 153, 0.15)', 
                          borderRadius: '6px', 
                          padding: '0.4rem 0.6rem', 
                          color: '#34d399',
                          fontSize: '0.75rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: 600 }}>{output.itemName || '-'}</span>
                          <span style={{ fontWeight: 700, color: 'white' }}>{output.outputQty || 0}개</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontStyle: 'italic', paddingLeft: '0.5rem' }}>
                      생산 대기 중
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInputStep(step);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6366f1';
                  }}
                >
                  입력상세보기
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {selectedInputStep && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
        onClick={() => setSelectedInputStep(null)}
        >
          <div style={{
            background: '#1e1b4b',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '420px',
            padding: '1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {selectedInputStep.stepName} - 투입 상세 정보
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInputStep(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {!selectedInputStep.inputs || selectedInputStep.inputs.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>
                  투입된 원자재(LOT) 정보가 없습니다.
                </div>
              ) : (
                selectedInputStep.inputs.map((input) => (
                  <div key={input.processInputID} style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>원자재 LOT:</span>
                      <strong style={{ color: '#c084fc' }}>{input.lotNo || '-'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>품목명:</span>
                      <span style={{ color: 'white', fontWeight: 500 }}>{input.itemName || '-'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.2rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>사용 수량</div>
                        <strong style={{ color: 'white' }}>{input.usedQty ?? 0}개</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>잔여 수량</div>
                        <strong style={{ color: 'white' }}>{input.remainQty ?? 0}개</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedInputStep(null)}
              style={{
                padding: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'white',
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessStepStatusGrid;
