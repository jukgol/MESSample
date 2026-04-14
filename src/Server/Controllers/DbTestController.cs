using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly OracleService _oracleService;
        private readonly LocalDataService _localData;

        public DbTestController(OracleService oracleService, LocalDataService localData)
        {
            _oracleService = oracleService;
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
            var isSuccess = await _oracleService.TestDefaultConnectionAsync();
            if (isSuccess)
            {
                return Ok(new { Message = "Oracle DB 연결 성공!", Timestamp = DateTime.Now });
            }
            else
            {
                return StatusCode(500, new { Message = "Oracle DB 연결 실패. 설정을 확인하세요." });
            }
        }

        [HttpGet("query")]
        public IActionResult RunSampleQuery()
        {
            var result = _oracleService.GetSysdate();
            if (result.Success)
            {
                return Ok(new { Message = "쿼리 실행 성공", Sysdate = result.Sysdate });
            }
            else
            {
                return StatusCode(500, new { Message = $"쿼리 실행 중 오류 발생: {result.Error}" });
            }
        }

        [HttpPost("test-custom")]
        public async Task<IActionResult> TestCustomConnection([FromBody] OracleConnRequest request)
        {
            // 연결 버튼을 누르면 입력한 정보를 로컬에 저장합니다.
            await _localData.SaveConnectionDataAsync(new Models.ConnectionData 
            { 
                UserId = request.UserId, 
                Password = request.Password 
            });

            var isSuccess = await _oracleService.TestCustomConnectionAsync(
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
