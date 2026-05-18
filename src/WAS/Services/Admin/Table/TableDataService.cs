using Oracle.ManagedDataAccess.Client;
using System.Data;
using Shared.Models;

namespace WAS.Services.Admin.Table
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

        public async Task<IEnumerable<string>> GetTablesAsync(string schemaName)
        {
            // GET_TABLE_LIST 쿼리를 사용하여 테이블 목록 조회
            // USER_TABLES를 조회하므로 SchemaName 파라미터가 쿼리에 직접적으로 필요하지 않을 수 있으나,
            // 일관성을 위해 전달하거나 추후 ALL_TABLES 조회 시를 대비합니다.
            var results = await _scriptExecutor.ExecuteQueryAsync<dynamic>("GET_TABLE_LIST", null);
            return results.Select(r => (string)r.TABLE_NAME);
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

        public async Task<string> SaveTableDataAsCsvAsync(string schemaName, string tableName)
        {
            var upperTableName = tableName.ToUpper();

            // 1. 데이터 및 컬럼 정보 확보
            var rows = await GetTableDataAsync(schemaName, upperTableName);
            var metadata = await GetTableMetadataAsync(schemaName, upperTableName);
            var columns = metadata.Select(m => m.Name).ToList();

            // 2. CSV 조립
            var csvBuilder = new System.Text.StringBuilder();
            
            // UTF-8 BOM(Byte Order Mark) 문자 추가 (한글 인코딩 깨짐 방지용)
            csvBuilder.Append('\uFEFF');
            csvBuilder.AppendLine(string.Join(",", columns));

            foreach (var row in rows)
            {
                var rowDict = row as IDictionary<string, object>;
                if (rowDict != null)
                {
                    var values = columns.Select(col => {
                        var val = rowDict.ContainsKey(col) ? rowDict[col] : null;
                        if (val == null) return "";
                        
                        var valStr = val.ToString() ?? "";
                        if (valStr.Contains(",") || valStr.Contains("\n") || valStr.Contains("\""))
                        {
                            valStr = "\"" + valStr.Replace("\"", "\"\"") + "\"";
                        }
                        return valStr;
                    });
                    csvBuilder.AppendLine(string.Join(",", values));
                }
            }

            // 3. 디렉토리 검증 및 생성
            var targetDir = System.IO.Path.GetFullPath(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "..", "tabledata"));
            if (!System.IO.Directory.Exists(targetDir))
            {
                System.IO.Directory.CreateDirectory(targetDir);
            }

            var fileName = $"{upperTableName}_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            var filePath = System.IO.Path.Combine(targetDir, fileName);

            // 4. 물리 파일 기록
            await System.IO.File.WriteAllTextAsync(filePath, csvBuilder.ToString(), System.Text.Encoding.UTF8);

            return fileName;
        }
    }
}
