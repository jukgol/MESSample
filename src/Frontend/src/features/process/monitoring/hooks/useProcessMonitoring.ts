import { useCallback, useMemo, useState, useEffect } from 'react';
import { api } from '../../../../api/client';
import type { CurrentWorkOrderStateDto } from '../../../../api/data-contracts';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuthStore } from '../../../../store/useAuthStore';

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

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl('/hubs/process-monitoring', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on('PlcEquipmentStateChanged', (data: any) => {
      console.log('실시간 장비 상태 변경 수신:', data);
      const rawEqId = data.equipmentID || data.EquipmentID || data.equipmentId;
      const rawState = data.state || data.State;
      
      if (!rawEqId) return;
      const targetEqId = String(rawEqId).trim().toUpperCase();
      const isStarted = String(rawState).toUpperCase() === 'STARTED';

      setCurrentWorkOrders((prevWorkOrders) => {
        return prevWorkOrders.map((workOrder) => {
          const hasTargetStep = workOrder.steps?.some(
            step => step.equipmentID && step.equipmentID.trim().toUpperCase() === targetEqId
          );
          if (!hasTargetStep) return workOrder;

          return {
            ...workOrder,
            steps: workOrder.steps?.map((step) => {
              if (step.equipmentID && step.equipmentID.trim().toUpperCase() === targetEqId) {
                return {
                  ...step,
                  status: isStarted ? 'RUNNING' : 'PAUSED'
                };
              }
              return step;
            })
          };
        });
      });
    });

    connection.start()
      .then(() => console.log('SignalR Hub Connected!'))
      .catch((err) => console.error('SignalR Hub Connection Error:', err));

    return () => {
      connection.stop();
    };
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
