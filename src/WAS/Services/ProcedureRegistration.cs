using WAS.Data;
using System.Data.Common;
using Microsoft.Extensions.Logging;

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
        /// Î™®Îì† ?ÑÎ°ú?úÏ? SQL ?åÏùº??Ï∞æÏïÑ DB???êÎèô Î∞∞Ìè¨?©Îãà??
        /// </summary>
        public async Task DeployProceduresAsync()
        {
            _logger.LogInformation("[PROCDRE] ?ÑÎ°ú?úÏ? ?êÎèô Î∞∞Ìè¨ ?ÑÎ°ú?∏Ïä§Î•??úÏûë?©Îãà??");

            var scriptsPath = GetScriptsPath();
            if (string.IsNullOrEmpty(scriptsPath))
            {
                _logger.LogWarning("[PROCDRE] ?§ÌÅ¨Î¶ΩÌä∏ Í≤ΩÎ°úÎ•?Ï∞æÏùÑ ???ÜÏäµ?àÎã§.");
                return;
            }

            var files = Directory.GetFiles(scriptsPath, "*.sql");
            _logger.LogInformation("[PROCDRE] Ï¥?{Count}Í∞úÏùò ?åÏùº??Î∞úÍ≤¨?àÏäµ?àÎã§.", files.Length);

            using var connection = _db.CreateConnection();
            await OpenConnectionAsync(connection);

            int successCount = 0;

            foreach (var file in files)
            {
                var fileName = Path.GetFileName(file);

                // [?µÏã¨] Î°úÍπÖÍ≥??êÎü¨ Ï≤òÎ¶¨Î•??¥Îãπ?òÎäî '?¨Î?Î¶??ºÌÑ∞(Wrapper)'???åÎßπ??Î°úÏßÅÎß??ÑÎã¨?©Îãà??
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

            _logger.LogInformation("[PROCDRE] Î∞∞Ìè¨ Ï¢ÖÎ£å. (?±Í≥µ: {Success}/{Total})", successCount, files.Length);
        }

        /// <summary>
        /// [Wrapper Method] Î°úÍπÖÍ≥??àÏô∏ Ï≤òÎ¶¨Î•?Í≥µÌÜµ?ºÎ°ú ?òÌñâ?òÎäî ?¨Î?Î¶??ºÌÑ∞?ÖÎãà??
        /// </summary>
        private async Task<bool> ExecuteStepWithLogAsync(string taskName, Func<Task> action)
        {
            try
            {
                // ?§Ï†ú ?ÖÎ¨¥ ?§Ìñâ
                await action();
                
                _logger.LogInformation("[SUCCESS] {TaskName}", taskName);
                return true;
            }
            catch (Exception ex)
            {
                // Í≥µÌÜµ ?êÎü¨ Ï≤òÎ¶¨ Î∞?Î°úÍ∑∏ Í∏∞Î°ù
                _logger.LogError(ex, "[FAILED] {TaskName} | ?¨Ïú†: {Message}", taskName, ex.Message);
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

