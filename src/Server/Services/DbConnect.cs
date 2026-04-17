using Server.Attributes;
using Server.Data;
using System;
using System.Collections.Generic;
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

        // ... (기존 메서드 생략) ...

        [Log("현재 DB 유저 조회")]
        public async Task<string> GetCurrentUserIdAsync()
        {
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = "SELECT USER FROM DUAL";
            var result = command.ExecuteScalar(); // 동기 방식으로 변경
            return result?.ToString() ?? "Unknown";
        }

        [Log("스키마 권한 조회")]
        public async Task<List<(string Type, string Name)>> GetSchemaPrivilegesAsync(string schemaName)
        {
            var privs = new List<(string Type, string Name)>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_SCHEMA_PRIVS.sql");
            string sqlText = File.Exists(queryPath) ? await File.ReadAllTextAsync(queryPath) : "";

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;
            
            // 바인드 변수 설정 (Oracle은 ParameterName에 콜론을 제외한 이름만 넣는 것이 정석)
            var parameter = command.CreateParameter();
            parameter.ParameterName = "schemaName";
            parameter.Value = schemaName.ToUpper();
            command.Parameters.Add(parameter);

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                privs.Add((reader.GetString(0), reader.GetString(1)));
            }
            return privs;
        }

        [Log("DB 스키마 목록 조회")]
        public async Task<List<string>> GetSchemasAsync()
        {
            var schemas = new List<string>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn)
            {
                await dbConn.OpenAsync();
            }
            else
            {
                connection.Open();
            }

            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_SCHEMA_LIST.sql");
            string sqlText = File.Exists(queryPath) ? await File.ReadAllTextAsync(queryPath) : "SELECT USERNAME FROM ALL_USERS ORDER BY USERNAME";

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                schemas.Add(reader.GetString(0));
            }
            return schemas;
        }

        [Log("DB 테이블 목록 조회")]
        public async Task<List<string>> GetTablesAsync()
        {
            var tables = new List<string>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn)
            {
                await dbConn.OpenAsync();
            }
            else
            {
                connection.Open();
            }

            // SQL 파일 로드 (Scripts/Queries/GET_TABLE_LIST.sql)
            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_TABLE_LIST.sql");
            string sqlText;

            if (File.Exists(queryPath))
            {
                sqlText = await File.ReadAllTextAsync(queryPath);
            }
            else
            {
                // 파일이 없을 경우 대비용 기본 쿼리
                sqlText = "SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME";
            }

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;
            
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                tables.Add(reader.GetString(0));
            }
            return tables;
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
