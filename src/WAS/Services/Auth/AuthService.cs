using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WAS.Models.Auth;

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
            // 1. DB에서 사용자 조회 (현재는 평문 비교)
            // USER_INFO와 USER_ROLE을 조인하여 정보 가져오기
            var sql = @"
                SELECT u.LOGIN_ID as UserId, u.USER_NAME as UserName, u.PASSWORD, 
                       u.ROLE_CODE as RoleCode, r.ROLE_NAME as RoleName
                FROM USER_INFO u
                JOIN USER_ROLE r ON u.ROLE_CODE = r.ROLE_CODE
                WHERE u.LOGIN_ID = :UserId AND u.IS_ACTIVE = 'Y'";

            var users = await _scriptExecutor.ExecuteQueryAsync<dynamic>(sql, new { UserId = request.UserId }, isRawSql: true);
            var user = users.FirstOrDefault();

            if (user == null || user.PASSWORD != request.Password)
            {
                return new LoginResponse { Success = false, Message = "아이디 또는 비밀번호가 올바르지 않습니다." };
            }

            // 2. JWT 토큰 생성
            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Success = true,
                Message = "로그인 성공",
                Token = token,
                User = new UserInfo
                {
                    UserId = user.USERID,
                    UserName = user.USERNAME,
                    RoleCode = user.ROLECODE,
                    RoleName = user.ROLENAME
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
                new Claim(ClaimTypes.NameIdentifier, (string)user.USERID),
                new Claim(ClaimTypes.Name, (string)user.USERNAME),
                new Claim(ClaimTypes.Role, (string)user.ROLECODE)
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
