import React, { useEffect, useMemo, useState } from 'react';
import WorkOrderActionBar from '../components/WorkOrderActionBar';
import WorkOrderApprovalPanel from '../components/WorkOrderApprovalPanel';
import WorkOrderConfigPanel from '../components/WorkOrderConfigPanel';
import WorkOrderErrorAlert from '../components/WorkOrderErrorAlert';
import WorkOrderHeader from '../components/WorkOrderHeader';
import WorkOrderLayout from '../components/WorkOrderLayout';
import WorkOrderMasterList from '../components/WorkOrderMasterList';
import WorkOrderMessage from '../components/WorkOrderMessage';
import WorkOrderStepGrid from '../components/WorkOrderStepGrid';
import WorkOrderTabs, { type WorkOrderTab } from '../components/WorkOrderTabs';
import { useWorkOrder } from '../hooks/useWorkOrder';
import { useAuthStore } from '../../../../store/useAuthStore';

const WorkOrderPage: React.FC = () => {
  const {
    masters,
    preview,
    loading,
    approving,
    error,
    fetchMasters,
    fetchPreview,
    approveWorkOrder
  } = useWorkOrder();
  const currentUser = useAuthStore((state) => state.user);

  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [orderQty, setOrderQty] = useState(10);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<WorkOrderTab>('issue');
  const operatorName = currentUser?.userName || '';

  const selectedMaster = useMemo(() => {
    return masters.find((master) => master.processID === selectedMasterId) || null;
  }, [masters, selectedMasterId]);

  const hasUnavailableStep = useMemo(() => {
    return (preview?.steps || []).some((step) => !step.isAvailable);
  }, [preview]);

  const canApprove = useMemo(() => {
    const steps = preview?.steps || [];
    return Boolean(selectedMasterId) && steps.length > 0 && !hasUnavailableStep;
  }, [hasUnavailableStep, preview, selectedMasterId]);

  const handleRefresh = async () => {
    const nextMasters = await fetchMasters();

    if (!selectedMasterId && nextMasters.length > 0) {
      setSelectedMasterId(nextMasters[0].processID || null);
    }
  };

  const handleSelectMaster = (id: number) => {
    setSelectedMasterId(id);
    setSelectedStepId(null);
    setMessage('');
  };

  const handleApprove = async () => {
    if (!selectedMasterId) {
      setMessage('공정 마스터를 선택하세요.');
      return;
    }

    if (!operatorName.trim()) {
      setMessage('로그인 사용자 정보를 확인할 수 없습니다.');
      return;
    }

    const result = await approveWorkOrder(selectedMasterId, orderQty, operatorName.trim());
    if (!result) return;

    setMessage(result.isApproved ? `공정이 진행중입니다. 작업지시: ${result.workOrderNo}` : '자재 부족으로 승인되지 않았습니다.');
    await fetchPreview(selectedMasterId, orderQty);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    if (selectedMasterId) {
      fetchPreview(selectedMasterId, orderQty);
    }
  }, [selectedMasterId, orderQty, fetchPreview]);

  useEffect(() => {
    const steps = preview?.steps || [];
    const hasSelectedStep = steps.some((step) => step.stepID === selectedStepId);

    if (!hasSelectedStep) {
      setSelectedStepId(null);
    }
  }, [preview, selectedStepId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
      <WorkOrderHeader />
      <WorkOrderErrorAlert message={error} />

      <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <WorkOrderTabs activeTab={activeTab} onChange={setActiveTab} />
        <div
          style={{
            border: '1px solid var(--border-color)',
            borderTop: 'none',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            background: 'var(--panel-bg)',
            padding: '1rem',
            minHeight: 0
          }}
        >
          {activeTab === 'issue' ? (
            <>
              <WorkOrderActionBar
                onRefresh={handleRefresh}
                loading={loading}
              />

              <WorkOrderLayout
                top={
                  <WorkOrderMasterList
                    masters={masters}
                    selectedMasterId={selectedMasterId}
                    onSelectMaster={handleSelectMaster}
                  />
                }
                middle={
                  <>
                    <WorkOrderConfigPanel
                      selectedMaster={selectedMaster}
                      orderQty={orderQty}
                      onOrderQtyChange={setOrderQty}
                    />
                    <WorkOrderStepGrid
                      steps={preview?.steps || []}
                      loading={loading}
                      selectedStepId={selectedStepId}
                      onSelectStep={(step) => setSelectedStepId(step.stepID || null)}
                    />
                  </>
                }
                bottom={
                  <>
                    <WorkOrderApprovalPanel
                      operatorName={operatorName}
                      onApprove={handleApprove}
                      disabled={approving || loading || !canApprove}
                    />
                    <WorkOrderMessage message={message} />
                  </>
                }
              />
            </>
          ) : (
            <section style={{ padding: '0.25rem', color: 'var(--text-secondary)' }}>
              작업 이력 화면은 다음 단계에서 연결합니다.
            </section>
          )}
        </div>
      </section>
    </div>
  );
};

export default WorkOrderPage;
