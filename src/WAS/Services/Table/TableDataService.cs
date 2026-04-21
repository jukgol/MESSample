using WAS.Attributes;
using WAS.Data;
using WAS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.Table
{
    public class TableDataService : ITableDataService
    {
        private readonly DbProvider _db;

        public TableDataService(DbProvider db)
        {
            _db = db;
        }

        [Log("?åÏù¥Î∏?Î©îÌ??∞Ïù¥??Ï°∞Ìöå")]
        public async Task<List<ColumnMetadata>> GetTableMetadataAsync(string tableName)
        {
            var columns = new List<ColumnMetadata>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            // Oracle ?úÏä§??Î∑∞Ïóê??Ïª¨Îüº ?ÅÏÑ∏ ?ïÎ≥¥ Ï°∞Ìöå
            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT COLUMN_NAME, DATA_TYPE, NULLABLE, DATA_DEFAULT, IDENTITY_COLUMN
                FROM ALL_TAB_COLS
                WHERE TABLE_NAME = :t AND HIDDEN_COLUMN = 'NO'
                ORDER BY COLUMN_ID";
            
            var p = command.CreateParameter();
            p.ParameterName = "t";
            p.Value = tableName.ToUpper();
            command.Parameters.Add(p);

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                columns.Add(new ColumnMetadata
                {
                    Name = reader.GetString(0),
                    DataType = reader.GetString(1),
                    IsNullable = reader.GetString(2) == "Y",
                    HasDefault = !reader.IsDBNull(3),
                    IsIdentity = reader.GetString(4) == "YES"
                });
            }
            return columns;
        }

        [Log("DB ?åÏù¥Î∏?Î™©Î°ù Ï°∞Ìöå")]
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

        [Log("?åÏù¥Î∏??∞Ïù¥??Ï°∞Ìöå")]
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

        [Log("?åÏù¥Î∏??∞Ïù¥??Ï∂îÍ?")]
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
                return (true, "?∞Ïù¥?∞Í? ?±Í≥µ?ÅÏúºÎ°?Ï∂îÍ??òÏóà?µÎãà??");
            }
            catch (Exception ex)
            {
                return (false, $"?∞Ïù¥??Ï∂îÍ? ?§Ìå®: {ex.Message}");
            }
        }
    }
}

