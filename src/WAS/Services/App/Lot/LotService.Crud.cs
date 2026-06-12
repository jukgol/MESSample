using Dapper;
using Shared.Models.App;

namespace WAS.Services.App
{
    public partial class LotService
    {
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
    }
}
