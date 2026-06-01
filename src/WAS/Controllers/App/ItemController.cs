using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;
using Shared.Models.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ItemDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            try
            {
                var items = await _itemService.GetItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateItem([FromBody] ItemCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.ItemName))
                {
                    return BadRequest(new { Message = "품목 이름은 필수 입력 항목입니다." });
                }

                await _itemService.CreateItemAsync(dto);
                return Ok(new { Message = "품목이 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateItem(int id, [FromBody] ItemUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.ItemName))
                {
                    return BadRequest(new { Message = "품목 이름은 필수 입력 항목입니다." });
                }

                await _itemService.UpdateItemAsync(id, dto);
                return Ok(new { Message = "품목 정보가 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> DeleteItem(int id)
        {
            try
            {
                await _itemService.DeleteItemAsync(id);
                return Ok(new { Message = "품목이 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("dummy")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateDummyItems([FromQuery] int count = 10)
        {
            try
            {
                if (count <= 0)
                {
                    return BadRequest(new { Message = "생성할 수량은 1개 이상이어야 합니다." });
                }

                await _itemService.GenerateDummyItemsAsync(count);
                return Ok(new { Message = $"성공적으로 {count}개의 품목 테스트 데이터가 생성되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 테스트 데이터 생성 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
