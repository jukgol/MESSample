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
        public int? ProcessStepID { get; set; }
        public string ProcessStepName { get; set; } = string.Empty;
    }

    public class BomCreateDto
    {
        public int ParentItemID { get; set; }
        public int ChildItemID { get; set; }
        public int BomQty { get; set; }
        public int? ProcessStepID { get; set; }
    }

    public class BomUpdateDto
    {
        public int BomQty { get; set; }
        public int? ProcessStepID { get; set; } // 공정 변경 가능하도록 허용
    }

    public class BomScenarioDto
    {
        public string ParentItemCode { get; set; } = string.Empty;
        public string ChildItemCode { get; set; } = string.Empty;
        public int BomQty { get; set; }
        public string ProcessStepName { get; set; } = string.Empty;
    }

    public class BomUpdateProcessDto
    {
        public int? ProcessStepID { get; set; }
    }
}
