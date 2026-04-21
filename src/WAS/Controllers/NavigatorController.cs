using Microsoft.AspNetCore.Mvc;
using WAS.Services;
using WAS.Models;
using System.Data;
using System.Linq;

namespace WAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NavigatorController : ControllerBase
    {
        private readonly IDbConnect _dbConnect;
        private readonly ISchemaService _schemaService;

        public NavigatorController(IDbConnect dbConnect, ISchemaService schemaService)
        {
            _dbConnect = dbConnect;
            _schemaService = schemaService;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            var isSuccess = await _dbConnect.TestDefaultConnectionAsync();

            if (isSuccess)
            {
                return Ok(new { Message = "Oracle DB ?∞Îèô ?±Í≥µ!", Timestamp = DateTime.Now });
            }
            else
            {
                return StatusCode(500, new { Message = "DB ?∞Í≤∞???§Ìå®?àÏäµ?àÎã§." });
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
                return Ok(new { Message = "ÏøºÎ¶¨ ?§Ìñâ ?±Í≥µ", Sysdate = result.Sysdate });
            }
            else
            {
                return StatusCode(500, new { Message = $"ÏøºÎ¶¨ ?§Ìñâ Ï§??§Î•ò Î∞úÏÉù: {result.Error}" });
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
                return Ok(new { Message = "?∞Í≤∞ ?±Í≥µ!", Details = $"Connected to {request.Host}:{request.Port}/{request.ServiceName}" });
            }
            else
            {
                return BadRequest(new { Message = "?∞Í≤∞ ?§Ìå®. ?ÖÎ†• ?ïÎ≥¥Î•??§Ïãú ?ïÏù∏??Ï£ºÏÑ∏??" });
            }
        }
    }
}

