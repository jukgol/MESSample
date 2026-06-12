using System;

namespace Shared.Models.PLC
{
    public class PlcEquipmentStateRequestDto
    {
        public string EquipmentID { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public DateTime? OccurredAt { get; set; }
    }

    public class PlcEquipmentStateResponseDto
    {
        public bool Success { get; set; }
        public string EquipmentID { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public DateTime ReceivedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class PlcEquipmentDataReceiveResponseDto
    {
        public bool Success { get; set; }
        public DateTime ReceivedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class PlcEquipmentProductionRequestDto
    {
        public string EquipmentID { get; set; } = string.Empty;
        public string Event { get; set; } = string.Empty;
        public int? Qty { get; set; }
        public DateTime? OccurredAt { get; set; }
    }

}
