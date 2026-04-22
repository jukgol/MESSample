using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace WAS.Services
{
    public interface IDbConnect
    {
        // 기본 설정된 연결 문자열로 DB 연결 테스트
        Task<bool> TestDefaultConnectionAsync();

        // 사용자 정의 정보로 DB 연결 테스트
        Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password);
    }
}
