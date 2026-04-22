using Microsoft.AspNetCore.Mvc;
using WAS.Services.Table;

namespace WAS.Controllers.Table
{
    [ApiController]
    [Route("api/table/data")]
    public class TableDataController : ControllerBase
    {
        private readonly ITableDataService _tableDataService;

        public TableDataController(ITableDataService tableDataService)
        {
            _tableDataService = tableDataService;
        }

        [HttpGet("{schemaName}/{tableName}")]
        public async Task<IActionResult> GetTableData(string schemaName, string tableName)
        {
            try
            {
                var data = await _tableDataService.GetTableDataAsync(schemaName, tableName);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 데이터 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{schemaName}/{tableName}/metadata")]
        public async Task<IActionResult> GetTableMetadata(string schemaName, string tableName)
        {
            try
            {
                var metadata = await _tableDataService.GetTableMetadataAsync(schemaName, tableName);
                return Ok(metadata);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 메타데이터 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("{schemaName}/{tableName}")]
        public async Task<IActionResult> InsertRow(string schemaName, string tableName, [FromBody] Dictionary<string, object> data)
        {
            try
            {
                await _tableDataService.InsertRowAsync(schemaName, tableName, data);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"행 추가 실패: {ex.Message}" });
            }
        }
    }
}
