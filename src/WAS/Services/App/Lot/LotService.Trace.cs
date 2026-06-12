using Shared.Models.App;

namespace WAS.Services.App
{
    public partial class LotService
    {
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
    }
}
