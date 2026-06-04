import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../api/client';

export interface ItemType {
  itemTypeID: number;
  typeName: string;
}

export interface ItemTypeCreateDto {
  typeName: string;
}

export interface ItemTypeUpdateDto {
  typeName: string;
}

export const useItemTypes = () => {
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/ItemType');
      if (Array.isArray(response.data)) {
        // 백엔드의 필드명(itemTypeID, typeName) 매핑 및 검증
        const mappedTypes = response.data.map((item: any) => ({
          itemTypeID: item.itemTypeID ?? item.itemTypeId ?? item.itemtypeid,
          typeName: item.typeName || item.typename || ''
        }));
        setItemTypes(mappedTypes);
      }
    } catch (err: any) {
      console.error('품목 유형 목록 조회 실패:', err);
      setError('품목 유형 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItemType = async (dto: ItemTypeCreateDto) => {
    try {
      setError(null);
      await apiClient.post('/api/ItemType', dto);
      await fetchItemTypes();
      return true;
    } catch (err: any) {
      console.error('품목 유형 등록 실패:', err);
      setError(err.response?.data?.message || '품목 유형을 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateItemType = async (id: number, dto: ItemTypeUpdateDto) => {
    try {
      setError(null);
      await apiClient.put(`/api/ItemType/${id}`, dto);
      await fetchItemTypes();
      return true;
    } catch (err: any) {
      console.error('품목 유형 수정 실패:', err);
      setError(err.response?.data?.message || '품목 유형을 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteItemType = async (id: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/ItemType/${id}`);
      await fetchItemTypes();
      return true;
    } catch (err: any) {
      console.error('품목 유형 삭제 실패:', err);
      setError(err.response?.data?.message || '품목 유형을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchItemTypes();
  }, [fetchItemTypes]);

  return {
    itemTypes,
    loading,
    error,
    fetchItemTypes,
    createItemType,
    updateItemType,
    deleteItemType
  };
};
