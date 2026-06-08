import React from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import type { ProcessStep } from './useProcessSteps';

interface ProcessStepTableProps {
  processSteps: ProcessStep[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (step: ProcessStep) => void;
  onDelete: (id: number) => void;
}

const ProcessStepTable: React.FC<ProcessStepTableProps> = ({
  processSteps,
  loading,
  error,
  onOpenUpdateModal,
  onDelete
}) => {
  return (
    <div className="premium-card" style={{ padding: '1.5rem' }}>
      {error ? (
        <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
                데이터를 불러오는 중입니다...
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    position: 'sticky',
                    top: 0,
                    background: '#151720',
                    zIndex: 1
                  }}>
                    <th style={{ padding: '1rem' }}>순서 (Seq)</th>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>공정 단계명</th>
                    <th style={{ padding: '1rem' }}>공정 유형</th>
                    <th style={{ padding: '1rem' }}>소속 공정</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {processSteps.length > 0 ? (
                    processSteps.map((step) => (
                      <tr key={step.stepID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{step.seqNo}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{step.stepID}</td>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{step.stepName}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '4px 10px',
                            background: step.stepType === '생산' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            border: `1px solid ${step.stepType === '생산' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                            color: step.stepType === '생산' ? '#34d399' : '#fbbf24'
                          }}>
                            {step.stepType}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: step.processMasterName ? 'white' : 'var(--text-secondary)' }}>
                          {step.processMasterName || '미연결'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => onOpenUpdateModal(step)}
                              style={{
                                padding: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="수정"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(step.stepID)}
                              style={{
                                padding: '6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '6px',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        등록된 공정 단계가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessStepTable;
