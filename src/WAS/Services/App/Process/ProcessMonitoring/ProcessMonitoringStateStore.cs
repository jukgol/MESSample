using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WAS.Services.App
{
    public class ProcessMonitoringStateStore : IProcessMonitoringStateStore
    {
        private readonly object _lock = new();
        private readonly Dictionary<int, CurrentWorkOrderStateDto> _byWorkOrder = new();
        private readonly Dictionary<string, CurrentProcessStepStateDto> _byEquipment = new(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<int, CurrentProcessStepStateDto> _byExecution = new();

        public IReadOnlyCollection<CurrentWorkOrderStateDto> GetCurrentWorkOrders()
        {
            lock (_lock)
            {
                return _byWorkOrder.Values
                    .Select(CloneWorkOrder)
                    .OrderByDescending(state => state.LastUpdatedAt)
                    .ToList();
            }
        }

        public CurrentWorkOrderStateDto? GetCurrentWorkOrder(int workOrderId)
        {
            lock (_lock)
            {
                return _byWorkOrder.TryGetValue(workOrderId, out var state)
                    ? CloneWorkOrder(state)
                    : null;
            }
        }

        public CurrentProcessStepStateDto? GetCurrentStepByEquipment(string equipmentId)
        {
            lock (_lock)
            {
                if (string.IsNullOrWhiteSpace(equipmentId))
                {
                    return null;
                }

                return _byEquipment.TryGetValue(equipmentId, out var state)
                    ? CloneStep(state)
                    : null;
            }
        }

        public CurrentProcessStepStateDto? GetCurrentStepByExecution(int executionId)
        {
            lock (_lock)
            {
                return _byExecution.TryGetValue(executionId, out var state)
                    ? CloneStep(state)
                    : null;
            }
        }

        public void ReplaceAll(
            IEnumerable<ProcessStepExecutionDto> executions,
            IEnumerable<ProcessInputDto> inputs,
            IEnumerable<ProcessOutputDto> outputs)
        {
            lock (_lock)
            {
                _byWorkOrder.Clear();
                _byEquipment.Clear();
                _byExecution.Clear();

                UpsertWorkOrderCore(executions, inputs, outputs);
            }
        }

        public void UpsertWorkOrder(
            IEnumerable<ProcessStepExecutionDto> executions,
            IEnumerable<ProcessInputDto> inputs,
            IEnumerable<ProcessOutputDto> outputs)
        {
            lock (_lock)
            {
                UpsertWorkOrderCore(executions, inputs, outputs);
            }
        }

        private void UpsertWorkOrderCore(
            IEnumerable<ProcessStepExecutionDto> executions,
            IEnumerable<ProcessInputDto> inputs,
            IEnumerable<ProcessOutputDto> outputs)
        {
            var executionList = executions.OrderBy(row => row.SeqNo).ToList();
            if (executionList.Count == 0)
            {
                return;
            }

            var workOrderId = executionList[0].WorkOrderID;
            RemoveWorkOrderIndexes(workOrderId);

            var inputLookup = inputs
                .GroupBy(input => input.ProcessStepExecutionID)
                .ToDictionary(group => group.Key, group => group.ToList());

            var outputLookup = outputs
                .GroupBy(output => output.ProcessStepExecutionID)
                .ToDictionary(group => group.Key, group => group.ToList());

            CurrentWorkOrderStateDto? workOrder = null;

            foreach (var execution in executionList)
            {
                workOrder ??= new CurrentWorkOrderStateDto
                {
                    WorkOrderID = execution.WorkOrderID,
                    WorkOrderNo = execution.WorkOrderNo,
                    ProcessMasterID = execution.ProcessMasterID,
                    ProcessMasterName = execution.ProcessMasterName,
                    OrderQty = execution.OrderQty,
                    WorkerUserID = execution.WorkerUserID,
                    WorkerName = execution.WorkerName,
                    Status = ResolveWorkOrderStatus(executionList),
                    ApprovedAt = execution.ApprovedAt,
                    StartedAt = execution.StartedAt,
                    LastUpdatedAt = execution.UpdatedAt ?? execution.StartedAt ?? execution.CreatedAt
                };

                var step = new CurrentProcessStepStateDto
                {
                    ProcessStepExecutionID = execution.ProcessStepExecutionID,
                    ProcessStepID = execution.ProcessStepID,
                    StepName = execution.StepName,
                    SeqNo = execution.SeqNo,
                    EquipmentID = execution.EquipmentID,
                    WorkerUserID = execution.WorkerUserID,
                    WorkerName = execution.WorkerName,
                    Status = execution.Status,
                    StartedAt = execution.StartedAt,
                    EndedAt = execution.EndedAt,
                    LastUpdatedAt = execution.UpdatedAt ?? execution.StartedAt ?? execution.CreatedAt,
                    Inputs = inputLookup.TryGetValue(execution.ProcessStepExecutionID, out var stepInputs)
                        ? stepInputs.Select(input => new CurrentProcessInputStateDto
                        {
                            ProcessInputID = input.ProcessInputID,
                            ProcessStepExecutionID = input.ProcessStepExecutionID,
                            LotID = input.LotID,
                            LotNo = input.LotNo,
                            ItemID = input.ItemID,
                            ItemName = input.ItemName,
                            InputQty = input.InputQty,
                            UsedQty = input.UsedQty,
                            RemainQty = input.RemainQty,
                            InputAt = input.InputAt
                        }).ToList()
                        : new List<CurrentProcessInputStateDto>(),
                    Outputs = outputLookup.TryGetValue(execution.ProcessStepExecutionID, out var stepOutputs)
                        ? stepOutputs.Select(output => new CurrentProcessOutputStateDto
                        {
                            ProcessOutputID = output.ProcessOutputID,
                            ProcessStepExecutionID = output.ProcessStepExecutionID,
                            LotID = output.LotID,
                            LotNo = output.LotNo,
                            ItemID = output.ItemID,
                            ItemName = output.ItemName,
                            TargetQty = output.TargetQty,
                            OutputQty = output.OutputQty,
                            OutputType = output.OutputType,
                            OutputAt = output.OutputAt
                        }).ToList()
                        : new List<CurrentProcessOutputStateDto>()
                };

                workOrder.Steps.Add(step);
                workOrder.StartedAt = MinDate(workOrder.StartedAt, step.StartedAt);
                workOrder.LastUpdatedAt = MaxDate(workOrder.LastUpdatedAt, step.LastUpdatedAt);

                _byExecution[step.ProcessStepExecutionID] = step;
                if (!string.IsNullOrWhiteSpace(step.EquipmentID))
                {
                    _byEquipment[step.EquipmentID] = step;
                }
            }

            if (workOrder != null)
            {
                _byWorkOrder[workOrder.WorkOrderID] = workOrder;
            }
        }

        private void RemoveWorkOrderIndexes(int workOrderId)
        {
            if (!_byWorkOrder.TryGetValue(workOrderId, out var existing))
            {
                return;
            }

            foreach (var step in existing.Steps)
            {
                _byExecution.Remove(step.ProcessStepExecutionID);
                if (!string.IsNullOrWhiteSpace(step.EquipmentID))
                {
                    _byEquipment.Remove(step.EquipmentID);
                }
            }

            _byWorkOrder.Remove(workOrderId);
        }

        private static string ResolveWorkOrderStatus(IEnumerable<ProcessStepExecutionDto> executions)
        {
            var statuses = executions.Select(row => row.Status).ToList();
            if (statuses.Any(status => status == "RUNNING")) return "RUNNING";
            if (statuses.Any(status => status == "PAUSED")) return "PAUSED";
            if (statuses.Any(status => status == "FAILED")) return "FAILED";
            if (statuses.Count > 0 && statuses.All(status => status == "DONE")) return "DONE";
            return "WAITING";
        }

        private static DateTime? MinDate(DateTime? current, DateTime? candidate)
        {
            if (!candidate.HasValue) return current;
            if (!current.HasValue) return candidate;
            return candidate.Value < current.Value ? candidate : current;
        }

        private static DateTime MaxDate(DateTime current, DateTime candidate)
        {
            return candidate > current ? candidate : current;
        }

        private static CurrentWorkOrderStateDto CloneWorkOrder(CurrentWorkOrderStateDto source)
        {
            return new CurrentWorkOrderStateDto
            {
                WorkOrderID = source.WorkOrderID,
                WorkOrderNo = source.WorkOrderNo,
                ProcessMasterID = source.ProcessMasterID,
                ProcessMasterName = source.ProcessMasterName,
                OrderQty = source.OrderQty,
                WorkerUserID = source.WorkerUserID,
                WorkerName = source.WorkerName,
                Status = source.Status,
                ApprovedAt = source.ApprovedAt,
                StartedAt = source.StartedAt,
                LastUpdatedAt = source.LastUpdatedAt,
                Steps = source.Steps.Select(CloneStep).OrderBy(step => step.SeqNo).ToList()
            };
        }

        private static CurrentProcessStepStateDto CloneStep(CurrentProcessStepStateDto source)
        {
            return new CurrentProcessStepStateDto
            {
                ProcessStepExecutionID = source.ProcessStepExecutionID,
                ProcessStepID = source.ProcessStepID,
                StepName = source.StepName,
                SeqNo = source.SeqNo,
                EquipmentID = source.EquipmentID,
                WorkerUserID = source.WorkerUserID,
                WorkerName = source.WorkerName,
                Status = source.Status,
                StartedAt = source.StartedAt,
                EndedAt = source.EndedAt,
                LastUpdatedAt = source.LastUpdatedAt,
                Inputs = source.Inputs.Select(input => new CurrentProcessInputStateDto
                {
                    ProcessInputID = input.ProcessInputID,
                    ProcessStepExecutionID = input.ProcessStepExecutionID,
                    LotID = input.LotID,
                    LotNo = input.LotNo,
                    ItemID = input.ItemID,
                    ItemName = input.ItemName,
                    InputQty = input.InputQty,
                    UsedQty = input.UsedQty,
                    RemainQty = input.RemainQty,
                    InputAt = input.InputAt
                }).ToList(),
                Outputs = source.Outputs.Select(output => new CurrentProcessOutputStateDto
                {
                    ProcessOutputID = output.ProcessOutputID,
                    ProcessStepExecutionID = output.ProcessStepExecutionID,
                    LotID = output.LotID,
                    LotNo = output.LotNo,
                    ItemID = output.ItemID,
                    ItemName = output.ItemName,
                    TargetQty = output.TargetQty,
                    OutputQty = output.OutputQty,
                    OutputType = output.OutputType,
                    OutputAt = output.OutputAt
                }).ToList()
            };
        }
    }
}
