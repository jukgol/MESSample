import { useCallback, useState } from 'react';
import type { AxiosError } from 'axios';
import { api } from '../../../../api/client';
import type {
  ProcessMasterDto,
  WorkOrderCreateResultDto,
  WorkOrderHistoryDto,
  WorkOrderPreviewDto
} from '../../../../api/data-contracts';

export const useWorkOrder = () => {
  const [masters, setMasters] = useState<ProcessMasterDto[]>([]);
  const [history, setHistory] = useState<WorkOrderHistoryDto[]>([]);
  const [preview, setPreview] = useState<WorkOrderPreviewDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMasters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.api.workOrderMastersList();
      const nextMasters = response.data || [];
      setMasters(nextMasters);
      return nextMasters;
    } catch (err) {
      console.error('Work order masters load failed:', err);
      setError('공정 마스터를 불러오지 못했습니다.');
      setMasters([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      const response = await api.api.workOrderHistoryList();
      const nextHistory = response.data || [];
      setHistory(nextHistory);
      return nextHistory;
    } catch (err) {
      console.error('Work order history load failed:', err);
      setError('작업 이력을 불러오지 못했습니다.');
      setHistory([]);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchPreview = useCallback(async (processMasterID: number, orderQty: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.api.workOrderPreviewCreate({
        processMasterID,
        orderQty
      });
      setPreview(response.data || null);
      return response.data || null;
    } catch (err) {
      console.error('Work order preview failed:', err);
      setError('작업 가능 여부를 확인하지 못했습니다.');
      setPreview(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveWorkOrder = useCallback(async (
    processMasterID: number,
    orderQty: number,
    workerName: string
  ): Promise<WorkOrderCreateResultDto | null> => {
    try {
      setApproving(true);
      setError(null);
      const response = await api.api.workOrderApproveCreate({
        processMasterID,
        orderQty,
        workerName
      });
      return response.data || null;
    } catch (err) {
      console.error('Work order approval failed:', err);
      const axiosError = err as AxiosError<{ message?: string; Message?: string }>;
      const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.Message;
      setError(serverMessage || '작업지시 승인에 실패했습니다.');
      return null;
    } finally {
      setApproving(false);
    }
  }, []);

  return {
    masters,
    history,
    preview,
    loading,
    historyLoading,
    approving,
    error,
    fetchMasters,
    fetchHistory,
    fetchPreview,
    approveWorkOrder
  };
};
