using Server.Attributes;
using Server.Data;
using System;
using System.Data;
using System.Threading.Tasks;

namespace Server.Services
{
    public class DbConnect : IDbConnect
    {
        private readonly DbProvider _db;

        public DbConnect(DbProvider db)
        {
            _db = db;
        }

        [Log("기본 DB 연결 테스트")]
        public async Task<bool> TestDefaultConnectionAsync()
        {
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn)
            {
                await dbConn.OpenAsync();
            }
            else
            {
                connection.Open();
            }
            return true;
        }

        [Log("커스텀 DB 연결 테스트")]
        public async Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password)
        {
            using var connection = _db.CreateCustomConnection(host, port, serviceName, userId, password);
            if (connection is System.Data.Common.DbConnection dbConn)
            {
                await dbConn.OpenAsync();
            }
            else
            {
                connection.Open();
            }
            return true;
        }

        [Log("DB 현재 시간 조회")]
        public (bool Success, string? Sysdate, string? Error) GetSysdate()
        {
            using var connection = _db.CreateConnection();
            connection.Open();
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL";
            var result = command.ExecuteScalar();
            return (true, result?.ToString(), null);
        }
    }
}
