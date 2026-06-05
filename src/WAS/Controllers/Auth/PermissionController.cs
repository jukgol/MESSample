using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 로그인한 사람만 호출 가능
    public class PermissionController : ControllerBase
    {
        public class PermissionDto
        {
            public string Code { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<PermissionDto>), 200)]
        public ActionResult<List<PermissionDto>> GetAllPermissions()
        {
            var result = new List<PermissionDto>();

            // Permissions 클래스의 모든 static string 필드를 리플렉션으로 수집
            var fields = typeof(Permissions)
                .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                .Where(fi => fi.IsLiteral && !fi.IsInitOnly && fi.FieldType == typeof(string));

            foreach (var field in fields)
            {
                var code = (string)field.GetRawConstantValue()!;
                var infoAttr = field.GetCustomAttribute<PermissionInfoAttribute>();
                var name = infoAttr != null ? infoAttr.Description : field.Name;

                result.Add(new PermissionDto
                {
                    Code = code,
                    Name = name
                });
            }

            return Ok(result);
        }
    }
}
