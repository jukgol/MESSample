using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Server.Data
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

        // 특정 정보로 동적 연결 객체를 생성하는 기능도 데이터 레이어에서 제공합니다.
        public IDbConnection CreateCustomConnection(string host, int port, string serviceName, string userId, string password)
        {
            string customConnStr = $"Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={host})(PORT={port}))(CONNECT_DATA=(SERVICE_NAME={serviceName})));User Id={userId};Password={password};";
            return new OracleConnection(customConnStr);
        }
    }
}
