using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace WAS.Services
{
    public interface IDbConnect
    {
        Task<bool> TestDefaultConnectionAsync();
        Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password);
        (bool Success, string? Sysdate, string? Error) GetSysdate();
    }
}

