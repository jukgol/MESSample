using WAS.Data;
using System.Data.Common;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WAS.Services
{
    public class ProcedureRegistration
    {
        private readonly DbProvider _db;
        private readonly ILogger<ProcedureRegistration> _logger;

        public ProcedureRegistration(DbProvider db, ILogger<ProcedureRegistration> logger)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>
        /// 모든 프로시저 SQL 파일을 찾아 DB에 자동 배포합니다.
        /// </summary>
        public Task DeployProceduresAsync()
        {
            _logger.LogInformation("[PROCDRE] 프로시저 자동 배포 프로세스를 시작합니다.");

            var scriptsPath = GetScriptsPath();
            if (string.IsNullOrEmpty(scriptsPath))
            {
                _logger.LogWarning("[PROCDRE] 스크립트 경로를 찾을 수 없습니다.");
                return Task.CompletedTask;
            }

            // TODO: 실제 배포 로직 구현
            return Task.CompletedTask;
        }

        private string GetScriptsPath()
        {
            // TODO: 실제 경로 반환 로직 구현
            return string.Empty;
        }
    }
}
