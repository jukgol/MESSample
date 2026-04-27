using Microsoft.AspNetCore.Mvc;
using WAS.Services;

namespace WAS.Controllers.System
{
    [ApiController]
    [Route("api/system/[controller]")]
    public class ScriptsController : ControllerBase
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ScriptsController(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteSql([FromBody] string sql)
        {
            try
            {
                var result = await _scriptExecutor.ExecuteSqlAsync(sql);
                if (result.Success)
                    return Ok(new { Message = result.Message });
                else
                    return BadRequest(new { Message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"SQL 실행 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
