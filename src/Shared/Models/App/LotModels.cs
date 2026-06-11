using System;

namespace Shared.Models.App
{
    public class LotDto
    {
        public int LotID { get; set; }
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string LotNo { get; set; } = string.Empty;
        public int Qty { get; set; }
        public int CurrentQty { get; set; }
        public int ReservedQty { get; set; }
        public int AvailableQty { get; set; }
        public DateTime ReceivedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class LotCreateDto
    {
        public int ItemID { get; set; }
        public string LotNo { get; set; } = string.Empty;
        public int Qty { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class LotUpdateDto
    {
        public int Qty { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class LotStockChangeDto
    {
        public int LotID { get; set; }
        public int ChangeQty { get; set; }
        public string ChangeType { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string RefType { get; set; } = string.Empty;
        public int? RefID { get; set; }
    }

    public class LotTraceCreateDto
    {
        public int? ParentLotID { get; set; }
        public int ChildLotID { get; set; }
        public string TraceType { get; set; } = string.Empty;
        public int? InputQty { get; set; }
        public int OutputQty { get; set; }
        public int? ProcessStepExecutionID { get; set; }
        public string RefType { get; set; } = string.Empty;
        public int? RefID { get; set; }
    }
}
