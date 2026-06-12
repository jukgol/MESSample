namespace WAS.Services.App
{
    public partial class LotService
    {
        public async Task IncreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null)
        {
            if (qty <= 0) throw new ArgumentException("Increase quantity must be greater than 0.");
            await ChangeLotStockAsync(lotId, qty, "INCREASE", reason, refType, refId, resetReservedQty: false);
        }

        public async Task DecreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null)
        {
            if (qty <= 0) throw new ArgumentException("Decrease quantity must be greater than 0.");
            await ChangeLotStockAsync(lotId, -qty, "DECREASE", reason, refType, refId, resetReservedQty: true);
        }

        public async Task ConsumeLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null)
        {
            if (qty <= 0) throw new ArgumentException("Consume quantity must be greater than 0.");
            await ChangeLotStockAsync(lotId, -qty, "CONSUME", reason, refType, refId, resetReservedQty: true);
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

        private async Task ChangeLotStockAsync(int lotId, int changeQty, string changeType, string reason, string? refType, int? refId, bool resetReservedQty)
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

                if (resetReservedQty)
                {
                    await UpdateLotStockAsync(connection, transaction, lotId, afterQty, 0);
                }
                else
                {
                    await UpdateLotStockAsync(connection, transaction, lotId, afterQty);
                }
                await InsertLotStockHistoryAsync(connection, transaction, lotId, changeType, beforeQty, changeQty, afterQty, reason, refType, refId);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}
