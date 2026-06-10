import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../../api/client';
import type { CurrentWorkOrderStateDto } from '../../../../api/data-contracts';

export const useProcessMonitoring = () => {
  const [currentWorkOrders, setCurrentWorkOrders] = useState<CurrentWorkOrderStateDto[]>([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWorkOrder = useMemo(() => {
    return currentWorkOrders.find((workOrder) => workOrder.workOrderID === selectedWorkOrderId) || null;
  }, [currentWorkOrders, selectedWorkOrderId]);

  const fetchCurrentWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.api.processMonitoringCurrentList();
      const nextWorkOrders = (response.data || []) as CurrentWorkOrderStateDto[];

      setCurrentWorkOrders(nextWorkOrders);
      setSelectedWorkOrderId((prev) => {
        if (prev && nextWorkOrders.some((workOrder) => workOrder.workOrderID === prev)) {
          return prev;
        }

        return nextWorkOrders[0]?.workOrderID || null;
      });

      return nextWorkOrders;
    } catch (err) {
      console.error('Process monitoring current state load failed:', err);
      setError('현재 공정 모니터링 상태를 불러오지 못했습니다.');
      setCurrentWorkOrders([]);
      setSelectedWorkOrderId(null);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const selectWorkOrder = useCallback((workOrderId: number) => {
    setSelectedWorkOrderId(workOrderId);
  }, []);

  return {
    currentWorkOrders,
    selectedWorkOrder,
    selectedWorkOrderId,
    loading,
    error,
    fetchCurrentWorkOrders,
    selectWorkOrder
  };
};
