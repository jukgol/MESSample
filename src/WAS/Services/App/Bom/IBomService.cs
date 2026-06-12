using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IBomService
    {
        Task<IEnumerable<BomRecipeListDto>> GetBomRecipeListAsync();
        Task CreateBomAsync(BomRecipeCreateDto dto);
        Task AddRecipeInputAsync(int recipeId, int itemId, int qty);
        Task AddRecipeOutputAsync(int recipeId, int itemId, int qty);
        Task DeleteRecipeInputAsync(int recipeId, int itemId);
        Task DeleteRecipeOutputAsync(int recipeId, int itemId);
        Task UpdateRecipeInputQtyAsync(int recipeId, int itemId, int qty);
        Task UpdateRecipeOutputQtyAsync(int recipeId, int itemId, int qty);
        Task DeleteRecipeAsync(int recipeId);
        Task UpdateRecipeProcessAsync(int recipeId, int? processStepId);
    }
}
