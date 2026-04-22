using Microsoft.AspNetCore.Mvc;
using WAS.Services;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace WAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NavigatorController : ControllerBase
    {
        private readonly IDbConnect _dbConnect;
        private readonly IConfiguration _configuration;

        public NavigatorController(IDbConnect dbConnect, IConfiguration configuration)
        {
            _dbConnect = dbConnect;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetNavigation()
        {
            var menu = new[]
            {
                new { Title = "공정 모니터링", Icon = "monitor", Path = "/monitor" },
                new { Title = "자재 현황", Icon = "inventory", Path = "/items" },
                new { Title = "품질 검사", Icon = "check_circle", Path = "/qc" },
                new { Title = "시스템 관리", Icon = "settings", Path = "/admin" }
            };
            return Ok(menu);
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                var isConnected = await _dbConnect.TestDefaultConnectionAsync();
                return Ok(new { Success = isConnected });
            }
            catch (Exception ex)
            {
                // 연결 실패 시 에러 상태와 메시지 반환
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("current-user")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var connString = _configuration.GetConnectionString("OracleDb");
                if (string.IsNullOrEmpty(connString))
                {
                    return BadRequest(new { Message = "DB 연결 설정이 없습니다." });
                }

                // 연결 문자열에서 User Id 추출 (대소문자 무시)
                var match = Regex.Match(connString, @"User\s+Id=([^;]+)", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    var userId = match.Groups[1].Value.Trim();
                    return Ok(new { userId = userId, userName = "DB Connected User" });
                }

                return BadRequest(new { Message = "사용자 정보를 확인할 수 없습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 정보 조회 오류: {ex.Message}" });
            }
        }
    }
}
