using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScriptsController : ControllerBase
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ScriptsController(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        [HttpGet("setup")]
        public IActionResult GetSetupScripts()
        {
            // ... (기존 로직 동일)
            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string setupPath = Path.Combine(baseDir, "Data", "Scripts", "Setup");

                if (!Directory.Exists(setupPath))
                {
                    setupPath = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", "Setup");
                }

                if (!Directory.Exists(setupPath)) 
                {
                    setupPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Setup");
                }

                if (!Directory.Exists(setupPath))
                    return NotFound(new { Message = $"Setup 디렉토리를 찾을 수 없습니다." });

                var files = Directory.GetFiles(setupPath, "*.sql")
                                     .Select(Path.GetFileName)
                                     .ToList();
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"스크립트 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteScript([FromBody] ExecuteScriptRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.SchemaName))
                return BadRequest(new { Message = "파일명과 스키마명은 필수입니다." });

            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string setupPath = Path.Combine(baseDir, "Data", "Scripts", "Setup");
                if (!Directory.Exists(setupPath)) setupPath = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", "Setup");
                if (!Directory.Exists(setupPath)) setupPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Setup");

                string filePath = Path.Combine(setupPath, request.FileName);
                if (!System.IO.File.Exists(filePath)) return NotFound(new { Message = "스크립트 파일을 찾을 수 없습니다." });

                string sql = await System.IO.File.ReadAllTextAsync(filePath);

                // 플레이스홀더 치환 (대소문자 구분 없이 처리)
                // GRANT_USER_PRIVILEGES.sql에 사용된 관습적인 이름들을 요청된 스키마명으로 교체
                sql = sql.Replace("C##MYUSER", request.SchemaName, StringComparison.OrdinalIgnoreCase);

                var result = await _scriptExecutor.ExecuteSqlAsync(sql);

                if (result.Success) return Ok(new { Message = result.Message });
                else return StatusCode(500, new { Message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"스크립트 실행 중 서버 오류: {ex.Message}" });
            }
        }
    }

    public class ExecuteScriptRequest
    {
        public string FileName { get; set; } = string.Empty;
        public string SchemaName { get; set; } = string.Empty;
    }
}
