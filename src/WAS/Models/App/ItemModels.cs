namespace WAS.Models.App
{
    public class ItemDto
    {
        public string ItemCode { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string IsActive { get; set; } = "Y";
        public DateTime CreatedAt { get; set; }
    }
}
