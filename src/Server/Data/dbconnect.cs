using Oracle.ManagedDataAccess.Client;
using System.Data;
using Server.Services;
using System.Text.Json;

namespace Server.Data
{
    public class DbProvider
    {
        private readonly IConfiguration _configuration;
        private readonly LocalData _localData;

        public DbProvider(IConfiguration configuration, LocalData localData)
        {
            _configuration = configuration;
            _localData = localData;
        }

        public IDbConnection CreateConnection()
        {
            // 1. LocalData에서 저장된 설정 읽기 (동기적으로 읽기 위해 직접 로직 수행)
            string storagePath = Path.Combine(AppContext.BaseDirectory, "Storage", "connectdata.json");
            
            if (File.Exists(storagePath))
            {
                var json = File.ReadAllText(storagePath);
                var data = JsonSerializer.Deserialize<Models.ConnectionData>(json);
                
                if (data != null && !string.IsNullOrEmpty(data.UserId))
                {
                    // 저장된 정보가 있으면 커스텀 연결 생성 (기본 포트 등 유지)
                    return CreateCustomConnection("localhost", 1521, "FREE", data.UserId, data.Password);
                }
            }

            // 2. 저장된 정보가 없으면 appsettings.json의 기본값 사용
            var connectionString = _configuration.GetConnectionString("OracleDb");
            return new OracleConnection(connectionString);
        }

        public IDbConnection CreateCustomConnection(string host, int port, string serviceName, string userId, string password)
        {
            var connectionString = $"Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={host})(PORT={port}))(CONNECT_DATA=(SERVICE_NAME={serviceName})));User Id={userId};Password={password};";
            return new OracleConnection(connectionString);
        }
    }
}
