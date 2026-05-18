using Microsoft.AspNetCore.Mvc;
using WAS.Services.Admin.Table;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;
using Shared.Models.Admin;

namespace WAS.Controllers.Admin.Table
{
    [ApiController]
    [Route("api/admin/[controller]")]
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
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public async Task<ActionResult<IEnumerable<string>>> GetTables()
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper();
                var tables = await _tableDataService.GetTablesAsync(schemaName);
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"테이블 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{tableName}/data")]
        [ProducesResponseType(typeof(TableDataResponse), 200)]
        public async Task<ActionResult<TableDataResponse>> GetTableData(string tableName)
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper(); 
                var upperTableName = tableName.ToUpper();      
                
                var rows = await _tableDataService.GetTableDataAsync(schemaName, upperTableName);
                var metadata = await _tableDataService.GetTableMetadataAsync(schemaName, upperTableName);

                var columns = metadata.Select(m => m.Name).ToList();

                return Ok(new TableDataResponse
                { 
                    Columns = columns,
                    Rows = rows.ToList(),
                    Metadata = metadata.ToList() 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"데이터 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("{tableName}/row")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> InsertRow(string tableName, [FromBody] Dictionary<string, object> data)
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper();
                await _tableDataService.InsertRowAsync(schemaName, tableName.ToUpper(), data);
                return Ok(new ActionResponse { Message = "데이터가 성공적으로 추가되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"행 추가 실패: {ex.Message}" });
            }
        }

        [HttpPost("{tableName}/save-csv")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> SaveTableDataAsCsv(string tableName)
        {
            try
            {
                var schemaName = GetCurrentSchema().ToUpper();
                var fileName = await _tableDataService.SaveTableDataAsCsvAsync(schemaName, tableName.ToUpper());

                return Ok(new ActionResponse { Message = $"CSV 파일이 성공적으로 저장되었습니다.\n파일명: {fileName}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"CSV 저장 실패: {ex.Message}" });
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
