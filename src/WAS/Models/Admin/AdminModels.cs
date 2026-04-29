using System.Collections.Generic;

namespace WAS.Models.Admin
{
    // 1. 사용자 관련 모델
    public class UserListDto
    {
        public decimal USER_ID { get; set; }
        public string LOGIN_ID { get; set; } = string.Empty;
        public string PASSWORD { get; set; } = string.Empty;
        public string USER_NAME { get; set; } = string.Empty;
        public string ROLE_NAME { get; set; } = string.Empty;
        public string IS_ACTIVE { get; set; } = "Y";
    }

    public class RoleDto
    {
        public string ROLE_CODE { get; set; } = string.Empty;
        public string ROLE_NAME { get; set; } = string.Empty;
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
