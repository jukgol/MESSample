using System;

namespace Shared.Models.App
{
    public class ProcessMasterDto
    {
        public int ProcessID { get; set; }
        public string ProcessCode { get; set; } = string.Empty;
        public string ProcessName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ProcessMasterCreateDto
    {
        public string ProcessCode { get; set; } = string.Empty;
        public string ProcessName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class ProcessMasterUpdateDto
    {
        public string ProcessName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
