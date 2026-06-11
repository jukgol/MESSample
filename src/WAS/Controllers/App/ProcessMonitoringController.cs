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
    [Route("api/process-monitoring")]
    [Authorize]
    public class ProcessMonitoringController : ControllerBase
    {
        private readonly IProcessMonitoringService _processMonitoringService;

        public ProcessMonitoringController(IProcessMonitoringService processMonitoringService)
        {
            _processMonitoringService = processMonitoringService;
        }

        [HttpGet("current")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<CurrentWorkOrderStateDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<CurrentWorkOrderStateDto>>> GetCurrentWorkOrders()
        {
            try
            {
                var states = await _processMonitoringService.GetCurrentWorkOrdersAsync();
                return Ok(states);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"현재 공정 모니터링 상태 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("current/work-orders/{workOrderId}")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(CurrentWorkOrderStateDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<CurrentWorkOrderStateDto>> GetCurrentWorkOrder(int workOrderId)
        {
            try
            {
                var state = await _processMonitoringService.GetCurrentWorkOrderAsync(workOrderId);
                if (state == null)
                {
                    return NotFound(new { Message = "현재 진행 중인 작업지시 상태를 찾을 수 없습니다." });
                }

                return Ok(state);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"현재 작업지시 상태 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpGet("current/equipment/{equipmentId}")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(CurrentProcessStepStateDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<CurrentProcessStepStateDto>> GetCurrentStepByEquipment(string equipmentId)
        {
            try
            {
                var state = await _processMonitoringService.GetCurrentStepByEquipmentAsync(equipmentId);
                if (state == null)
                {
                    return NotFound(new { Message = "해당 설비의 현재 공정 상태를 찾을 수 없습니다." });
                }

                return Ok(state);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"설비별 현재 공정 상태 조회 중 오류 발생: {ex.Message}" });
            }
        }

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

        [HttpPost("stattool/start")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StatToolSignalResponseDto>> StartStatTool([FromBody] StatToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStatToolStartAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }

        [HttpPost("stattool/stop")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StatToolSignalResponseDto>> StopStatTool([FromBody] StatToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStatToolStopAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }

        private ActionResult? ValidateExecution(ProcessStepExecutionCreateDto? dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (dto.WorkOrderID <= 0 || dto.ProcessStepID <= 0)
            {
                return BadRequest(new { Message = "작업지시 ID와 공정 단계 ID는 필수입니다." });
            }

            var status = string.IsNullOrWhiteSpace(dto.Status) ? "WAITING" : dto.Status.Trim().ToUpperInvariant();
            if (!IsValidExecutionStatus(status))
            {
                return BadRequest(new { Message = "공정 실행 상태가 올바르지 않습니다." });
            }

            dto.Status = status;
            return null;
        }

        private ActionResult? ValidateInput(int executionId, ProcessInputCreateDto? dto)
        {
            if (executionId <= 0)
            {
                return BadRequest(new { Message = "공정 실행 ID가 올바르지 않습니다." });
            }

            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (dto.LotID <= 0 || dto.ItemID <= 0 || dto.InputQty <= 0)
            {
                return BadRequest(new { Message = "Lot ID, 품목 ID, 투입 수량은 필수이며 투입 수량은 1 이상이어야 합니다." });
            }

            if (dto.UsedQty < 0)
            {
                return BadRequest(new { Message = "사용 수량은 0 이상이어야 합니다." });
            }

            var remainQty = dto.RemainQty ?? dto.InputQty - dto.UsedQty;
            if (remainQty < 0)
            {
                return BadRequest(new { Message = "잔량은 0 이상이어야 합니다." });
            }

            dto.RemainQty = remainQty;
            return null;
        }

        private ActionResult? ValidateOutput(int executionId, ProcessOutputCreateDto? dto)
        {
            if (executionId <= 0)
            {
                return BadRequest(new { Message = "공정 실행 ID가 올바르지 않습니다." });
            }

            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (dto.LotID <= 0 || dto.ItemID <= 0 || dto.OutputQty < 0)
            {
                return BadRequest(new { Message = "Lot ID와 품목 ID는 필수이며 산출 수량은 0 이상이어야 합니다." });
            }

            if (dto.TargetQty < 0)
            {
                return BadRequest(new { Message = "목표 산출 수량은 0 이상이어야 합니다." });
            }

            var outputType = string.IsNullOrWhiteSpace(dto.OutputType) ? "GOOD" : dto.OutputType.Trim().ToUpperInvariant();
            if (!IsValidOutputType(outputType))
            {
                return BadRequest(new { Message = "산출 유형이 올바르지 않습니다." });
            }

            dto.OutputType = outputType;
            return null;
        }

        private ActionResult? ValidateInputQuantity(int inputId, ProcessInputQuantityUpdateDto? dto)
        {
            if (inputId <= 0)
            {
                return BadRequest(new { Message = "공정 투입 ID가 올바르지 않습니다." });
            }

            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (dto.UsedQty < 0 || dto.RemainQty < 0)
            {
                return BadRequest(new { Message = "사용 수량과 잔량은 0 이상이어야 합니다." });
            }

            return null;
        }

        private ActionResult? ValidateOutputQuantity(int outputId, ProcessOutputQuantityUpdateDto? dto)
        {
            if (outputId <= 0)
            {
                return BadRequest(new { Message = "공정 산출 ID가 올바르지 않습니다." });
            }

            if (dto == null)
            {
                return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
            }

            if (dto.OutputQty < 0)
            {
                return BadRequest(new { Message = "산출 수량은 0 이상이어야 합니다." });
            }

            return null;
        }

        private bool IsValidExecutionStatus(string status)
        {
            return status == "WAITING"
                || status == "RUNNING"
                || status == "PAUSED"
                || status == "DONE"
                || status == "FAILED";
        }

        private bool IsValidOutputType(string outputType)
        {
            return outputType == "GOOD"
                || outputType == "DEFECT"
                || outputType == "LOSS";
        }
    }
}
