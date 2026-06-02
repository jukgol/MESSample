using System;

namespace Shared.Models.App
{
    public class BomDto
    {
        public int BomID { get; set; }
        public int ParentItemID { get; set; }
        public string ParentItemName { get; set; } = string.Empty;
        public int ChildItemID { get; set; }
        public string ChildItemName { get; set; } = string.Empty;
        public int BomQty { get; set; }
    }

    public class BomCreateDto
    {
        public int ParentItemID { get; set; }
        public int ChildItemID { get; set; }
        public int BomQty { get; set; }
    }

    public class BomUpdateDto
    {
        public int BomQty { get; set; }
    }
}
