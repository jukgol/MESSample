using Dapper;
using System.Data;

namespace WAS.Services.App
{
    public partial class LotService
    {
        private static async Task<int> InsertLotAsync(IDbConnection connection, IDbTransaction transaction, int itemId, string lotNo, int qty, string status)
        {
            var parameters = new DynamicParameters();
            parameters.Add("ItemId", itemId);
            parameters.Add("LotNo", lotNo.Trim());
            parameters.Add("Qty", qty);
            parameters.Add("Status", string.IsNullOrWhiteSpace(status) ? "CREATED" : status.Trim());
            parameters.Add("LotId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                @"INSERT INTO LOT (ITEM_ID, LOT_NO, QTY, RECEIVED_AT, STATUS)
                  VALUES (:ItemId, :LotNo, :Qty, CURRENT_TIMESTAMP, :Status)
                  RETURNING LOT_ID INTO :LotId",
                parameters,
                transaction);

            return parameters.Get<int>("LotId");
        }

        private static async Task InsertLotStockAsync(IDbConnection connection, IDbTransaction transaction, int lotId, int currentQty)
        {
            await connection.ExecuteAsync(
                @"INSERT INTO LOT_STOCK (LOT_ID, CURRENT_QTY, RESERVED_QTY, UPDATED_AT, CREATED_AT)
                  VALUES (:LotId, :CurrentQty, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                new
                {
                    LotId = lotId,
                    CurrentQty = currentQty
                },
                transaction);
        }

        private static async Task<int> GetCurrentQtyForUpdateAsync(IDbConnection connection, IDbTransaction transaction, int lotId)
        {
            var currentQty = await connection.QuerySingleOrDefaultAsync<int?>(
                "SELECT CURRENT_QTY FROM LOT_STOCK WHERE LOT_ID = :LotId FOR UPDATE",
                new { LotId = lotId },
                transaction);

            if (!currentQty.HasValue)
            {
                throw new InvalidOperationException($"Lot stock was not found. LotId={lotId}");
            }

            return currentQty.Value;
        }

        private static async Task UpdateLotStockAsync(IDbConnection connection, IDbTransaction transaction, int lotId, int currentQty)
        {
            await connection.ExecuteAsync(
                @"UPDATE LOT_STOCK
                  SET CURRENT_QTY = :CurrentQty,
                      UPDATED_AT = CURRENT_TIMESTAMP
                  WHERE LOT_ID = :LotId",
                new
                {
                    LotId = lotId,
                    CurrentQty = currentQty
                },
                transaction);
        }

        private static async Task InsertLotStockHistoryAsync(
            IDbConnection connection,
            IDbTransaction transaction,
            int lotId,
            string changeType,
            int beforeQty,
            int changeQty,
            int afterQty,
            string? reason,
            string? refType,
            int? refId)
        {
            await connection.ExecuteAsync(
                @"INSERT INTO LOT_STOCK_HISTORY
                    (LOT_ID, CHANGE_TYPE, BEFORE_QTY, CHANGE_QTY, AFTER_QTY, REASON, REF_TYPE, REF_ID, CREATED_AT)
                  VALUES
                    (:LotId, :ChangeType, :BeforeQty, :ChangeQty, :AfterQty, :Reason, :RefType, :RefId, CURRENT_TIMESTAMP)",
                new
                {
                    LotId = lotId,
                    ChangeType = changeType,
                    BeforeQty = beforeQty,
                    ChangeQty = changeQty,
                    AfterQty = afterQty,
                    Reason = reason,
                    RefType = refType,
                    RefId = refId
                },
                transaction);
        }

        private static async Task InsertLotTraceAsync(
            IDbConnection connection,
            IDbTransaction transaction,
            int? parentLotId,
            int childLotId,
            string traceType,
            int? inputQty,
            int outputQty,
            int? processStepExecutionId,
            string? refType,
            int? refId)
        {
            await connection.ExecuteAsync(
                @"INSERT INTO LOT_TRACE
                    (PARENT_LOT_ID, CHILD_LOT_ID, TRACE_TYPE, INPUT_QTY, OUTPUT_QTY, PROCESS_STEP_EXECUTION_ID, REF_TYPE, REF_ID, CREATED_AT)
                  VALUES
                    (:ParentLotId, :ChildLotId, :TraceType, :InputQty, :OutputQty, :ProcessStepExecutionId, :RefType, :RefId, CURRENT_TIMESTAMP)",
                new
                {
                    ParentLotId = parentLotId,
                    ChildLotId = childLotId,
                    TraceType = traceType,
                    InputQty = inputQty,
                    OutputQty = outputQty,
                    ProcessStepExecutionId = processStepExecutionId,
                    RefType = refType,
                    RefId = refId
                },
                transaction);
        }
    }
}
