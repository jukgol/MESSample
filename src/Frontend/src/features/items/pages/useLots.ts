import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';
import type { LotDto, LotCreateDto, LotUpdateDto } from '../../../api/generated-api';

export const useLots = () => {
  const [lots, setLots] = useState<LotDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.api.getApi();
      if (Array.isArray(response.data)) {
        setLots(response.data);
      }
    } catch (err: any) {
      console.error('LOT 목록 조회 실패:', err);
      setError(err.response?.data?.message || 'LOT 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLot = async (dto: LotCreateDto) => {
    try {
      setError(null);
      await api.api.postApi(dto);
      await fetchLots();
      return true;
    } catch (err: any) {
      console.error('LOT 등록 실패:', err);
      setError(err.response?.data?.message || 'LOT을 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateLot = async (id: number, dto: LotUpdateDto) => {
    try {
      setError(null);
      await api.api.putApi(id, dto);
      await fetchLots();
      return true;
    } catch (err: any) {
      console.error('LOT 수정 실패:', err);
      setError(err.response?.data?.message || 'LOT 정보를 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteLot = async (id: number) => {
    try {
      setError(null);
      await api.api.deleteApi(id);
      await fetchLots();
      return true;
    } catch (err: any) {
      console.error('LOT 삭제 실패:', err);
      setError(err.response?.data?.message || 'LOT을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const generateDummyLots = async (count: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.api.lotDummyCreate({ count });
      await fetchLots();
      return true;
    } catch (err: any) {
      console.error('더미 LOT 생성 실패:', err);
      setError(err.response?.data?.message || '더미 LOT을 생성하는 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  return {
    lots,
    loading,
    error,
    fetchLots,
    createLot,
    updateLot,
    deleteLot,
    generateDummyLots
  };
};
