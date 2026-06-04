import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../api/client';

export interface Item {
  id: string | number;
  name: string;
  spec: string;
  category: string;
  stock: number;
  unit: string;
}

export interface ItemCreateDto {
  itemName: string;
  itemType: string;
  unit: string;
  description: string;
}

export interface ItemUpdateDto {
  itemName: string;
  itemType: string;
  unit: string;
  description: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 전용 ItemController를 통해 데이터 조회
      const response = await apiClient.get('/api/Item');

      if (Array.isArray(response.data)) {
        // 백엔드의 camelCase 필드명을 프론트엔드 형식으로 매핑
        const mappedItems = response.data.map((item: any) => ({
          id: item.itemID || item.itemId,
          name: item.itemName,
          spec: item.description || '-',
          category: item.itemType || 'N/A',
          stock: 0,
          unit: item.unit || 'EA'
        }));
        setItems(mappedItems);
      }
    } catch (err: any) {
      console.error('품목 리스트 조회 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (dto: ItemCreateDto) => {
    try {
      setError(null);
      await apiClient.post('/api/Item', dto);
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('품목 등록 실패:', err);
      setError(err.response?.data?.message || '품목을 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateItem = async (id: number | string, dto: ItemUpdateDto) => {
    try {
      setError(null);
      await apiClient.put(`/api/Item/${id}`, dto);
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('품목 수정 실패:', err);
      setError(err.response?.data?.message || '품목 정보를 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteItem = async (id: number | string) => {
    try {
      setError(null);
      await apiClient.delete(`/api/Item/${id}`);
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('품목 삭제 실패:', err);
      setError(err.response?.data?.message || '품목을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const generateDummyItems = async (count: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`/api/Item/dummy?count=${count}`);
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('더미 품목 생성 실패:', err);
      setError(err.response?.data?.message || '더미 품목을 생성하는 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    generateDummyItems
  };
};
