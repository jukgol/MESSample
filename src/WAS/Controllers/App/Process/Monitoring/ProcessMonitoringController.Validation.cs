using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;

namespace WAS.Controllers.App
{
    public partial class ProcessMonitoringController
    {
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
