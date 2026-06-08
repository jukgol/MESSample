using WAS.Data;
using System.Data.Common;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.IO;
using System;
using System.Linq;
using Dapper;

namespace WAS.Services
{
    public class ProcedureRegistration
    {
        private readonly DbProvider _db;
        private readonly ILogger<ProcedureRegistration> _logger;
        private readonly IScriptExecutor _scriptExecutor;

        public ProcedureRegistration(DbProvider db, ILogger<ProcedureRegistration> logger, IScriptExecutor scriptExecutor)
        {
            _db = db;
            _logger = logger;
            _scriptExecutor = scriptExecutor;
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

            try
            {
                var sqlFiles = Directory.GetFiles(scriptsPath, "*.sql");
                foreach (var file in sqlFiles)
                {
                    var procedureName = Path.GetFileNameWithoutExtension(file).ToUpper();
                    bool exists = false;

                    try
                    {
                        using var connection = _db.CreateConnection();
                        exists = await connection.ExecuteScalarAsync<int>(
                            "SELECT COUNT(*) FROM USER_OBJECTS WHERE OBJECT_TYPE = 'PROCEDURE' AND OBJECT_NAME = :Name",
                            new { Name = procedureName }
                        ) > 0;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "[PROCDRE] 프로시저 '{Name}' 존재 여부 조회 실패. 기본값인 미존재로 간주합니다.", procedureName);
                    }

                    var sql = await File.ReadAllTextAsync(file);
                    var result = await _scriptExecutor.ExecuteSqlAsync(sql);
                    
                    if (result.Success)
                    {
                        if (!exists)
                        {
                            _logger.LogInformation($"[PROCDRE] {Path.GetFileName(file)} 최초 배포 성공.");
                        }
                    }
                    else
                    {
                        _logger.LogError($"[PROCDRE] {Path.GetFileName(file)} 배포 실패: {result.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[PROCDRE] 프로시저 배포 중 예상치 못한 오류 발생.");
            }
        }

        private string GetScriptsPath()
        {
            // 실행 환경에 따른 경로 탐색
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            
            // 1. 실행 경로 기준 (bin/Debug/net8.0/Data/Scripts/Procedures)
            string path = Path.Combine(baseDir, "Data", "Scripts", "Procedures");
            if (Directory.Exists(path)) return path;

            // 2. 프로젝트 소스 경로 기준 (개발 시)
            string projectRoot = Directory.GetCurrentDirectory();
            path = Path.Combine(projectRoot, "Data", "Scripts", "Procedures");
            if (Directory.Exists(path)) return path;

            // 3. src 폴더 포함 경로 기준 (특이 케이스)
            path = Path.Combine(projectRoot, "src", "WAS", "Data", "Scripts", "Procedures");
            if (Directory.Exists(path)) return path;

            return string.Empty;
        }
    }
}
