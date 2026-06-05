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
    [Route("api/process-step")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class ProcessStepController : ControllerBase
    {
        private readonly IProcessStepService _processStepService;

        public ProcessStepController(IProcessStepService processStepService)
        {
            _processStepService = processStepService;
        }

        [HttpGet]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessStepDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessStepDto>>> GetProcessSteps()
        {
            try
            {
                var steps = await _processStepService.GetProcessStepsAsync();
                return Ok(steps);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 단계 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(ProcessStepDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<ProcessStepDto>> GetProcessStep(int id)
        {
            try
            {
                var step = await _processStepService.GetProcessStepByIdAsync(id);
                if (step == null)
                {
                    return NotFound(new { Message = $"해당 ID({id})의 공정 단계를 찾을 수 없습니다." });
                }
                return Ok(step);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 단계 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateProcessStep([FromBody] ProcessStepCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.StepName))
                {
                    return BadRequest(new { Message = "공정 단계명은 필수 입력 항목입니다." });
                }

                await _processStepService.CreateProcessStepAsync(dto);
                return Ok(new { Message = "공정 단계가 성공적으로 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 단계 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateProcessStep(int id, [FromBody] ProcessStepUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                if (string.IsNullOrWhiteSpace(dto.StepName))
                {
                    return BadRequest(new { Message = "공정 단계명은 필수 입력 항목입니다." });
                }

                await _processStepService.UpdateProcessStepAsync(id, dto);
                return Ok(new { Message = "공정 단계 정보가 성공적으로 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 단계 수정 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> DeleteProcessStep(int id)
        {
            try
            {
                await _processStepService.DeleteProcessStepAsync(id);
                return Ok(new { Message = "공정 단계가 성공적으로 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 단계 삭제 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("dummy")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateDummySteps()
        {
            try
            {
                await _processStepService.LoadScenarioStepsAsync();
                return Ok(new { Message = "성공적으로 시나리오 공정 데이터가 로드되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 데이터 생성 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
