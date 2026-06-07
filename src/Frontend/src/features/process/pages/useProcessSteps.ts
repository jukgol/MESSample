import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/client';

export interface ProcessStep {
  stepID: number;
  stepName: string;
  seqNo: number;
  stepType: string;
  description: string;
  createdAt?: string;
}

export interface ProcessStepCreateDto {
  stepName: string;
  seqNo: number;
  stepType: string;
  description: string;
}

export interface ProcessStepUpdateDto {
  stepName: string;
  seqNo: number;
  stepType: string;
  description: string;
}

export const useProcessSteps = () => {
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcessSteps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/process-step');

      if (Array.isArray(response.data)) {
        // 백엔드의 PascalCase/camelCase에 맞춰 매핑
        const mappedSteps = response.data.map((step: any) => ({
          stepID: step.stepID || step.stepId,
          stepName: step.stepName,
          seqNo: step.seqNo,
          stepType: step.stepType,
          description: step.description || '-',
          createdAt: step.createdAt
        }));
        setProcessSteps(mappedSteps);
      }
    } catch (err: any) {
      console.error('공정 단계 리스트 조회 실패:', err);
      setError('공정 단계 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProcessStep = async (dto: ProcessStepCreateDto) => {
    try {
      setError(null);
      await apiClient.post('/api/process-step', dto);
      await fetchProcessSteps();
      return true;
    } catch (err: any) {
      console.error('공정 단계 등록 실패:', err);
      setError(err.response?.data?.message || '공정 단계를 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateProcessStep = async (id: number, dto: ProcessStepUpdateDto) => {
    try {
      setError(null);
      await apiClient.put(`/api/process-step/${id}`, dto);
      await fetchProcessSteps();
      return true;
    } catch (err: any) {
      console.error('공정 단계 수정 실패:', err);
      setError(err.response?.data?.message || '공정 단계 정보를 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteProcessStep = async (id: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/process-step/${id}`);
      await fetchProcessSteps();
      return true;
    } catch (err: any) {
      console.error('공정 단계 삭제 실패:', err);
      setError(err.response?.data?.message || '공정 단계를 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const generateDummyProcessSteps = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post('/api/process-step/dummy');
      await fetchProcessSteps();
      return true;
    } catch (err: any) {
      console.error('공정 시나리오 생성 실패:', err);
      setError(err.response?.data?.message || '공정 시나리오 데이터를 생성하는 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessSteps();
  }, [fetchProcessSteps]);

  return {
    processSteps,
    loading,
    error,
    fetchProcessSteps,
    createProcessStep,
    updateProcessStep,
    deleteProcessStep,
    generateDummyProcessSteps
  };
};
