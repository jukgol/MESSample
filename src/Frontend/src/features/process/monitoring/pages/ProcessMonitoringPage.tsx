import React, { useEffect } from 'react';
import CurrentWorkOrderList from '../components/CurrentWorkOrderList';
import ProcessMonitoringErrorAlert from '../components/ProcessMonitoringErrorAlert';
import ProcessMonitoringHeader from '../components/ProcessMonitoringHeader';
import ProcessStepStatusGrid from '../components/ProcessStepStatusGrid';
import { useProcessMonitoring } from '../hooks/useProcessMonitoring';

const ProcessMonitoringPage: React.FC = () => {
  const {
    currentWorkOrders,
    selectedWorkOrder,
    selectedWorkOrderId,
    loading,
    error,
    fetchCurrentWorkOrders,
    selectWorkOrder,
    deleteCurrentProcessMaster
  } = useProcessMonitoring();

  useEffect(() => {
    fetchCurrentWorkOrders();
  }, [fetchCurrentWorkOrders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
      <ProcessMonitoringHeader 
        loading={loading} 
        onRefresh={fetchCurrentWorkOrders} 
      />
      <ProcessMonitoringErrorAlert message={error} />

      <CurrentWorkOrderList
        workOrders={currentWorkOrders}
        selectedWorkOrderId={selectedWorkOrderId}
        loading={loading}
        onSelectWorkOrder={selectWorkOrder}
        onDeleteProcessMaster={deleteCurrentProcessMaster}
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
        />
      </section>
    </div>
  );
};

export default ProcessMonitoringPage;
