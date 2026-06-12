using Shared.Models.App;

namespace WAS.Services.App
{
    public partial class LotService
    {
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
    }
}
