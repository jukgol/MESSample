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
        [HttpGet("executions/{executionId}/outputs")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessOutputDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessOutputDto>>> GetOutputs(int executionId)
        {
            try
            {
                var outputs = await _processMonitoringService.GetOutputsAsync(executionId);
                return Ok(outputs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 산출 내역 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("executions/{executionId}/outputs")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateOutput(int executionId, [FromBody] ProcessOutputCreateDto dto)
        {
            try
            {
                var validation = ValidateOutput(executionId, dto);
                if (validation != null)
                {
                    return validation;
                }

                await _processMonitoringService.CreateOutputAsync(executionId, dto);
                return Ok(new { Message = "공정 산출 내역이 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 산출 내역 등록 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPatch("outputs/{outputId}/quantity")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> UpdateOutputQuantity(int outputId, [FromBody] ProcessOutputQuantityUpdateDto dto)
        {
            try
            {
                var validation = ValidateOutputQuantity(outputId, dto);
                if (validation != null)
                {
                    return validation;
                }

                await _processMonitoringService.UpdateOutputQuantityAsync(outputId, dto);
                return Ok(new { Message = "공정 산출 수량 상태가 갱신되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 산출 수량 갱신 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
