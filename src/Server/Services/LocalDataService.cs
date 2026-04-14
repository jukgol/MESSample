using System.Text.Json;
using Server.Models;

namespace Server.Services
{
    public class LocalDataService
    {
        private readonly string _filePath;
        private readonly ILogger<LocalDataService> _logger;
        private ConnectionData? _cachedData;

        public LocalDataService(ILogger<LocalDataService> logger)
        {
            _logger = logger;
            _filePath = Path.Combine(Directory.GetCurrentDirectory(), "Storage", "connectdata.json");
            
            // Ensure directory exists
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
        }

        public async Task<ConnectionData> GetConnectionDataAsync()
        {
            if (_cachedData != null) return _cachedData;

            try
            {
                if (!File.Exists(_filePath))
                {
                    _cachedData = new ConnectionData();
                    return _cachedData;
                }

                string jsonString = await File.ReadAllTextAsync(_filePath);
                _cachedData = JsonSerializer.Deserialize<ConnectionData>(jsonString) ?? new ConnectionData();
                return _cachedData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "로컬 연결 데이터를 읽는 중 오류 발생");
                return new ConnectionData();
            }
        }

        public async Task<bool> SaveConnectionDataAsync(ConnectionData data)
        {
            try
            {
                string jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(_filePath, jsonString);
                _cachedData = data; // Update cache
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "로컬 연결 데이터를 저장하는 중 오류 발생");
                return false;
            }
        }
    }
}
