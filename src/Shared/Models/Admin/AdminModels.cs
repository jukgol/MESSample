using System.Collections.Generic;

namespace Shared.Models.Admin
{
    // 1. 사용자 관련 모델
    public class UserListDto
    {
        public decimal UserId { get; set; }
        public string LoginId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string RoleCode { get; set; } = string.Empty;
        public string IsActive { get; set; } = "Y";
    }

    public class RoleDto
    {
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Permissions { get; set; } = new();
    }

    public class RolePermissionsUpdateDto
    {
        public List<string> Permissions { get; set; } = new();
    }

    // 2. 테이블 데이터 관련 모델
    public class TableDataResponse
    {
        public List<string> Columns { get; set; } = new();
        public List<dynamic> Rows { get; set; } = new();
        public List<ColumnMetadata> Metadata { get; set; } = new();
    }

    // 3. 스키마/권한 관련 모델
    public class SchemaPrivilegeDto
    {
        public string Type { get; set; } = string.Empty; // ROLE, SYSTEM
        public string Name { get; set; } = string.Empty;
    }

    // 4. 네비게이터/시스템 관련 모델
    public class NavItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
    }

    public class DbUserDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }

    // 5. 공통 응답 모델
    public class ActionResponse
    {
        public string Message { get; set; } = string.Empty;
        public string? ExecutedSql { get; set; }
    }
}
