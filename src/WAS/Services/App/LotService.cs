using Shared.Models.App;
using Bogus;
using Dapper;
using System.Data;
using System.Linq;
using WAS.Data;

namespace WAS.Services.App
{
    public class LotService : ILotService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IItemService _itemService;
        private readonly DbProvider _db;

        public LotService(IScriptExecutor scriptExecutor, IItemService itemService, DbProvider db)
        {
            _scriptExecutor = scriptExecutor;
            _itemService = itemService;
            _db = db;
        }

        public async Task<IEnumerable<LotDto>> GetLotsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotDto>("App/Lot/GET_LOT_LIST");
        }

        public async Task CreateLotAsync(LotCreateDto dto)
        {
            await CreateLotWithInitialDataAsync(dto);
        }

        public async Task<int> CreateLotWithInitialDataAsync(
            LotCreateDto dto,
            string traceType = "EXTERNAL_RECEIVE",
            string? refType = null,
            int? refId = null)
        {
            if (dto.ItemID <= 0) throw new ArgumentException("ItemID must be greater than 0.");
            if (string.IsNullOrWhiteSpace(dto.LotNo)) throw new ArgumentException("LotNo is required.");
            if (dto.Qty < 0) throw new ArgumentException("Qty cannot be negative.");

            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var lotId = await InsertLotAsync(connection, transaction, dto.ItemID, dto.LotNo, dto.Qty, dto.Status);
                await InsertLotStockAsync(connection, transaction, lotId, dto.Qty);
                await InsertLotStockHistoryAsync(connection, transaction, lotId, "CREATE", 0, dto.Qty, dto.Qty, "Lot created", refType, refId);
                await InsertLotTraceAsync(connection, transaction, null, lotId, traceType, null, dto.Qty, null, refType, refId);

                transaction.Commit();
                return lotId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<int> CreateProductionLotAsync(
            LotCreateDto dto,
            int? processStepExecutionId = null,
            string? refType = null,
            int? refId = null)
        {
            if (dto.ItemID <= 0) throw new ArgumentException("ItemID must be greater than 0.");
            if (string.IsNullOrWhiteSpace(dto.LotNo)) throw new ArgumentException("LotNo is required.");

            var status = string.IsNullOrWhiteSpace(dto.Status) ? "IN_PROGRESS" : dto.Status.Trim();

            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var lotId = await InsertLotAsync(connection, transaction, dto.ItemID, dto.LotNo, dto.Qty, status);
                await InsertLotStockAsync(connection, transaction, lotId, 0);
                await InsertLotStockHistoryAsync(connection, transaction, lotId, "CREATE", 0, 0, 0, "Production lot created", refType, refId);
                await InsertLotTraceAsync(connection, transaction, null, lotId, "PRODUCTION_APPROVAL", null, 0, processStepExecutionId, refType, refId);

                transaction.Commit();
                return lotId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task IncreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null)
        {
            if (qty <= 0) throw new ArgumentException("Increase quantity must be greater than 0.");
            await ChangeLotStockAsync(lotId, qty, "INCREASE", reason, refType, refId);
        }

        public async Task DecreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null)
        {
            if (qty <= 0) throw new ArgumentException("Decrease quantity must be greater than 0.");
            await ChangeLotStockAsync(lotId, -qty, "DECREASE", reason, refType, refId);
        }

        public async Task AdjustLotStockAsync(int lotId, int targetQty, string reason, string? refType = null, int? refId = null)
        {
            if (targetQty < 0) throw new ArgumentException("Target quantity cannot be negative.");

            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var beforeQty = await GetCurrentQtyForUpdateAsync(connection, transaction, lotId);
                var changeQty = targetQty - beforeQty;

                await UpdateLotStockAsync(connection, transaction, lotId, targetQty);
                await InsertLotStockHistoryAsync(connection, transaction, lotId, "ADJUST", beforeQty, changeQty, targetQty, reason, refType, refId);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task CreateLotTraceAsync(LotTraceCreateDto dto)
        {
            if (dto.ChildLotID <= 0) throw new ArgumentException("ChildLotID must be greater than 0.");

            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                await InsertLotTraceAsync(
                    connection,
                    transaction,
                    dto.ParentLotID,
                    dto.ChildLotID,
                    string.IsNullOrWhiteSpace(dto.TraceType) ? "PROCESS_OUTPUT" : dto.TraceType.Trim().ToUpperInvariant(),
                    dto.InputQty,
                    dto.OutputQty,
                    dto.ProcessStepExecutionID,
                    string.IsNullOrWhiteSpace(dto.RefType) ? null : dto.RefType.Trim(),
                    dto.RefID);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task UpdateLotAsync(int id, LotUpdateDto dto)
        {
            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                await connection.ExecuteAsync(
                    @"UPDATE LOT
                      SET QTY = :Qty,
                          STATUS = :Status
                      WHERE LOT_ID = :LotId",
                    new
                    {
                        LotId = id,
                        Qty = dto.Qty,
                        Status = dto.Status
                    },
                    transaction);

                var beforeQty = await GetCurrentQtyForUpdateAsync(connection, transaction, id);
                if (beforeQty != dto.Qty)
                {
                    await UpdateLotStockAsync(connection, transaction, id, dto.Qty);
                    await InsertLotStockHistoryAsync(connection, transaction, id, "ADJUST", beforeQty, dto.Qty - beforeQty, dto.Qty, "Lot updated", "LOT", id);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task DeleteLotAsync(int id)
        {
            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                await connection.ExecuteAsync("DELETE FROM LOT_TRACE WHERE CHILD_LOT_ID = :LotId OR PARENT_LOT_ID = :LotId", new { LotId = id }, transaction);
                await connection.ExecuteAsync("DELETE FROM LOT_STOCK_HISTORY WHERE LOT_ID = :LotId", new { LotId = id }, transaction);
                await connection.ExecuteAsync("DELETE FROM LOT_STOCK WHERE LOT_ID = :LotId", new { LotId = id }, transaction);
                await connection.ExecuteAsync("DELETE FROM LOT WHERE LOT_ID = :LotId", new { LotId = id }, transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task GenerateDummyLotsAsync(int count)
        {
            var items = await _itemService.GetItemsAsync();
            var itemIds = items.Select(x => x.ItemID).ToList();

            if (itemIds.Count == 0)
            {
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "Dummy PCB Type A",
                    ItemType = "RawMaterial",
                    Unit = "EA",
                    Description = "Auto-generated master item for testing."
                });
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "Dummy Resistor R01",
                    ItemType = "Component",
                    Unit = "EA",
                    Description = "Auto-generated master item for testing."
                });

                items = await _itemService.GetItemsAsync();
                itemIds = items.Select(x => x.ItemID).ToList();
            }

            var faker = new Faker<LotCreateDto>()
                .RuleFor(l => l.ItemID, f => f.PickRandom(itemIds))
                .RuleFor(l => l.LotNo, f => $"LOT-{f.Date.Recent():yyyyMMdd}-{f.Random.AlphaNumeric(4).ToUpper()}")
                .RuleFor(l => l.Qty, f => f.Random.Number(10, 1000))
                .RuleFor(l => l.Status, f => f.PickRandom("RECEIVED", "IN_PROGRESS", "INSPECTION", "DONE"));

            var dummyLots = faker.Generate(count);

            foreach (var dummy in dummyLots)
            {
                await CreateLotAsync(dummy);
            }
        }

        private async Task ChangeLotStockAsync(int lotId, int changeQty, string changeType, string reason, string? refType, int? refId)
        {
            using var connection = _db.CreateConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                var beforeQty = await GetCurrentQtyForUpdateAsync(connection, transaction, lotId);
                var afterQty = beforeQty + changeQty;

                if (afterQty < 0)
                {
                    throw new InvalidOperationException($"Lot stock cannot be negative. LotId={lotId}, CurrentQty={beforeQty}, ChangeQty={changeQty}");
                }

                await UpdateLotStockAsync(connection, transaction, lotId, afterQty);
                await InsertLotStockHistoryAsync(connection, transaction, lotId, changeType, beforeQty, changeQty, afterQty, reason, refType, refId);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

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
