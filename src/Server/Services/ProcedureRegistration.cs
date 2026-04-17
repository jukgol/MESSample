using Server.Data;
using System.Data.Common;
using Microsoft.Extensions.Logging;

namespace Server.Services
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
        public async Task DeployProceduresAsync()
        {
            _logger.LogInformation("[PROCDRE] 프로시저 자동 배포 프로세스를 시작합니다.");

            var scriptsPath = GetScriptsPath();
            if (string.IsNullOrEmpty(scriptsPath))
            {
                _logger.LogWarning("[PROCDRE] 스크립트 경로를 찾을 수 없습니다.");
                return;
            }

            var files = Directory.GetFiles(scriptsPath, "*.sql");
            _logger.LogInformation("[PROCDRE] 총 {Count}개의 파일을 발견했습니다.", files.Length);

            using var connection = _db.CreateConnection();
            await OpenConnectionAsync(connection);

            int successCount = 0;

            foreach (var file in files)
            {
                var fileName = Path.GetFileName(file);

                // [핵심] 로깅과 에러 처리를 담당하는 '심부름 센터(Wrapper)'에 알맹이 로직만 전달합니다.
                bool isSuccess = await ExecuteStepWithLogAsync(fileName, async () => 
                {
                    var script = await File.ReadAllTextAsync(file);
                    script = script.Trim().TrimEnd('/');

                    using var command = connection.CreateCommand();
                    command.CommandText = script;

                    if (command is DbCommand asyncCommand)
                        await asyncCommand.ExecuteNonQueryAsync();
                    else
                        command.ExecuteNonQuery();
                });

                if (isSuccess) successCount++;
            }

            _logger.LogInformation("[PROCDRE] 배포 종료. (성공: {Success}/{Total})", successCount, files.Length);
        }

        /// <summary>
        /// [Wrapper Method] 로깅과 예외 처리를 공통으로 수행하는 심부름 센터입니다.
        /// </summary>
        private async Task<bool> ExecuteStepWithLogAsync(string taskName, Func<Task> action)
        {
            try
            {
                // 실제 업무 실행
                await action();
                
                _logger.LogInformation("[SUCCESS] {TaskName}", taskName);
                return true;
            }
            catch (Exception ex)
            {
                // 공통 에러 처리 및 로그 기록
                _logger.LogError(ex, "[FAILED] {TaskName} | 사유: {Message}", taskName, ex.Message);
                return false;
            }
        }

        private async Task OpenConnectionAsync(System.Data.IDbConnection connection)
        {
            if (connection is DbConnection dbConn)
                await dbConn.OpenAsync();
            else
                connection.Open();
        }

        private string? GetScriptsPath()
        {
            string[] paths = {
                Path.Combine(Directory.GetCurrentDirectory(), "Data", "Scripts", "Procedures"),
                Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Procedures")
            };

            foreach (var path in paths)
            {
                if (Directory.Exists(path)) return path;
            }
            return null;
        }
    }
}
