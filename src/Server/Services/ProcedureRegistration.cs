using Server.Data;
using System.Data.Common;

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

        public async Task DeployProceduresAsync()
        {
            try
            {
                var scriptsPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Scripts", "Procedures");
                
                if (!Directory.Exists(scriptsPath))
                {
                    scriptsPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Procedures");
                }

                if (!Directory.Exists(scriptsPath))
                {
                    _logger.LogWarning("프로시저 스크립트 폴더를 찾을 수 없습니다: {Path}", scriptsPath);
                    return;
                }

                var files = Directory.GetFiles(scriptsPath, "*.sql");
                _logger.LogInformation("--- 프로시저 자동 배포 시작 ({Count}개 파일) ---", files.Length);

                using var connection = _db.CreateConnection();
                if (connection is DbConnection dbConn)
                {
                    await dbConn.OpenAsync();
                }
                else
                {
                    connection.Open();
                }

                foreach (var file in files)
                {
                    var fileName = Path.GetFileName(file);
                    var script = await File.ReadAllTextAsync(file);
                    script = script.Trim().TrimEnd('/');
                    
                    try 
                    {
                        using var command = connection.CreateCommand();
                        command.CommandText = script;

                        // IDbCommand에는 ExecuteNonQueryAsync가 없으므로 DbCommand로 캐스팅
                        if (command is DbCommand asyncCommand)
                        {
                            await asyncCommand.ExecuteNonQueryAsync();
                        }
                        else
                        {
                            command.ExecuteNonQuery();
                        }
                        
                        _logger.LogInformation("✅ 배포 성공: {FileName}", fileName);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ 배포 실패: {FileName} - {Message}", fileName, ex.Message);
                    }
                }
                _logger.LogInformation("--- 프로시저 자동 배포 완료 ---");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "프로시저 배포 프로세스 중 치명적 오류 발생");
            }
        }
    }
}
