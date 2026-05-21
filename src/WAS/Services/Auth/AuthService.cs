using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Shared.Models.Auth;

namespace WAS.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IConfiguration _configuration;

        public AuthService(IScriptExecutor scriptExecutor, IConfiguration configuration)
        {
            _scriptExecutor = scriptExecutor;
            _configuration = configuration;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // 1. 프로시저를 통해 사용자 정보 조회
            var users = await _scriptExecutor.ExecuteQueryAsync<dynamic>(
                "LOGIN_USER", 
                new { I_USER_ID = request.UserId }
            );
            
            var user = users.FirstOrDefault();

            // 2. 검증: 사용자가 없거나, 비밀번호가 틀렸거나, 비활성 상태인 경우
            if (user == null || user.PASSWORD != request.Password)
            {
                return new LoginResponse { Success = false, Message = "아이디 또는 비밀번호가 올바르지 않습니다." };
            }

            if (user.IS_ACTIVE != "Y")
            {
                return new LoginResponse { Success = false, Message = "비활성화된 계정입니다. 관리자에게 문의하세요." };
            }

            // 3. JWT 토큰 생성
            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Success = true,
                Message = "로그인 성공",
                Token = token,
                User = new UserInfo
                {
                    UserId = user.LOGIN_ID,
                    UserName = user.USER_NAME,
                    RoleCode = user.ROLE_CODE,
                    RoleName = user.ROLE_NAME
                }
            };
        }

        private string GenerateJwtToken(dynamic user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "DefaultSecretKeyForMESProject"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, (string)user.LOGIN_ID),
                new Claim(ClaimTypes.Name, (string)user.USER_NAME),
                new Claim(ClaimTypes.Role, (string)user.ROLE_CODE),                
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"] ?? "60")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
