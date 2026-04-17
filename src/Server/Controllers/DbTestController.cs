using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly IDbConnect _dbConnect;
        private readonly LocalData _localData;

        public DbTestController(IDbConnect dbConnect, LocalData localData)
        {
            _dbConnect = dbConnect;
            _localData = localData;
        }

        [HttpGet("local-data")]
        public async Task<IActionResult> GetLocalData()
        {
            var data = await _localData.GetConnectionDataAsync();
            return Ok(data);
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            var savedData = await _localData.GetConnectionDataAsync();
            
            if (string.IsNullOrEmpty(savedData.UserId))
            {
                return BadRequest(new { Message = "저장된 접속 정보가 없습니다." });
            }

            var isSuccess = await _dbConnect.TestCustomConnectionAsync(
                "localhost", 
                1521,        
                "FREE",      
                savedData.UserId, 
                savedData.Password);

            if (isSuccess)
            {
                return Ok(new { Message = "Oracle DB 자동 연동 성공!", Timestamp = DateTime.Now });
            }
            else
            {
                return StatusCode(500, new { Message = "저장된 정보로 DB 연결에 실패했습니다." });
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

        [HttpPost("test-custom")]
        public async Task<IActionResult> TestCustomConnection([FromBody] OracleConnRequest request)
        {
            await _localData.SaveConnectionDataAsync(new Models.ConnectionData 
            { 
                UserId = request.UserId, 
                Password = request.Password 
            });

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
