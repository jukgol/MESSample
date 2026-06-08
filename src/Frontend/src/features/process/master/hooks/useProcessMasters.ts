import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../api/client';

export interface ProcessMaster {
  processID: number;
  processCode: string;
  processName: string;
  description: string;
  createdAt?: string;
}

export interface ProcessMasterCreateDto {
  processCode: string;
  processName: string;
  description: string;
}

export interface ProcessMasterUpdateDto {
  processName: string;
  description: string;
}

export const useProcessMasters = () => {
  const [processMasters, setProcessMasters] = useState<ProcessMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcessMasters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/process-master');
      if (Array.isArray(response.data)) {
        const mapped = response.data.map((item: any) => ({
          processID: item.processID || item.processId,
          processCode: item.processCode,
          processName: item.processName,
          description: item.description || '-',
          createdAt: item.createdAt
        }));
        setProcessMasters(mapped);
      }
    } catch (err: any) {
      console.error('공정 마스터 목록 조회 실패:', err);
      setError('공정 마스터 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProcessMaster = async (dto: ProcessMasterCreateDto) => {
    try {
      setError(null);
      await apiClient.post('/api/process-master', dto);
      await fetchProcessMasters();
      return true;
    } catch (err: any) {
      console.error('공정 마스터 등록 실패:', err);
      setError(err.response?.data?.message || '공정 마스터를 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateProcessMaster = async (id: number, dto: ProcessMasterUpdateDto) => {
    try {
      setError(null);
      await apiClient.put(`/api/process-master/${id}`, dto);
      await fetchProcessMasters();
      return true;
    } catch (err: any) {
      console.error('공정 마스터 수정 실패:', err);
      setError(err.response?.data?.message || '공정 마스터를 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteProcessMaster = async (id: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/process-master/${id}`);
      await fetchProcessMasters();
      return true;
    } catch (err: any) {
      console.error('공정 마스터 삭제 실패:', err);
      setError(err.response?.data?.message || '공정 마스터를 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchProcessMasters();
  }, [fetchProcessMasters]);

  return {
    processMasters,
    loading,
    error,
    fetchProcessMasters,
    createProcessMaster,
    updateProcessMaster,
    deleteProcessMaster
  };
};
