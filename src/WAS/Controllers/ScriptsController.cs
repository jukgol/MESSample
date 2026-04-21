using Microsoft.AspNetCore.Mvc;
using WAS.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace WAS.Controllers
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

                if (!Directory.Exists(path)) path = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", subFolder == "Setup" ? "Setup" : $"Queries/{subFolder}");
                if (!Directory.Exists(path)) path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", subFolder == "Setup" ? "Setup" : $"Queries/{subFolder}");

                if (!Directory.Exists(path)) return NotFound(new { Message = $"{subFolder} ?îÎ†â?†Î¶¨Î•?Ï∞æÏùÑ ???ÜÏäµ?àÎã§." });

                var files = Directory.GetFiles(path, "*.sql").Select(Path.GetFileName).ToList();
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Î™©Î°ù Ï°∞Ìöå ?§Ìå®: {ex.Message}" });
            }
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteScript([FromBody] ExecuteScriptRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.SchemaName))
                return BadRequest(new { Message = "?åÏùºÎ™ÖÍ≥º ?§ÌÇ§ÎßàÎ™Ö?Ä ?ÑÏàò?ÖÎãà??" });

            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string setupPath = Path.Combine(baseDir, "Data", "Scripts", "Setup");
                if (!Directory.Exists(setupPath)) setupPath = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", "Setup");
                if (!Directory.Exists(setupPath)) setupPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Setup");

                string filePath = Path.Combine(setupPath, request.FileName);
                if (!System.IO.File.Exists(filePath)) return NotFound(new { Message = "?§ÌÅ¨Î¶ΩÌä∏ ?åÏùº??Ï∞æÏùÑ ???ÜÏäµ?àÎã§." });

                string sql = await System.IO.File.ReadAllTextAsync(filePath);

                sql = sql.Replace("C##MYUSER", request.SchemaName, StringComparison.OrdinalIgnoreCase);

                var result = await _scriptExecutor.ExecuteSqlAsync(sql);

                if (result.Success) return Ok(new { Message = result.Message });
                else return StatusCode(500, new { Message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ Ï§??úÎ≤Ñ ?§Î•ò: {ex.Message}" });
            }
        }
    }

    public class ExecuteScriptRequest
    {
        public string FileName { get; set; } = string.Empty;
        public string SchemaName { get; set; } = string.Empty;
    }
}

