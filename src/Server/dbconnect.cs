using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Server
{
    public class dbconnect
    {
        private readonly string _connectionString;

        public dbconnect(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("OracleDb") ?? throw new InvalidOperationException("Connection string 'OracleDb' not found in appsettings.json");
        }

        public IDbConnection CreateConnection()
        {
            return new OracleConnection(_connectionString);
        }

        public async Task<bool> TestConnectionAsync()
        {
            using var connection = new OracleConnection(_connectionString);
            try
            {
                await connection.OpenAsync();
                return true;
            }
            catch (Exception ex)
            {
                // 실 운영 환경에서는 로깅을 권장합니다.
                Console.WriteLine($"Oracle Connection Error: {ex.Message}");
                return false;
            }
        }
    }
}
