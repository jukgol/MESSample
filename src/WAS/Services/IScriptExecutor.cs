using System.Threading.Tasks;

namespace WAS.Services
{
    public interface IScriptExecutor
    {
        Task<(bool Success, string Message)> ExecuteSqlAsync(string sql);
    }
}

