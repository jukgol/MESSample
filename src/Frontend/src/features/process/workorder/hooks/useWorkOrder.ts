import { useCallback, useState } from 'react';
import { api } from '../../../../api/client';
import type {
  ProcessMasterDto,
  WorkOrderCreateResultDto,
  WorkOrderPreviewDto
} from '../../../../api/data-contracts';

export const useWorkOrder = () => {
  const [masters, setMasters] = useState<ProcessMasterDto[]>([]);
  const [preview, setPreview] = useState<WorkOrderPreviewDto | null>(null);
  const [loading, setLoading] = useState(false);
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
      setError('작업지시 승인에 실패했습니다.');
      return null;
    } finally {
      setApproving(false);
    }
  }, []);

  return {
    masters,
    preview,
    loading,
    approving,
    error,
    fetchMasters,
    fetchPreview,
    approveWorkOrder
  };
};
