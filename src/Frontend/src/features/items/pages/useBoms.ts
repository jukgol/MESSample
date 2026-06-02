import { useState, useCallback } from 'react';
import apiClient from '../../../api/client';

export interface Bom {
  bomID: number;
  parentItemID: number;
  parentItemName: string;
  childItemID: number;
  childItemName: string;
  bomQty: number;
}

export interface BomCreateDto {
  parentItemID: number;
  childItemID: number;
  bomQty: number;
}

export interface BomUpdateDto {
  bomQty: number;
}

export const useBoms = () => {
  const [boms, setBoms] = useState<Bom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBomsByParent = useCallback(async (parentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/bom/parent/${parentId}`);
      if (Array.isArray(response.data)) {
        // 백엔드의 PascalCase/camelCase 속성을 매핑
        const mappedBoms = response.data.map((item: any) => ({
          bomID: item.bomID || item.bomId,
          parentItemID: item.parentItemID || item.parentItemId,
          parentItemName: item.parentItemName || '',
          childItemID: item.childItemID || item.childItemId,
          childItemName: item.childItemName || '',
          bomQty: item.bomQty !== undefined ? item.bomQty : item.quantity
        }));
        setBoms(mappedBoms);
      } else {
        setBoms([]);
      }
    } catch (err: any) {
      console.error('BOM 목록 조회 실패:', err);
      setError('BOM 데이터를 조회하는 중 오류가 발생했습니다.');
      setBoms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBom = async (dto: BomCreateDto) => {
    try {
      setError(null);
      await apiClient.post('/api/bom', {
        parentItemID: Number(dto.parentItemID),
        childItemID: Number(dto.childItemID),
        bomQty: Number(dto.bomQty)
      });
      await fetchBomsByParent(dto.parentItemID);
      return true;
    } catch (err: any) {
      console.error('BOM 추가 실패:', err);
      setError(err.response?.data?.message || 'BOM 항목을 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateBom = async (id: number, parentId: number, dto: BomUpdateDto) => {
    try {
      setError(null);
      await apiClient.put(`/api/bom/${id}`, {
        bomQty: Number(dto.bomQty)
      });
      await fetchBomsByParent(parentId);
      return true;
    } catch (err: any) {
      console.error('BOM 수정 실패:', err);
      setError(err.response?.data?.message || 'BOM 항목을 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteBom = async (id: number, parentId: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/bom/${id}`);
      await fetchBomsByParent(parentId);
      return true;
    } catch (err: any) {
      console.error('BOM 삭제 실패:', err);
      setError(err.response?.data?.message || 'BOM 항목을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  return {
    boms,
    loading,
    error,
    fetchBomsByParent,
    createBom,
    updateBom,
    deleteBom
  };
};
