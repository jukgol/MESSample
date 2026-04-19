using Server.Attributes;
using Server.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;

namespace Server.Services
{
    public class TableService : ITableService
    {
        private readonly DbProvider _db;

        public TableService(DbProvider db)
        {
            _db = db;
        }

        [Log("DB 테이블 목록 조회")]
        public async Task<List<string>> GetTablesAsync()
        {
            var tables = new List<string>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_TABLE_LIST.sql");
            string sqlText = File.Exists(queryPath) ? await File.ReadAllTextAsync(queryPath) : "SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME";

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;
            
            using var reader = command.ExecuteReader();
            while (reader.Read()) tables.Add(reader.GetString(0));
            return tables;
        }

        [Log("테이블 데이터 조회")]
        public async Task<DataTable> GetTableDataAsync(string tableName)
        {
            var dt = new DataTable();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = $"SELECT * FROM {tableName.ToUpper()} FETCH FIRST 100 ROWS ONLY";
            
            using var reader = command.ExecuteReader();
            dt.Load(reader);
            return dt;
        }

        [Log("테이블 데이터 추가")]
        public async Task<(bool Success, string Message)> InsertRowAsync(string tableName, Dictionary<string, object> rowData)
        {
            try
            {
                using var connection = _db.CreateConnection();
                if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
                else connection.Open();

                var columns = string.Join(", ", rowData.Keys);
                var parameters = string.Join(", ", rowData.Keys.Select(k => ":" + k));
                var sql = $"INSERT INTO {tableName.ToUpper()} ({columns}) VALUES ({parameters})";

                using var command = connection.CreateCommand();
                command.CommandText = sql;

                foreach (var kvp in rowData)
                {
                    var p = command.CreateParameter();
                    p.ParameterName = kvp.Key;
                    p.Value = kvp.Value ?? DBNull.Value;
                    command.Parameters.Add(p);
                }

                await (command as System.Data.Common.DbCommand)?.ExecuteNonQueryAsync()!;
                return (true, "데이터가 성공적으로 추가되었습니다.");
            }
            catch (Exception ex)
            {
                return (false, $"데이터 추가 실패: {ex.Message}");
            }
        }
    }
}
