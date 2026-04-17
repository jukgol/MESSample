using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly IDbConnect _dbConnect;

        public DbTestController(IDbConnect dbConnect)
        {
            _dbConnect = dbConnect;
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
                var userId = await _dbConnect.GetCurrentUserIdAsync();
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
                var tables = await _dbConnect.GetTablesAsync();
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("schemas")]
        public async Task<IActionResult> GetSchemas()
        {
            try
            {
                var schemas = await _dbConnect.GetSchemasAsync();
                return Ok(schemas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"스키마 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("schemas/{schemaName}/privileges")]
        public async Task<IActionResult> GetSchemaPrivileges([FromRoute] string schemaName)
        {
            if (string.IsNullOrEmpty(schemaName)) return BadRequest();
            
            try
            {
                // URL 디코딩은 ASP.NET Core가 자동으로 수행하지만 명시적으로 처리 로직 확인 가능
                var privs = await _dbConnect.GetSchemaPrivilegesAsync(schemaName);
                var result = privs.Select(p => new { p.Type, p.Name });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"권한 조회 실패: {ex.Message}" });
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
    }

    public class OracleConnRequest
    {
        public string Host { get; set; } = "localhost";
        public int Port { get; set; } = 1521;
        public string ServiceName { get; set; } = "FREE";
        public string UserId { get; set; } = "system";
        public string Password { get; set; } = "oracle";
    }
}
