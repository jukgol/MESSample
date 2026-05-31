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
}
