namespace WAS.Models.Auth
{
    public class LoginRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserInfo? User { get; set; }
    }

    public class UserInfo
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
}
