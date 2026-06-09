using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/mrp")]
    [Authorize]
    public class MrpController : ControllerBase
    {
        private readonly IMrpService _mrpService;

        public MrpController(IMrpService mrpService)
        {
            _mrpService = mrpService;
        }

        [HttpGet("masters")]
        [HasPermission(Permissions.MasterDataView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessMasterDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessMasterDto>>> GetMasters()
        {
            try
            {
                var masters = await _mrpService.GetMastersAsync();
                return Ok(masters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"MRP 공정 마스터 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("simulation")]
        [HasPermission(Permissions.MasterDataView)]
        [ProducesResponseType(typeof(MrpSimulationResultDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<MrpSimulationResultDto>> Simulate([FromBody] MrpSimulationRequestDto request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (request.ProcessMasterID <= 0)
                {
                    return BadRequest(new { Message = "공정 마스터 ID가 올바르지 않습니다." });
                }

                if (request.TargetQty <= 0)
                {
                    return BadRequest(new { Message = "목표 생산량은 1 이상이어야 합니다." });
                }

                var result = await _mrpService.SimulateAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"MRP 시뮬레이션 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
