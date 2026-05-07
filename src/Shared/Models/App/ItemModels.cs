namespace Shared.Models.App
{
    public class ItemDto
    {
        public string ItemID { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string Description  { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
