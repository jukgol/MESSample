import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { LotStockHistoryDto } from '../../../../api/data-contracts';

export const useLotTraceHistory = () => {
  const [traceList, setTraceList] = useState<LotStockHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTraces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.api.historyLotStockList();
      setTraceList(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch lot stock history:', err);
      setError('LOT 재고 변동 이력을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTraces();
  }, [fetchAllTraces]);

  return {
    traceList,
    loading,
    error,
    fetchAllTraces,
  };
};
