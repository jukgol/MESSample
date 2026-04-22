namespace WAS.Models
{
    public class OracleConnRequest
    {
        public string Host { get; set; } = "localhost";
        public int Port { get; set; } = 1521;
        public string ServiceName { get; set; } = "FREE";
        public string UserId { get; set; } = "system";
        public string Password { get; set; } = "oracle";
    }
}

