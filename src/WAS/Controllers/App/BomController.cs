using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;
using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/bom")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class BomController : ControllerBase
    {
        private readonly IBomService _bomService;

        public BomController(IBomService bomService)
        {
            _bomService = bomService;
        }

        [HttpGet("parent/{parentId}")]
        [HasPermission(Permissions.MasterDataView)]
        [ProducesResponseType(typeof(IEnumerable<BomDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<BomDto>>> GetBomsByParent(int parentId)
        {
            try
            {
                var boms = await _bomService.GetBomsByParentAsync(parentId);
                return Ok(boms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"부모 품목 ID({parentId}) 기준 BOM 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [HasPermission(Permissions.MasterDataEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateBom([FromBody] BomCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (dto.ParentItemID <= 0 || dto.ChildItemID <= 0 || dto.BomQty <= 0)
                {
                    return BadRequest(new { Message = "필수 항목(부모 품목 ID, 자식 품목 ID, 소요량)이 누락되었거나 올바르지 않습니다." });
                }

                await _bomService.CreateBomAsync(dto);
                return Ok(new { Message = "BOM 항목이 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.MasterDataEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateBom(int id, [FromBody] BomUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (dto.BomQty <= 0)
                {
                    return BadRequest(new { Message = "수정 항목(소요량)이 누락되었거나 올바르지 않습니다." });
                }

                await _bomService.UpdateBomAsync(id, dto);
                return Ok(new { Message = "BOM 정보가 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.MasterDataEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> DeleteBom(int id)
        {
            try
            {
                await _bomService.DeleteBomAsync(id);
                return Ok(new { Message = "BOM 항목이 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("dummy")]
        [HasPermission(Permissions.MasterDataEdit)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateDummyBoms()
        {
            try
            {
                await _bomService.LoadScenarioBomsAsync();
                return Ok(new { Message = "성공적으로 시나리오 BOM 데이터가 로드되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"BOM 시나리오 데이터 로드 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
