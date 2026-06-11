using System;
using System.Collections.Generic;

namespace Shared.Models.App
{
    public class WorkOrderPreviewRequestDto
    {
        public int ProcessMasterID { get; set; }
        public int OrderQty { get; set; }
    }

    public class WorkOrderPreviewDto
    {
        public int ProcessMasterID { get; set; }
        public int OrderQty { get; set; }
        public bool IsAvailable { get; set; }
        public List<WorkOrderStepAvailabilityDto> Steps { get; set; } = new();
    }

    public class WorkOrderStepAvailabilityDto
    {
        public int StepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class WorkOrderCreateRequestDto
    {
        public int ProcessMasterID { get; set; }
        public int OrderQty { get; set; }
        public int? WorkerUserID { get; set; }
        public string WorkerName { get; set; } = string.Empty;
    }

    public class WorkOrderCreateResultDto
    {
        public string WorkOrderNo { get; set; } = string.Empty;
        public int ProcessMasterID { get; set; }
        public int OrderQty { get; set; }
        public int? WorkerUserID { get; set; }
        public string WorkerName { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public DateTime ApprovedAt { get; set; }
        public List<WorkOrderStepAvailabilityDto> Steps { get; set; } = new();
    }

    public class WorkOrderStepRowDto
    {
        public int StepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public int? BomID { get; set; }
        public int? BomQty { get; set; }
        public int CurrentStock { get; set; }
    }

}
