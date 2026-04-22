using Microsoft.AspNetCore.Mvc;
using WAS.Services.Table;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace WAS.Controllers.Table
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableDataController : ControllerBase
    {
        private readonly ITableDataService _tableDataService;
        private readonly IConfiguration _configuration;

        public TableDataController(ITableDataService tableDataService, IConfiguration configuration)
        {
            _tableDataService = tableDataService;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper(); // 대문자 변환
                // TODO: 실제 테이블 목록 조회 서비스 호출 필요
                var tables = new[] { "ITEM", "LOT", "PROCESS_STEP", "PROCESS_LOG", "USER_INFO", "USER_ROLE" };
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{tableName}/data")]
        public async Task<IActionResult> GetTableData(string tableName)
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper(); // 대문자 변환
                var upperTableName = tableName.ToUpper();      // 대문자 변환
                
                var rows = await _tableDataService.GetTableDataAsync(schemaName, upperTableName);
                var metadata = await _tableDataService.GetTableMetadataAsync(schemaName, upperTableName);

                var columns = metadata.Select(m => m.Name).ToList();

                return Ok(new 
                { 
                    columns = columns,
                    rows = rows,
                    metadata = metadata 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"데이터 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("{tableName}/row")]
        public async Task<IActionResult> InsertRow(string tableName, [FromBody] Dictionary<string, object> data)
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper();
                await _tableDataService.InsertRowAsync(schemaName, tableName.ToUpper(), data);
                return Ok(new { Message = "데이터가 성공적으로 추가되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"행 추가 실패: {ex.Message}" });
            }
        }

        private string GetCurrentSchema()
        {
            var connString = _configuration.GetConnectionString("OracleDb");
            var match = Regex.Match(connString ?? "", @"User\s+Id=([^;]+)", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value.Trim() : "C##MYUSER";
        }
    }
}
