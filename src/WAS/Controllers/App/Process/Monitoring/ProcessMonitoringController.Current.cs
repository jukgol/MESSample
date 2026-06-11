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
    }
}
