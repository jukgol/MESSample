import { useState, useEffect } from 'react';
import apiClient from '../../../api/client';

export interface Item {
  id: string | number;
  name: string;
  spec: string;
  category: string;
  stock: number;
  unit: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // 전용 ItemController를 통해 데이터 조회
      const response = await apiClient.get('/api/Item');

      if (Array.isArray(response.data)) {
        // 백엔드의 camelCase 필드명을 프론트엔드 형식으로 매핑
        const mappedItems = response.data.map((item: any) => ({
          id: item.itemId,
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
  };

  return {
    items,
    loading,
    error,
    fetchItems
  };
};
