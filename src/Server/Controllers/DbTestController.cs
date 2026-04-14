using Microsoft.AspNetCore.Mvc;
using System.Data;
using Oracle.ManagedDataAccess.Client;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly dbconnect _db;

        public DbTestController(dbconnect db)
        {
            _db = db;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            var isSuccess = await _db.TestConnectionAsync();
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
            try
            {
                using var connection = _db.CreateConnection();
                connection.Open();
                using var command = connection.CreateCommand();
                command.CommandText = "SELECT SYSDATE FROM DUAL";
                
                var result = command.ExecuteScalar();
                return Ok(new { Message = "쿼리 실행 성공", Sysdate = result?.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"쿼리 실행 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
