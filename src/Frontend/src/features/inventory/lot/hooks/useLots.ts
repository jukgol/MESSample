import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../api/client';

export interface LotDto {
  lotID: number;
  itemID: number;
  itemName: string;
  lotNo: string;
  qty: number;
  currentQty: number;
  receivedAt: string;
  status: string;
}

export interface LotCreateDto {
  itemID: number;
  lotNo: string;
  qty: number;
  status: string;
}

export interface LotUpdateDto {
  qty: number;
  status: string;
}

export const useLots = () => {
  const [lots, setLots] = useState<LotDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/Lot');
      if (Array.isArray(response.data)) {
        const mappedLots = response.data.map((lot: any) => ({
          lotID: lot.lotID || lot.lotId,
          itemID: lot.itemID || lot.itemId,
          itemName: lot.itemName,
          lotNo: lot.lotNo,
          qty: lot.qty,
          currentQty: lot.currentQty !== undefined ? lot.currentQty : lot.qty,
          receivedAt: lot.receivedAt,
          status: lot.status
        }));
        setLots(mappedLots);
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
      await apiClient.post('/api/Lot', {
        itemID: dto.itemID,
        lotNo: dto.lotNo,
        qty: dto.qty,
        status: dto.status
      });
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
      await apiClient.put(`/api/Lot/${id}`, {
        qty: dto.qty,
        status: dto.status
      });
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
      await apiClient.delete(`/api/Lot/${id}`);
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
      await apiClient.post(`/api/Lot/dummy?count=${count}`);
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

  const deleteAllLots = async (lotsToDelete: LotDto[]) => {
    try {
      setLoading(true);
      setError(null);
      for (const lot of lotsToDelete) {
        if (lot.lotID !== undefined) {
          await apiClient.delete(`/api/Lot/${lot.lotID}`);
        }
      }
      await fetchLots();
      return true;
    } catch (err: any) {
      console.error('전체 LOT 삭제 실패:', err);
      setError(err.response?.data?.message || 'LOT을 삭제하는 중 오류가 발생했습니다.');
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
    generateDummyLots,
    deleteAllLots
  };
};
