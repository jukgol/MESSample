import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { WorkOrderHistoryDto } from '../../../../api/data-contracts';

export const useWorkOrderHistory = () => {
  const [historyList, setHistoryList] = useState<WorkOrderHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.api.historyWorkOrdersList();
      setHistoryList(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch work order history:', err);
      setError('작업지시 이력을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    historyList,
    loading,
    error,
    fetchHistory,
  };
};
