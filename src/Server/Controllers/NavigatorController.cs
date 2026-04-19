using Microsoft.AspNetCore.Mvc;
using Server.Services;
using Server.Models;
using System.Data;
using System.Linq;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NavigatorController : ControllerBase
    {
        private readonly IDbConnect _dbConnect;
        private readonly ISchemaService _schemaService;
        private readonly ITableService _tableService;

        public NavigatorController(IDbConnect dbConnect, ISchemaService schemaService, ITableService tableService)
        {
            _dbConnect = dbConnect;
            _schemaService = schemaService;
            _tableService = tableService;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            var isSuccess = await _dbConnect.TestDefaultConnectionAsync();

            if (isSuccess)
            {
                return Ok(new { Message = "Oracle DB 연동 성공!", Timestamp = DateTime.Now });
            }
            else
            {
                return StatusCode(500, new { Message = "DB 연결에 실패했습니다." });
            }
        }

        [HttpGet("current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = await _schemaService.GetCurrentUserIdAsync();
                return Ok(new { UserId = userId });
            }
            catch (Exception ex)
            {
                return Ok(new { UserId = "Unknown", Error = ex.Message });
            }
        }

        [HttpGet("query")]
        public IActionResult RunSampleQuery()
        {
            var result = _dbConnect.GetSysdate();
            if (result.Success)
            {
                return Ok(new { Message = "쿼리 실행 성공", Sysdate = result.Sysdate });
            }
            else
            {
                return StatusCode(500, new { Message = $"쿼리 실행 중 오류 발생: {result.Error}" });
            }
        }

        [HttpGet("tables")]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                var tables = await _tableService.GetTablesAsync();
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("test-custom")]
        public async Task<IActionResult> TestCustomConnection([FromBody] OracleConnRequest request)
        {
            var isSuccess = await _dbConnect.TestCustomConnectionAsync(
                request.Host, 
                request.Port, 
                request.ServiceName, 
                request.UserId, 
                request.Password);

            if (isSuccess)
            {
                return Ok(new { Message = "연결 성공!", Details = $"Connected to {request.Host}:{request.Port}/{request.ServiceName}" });
            }
            else
            {
                return BadRequest(new { Message = "연결 실패. 입력 정보를 다시 확인해 주세요." });
            }
        }

        [HttpGet("tables/{tableName}/data")]
        public async Task<IActionResult> GetTableData([FromRoute] string tableName)
        {
            if (string.IsNullOrEmpty(tableName)) return BadRequest();

            try
            {
                var dt = await _tableService.GetTableDataAsync(tableName);
                
                // DataTable을 List<Dictionary> 형태로 변환 (JSON 직렬화 가능하도록)
                var columns = dt.Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToList();
                var data = dt.AsEnumerable().Select(row => 
                    columns.ToDictionary(col => col, col => row[col] == DBNull.Value ? null : row[col])
                ).ToList();

                return Ok(new { Columns = columns, Rows = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"데이터 조회 실패: {ex.Message}" });
            }
        }
    }
}
