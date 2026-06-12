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
        [HttpGet("executions")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessStepExecutionDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessStepExecutionDto>>> GetAllExecutions()
        {
            try
            {
                var executions = await _processMonitoringService.GetAllExecutionsAsync();
                return Ok(executions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 실행 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("work-orders/{workOrderId}/executions")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessStepExecutionDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessStepExecutionDto>>> GetExecutionsByWorkOrder(int workOrderId)
        {
            try
            {
                var executions = await _processMonitoringService.GetExecutionsByWorkOrderAsync(workOrderId);
                return Ok(executions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"작업지시 ID({workOrderId}) 기준 공정 실행 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("executions/{executionId}")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(ProcessStepExecutionDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<ProcessStepExecutionDto>> GetExecution(int executionId)
        {
            try
            {
                var execution = await _processMonitoringService.GetExecutionByIdAsync(executionId);
                if (execution == null)
                {
                    return NotFound(new { Message = "공정 실행 정보를 찾을 수 없습니다." });
                }

                return Ok(execution);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 실행 상세 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("executions")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CreateExecution([FromBody] ProcessStepExecutionCreateDto dto)
        {
            try
            {
                var validation = ValidateExecution(dto);
                if (validation != null)
                {
                    return validation;
                }

                await _processMonitoringService.CreateExecutionAsync(dto);
                return Ok(new { Message = "공정 실행 정보가 등록되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 실행 등록 중 오류 발생: {ex.Message}" });
            }
        }
        [HttpPost("executions/{executionId}/start")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> StartExecution(int executionId)
        {
            try
            {
                if (executionId <= 0)
                {
                    return BadRequest(new { Message = "공정 실행 ID가 올바르지 않습니다." });
                }

                await _processMonitoringService.StartExecutionAsync(executionId);
                return Ok(new { Message = "공정 실행이 시작되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 실행 시작 중 오류 발생: {ex.Message}" });
            }
        }
        [HttpPost("executions/{executionId}/complete")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CompleteExecution(int executionId)
        {
            try
            {
                if (executionId <= 0)
                {
                    return BadRequest(new { Message = "공정 실행 ID가 올바르지 않습니다." });
                }

                await _processMonitoringService.CompleteExecutionAsync(executionId);
                return Ok(new { Message = "공정 실행이 완료되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"공정 실행 완료 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPost("work-orders/{workOrderId}/complete")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult> CompleteWorkOrder(int workOrderId)
        {
            try
            {
                if (workOrderId <= 0)
                {
                    return BadRequest(new { Message = "작업지시 ID가 올바르지 않습니다." });
                }

                await _processMonitoringService.CompleteWorkOrderAsync(workOrderId);
                return Ok(new { Message = "작업지시 공정이 완료 처리되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"작업지시 완료 처리 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
