using System;
using System.Collections.Generic;

namespace Shared.Models.App
{
    public class BomRecipeListDto
    {
        public int BomRecipeID { get; set; }
        public string RecipeCode { get; set; } = string.Empty;
        public string RecipeName { get; set; } = string.Empty;
        public int? ProcessStepID { get; set; }
        public string ProcessStepName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<BomRecipeItemDto> Inputs { get; set; } = new();
        public List<BomRecipeItemDto> Outputs { get; set; } = new();
    }

    public class BomRecipeCreateDto
    {
        public string RecipeCode { get; set; } = string.Empty;
        public string RecipeName { get; set; } = string.Empty;
        public int? ProcessStepID { get; set; }
        public List<BomRecipeCreateItemDto> Inputs { get; set; } = new();
        public List<BomRecipeCreateItemDto> Outputs { get; set; } = new();
    }

    public class BomRecipeCreateItemDto
    {
        public int ItemID { get; set; }
        public int Qty { get; set; }
    }

    public class BomRecipeItemDto
    {
        public int ItemID { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public int Qty { get; set; }
    }

    public class BomRecipeListRowDto
    {
        public int BomRecipeID { get; set; }
        public string RecipeCode { get; set; } = string.Empty;
        public string RecipeName { get; set; } = string.Empty;
        public int? ProcessStepID { get; set; }
        public string ProcessStepName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int? InputItemID { get; set; }
        public string InputItemCode { get; set; } = string.Empty;
        public string InputItemName { get; set; } = string.Empty;
        public int? InputQty { get; set; }
        public int? OutputItemID { get; set; }
        public string OutputItemCode { get; set; } = string.Empty;
        public string OutputItemName { get; set; } = string.Empty;
        public int? OutputQty { get; set; }
    }

    public class BomRecipeIdentityDto
    {
        public int BomRecipeID { get; set; }
        public string RecipeCode { get; set; } = string.Empty;
    }
}
