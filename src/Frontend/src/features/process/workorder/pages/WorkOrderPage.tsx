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
  const [orderQty, setOrderQty] = useState(10);
  const [message, setMessage] = useState('');
  const operatorName = currentUser?.userName || '';

  const selectedMaster = useMemo(() => {
    return masters.find((master) => master.processID === selectedMasterId) || null;
  }, [masters, selectedMasterId]);

  const handleRefresh = async () => {
    const nextMasters = await fetchMasters();

    if (!selectedMasterId && nextMasters.length > 0) {
      setSelectedMasterId(nextMasters[0].processID || null);
    }
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

    setMessage(result.isApproved ? `승인 완료: ${result.workOrderNo}` : '자재 부족으로 승인되지 않았습니다.');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
      <WorkOrderHeader />

      <WorkOrderErrorAlert message={error} />

      <WorkOrderActionBar
        onRefresh={handleRefresh}
        loading={loading}
      />

      <WorkOrderLayout
        top={
          <WorkOrderMasterList
            masters={masters}
            selectedMasterId={selectedMasterId}
            onSelectMaster={setSelectedMasterId}
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
            />
          </>
        }
        bottom={
          <>
            <WorkOrderApprovalPanel
              operatorName={operatorName}
              onApprove={handleApprove}
              disabled={approving || loading || !selectedMasterId}
            />
            <WorkOrderMessage message={message} />
          </>
        }
      />
    </div>
  );
};

export default WorkOrderPage;
