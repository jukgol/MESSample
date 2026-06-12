import React, { useEffect, useState, useCallback } from 'react';
import CurrentWorkOrderList from '../components/CurrentWorkOrderList';
import ProcessMonitoringErrorAlert from '../components/ProcessMonitoringErrorAlert';
import ProcessMonitoringHeader from '../components/ProcessMonitoringHeader';
import ProcessStepStatusGrid from '../components/ProcessStepStatusGrid';
import { useProcessMonitoring } from '../hooks/useProcessMonitoring';
import { api } from '../../../../api/client';

const ProcessMonitoringPage: React.FC = () => {
  const {
    currentWorkOrders,
    selectedWorkOrder,
    selectedWorkOrderId,
    loading,
    error,
    fetchCurrentWorkOrders,
    selectWorkOrder,
    deleteCurrentProcessMaster,
    completeWorkOrder
  } = useProcessMonitoring();

  const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentWorkOrders();
  }, [fetchCurrentWorkOrders]);

  useEffect(() => {
    setSelectedExecutionId(null);
  }, [selectedWorkOrderId]);

  const handleStartExecution = useCallback(async () => {
    if (!selectedExecutionId) {
      alert('실행할 공정을 선택해주세요.');
      return;
    }
    try {
      await api.api.processMonitoringExecutionsStartCreate(selectedExecutionId);
      alert('공정 실행이 시작되었습니다.');
      fetchCurrentWorkOrders();
      setSelectedExecutionId(null);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || '오류 발생';
      alert(`공정 실행 시작 실패: ${msg}`);
    }
  }, [selectedExecutionId, fetchCurrentWorkOrders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
      <ProcessMonitoringHeader 
        loading={loading} 
        onRefresh={fetchCurrentWorkOrders} 
        onStartExecution={handleStartExecution}
        hasSelection={!!selectedExecutionId}
      />
      <ProcessMonitoringErrorAlert message={error} />

      <CurrentWorkOrderList
        workOrders={currentWorkOrders}
        selectedWorkOrderId={selectedWorkOrderId}
        loading={loading}
        onSelectWorkOrder={selectWorkOrder}
        onDeleteProcessMaster={deleteCurrentProcessMaster}
        onCompleteWorkOrder={completeWorkOrder}
      />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.15rem' }}>공정 상태</h2>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {selectedWorkOrder ? `${selectedWorkOrder.workOrderNo || '-'}의 공정 진행 상태입니다.` : '작업지시를 선택하면 공정 상태가 표시됩니다.'}
            </p>
          </div>
        </div>

        <ProcessStepStatusGrid
          steps={selectedWorkOrder?.steps || []}
          loading={loading}
          selectedExecutionId={selectedExecutionId}
          onSelectExecution={setSelectedExecutionId}
        />
      </section>
    </div>
  );
};

export default ProcessMonitoringPage;
