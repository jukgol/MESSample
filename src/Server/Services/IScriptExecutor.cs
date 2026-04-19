using System.Threading.Tasks;

namespace Server.Services
{
    public interface IScriptExecutor
    {
        Task<(bool Success, string Message)> ExecuteSqlAsync(string sql);
    }
}
