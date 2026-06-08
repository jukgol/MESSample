import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProcessMasters } from '../../../masterdata/master/hooks/useProcessMasters';
import type { ProcessMaster } from '../../../masterdata/master/hooks/useProcessMasters';
import { useProcessSteps } from '../../../masterdata/step/hooks/useProcessSteps';
import type { ProcessStep } from '../../../masterdata/step/hooks/useProcessSteps';
import { useBoms } from '../../../masterdata/bom/hooks/useBoms';
import type { Bom } from '../../../masterdata/bom/hooks/useBoms';
import { useLots } from '../../lot/hooks/useLots';

export interface MrpItemDetail {
  bomID: number;
  childItemID: number;
  childItemName: string;
  unitQty: number;
  requiredQty: number;
  currentStock: number;
  shortage: number;
  isSufficient: boolean;
}

export interface MrpStepDetail {
  stepID: number;
  stepName: string;
  seqNo: number;
  stepType: string;
  items: MrpItemDetail[];
}

export const useMrp = () => {
  const { processMasters, loading: mastersLoading, fetchProcessMasters } = useProcessMasters();
  const { processSteps, loading: stepsLoading, fetchProcessSteps } = useProcessSteps();
  const { fetchBomsByStep, loading: bomsLoading } = useBoms();
  const { lots, loading: lotsLoading, fetchLots } = useLots();

  // State
  const [selectedMaster, setSelectedMaster] = useState<ProcessMaster | null>(null);
  const [targetQty, setTargetQty] = useState<number>(100);
  const [stepBomsMap, setStepBomsMap] = useState<Record<number, Bom[]>>({});
  const [fetchingBoms, setFetchingBoms] = useState(false);

  // Steps assigned to the selected process master
  const assignedSteps = useMemo(() => {
    if (!selectedMaster) return [];
    return processSteps
      .filter(step => step.processMasterID === selectedMaster.processID)
      .sort((a, b) => a.seqNo - b.seqNo);
  }, [processSteps, selectedMaster]);

  // Load BOMs for all steps in the selected master
  const loadBomsForSelectedMaster = useCallback(async (steps: ProcessStep[]) => {
    if (steps.length === 0) {
      setStepBomsMap({});
      return;
    }

    try {
      setFetchingBoms(true);
      const newMap: Record<number, Bom[]> = {};

      // Fetch BOMs for each step in parallel
      await Promise.all(
        steps.map(async (step) => {
          const data = await fetchBomsByStep(step.stepID);
          newMap[step.stepID] = data || [];
        })
      );

      setStepBomsMap(newMap);
    } catch (err) {
      console.error('공정별 BOM 로딩 실패:', err);
    } finally {
      setFetchingBoms(false);
    }
  }, [fetchBomsByStep]);

  useEffect(() => {
    loadBomsForSelectedMaster(assignedSteps);
  }, [selectedMaster, assignedSteps, loadBomsForSelectedMaster]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchProcessMasters(),
      fetchProcessSteps(),
      fetchLots()
    ]);
    if (selectedMaster && assignedSteps.length > 0) {
      await loadBomsForSelectedMaster(assignedSteps);
    }
  }, [fetchProcessMasters, fetchProcessSteps, fetchLots, selectedMaster, assignedSteps, loadBomsForSelectedMaster]);

  // Aggregate current stock by Item ID from LOTs
  const stockByItemId = useMemo(() => {
    const map: Record<number, number> = {};
    lots.forEach(lot => {
      const id = lot.itemID;
      map[id] = (map[id] || 0) + lot.qty;
    });
    return map;
  }, [lots]);

  // Compute MRP calculation details per step
  const mrpDetails = useMemo<MrpStepDetail[]>(() => {
    if (!selectedMaster || assignedSteps.length === 0) return [];

    return assignedSteps.map(step => {
      const stepBoms = stepBomsMap[step.stepID] || [];

      const items = stepBoms.map(bom => {
        const requiredQty = bom.bomQty * targetQty;
        const currentStock = stockByItemId[bom.childItemID] || 0;
        const shortage = Math.max(0, requiredQty - currentStock);
        const isSufficient = currentStock >= requiredQty;

        return {
          bomID: bom.bomID,
          childItemID: bom.childItemID,
          childItemName: bom.childItemName,
          unitQty: bom.bomQty,
          requiredQty,
          currentStock,
          shortage,
          isSufficient
        };
      });

      return {
        stepID: step.stepID,
        stepName: step.stepName,
        seqNo: step.seqNo,
        stepType: step.stepType,
        items
      };
    });
  }, [selectedMaster, assignedSteps, stepBomsMap, targetQty, stockByItemId]);

  // Compute overall calculation summary
  const summary = useMemo(() => {
    let totalItemsCount = 0;
    let shortageItemsCount = 0;

    mrpDetails.forEach(step => {
      step.items.forEach(item => {
        totalItemsCount++;
        if (!item.isSufficient) {
          shortageItemsCount++;
        }
      });
    });

    const isFeasible = shortageItemsCount === 0;

    return {
      totalItemsCount,
      shortageItemsCount,
      isFeasible
    };
  }, [mrpDetails]);

  const isLoading = mastersLoading || stepsLoading || bomsLoading || lotsLoading || fetchingBoms;

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
