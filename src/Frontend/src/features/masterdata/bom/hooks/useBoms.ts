import { useState, useCallback } from 'react';
import apiClient from '../../../../api/client';

export interface Bom {
  bomID: number;
  parentItemID: number;
  parentItemName: string;
  childItemID: number;
  childItemName: string;
  bomQty: number;
  processStepID?: number | null;
  processStepName?: string;
}

export interface BomRecipeItem {
  itemID: number;
  itemCode: string;
  itemName: string;
  qty: number;
}

export interface BomRecipe {
  bomRecipeID: number;
  recipeCode: string;
  recipeName: string;
  processStepID?: number | null;
  processStepName?: string;
  createdAt: string;
  inputs: BomRecipeItem[];
  outputs: BomRecipeItem[];
}

export interface BomCreateDto {
  parentItemID: number;
  childItemID: number;
  bomQty: number;
  processStepID?: number | null;
}

export interface BomUpdateDto {
  bomQty: number;
  processStepID?: number | null;
}

export const useBoms = () => {
  const [boms, setBoms] = useState<Bom[]>([]);
  const [recipes, setRecipes] = useState<BomRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to map recipes list to flat boms list for backward compatibility
  const mapRecipesToBoms = (recipeList: BomRecipe[]): Bom[] => {
    const result: Bom[] = [];
    recipeList.forEach((recipe) => {
      const parentItem = recipe.outputs?.[0];
      const parentItemID = parentItem?.itemID || 0;
      const parentItemName = parentItem?.itemName || recipe.recipeName || '';

      (recipe.inputs || []).forEach((input) => {
        result.push({
          bomID: (recipe.bomRecipeID * 1000) + input.itemID, // unique mock ID
          parentItemID,
          parentItemName,
          childItemID: input.itemID,
          childItemName: input.itemName,
          bomQty: input.qty,
          processStepID: recipe.processStepID,
          processStepName: recipe.processStepName || ''
        });
      });
    });
    return result;
  };

  const fetchRecipeList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/bom/list');
      if (Array.isArray(response.data)) {
        const mappedRecipes: BomRecipe[] = response.data.map((recipe: any) => ({
          bomRecipeID: recipe.bomRecipeID || recipe.bomRecipeId,
          recipeCode: recipe.recipeCode || '',
          recipeName: recipe.recipeName || '',
          processStepID: recipe.processStepID || recipe.processStepId,
          processStepName: recipe.processStepName || '',
          createdAt: recipe.createdAt || '',
          inputs: (recipe.inputs || []).map((input: any) => ({
            itemID: input.itemID || input.itemId,
            itemCode: input.itemCode || '',
            itemName: input.itemName || '',
            qty: input.qty || 0
          })),
          outputs: (recipe.outputs || []).map((output: any) => ({
            itemID: output.itemID || output.itemId,
            itemCode: output.itemCode || '',
            itemName: output.itemName || '',
            qty: output.qty || 0
          }))
        }));
        setRecipes(mappedRecipes);
        
        // Also sync the boms state for compatibility
        setBoms(mapRecipesToBoms(mappedRecipes));
      } else {
        setRecipes([]);
        setBoms([]);
      }
    } catch (err: any) {
      console.error('BOM Recipe List 조회 실패:', err);
      setError('BOM 레시피 목록을 조회하는 중 오류가 발생했습니다.');
      setRecipes([]);
      setBoms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBomsByParent = useCallback(async (parentId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Instead of querying /api/bom/parent/{parentId} (which is deleted),
      // we filter the recipes from backend or local state.
      const response = await apiClient.get('/api/bom/list');
      if (Array.isArray(response.data)) {
        const mappedRecipes: BomRecipe[] = response.data.map((recipe: any) => ({
          bomRecipeID: recipe.bomRecipeID || recipe.bomRecipeId,
          recipeCode: recipe.recipeCode || '',
          recipeName: recipe.recipeName || '',
          processStepID: recipe.processStepID || recipe.processStepId,
          processStepName: recipe.processStepName || '',
          createdAt: recipe.createdAt || '',
          inputs: (recipe.inputs || []).map((input: any) => ({
            itemID: input.itemID || input.itemId,
            itemCode: input.itemCode || '',
            itemName: input.itemName || '',
            qty: input.qty || 0
          })),
          outputs: (recipe.outputs || []).map((output: any) => ({
            itemID: output.itemID || output.itemId,
            itemCode: output.itemCode || '',
            itemName: output.itemName || '',
            qty: output.qty || 0
          }))
        }));
        
        const flatBoms = mapRecipesToBoms(mappedRecipes);
        const filtered = flatBoms.filter(bom => bom.parentItemID === parentId);
        setBoms(filtered);
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

  const fetchBomsByStep = useCallback(async (stepId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/bom/list');
      if (Array.isArray(response.data)) {
        const mappedRecipes: BomRecipe[] = response.data.map((recipe: any) => ({
          bomRecipeID: recipe.bomRecipeID || recipe.bomRecipeId,
          recipeCode: recipe.recipeCode || '',
          recipeName: recipe.recipeName || '',
          processStepID: recipe.processStepID || recipe.processStepId,
          processStepName: recipe.processStepName || '',
          createdAt: recipe.createdAt || '',
          inputs: (recipe.inputs || []).map((input: any) => ({
            itemID: input.itemID || input.itemId,
            itemCode: input.itemCode || '',
            itemName: input.itemName || '',
            qty: input.qty || 0
          })),
          outputs: (recipe.outputs || []).map((output: any) => ({
            itemID: output.itemID || output.itemId,
            itemCode: output.itemCode || '',
            itemName: output.itemName || '',
            qty: output.qty || 0
          }))
        }));
        
        const flatBoms = mapRecipesToBoms(mappedRecipes);
        const filtered = flatBoms.filter(bom => bom.processStepID === stepId);
        setBoms(filtered);
        return filtered;
      }
      setBoms([]);
      return [];
    } catch (err: any) {
      console.error('공정 기준 BOM 목록 조회 실패:', err);
      setError('공정별 BOM 데이터를 조회하는 중 오류가 발생했습니다.');
      setBoms([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBoms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/bom/list');
      if (Array.isArray(response.data)) {
        const mappedRecipes: BomRecipe[] = response.data.map((recipe: any) => ({
          bomRecipeID: recipe.bomRecipeID || recipe.bomRecipeId,
          recipeCode: recipe.recipeCode || '',
          recipeName: recipe.recipeName || '',
          processStepID: recipe.processStepID || recipe.processStepId,
          processStepName: recipe.processStepName || '',
          createdAt: recipe.createdAt || '',
          inputs: (recipe.inputs || []).map((input: any) => ({
            itemID: input.itemID || input.itemId,
            itemCode: input.itemCode || '',
            itemName: input.itemName || '',
            qty: input.qty || 0
          })),
          outputs: (recipe.outputs || []).map((output: any) => ({
            itemID: output.itemID || output.itemId,
            itemCode: output.itemCode || '',
            itemName: output.itemName || '',
            qty: output.qty || 0
          }))
        }));
        return mapRecipesToBoms(mappedRecipes);
      }
      return [];
    } catch (err: any) {
      console.error('전체 BOM 목록 조회 실패:', err);
      setError('전체 BOM 데이터를 조회하는 중 오류가 발생했습니다.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBomProcess = async (bomId: number, processStepID: number | null) => {
    try {
      const recipeId = Math.floor(bomId / 1000);
      if (recipeId <= 0) return false;
      await apiClient.put(`/api/bom/${recipeId}/process`, { processStepId: processStepID });
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 공정 연동 실패:', err);
      setError(err.response?.data?.message || '공정 연동 중 오류가 발생했습니다.');
      return false;
    }
  };

  const createBom = async (dto: BomCreateDto) => {
    try {
      setError(null);
      
      // Fetch parent item code for naming recipeCode
      const itemsRes = await apiClient.get('/api/Item');
      const itemsList = Array.isArray(itemsRes.data) ? itemsRes.data : [];
      const parentItem = itemsList.find((item: any) => (item.itemID || item.itemId) === dto.parentItemID);
      
      const parentItemCode = parentItem?.itemCode || `ITEM_${dto.parentItemID}`;
      const parentItemName = parentItem?.itemName || `Product_${dto.parentItemID}`;

      // Map to BomRecipeCreateDto
      const recipeCreateDto = {
        recipeCode: `${parentItemCode}_RECIPE_${Date.now()}`,
        recipeName: parentItemName,
        processStepID: dto.processStepID ? Number(dto.processStepID) : null,
        outputs: [
          {
            itemID: Number(dto.parentItemID),
            qty: 1
          }
        ],
        inputs: [
          {
            itemID: Number(dto.childItemID),
            qty: Number(dto.bomQty)
          }
        ]
      };

      await apiClient.post('/api/bom', recipeCreateDto);
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('BOM 추가 실패:', err);
      setError(err.response?.data?.message || 'BOM 항목을 등록하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const createRecipe = async (dto: { recipeCode?: string; recipeName: string; processStepID?: number | null; outputItemID?: number | null }) => {
    try {
      setError(null);
      const recipeCreateDto: any = {
        recipeCode: dto.recipeCode?.trim() || `RECIPE_${Date.now()}`,
        recipeName: dto.recipeName.trim(),
        processStepID: dto.processStepID ? Number(dto.processStepID) : null,
        inputs: [],
        outputs: []
      };

      if (dto.outputItemID) {
        recipeCreateDto.outputs.push({
          itemID: Number(dto.outputItemID),
          qty: 1
        });
      }

      await apiClient.post('/api/bom', recipeCreateDto);
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('BOM 레시피 추가 실패:', err);
      setError(err.response?.data?.message || 'BOM 레시피를 생성하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateBom = async (id: number, parentId: number, dto: BomUpdateDto) => {
    // Legacy update (not supported in backend, mock client side success)
    console.log('updateBom mocked:', id, parentId, dto);
    return true;
  };

  const deleteBom = async (id: number, parentId: number) => {
    // Legacy delete (not supported in backend, mock client side success)
    console.log('deleteBom mocked:', id, parentId);
    return true;
  };

  const generateDummyBoms = async (parentId?: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post('/api/bom/dummy');
      await fetchRecipeList();
      if (parentId) {
        await fetchBomsByParent(parentId);
      }
      return true;
    } catch (err: any) {
      console.error('더미 BOM 생성 실패:', err);
      setError(err.response?.data?.message || '더미 BOM 데이터를 로드하는 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addRecipeInput = async (recipeId: number, itemId: number, qty: number) => {
    try {
      setError(null);
      await apiClient.post(`/api/bom/${recipeId}/input`, { itemId, qty });
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 입력 품목 추가 실패:', err);
      setError(err.response?.data?.message || '입력 품목을 추가하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const addRecipeOutput = async (recipeId: number, itemId: number, qty: number) => {
    try {
      setError(null);
      await apiClient.post(`/api/bom/${recipeId}/output`, { itemId, qty });
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 출력 품목 추가 실패:', err);
      setError(err.response?.data?.message || '출력 품목을 추가하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const removeRecipeInput = async (recipeId: number, itemId: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/bom/${recipeId}/input/${itemId}`);
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 입력 품목 삭제 실패:', err);
      setError(err.response?.data?.message || '입력 품목을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const removeRecipeOutput = async (recipeId: number, itemId: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/bom/${recipeId}/output/${itemId}`);
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 출력 품목 삭제 실패:', err);
      setError(err.response?.data?.message || '출력 품목을 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateRecipeInputQty = async (recipeId: number, itemId: number, qty: number) => {
    try {
      setError(null);
      await apiClient.put(`/api/bom/${recipeId}/input/${itemId}`, { qty });
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 입력 품목 수량 수정 실패:', err);
      setError(err.response?.data?.message || '수량을 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateRecipeOutputQty = async (recipeId: number, itemId: number, qty: number) => {
    try {
      setError(null);
      await apiClient.put(`/api/bom/${recipeId}/output/${itemId}`, { qty });
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 출력 품목 수량 수정 실패:', err);
      setError(err.response?.data?.message || '수량을 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    try {
      setError(null);
      await apiClient.delete(`/api/bom/${recipeId}`);
      await fetchRecipeList();
      return true;
    } catch (err: any) {
      console.error('레시피 삭제 실패:', err);
      setError(err.response?.data?.message || '레시피를 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  return {
    boms,
    recipes,
    loading,
    error,
    fetchBomsByParent,
    fetchBomsByStep,
    fetchAllBoms,
    fetchRecipeList,
    updateBomProcess,
    createBom,
    createRecipe,
    updateBom,
    deleteBom,
    generateDummyBoms,
    addRecipeInput,
    addRecipeOutput,
    removeRecipeInput,
    removeRecipeOutput,
    updateRecipeInputQty,
    updateRecipeOutputQty,
    deleteRecipe
  };
};
