using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Models.Auth;
using WAS.Services.Auth;

namespace WAS.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { Message = "아이디와 비밀번호를 입력해주세요." });
            }

            var result = await _authService.LoginAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return Unauthorized(new { Message = result.Message });
        }
    }
}
