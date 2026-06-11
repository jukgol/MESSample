namespace Shared.Models.PLC
{
    public class PlcProcessMasterDto
    {
        public int ProcessID { get; set; }
        public string ProcessCode { get; set; } = string.Empty;
        public string ProcessName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
