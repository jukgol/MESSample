import type { ProcessMaster } from '../../../../masterdata/master/hooks/useProcessMasters';
import type { MrpStepDetail } from '../../hooks/useMrp';

export interface MrpSummary {
  totalItemsCount: number;
  shortageItemsCount: number;
  missingRecipeStepsCount: number;
  missingLotItemsCount: number;
  isFeasible: boolean;
}

export interface MrpSimulationTableProps {
  selectedMaster: ProcessMaster | null;
  targetQty: number;
  onTargetQtyChange: (qty: number) => void;
  mrpDetails: MrpStepDetail[];
  summary: MrpSummary;
  loading: boolean;
}
