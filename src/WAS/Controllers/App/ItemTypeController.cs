using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;
using Shared.Models.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ItemTypeController : ControllerBase
    {
        private readonly IItemTypeService _itemTypeService;

        public ItemTypeController(IItemTypeService itemTypeService)
        {
            _itemTypeService = itemTypeService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ItemTypeDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ItemTypeDto>>> GetItemTypes()
        {
            try
            {
                var itemTypes = await _itemTypeService.GetItemTypesAsync();
                return Ok(itemTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 유형 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateItemType([FromBody] ItemTypeCreateDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.TypeName))
                {
                    return BadRequest(new { Message = "품목 유형 이름은 필수 입력 항목입니다." });
                }

                await _itemTypeService.CreateItemTypeAsync(dto);
                return Ok(new { Message = "품목 유형이 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 유형 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateItemType(int id, [FromBody] ItemTypeUpdateDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.TypeName))
                {
                    return BadRequest(new { Message = "품목 유형 이름은 필수 입력 항목입니다." });
                }

                await _itemTypeService.UpdateItemTypeAsync(id, dto);
                return Ok(new { Message = "품목 유형이 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 유형 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> DeleteItemType(int id)
        {
            try
            {
                await _itemTypeService.DeleteItemTypeAsync(id);
                return Ok(new { Message = "품목 유형이 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 유형 삭제 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
