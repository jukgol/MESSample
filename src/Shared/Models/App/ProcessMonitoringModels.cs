using System;
using System.Collections.Generic;

namespace Shared.Models.App
{
    public class ProcessStepExecutionDto
    {
        public int ProcessStepExecutionID { get; set; }
        public int WorkOrderID { get; set; }
        public string WorkOrderNo { get; set; } = string.Empty;
        public int ProcessMasterID { get; set; }
        public string ProcessMasterName { get; set; } = string.Empty;
        public int OrderQty { get; set; }
        public int ProcessStepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string EquipmentID { get; set; } = string.Empty;
        public int? WorkerUserID { get; set; }
        public string WorkerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public DateTime ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ProcessStepExecutionCreateDto
    {
        public int WorkOrderID { get; set; }
        public int ProcessStepID { get; set; }
        public string EquipmentID { get; set; } = string.Empty;
        public int? WorkerUserID { get; set; }
        public string Status { get; set; } = "WAITING";
    }

    public class ProcessInputDto
    {
        public int ProcessInputID { get; set; }
        public int ProcessStepExecutionID { get; set; }
        public int LotID { get; set; }
        public string LotNo { get; set; } = string.Empty;
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int InputQty { get; set; }
        public int UsedQty { get; set; }
        public int RemainQty { get; set; }
        public DateTime InputAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProcessInputCreateDto
    {
        public int LotID { get; set; }
        public int ItemID { get; set; }
        public int InputQty { get; set; }
        public int UsedQty { get; set; }
        public int? RemainQty { get; set; }
    }

    public class ProcessInputQuantityUpdateDto
    {
        public int UsedQty { get; set; }
        public int RemainQty { get; set; }
    }

    public class ProcessOutputDto
    {
        public int ProcessOutputID { get; set; }
        public int ProcessStepExecutionID { get; set; }
        public int LotID { get; set; }
        public string LotNo { get; set; } = string.Empty;
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int TargetQty { get; set; }
        public int OutputQty { get; set; }
        public string OutputType { get; set; } = string.Empty;
        public DateTime OutputAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProcessOutputCreateDto
    {
        public int LotID { get; set; }
        public int ItemID { get; set; }
        public int TargetQty { get; set; }
        public int OutputQty { get; set; }
        public string OutputType { get; set; } = "GOOD";
    }

    public class ProcessOutputQuantityUpdateDto
    {
        public int OutputQty { get; set; }
    }

    public class StartToolSignalRequestDto
    {
        public string? EquipmentId { get; set; }
    }

    public class StartToolSignalResponseDto
    {
        public bool Success { get; set; }
        public string Command { get; set; } = string.Empty;
        public string? TargetId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class ProcessMonitoringWorkOrderRefDto
    {
        public int WorkOrderID { get; set; }
    }

    public class CurrentWorkOrderStateDto
    {
        public int WorkOrderID { get; set; }
        public string WorkOrderNo { get; set; } = string.Empty;
        public int ProcessMasterID { get; set; }
        public string ProcessMasterName { get; set; } = string.Empty;
        public int OrderQty { get; set; }
        public int? WorkerUserID { get; set; }
        public string WorkerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime ApprovedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public List<CurrentProcessStepStateDto> Steps { get; set; } = new();
    }

    public class CurrentProcessStepStateDto
    {
        public int ProcessStepExecutionID { get; set; }
        public int ProcessStepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string EquipmentID { get; set; } = string.Empty;
        public int? WorkerUserID { get; set; }
        public string WorkerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public List<CurrentProcessInputStateDto> Inputs { get; set; } = new();
        public List<CurrentProcessOutputStateDto> Outputs { get; set; } = new();
    }

    public class CurrentProcessInputStateDto
    {
        public int ProcessInputID { get; set; }
        public int ProcessStepExecutionID { get; set; }
        public int LotID { get; set; }
        public string LotNo { get; set; } = string.Empty;
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int InputQty { get; set; }
        public int UsedQty { get; set; }
        public int RemainQty { get; set; }
        public DateTime InputAt { get; set; }
    }

    public class CurrentProcessOutputStateDto
    {
        public int ProcessOutputID { get; set; }
        public int ProcessStepExecutionID { get; set; }
        public int LotID { get; set; }
        public string LotNo { get; set; } = string.Empty;
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int TargetQty { get; set; }
        public int OutputQty { get; set; }
        public string OutputType { get; set; } = string.Empty;
        public DateTime OutputAt { get; set; }
    }
}
