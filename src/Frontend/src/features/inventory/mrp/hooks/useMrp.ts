import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { ProcessMaster } from '../../../masterdata/master/hooks/useProcessMasters';

export interface MrpItemDetail {
  bomID: number;
  childItemID: number;
  childItemName: string;
  unitQty: number;
  requiredQty: number;
  currentStock: number;
  shortage: number;
  hasLotStock: boolean;
  isSufficient: boolean;
}

export interface MrpStepDetail {
  stepID: number;
  stepName: string;
  seqNo: number;
  stepType: string;
  recipeID?: number | null;
  items: MrpItemDetail[];
}

interface MrpSummary {
  totalItemsCount: number;
  shortageItemsCount: number;
  missingRecipeStepsCount: number;
  missingLotItemsCount: number;
  isFeasible: boolean;
}

interface MrpSimulationResponse {
  summary?: {
    totalItemsCount?: number;
    TotalItemsCount?: number;
    shortageItemsCount?: number;
    ShortageItemsCount?: number;
    missingRecipeStepsCount?: number;
    MissingRecipeStepsCount?: number;
    missingLotItemsCount?: number;
    MissingLotItemsCount?: number;
    isFeasible?: boolean;
    IsFeasible?: boolean;
  };
  Summary?: MrpSimulationResponse['summary'];
  steps?: MrpStepDetail[];
  Steps?: MrpStepDetail[];
}

const emptySummary: MrpSummary = {
  totalItemsCount: 0,
  shortageItemsCount: 0,
  missingRecipeStepsCount: 0,
  missingLotItemsCount: 0,
  isFeasible: true
};

const mapProcessMaster = (item: any): ProcessMaster => ({
  processID: item.processID || item.processId || item.ProcessID,
  processCode: item.processCode || item.ProcessCode,
  processName: item.processName || item.ProcessName,
  description: item.description || item.Description || '-',
  createdAt: item.createdAt || item.CreatedAt
});

const mapMrpDetails = (steps: any[] | undefined): MrpStepDetail[] => {
  if (!Array.isArray(steps)) return [];

  return steps.map(step => ({
    stepID: step.stepID || step.stepId || step.StepID,
    stepName: step.stepName || step.StepName,
    seqNo: step.seqNo || step.SeqNo,
    stepType: step.stepType || step.StepType,
    recipeID: step.recipeID !== undefined ? step.recipeID : step.RecipeID,
    items: Array.isArray(step.items || step.Items)
      ? (step.items || step.Items).map((item: any) => ({
        bomID: item.bomID || item.bomId || item.BomID,
        childItemID: item.childItemID || item.childItemId || item.ChildItemID,
        childItemName: item.childItemName || item.ChildItemName,
        unitQty: item.unitQty || item.UnitQty,
        requiredQty: item.requiredQty || item.RequiredQty,
        currentStock: item.currentStock || item.CurrentStock || 0,
        shortage: item.shortage || item.Shortage || 0,
        hasLotStock: item.hasLotStock ?? item.HasLotStock ?? true,
        isSufficient: item.isSufficient ?? item.IsSufficient ?? false
      }))
      : []
  }));
};

const mapSummary = (summary: MrpSimulationResponse['summary']): MrpSummary => {
  if (!summary) return emptySummary;

  return {
    totalItemsCount: summary.totalItemsCount ?? summary.TotalItemsCount ?? 0,
    shortageItemsCount: summary.shortageItemsCount ?? summary.ShortageItemsCount ?? 0,
    missingRecipeStepsCount: summary.missingRecipeStepsCount ?? summary.MissingRecipeStepsCount ?? 0,
    missingLotItemsCount: summary.missingLotItemsCount ?? summary.MissingLotItemsCount ?? 0,
    isFeasible: summary.isFeasible ?? summary.IsFeasible ?? true
  };
};

export const useMrp = () => {
  const [processMasters, setProcessMasters] = useState<ProcessMaster[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<ProcessMaster | null>(null);
  const [targetQty, setTargetQty] = useState<number>(100);
  const [mrpDetails, setMrpDetails] = useState<MrpStepDetail[]>([]);
  const [summary, setSummary] = useState<MrpSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProcessMasters = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.api.mrpMastersList();
      setProcessMasters(Array.isArray(response.data) ? response.data.map(mapProcessMaster) : []);
    } catch (err) {
      console.error('MRP 공정 마스터 목록 조회 실패:', err);
      setProcessMasters([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSimulation = useCallback(async () => {
    if (!selectedMaster) {
      setMrpDetails([]);
      setSummary(emptySummary);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.api.mrpSimulationCreate({
        processMasterID: selectedMaster.processID,
        targetQty
      });

      const data = response.data;

      setSummary(mapSummary(data.summary || data.Summary));
      setMrpDetails(mapMrpDetails(data.steps || data.Steps));
    } catch (err) {
      console.error('MRP 시뮬레이션 조회 실패:', err);
      setMrpDetails([]);
      setSummary(emptySummary);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMaster, targetQty]);

  useEffect(() => {
    fetchProcessMasters();
  }, [fetchProcessMasters]);

  useEffect(() => {
    fetchSimulation();
  }, [fetchSimulation]);

  const handleRefresh = useCallback(async () => {
    await fetchProcessMasters();
    await fetchSimulation();
  }, [fetchProcessMasters, fetchSimulation]);

  return {
    processMasters,
    selectedMaster,
    setSelectedMaster,
    targetQty,
    setTargetQty,
    mrpDetails,
    summary,
    isLoading,
    handleRefresh
  };
};
