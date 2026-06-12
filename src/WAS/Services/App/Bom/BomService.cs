using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class BomService : IBomService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public BomService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<BomRecipeListDto>> GetBomRecipeListAsync()
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<BomRecipeListRowDto>("App/Bom/GET_BOM_RECIPE_LIST");

            return rows
                .GroupBy(row => new
                {
                    row.BomRecipeID,
                    row.RecipeCode,
                    row.RecipeName,
                    row.ProcessStepID,
                    row.ProcessStepName,
                    row.CreatedAt
                })
                .Select(group => new BomRecipeListDto
                {
                    BomRecipeID = group.Key.BomRecipeID,
                    RecipeCode = group.Key.RecipeCode,
                    RecipeName = group.Key.RecipeName,
                    ProcessStepID = group.Key.ProcessStepID,
                    ProcessStepName = group.Key.ProcessStepName,
                    CreatedAt = group.Key.CreatedAt,
                    Inputs = group
                        .Where(row => row.InputItemID.HasValue && row.InputQty.HasValue)
                        .GroupBy(row => row.InputItemID!.Value)
                        .Select(inputGroup =>
                        {
                            var input = inputGroup.First();
                            return new BomRecipeItemDto
                            {
                                ItemID = input.InputItemID!.Value,
                                ItemCode = input.InputItemCode,
                                ItemName = input.InputItemName,
                                Qty = input.InputQty!.Value
                            };
                        })
                        .OrderBy(item => item.ItemName)
                        .ToList(),
                    Outputs = group
                        .Where(row => row.OutputItemID.HasValue && row.OutputQty.HasValue)
                        .GroupBy(row => row.OutputItemID!.Value)
                        .Select(outputGroup =>
                        {
                            var output = outputGroup.First();
                            return new BomRecipeItemDto
                            {
                                ItemID = output.OutputItemID!.Value,
                                ItemCode = output.OutputItemCode,
                                ItemName = output.OutputItemName,
                                Qty = output.OutputQty!.Value
                            };
                        })
                        .OrderBy(item => item.ItemName)
                        .ToList()
                })
                .OrderBy(recipe => recipe.RecipeName)
                .ThenBy(recipe => recipe.ProcessStepID)
                .ToList();
        }

        public async Task CreateBomAsync(BomRecipeCreateDto dto)
        {
            var recipeCode = string.IsNullOrWhiteSpace(dto.RecipeCode)
                ? $"RECIPE_{DateTime.Now:yyyyMMddHHmmssfff}"
                : dto.RecipeCode.Trim();

            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM_RECIPE", new
            {
                RecipeCode = recipeCode,
                RecipeName = dto.RecipeName.Trim(),
                ProcessStepId = dto.ProcessStepID
            });

            var recipe = (await _scriptExecutor.ExecuteQueryAsync<BomRecipeIdentityDto>(
                    "App/Bom/GET_BOM_RECIPE_BY_CODE",
                    new { RecipeCode = recipeCode }))
                .FirstOrDefault();

            if (recipe == null)
            {
                throw new InvalidOperationException("Created BOM recipe could not be found.");
            }

            foreach (var input in dto.Inputs)
            {
                await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM_INPUT", new
                {
                    BomRecipeId = recipe.BomRecipeID,
                    ItemId = input.ItemID,
                    InputQty = input.Qty
                });
            }

            foreach (var output in dto.Outputs)
            {
                await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM_OUTPUT", new
                {
                    BomRecipeId = recipe.BomRecipeID,
                    ItemId = output.ItemID,
                    OutputQty = output.Qty <= 0 ? 1 : output.Qty
                });
            }
        }

        public async Task AddRecipeInputAsync(int recipeId, int itemId, int qty)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM_INPUT", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId,
                InputQty = qty
            });
        }

        public async Task AddRecipeOutputAsync(int recipeId, int itemId, int qty)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM_OUTPUT", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId,
                OutputQty = qty
            });
        }

        public async Task DeleteRecipeInputAsync(int recipeId, int itemId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/DELETE_BOM_INPUT", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId
            });
        }

        public async Task DeleteRecipeOutputAsync(int recipeId, int itemId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/DELETE_BOM_OUTPUT", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId
            });
        }

        public async Task UpdateRecipeInputQtyAsync(int recipeId, int itemId, int qty)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM_INPUT_QTY", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId,
                Qty = qty
            });
        }

        public async Task UpdateRecipeOutputQtyAsync(int recipeId, int itemId, int qty)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM_OUTPUT_QTY", new
            {
                BomRecipeId = recipeId,
                ItemId = itemId,
                Qty = qty
            });
        }

        public async Task DeleteRecipeAsync(int recipeId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/DELETE_BOM_RECIPE", new
            {
                BomRecipeId = recipeId
            });
        }

        public async Task UpdateRecipeProcessAsync(int recipeId, int? processStepId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM_RECIPE_PROCESS", new
            {
                BomRecipeId = recipeId,
                ProcessStepId = processStepId
            });
        }
    }
}
