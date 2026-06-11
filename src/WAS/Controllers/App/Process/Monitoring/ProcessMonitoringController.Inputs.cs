using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.App
{
    public partial class ProcessMonitoringController
    {
        [HttpGet("executions/{executionId}/inputs")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessInputDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessInputDto>>> GetInputs(int executionId)
        {
            try
            {
                var inputs = await _processMonitoringService.GetInputsAsync(executionId);
                return Ok(inputs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 투입 내역 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("executions/{executionId}/inputs")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateInput(int executionId, [FromBody] ProcessInputCreateDto dto)
        {
            try
            {
                var validation = ValidateInput(executionId, dto);
                if (validation != null)
                {
                    return validation;
                }

                await _processMonitoringService.CreateInputAsync(executionId, dto);
                return Ok(new { Message = "공정 투입 내역이 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 투입 내역 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPatch("inputs/{inputId}/quantity")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateInputQuantity(int inputId, [FromBody] ProcessInputQuantityUpdateDto dto)
        {
            try
            {
                var validation = ValidateInputQuantity(inputId, dto);
                if (validation != null)
                {
                    return validation;
                }

                await _processMonitoringService.UpdateInputQuantityAsync(inputId, dto);
                return Ok(new { Message = "공정 투입 수량 상태가 갱신되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 투입 수량 갱신 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
