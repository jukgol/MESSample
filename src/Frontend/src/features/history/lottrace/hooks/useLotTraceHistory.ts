import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { LotTraceHistoryDto, LotDto } from '../../../../api/data-contracts';

export const useLotTraceHistory = () => {
  const [traceList, setTraceList] = useState<LotTraceHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTraces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get all lots
      const lotsRes = await api.api.getLot();
      const lotList = lotsRes.data || [];

      if (lotList.length === 0) {
        setTraceList([]);
        return;
      }

      // 2. Fetch traces for all lots in parallel
      const promises = lotList.map((lot: LotDto) =>
        api.api.historyLotsTraceList(lot.lotID!)
          .then((res: any) => res.data || [])
          .catch(() => [] as LotTraceHistoryDto[])
      );

      const results = await Promise.all(promises);
      const merged = results.flat();

      // 3. Deduplicate traces based on parentLotNo and childLotNo and relationType
      const seen = new Set();
      const unique = merged.filter(item => {
        const key = `${item.parentLotNo || ''}-${item.childLotNo || ''}-${item.relationType || ''}-${item.traceDepth}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setTraceList(unique);
    } catch (err: any) {
      console.error('Failed to fetch lot traces:', err);
      setError('LOT 추적 정보를 불러오는 중 오류가 발생했습니다.');
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
