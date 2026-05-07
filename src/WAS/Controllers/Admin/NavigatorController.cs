using Microsoft.AspNetCore.Mvc;
using WAS.Services;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;
using Shared.Models.Admin;

namespace WAS.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
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
        [ProducesResponseType(typeof(IEnumerable<NavItemDto>), 200)]
        public ActionResult<IEnumerable<NavItemDto>> GetNavigation()
        {
            var menu = new[]
            {
                new NavItemDto { Title = "공정 모니터링", Icon = "monitor", Path = "/monitor" },
                new NavItemDto { Title = "자재 현황", Icon = "inventory", Path = "/items" },
                new NavItemDto { Title = "품질 검사", Icon = "check_circle", Path = "/qc" },
                new NavItemDto { Title = "시스템 관리", Icon = "settings", Path = "/admin" }
            };
            return Ok(menu);
        }

        [HttpGet("test")]
        [ProducesResponseType(typeof(object), 200)] // Success=bool 형태
        public async Task<ActionResult<object>> TestConnection()
        {
            try
            {
                var isConnected = await _dbConnect.TestDefaultConnectionAsync();
                return Ok(new { Success = isConnected });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("current-user")]
        [ProducesResponseType(typeof(DbUserDto), 200)]
        public ActionResult<DbUserDto> GetCurrentUser()
        {
            try
            {
                var connString = _configuration.GetConnectionString("OracleDb");
                if (string.IsNullOrEmpty(connString))
                {
                    return BadRequest(new ActionResponse { Message = "DB 연결 설정이 없습니다." });
                }

                var match = Regex.Match(connString, @"User\s+Id=([^;]+)", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    var userId = match.Groups[1].Value.Trim();
                    return Ok(new DbUserDto { UserId = userId, UserName = "DB Connected User" });
                }

                return BadRequest(new ActionResponse { Message = "사용자 정보를 확인할 수 없습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"사용자 정보 조회 오류: {ex.Message}" });
            }
        }
    }
}
