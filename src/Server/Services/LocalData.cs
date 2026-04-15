using System.Text.Json;
using Server.Models;

namespace Server.Services
{
    public class LocalData
    {
        private readonly string _filePath;
        private readonly ILogger<LocalData> _logger;

        public LocalData(IWebHostEnvironment env, ILogger<LocalData> logger)
        {
            _filePath = Path.Combine(env.ContentRootPath, "Storage", "connectdata.json");
            _logger = logger;
            
            // 저장 폴더가 없으면 생성
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory!);
            }
        }

        public async Task<ConnectionData> GetConnectionDataAsync()
        {
            try
            {
                if (!File.Exists(_filePath)) return new ConnectionData();

                var json = await File.ReadAllTextAsync(_filePath);
                return JsonSerializer.Deserialize<ConnectionData>(json) ?? new ConnectionData();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "로컬 접속 정보 읽기 실패");
                return new ConnectionData();
            }
        }

        public async Task SaveConnectionDataAsync(ConnectionData data)
        {
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                var json = JsonSerializer.Serialize(data, options);
                await File.WriteAllTextAsync(_filePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "로컬 접속 정보 저장 실패");
            }
        }
    }
}
