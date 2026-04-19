using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScriptsController : ControllerBase
    {
        [HttpGet("setup")]
        public IActionResult GetSetupScripts()
        {
            try
            {
                // 실행 위치에 관계없이 Data/Scripts/Setup 폴더를 찾기 위한 경로 보정
                string baseDir = Directory.GetCurrentDirectory();
                string setupPath = Path.Combine(baseDir, "Data", "Scripts", "Setup");

                // 만약 src/Server 밖에서 실행 중이라면 (프로젝트 루트 등)
                if (!Directory.Exists(setupPath))
                {
                    setupPath = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", "Setup");
                }

                if (!Directory.Exists(setupPath)) 
                {
                    // 최후의 수단: 현재 바이너리 위치 기준 탐색
                    setupPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Setup");
                }

                if (!Directory.Exists(setupPath))
                    return NotFound(new { Message = $"Setup 디렉토리를 찾을 수 없습니다. (Path: {setupPath})" });

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
    }
}
