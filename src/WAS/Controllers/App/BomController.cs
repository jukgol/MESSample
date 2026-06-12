using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/bom")]
    [Authorize]
    public class BomController : ControllerBase
    {
        private readonly IBomService _bomService;

        public BomController(IBomService bomService)
        {
            _bomService = bomService;
        }

        [HttpGet]
        [HttpGet("list")]
        [HasPermission(Permissions.MasterDataView)]
        [ProducesResponseType(typeof(IEnumerable<BomRecipeListDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<BomRecipeListDto>>> GetBomRecipeList()
        {
            try
            {
                var recipes = await _bomService.GetBomRecipeListAsync();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM recipe list 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [HasPermission(Permissions.MasterDataEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateBom([FromBody] BomRecipeCreateDto dto)
        {
            try
            {
                var validation = ValidateCreateDto(dto);
                if (validation != null)
                {
                    return validation;
                }

                await _bomService.CreateBomAsync(dto);
                return Ok(new { Message = "BOM recipe가 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM recipe 등록 중 오류 발생: {ex.Message}" });
            }
        }

        private ActionResult? ValidateCreateDto(BomRecipeCreateDto? dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (string.IsNullOrWhiteSpace(dto.RecipeName))
            {
                return BadRequest(new { Message = "레시피 이름은 필수입니다." });
            }

            if (dto.Inputs != null && dto.Inputs.Any(item => item.ItemID <= 0 || item.Qty <= 0))
            {
                return BadRequest(new { Message = "BOM input의 품목 ID와 수량은 0보다 커야 합니다." });
            }

            if (dto.Outputs != null && dto.Outputs.Any(item => item.ItemID <= 0 || item.Qty < 0))
            {
                return BadRequest(new { Message = "BOM output의 품목 ID는 0보다 커야 하고 수량은 음수일 수 없습니다." });
            }

            return null;
        }

        [HttpPost("{recipeId}/input")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> AddRecipeInput([FromRoute] int recipeId, [FromBody] BomRecipeCreateItemDto dto)
        {
            try
            {
                if (dto == null || dto.ItemID <= 0 || dto.Qty <= 0)
                {
                    return BadRequest(new { Message = "올바른 품목 ID와 수량을 입력해 주세요." });
                }
                await _bomService.AddRecipeInputAsync(recipeId, dto.ItemID, dto.Qty);
                return Ok(new { Message = "입력 품목이 성공적으로 추가되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"입력 품목 추가 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("{recipeId}/output")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> AddRecipeOutput([FromRoute] int recipeId, [FromBody] BomRecipeCreateItemDto dto)
        {
            try
            {
                if (dto == null || dto.ItemID <= 0 || dto.Qty <= 0)
                {
                    return BadRequest(new { Message = "올바른 품목 ID와 수량을 입력해 주세요." });
                }
                await _bomService.AddRecipeOutputAsync(recipeId, dto.ItemID, dto.Qty);
                return Ok(new { Message = "출력 품목이 성공적으로 추가되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"출력 품목 추가 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{recipeId}/input/{itemId}")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> DeleteRecipeInput([FromRoute] int recipeId, [FromRoute] int itemId)
        {
            try
            {
                await _bomService.DeleteRecipeInputAsync(recipeId, itemId);
                return Ok(new { Message = "입력 품목이 레시피에서 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"입력 품목 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{recipeId}/output/{itemId}")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> DeleteRecipeOutput([FromRoute] int recipeId, [FromRoute] int itemId)
        {
            try
            {
                await _bomService.DeleteRecipeOutputAsync(recipeId, itemId);
                return Ok(new { Message = "출력 품목이 레시피에서 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"출력 품목 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{recipeId}/input/{itemId}")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> UpdateRecipeInputQty([FromRoute] int recipeId, [FromRoute] int itemId, [FromBody] UpdateQtyRequest request)
        {
            try
            {
                if (request == null || request.Qty <= 0)
                {
                    return BadRequest(new { Message = "수량은 1 이상이어야 합니다." });
                }
                await _bomService.UpdateRecipeInputQtyAsync(recipeId, itemId, request.Qty);
                return Ok(new { Message = "수량이 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"수량 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{recipeId}/output/{itemId}")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> UpdateRecipeOutputQty([FromRoute] int recipeId, [FromRoute] int itemId, [FromBody] UpdateQtyRequest request)
        {
            try
            {
                if (request == null || request.Qty <= 0)
                {
                    return BadRequest(new { Message = "수량은 1 이상이어야 합니다." });
                }
                await _bomService.UpdateRecipeOutputQtyAsync(recipeId, itemId, request.Qty);
                return Ok(new { Message = "수량이 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"수량 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{recipeId}")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> DeleteRecipe([FromRoute] int recipeId)
        {
            try
            {
                await _bomService.DeleteRecipeAsync(recipeId);
                return Ok(new { Message = "레시피가 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"레시피 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{recipeId}/process")]
        [HasPermission(Permissions.MasterDataEdit)]
        public async Task<ActionResult> UpdateRecipeProcess([FromRoute] int recipeId, [FromBody] UpdateProcessRequest request)
        {
            try
            {
                await _bomService.UpdateRecipeProcessAsync(recipeId, request?.ProcessStepId);
                return Ok(new { Message = "레시피 공정 단계가 성공적으로 업데이트되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"레시피 공정 단계 업데이트 중 오류 발생: {ex.Message}" });
            }
        }
    }

    public class UpdateQtyRequest
    {
        public int Qty { get; set; }
    }

    public class UpdateProcessRequest
    {
        public int? ProcessStepId { get; set; }
    }
}
