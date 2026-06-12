import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { LotRelationHistoryDto } from '../../../../api/data-contracts';

export const useLotRelationHistory = () => {
  const [relations, setRelations] = useState<LotRelationHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.api.historyLotRelationsList();
      setRelations(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch lot relations:', err);
      setError('LOT 관계 이력을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);

  return {
    relations,
    loading,
    error,
    fetchRelations,
  };
};
