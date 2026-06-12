using System.Collections.Generic;

namespace Shared.Models.App
{
    public class MrpSimulationRequestDto
    {
        public int ProcessMasterID { get; set; }
        public int TargetQty { get; set; }
    }

    public class MrpSimulationResultDto
    {
        public MrpSummaryDto Summary { get; set; } = new();
        public List<MrpStepDetailDto> Steps { get; set; } = new();
    }

    public class MrpSummaryDto
    {
        public int TotalItemsCount { get; set; }
        public int ShortageItemsCount { get; set; }
        public int MissingRecipeStepsCount { get; set; }
        public int MissingLotItemsCount { get; set; }
        public bool IsFeasible { get; set; }
    }

    public class MrpStepDetailDto
    {
        public int StepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string StepType { get; set; } = string.Empty;
        public int? RecipeID { get; set; }
        public List<MrpItemDetailDto> Items { get; set; } = new();
    }

    public class MrpItemDetailDto
    {
        public int BomID { get; set; }
        public int ChildItemID { get; set; }
        public string ChildItemName { get; set; } = string.Empty;
        public int UnitQty { get; set; }
        public int RequiredQty { get; set; }
        public int CurrentStock { get; set; }
        public int Shortage { get; set; }
        public bool HasLotStock { get; set; }
        public bool IsSufficient { get; set; }
    }

    public class MrpSimulationRowDto
    {
        public int StepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string StepType { get; set; } = string.Empty;
        public int? RecipeID { get; set; }
        public int? BomID { get; set; }
        public int? ChildItemID { get; set; }
        public string? ChildItemName { get; set; }
        public int? BomQty { get; set; }
        public int CurrentStock { get; set; }
        public int LotCount { get; set; }
    }
}
