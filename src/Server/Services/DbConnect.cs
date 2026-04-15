using Server.Data;
using System.Data;

namespace Server.Services
{
    public class DbConnect
    {
        private readonly DbProvider _db;
        private readonly ILogger<DbConnect> _logger;

        public DbConnect(DbProvider db, ILogger<DbConnect> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<bool> TestDefaultConnectionAsync()
        {
            try
            {
                using var connection = _db.CreateConnection();
                if (connection is System.Data.Common.DbConnection dbConn)
                {
                    await dbConn.OpenAsync();
                    return true;
                }
                connection.Open();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "기본 DB 연결 테스트 중 오류 발생");
                return false;
            }
        }

        public async Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password)
        {
            try
            {
                using var connection = _db.CreateCustomConnection(host, port, serviceName, userId, password);
                if (connection is System.Data.Common.DbConnection dbConn)
                {
                    await dbConn.OpenAsync();
                    return true;
                }
                connection.Open();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "커스텀 DB 연결 테스트 중 오류 발생 (Host: {Host})", host);
                return false;
            }
        }

        public (bool Success, string? Sysdate, string? Error) GetSysdate()
        {
            try
            {
                using var connection = _db.CreateConnection();
                connection.Open();
                using var command = connection.CreateCommand();
                command.CommandText = "SELECT SYSDATE FROM DUAL";
                var result = command.ExecuteScalar();
                return (true, result?.ToString(), null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SYSDATE 조회 중 오류 발생");
                return (false, null, ex.Message);
            }
        }
    }
}
