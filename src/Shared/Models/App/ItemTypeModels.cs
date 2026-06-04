namespace Shared.Models.App
{
    public class ItemTypeDto
    {
        public int ItemTypeID { get; set; }
        public string TypeName { get; set; } = string.Empty;
    }

    public class ItemTypeCreateDto
    {
        public string TypeName { get; set; } = string.Empty;
    }

    public class ItemTypeUpdateDto
    {
        public string TypeName { get; set; } = string.Empty;
    }
}
