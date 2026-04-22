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

        [Log("기본 DB 연결 테스트")]
        public async Task<bool> TestDefaultConnectionAsync()
        {
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();
            return true;
        }

        [Log("커스텀 DB 연결 테스트")]
        public async Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password)
        {
            using var connection = _db.CreateCustomConnection(host, port, serviceName, userId, password);
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();
            return true;
        }
    }
}
