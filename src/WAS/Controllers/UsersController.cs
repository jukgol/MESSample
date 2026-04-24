using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Text.RegularExpressions;
using WAS.Data;
using WAS.Services;

namespace WAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IConfiguration _configuration;

        public UsersController(IScriptExecutor scriptExecutor, IConfiguration configuration)
        {
            _scriptExecutor = scriptExecutor;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var query = "SELECT U.*, R.ROLE_NAME FROM USER_INFO U JOIN USER_ROLE R ON U.ROLE_CODE = R.ROLE_CODE ORDER BY U.USER_ID DESC";
                var users = await _scriptExecutor.ExecuteQueryAsync<dynamic>(query, null);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var query = "SELECT ROLE_CODE, ROLE_NAME FROM USER_ROLE ORDER BY ROLE_CODE";
                var roles = await _scriptExecutor.ExecuteQueryAsync<dynamic>(query, null);
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"권한 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] Dictionary<string, object> userData)
        {
            try
            {
                // USER_ID는 시퀀스(IDENTITY)이므로 제외하고 삽입
                var columns = string.Join(", ", userData.Keys);
                var values = string.Join(", ", userData.Keys.Select(k => ":" + k));
                var query = $"INSERT INTO USER_INFO ({columns}) VALUES ({values})";

                var parameters = userData.Select(kv => new OracleParameter(kv.Key, kv.Value ?? DBNull.Value)).ToArray();
                await _scriptExecutor.ExecuteNonQueryAsync(query, parameters);
                
                return Ok(new { Message = "사용자가 생성되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 생성 실패: {ex.Message}" });
            }
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] Dictionary<string, object> userData)
        {
            try
            {
                var setClause = string.Join(", ", userData.Keys.Select(k => $"{k} = :{k}"));
                var query = $"UPDATE USER_INFO SET {setClause}, UPDATED_AT = CURRENT_TIMESTAMP WHERE USER_ID = :UserId";

                var parameters = userData.Select(kv => new OracleParameter(kv.Key, kv.Value ?? DBNull.Value)).ToList();
                parameters.Add(new OracleParameter("UserId", userId));

                await _scriptExecutor.ExecuteNonQueryAsync(query, parameters.ToArray());
                
                return Ok(new { Message = "사용자 정보가 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 수정 실패: {ex.Message}" });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var query = "DELETE FROM USER_INFO WHERE USER_ID = :UserId";
                var parameters = new[] { new OracleParameter("UserId", userId) };
                await _scriptExecutor.ExecuteNonQueryAsync(query, parameters);
                return Ok(new { Message = "사용자가 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 삭제 실패: {ex.Message}" });
            }
        }
    }
}
