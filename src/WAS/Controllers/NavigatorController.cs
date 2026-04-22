using Microsoft.AspNetCore.Mvc;

namespace WAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NavigatorController : ControllerBase
    {
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
    }
}
