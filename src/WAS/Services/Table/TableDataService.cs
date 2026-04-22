using Oracle.ManagedDataAccess.Client;
using System.Data;
using WAS.Data;
using WAS.Models;

namespace WAS.Services.Table
{
    public class TableDataService : ITableDataService
    {
        private readonly IDbConnect _dbConnect;
        private readonly IScriptExecutor _scriptExecutor;

        public TableDataService(IDbConnect dbConnect, IScriptExecutor scriptExecutor)
        {
            _dbConnect = dbConnect;
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<dynamic>> GetTableDataAsync(string schemaName, string tableName)
        {
            var parameters = new OracleParameter[]
            {
                new OracleParameter("SchemaName", schemaName),
                new OracleParameter("TableName", tableName)
            };
            return await _scriptExecutor.ExecuteQueryAsync<dynamic>("GET_TABLE_DATA", parameters);
        }

        public async Task<IEnumerable<ColumnMetadata>> GetTableMetadataAsync(string schemaName, string tableName)
        {
            var parameters = new OracleParameter[]
            {
                new OracleParameter("SchemaName", schemaName),
                new OracleParameter("TableName", tableName)
            };
            return await _scriptExecutor.ExecuteQueryAsync<ColumnMetadata>("GET_TABLE_METADATA", parameters);
        }

        public async Task InsertRowAsync(string schemaName, string tableName, Dictionary<string, object> data)
        {
            var columns = string.Join(", ", data.Keys);
            var values = string.Join(", ", data.Keys.Select(k => ":" + k));
            var query = $"INSERT INTO {schemaName}.{tableName} ({columns}) VALUES ({values})";

            var parameters = data.Select(kv => new OracleParameter(kv.Key, kv.Value ?? DBNull.Value)).ToArray();
            await _scriptExecutor.ExecuteNonQueryAsync(query, parameters);
        }
    }
}
