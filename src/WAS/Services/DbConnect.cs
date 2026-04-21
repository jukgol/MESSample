using WAS.Attributes;
using WAS.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace WAS.Services
{
    public class DbConnect : IDbConnect
    {
        private readonly DbProvider _db;

        public DbConnect(DbProvider db)
        {
            _db = db;
        }

        [Log("ê¸°ë³¸ DB ?°ê²° ?ŒìŠ¤??)]
        public async Task<bool> TestDefaultConnectionAsync()
        {
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();
            return true;
        }

        [Log("ì»¤ìŠ¤?€ DB ?°ê²° ?ŒìŠ¤??)]
        public async Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password)
        {
            using var connection = _db.CreateCustomConnection(host, port, serviceName, userId, password);
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();
            return true;
        }

        [Log("DB ?„ìž¬ ?œê°„ ì¡°íšŒ")]
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

