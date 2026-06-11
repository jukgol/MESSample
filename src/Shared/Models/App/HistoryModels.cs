using System;

namespace Shared.Models.App
{
    public class LotRelationHistoryDto
    {
        public int LotRelationID { get; set; }
        public int? ParentLotID { get; set; }
        public string ParentLotNo { get; set; } = string.Empty;
        public int? ParentItemID { get; set; }
        public string ParentItemName { get; set; } = string.Empty;
        public int ChildLotID { get; set; }
        public string ChildLotNo { get; set; } = string.Empty;
        public int ChildItemID { get; set; }
        public string ChildItemName { get; set; } = string.Empty;
        public string RelationType { get; set; } = string.Empty;
        public int? InputQty { get; set; }
        public int OutputQty { get; set; }
        public int? ProcessStepExecutionID { get; set; }
        public string WorkOrderNo { get; set; } = string.Empty;
        public string StepName { get; set; } = string.Empty;
        public string RefType { get; set; } = string.Empty;
        public int? RefID { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class LotTraceHistoryDto : LotRelationHistoryDto
    {
        public string Direction { get; set; } = string.Empty;
        public int TraceDepth { get; set; }
    }
}
