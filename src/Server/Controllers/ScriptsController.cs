using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScriptsController : ControllerBase
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<ScriptsController> _logger;

        public ScriptsController(IScriptExecutor scriptExecutor, ILogger<ScriptsController> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
        }

        [HttpGet("setup")]
        public IActionResult GetSetupScripts()
        {
            return GetScriptsFromPath("Setup");
        }

        private IActionResult GetScriptsFromPath(string subFolder)
        {
            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", subFolder);
                if (subFolder == "Setup") path = Path.Combine(baseDir, "Data", "Scripts", "Setup");

                if (!Directory.Exists(path)) path = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", subFolder == "Setup" ? "Setup" : $"Queries/{subFolder}");
                if (!Directory.Exists(path)) path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", subFolder == "Setup" ? "Setup" : $"Queries/{subFolder}");

                if (!Directory.Exists(path)) return NotFound(new { Message = $"{subFolder} 디렉토리를 찾을 수 없습니다." });

                var files = Directory.GetFiles(path, "*.sql").Select(Path.GetFileName).ToList();
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"목록 조회 실패: {ex.Message}" });
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
