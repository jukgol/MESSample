using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;
using Shared.Models.App;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class LotController : ControllerBase
    {
        private readonly ILotService _lotService;

        public LotController(ILotService lotService)
        {
            _lotService = lotService;
        }

        [HttpGet]
        [HasPermission(Permissions.InventoryView)]
        [ProducesResponseType(typeof(IEnumerable<LotDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<LotDto>>> GetLots()
        {
            try
            {
                var lots = await _lotService.GetLotsAsync();
                return Ok(lots);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"LOT 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [HasPermission(Permissions.InventoryEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateLot([FromBody] LotCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (dto.ItemID <= 0 || string.IsNullOrWhiteSpace(dto.LotNo))
                {
                    return BadRequest(new { Message = "필수 항목(자재 ID, LOT 번호)이 비어있거나 올바르지 않습니다." });
                }

                await _lotService.CreateLotAsync(dto);
                return Ok(new { Message = "LOT이 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"LOT 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.InventoryEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateLot(int id, [FromBody] LotUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                await _lotService.UpdateLotAsync(id, dto);
                return Ok(new { Message = "LOT 정보가 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"LOT 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.InventoryEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> DeleteLot(int id)
        {
            try
            {
                await _lotService.DeleteLotAsync(id);
                return Ok(new { Message = "LOT이 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"LOT 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("dummy")]
        [HasPermission(Permissions.InventoryEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateDummyLots([FromQuery] int count = 10)
        {
            try
            {
                if (count <= 0)
                {
                    return BadRequest(new { Message = "생성할 수량은 1개 이상이어야 합니다." });
                }

                await _lotService.GenerateDummyLotsAsync(count);
                return Ok(new { Message = $"성공적으로 {count}개의 LOT 테스트 데이터가 생성되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"LOT 테스트 데이터 생성 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
