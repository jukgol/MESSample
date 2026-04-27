using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Text.RegularExpressions;
using WAS.Data;
using WAS.Services;

namespace WAS.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
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
                var users = await _scriptExecutor.ExecuteQueryAsync<dynamic>("User/GET_USER_LIST", null);
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
                var roles = await _scriptExecutor.ExecuteQueryAsync<dynamic>("User/GET_ROLE_LIST", null);
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
                await _scriptExecutor.ExecuteNonQueryAsync("User/CREATE_USER", userData);
                return Ok(new { Message = "사용자가 생성되었습니다." });
            }
            catch (Exception ex)
            {
                var debugInfo = string.Join(", ", userData.Select(kv => $"{kv.Key}='{kv.Value}'"));
                return StatusCode(500, new { Message = $"사용자 생성 실패: {ex.Message} | 데이터: {debugInfo}" });
            }
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] Dictionary<string, object> userData)
        {
            try
            {
                var parameters = new Dictionary<string, object>(userData);
                parameters["UserId"] = userId;

                await _scriptExecutor.ExecuteNonQueryAsync("User/UPDATE_USER", parameters);
                return Ok(new { Message = "사용자 정보가 수정되었습니다." });
            }
            catch (Exception ex)
            {
                var debugInfo = string.Join(", ", userData.Select(kv => $"{kv.Key}='{kv.Value}'"));
                return StatusCode(500, new { Message = $"사용자 수정 실패: {ex.Message} | 데이터: {debugInfo}" });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var parameters = new Dictionary<string, object> { { "UserId", userId } };
                await _scriptExecutor.ExecuteNonQueryAsync("User/DELETE_USER", parameters);
                return Ok(new { Message = "사용자가 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"사용자 삭제 실패: {ex.Message}" });
            }
        }
    }
}
