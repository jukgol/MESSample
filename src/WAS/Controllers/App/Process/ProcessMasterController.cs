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
    [Route("api/process-master")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class ProcessMasterController : ControllerBase
    {
        private readonly IProcessMasterService _processMasterService;

        public ProcessMasterController(IProcessMasterService processMasterService)
        {
            _processMasterService = processMasterService;
        }

        [HttpGet]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessMasterDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessMasterDto>>> GetProcessMasters()
        {
            try
            {
                var processes = await _processMasterService.GetProcessMastersAsync();
                return Ok(processes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 마스터 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(ProcessMasterDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<ProcessMasterDto>> GetProcessMaster(int id)
        {
            try
            {
                var process = await _processMasterService.GetProcessMasterByIdAsync(id);
                if (process == null)
                {
                    return NotFound(new { Message = $"해당 ID({id})의 공정 마스터를 찾을 수 없습니다." });
                }
                return Ok(process);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 마스터 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateProcessMaster([FromBody] ProcessMasterCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.ProcessCode))
                {
                    return BadRequest(new { Message = "공정 마스터 코드는 필수 입력 항목입니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.ProcessName))
                {
                    return BadRequest(new { Message = "공정 마스터명은 필수 입력 항목입니다." });
                }

                var existing = await _processMasterService.GetProcessMasterByCodeAsync(dto.ProcessCode);
                if (existing != null)
                {
                    return BadRequest(new { Message = $"이미 존재하는 공정 코드({dto.ProcessCode})입니다." });
                }

                await _processMasterService.CreateProcessMasterAsync(dto);
                return Ok(new { Message = "공정 마스터가 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 마스터 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateProcessMaster(int id, [FromBody] ProcessMasterUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.ProcessName))
                {
                    return BadRequest(new { Message = "공정 마스터명은 필수 입력 항목입니다." });
                }

                var existing = await _processMasterService.GetProcessMasterByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { Message = $"해당 ID({id})의 공정 마스터를 찾을 수 없습니다." });
                }

                await _processMasterService.UpdateProcessMasterAsync(id, dto);
                return Ok(new { Message = "공정 마스터 정보가 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 마스터 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteProcessMaster(int id)
        {
            try
            {
                var existing = await _processMasterService.GetProcessMasterByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { Message = $"해당 ID({id})의 공정 마스터를 찾을 수 없습니다." });
                }

                await _processMasterService.DeleteProcessMasterAsync(id);
                return Ok(new { Message = "공정 마스터가 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 마스터 삭제 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
