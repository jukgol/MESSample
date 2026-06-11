using System;

namespace Shared.Models.App
{
    public class ProcessStepDto
    {
        public int StepID { get; set; }
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string EquipmentID { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ProcessMasterID { get; set; }
        public string? ProcessMasterName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProcessStepCreateDto
    {
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string EquipmentID { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ProcessMasterID { get; set; }
    }

    public class ProcessStepUpdateDto
    {
        public string StepName { get; set; } = string.Empty;
        public int SeqNo { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string EquipmentID { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ProcessMasterID { get; set; }
    }
}
