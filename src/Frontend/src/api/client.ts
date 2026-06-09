import { useAuthStore } from '../store/useAuthStore';
import { HttpClient } from './http-client';

/**
 * 백엔드 API 호출을 위한 기본 설정으로 HttpClient 인스턴스 생성
 */
const httpClient = new HttpClient({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiClient = httpClient.instance;

// 요청 인터셉터 추가: 로컬 스토리지(Zustand)에서 토큰을 가져와 헤더에 추가
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 추가: 401 에러(인증 만료) 또는 서버 연결 실패 시 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || !error.response) {
      const isLoginPath = window.location.pathname.includes('/login');

      if (!isLoginPath) {
        if (!error.response) {
          console.error('서버에 연결할 수 없습니다. 로그아웃 처리합니다.');
        } else {
          console.warn('인증 세션이 만료되었습니다. 로그아웃 처리합니다.');
        }

        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 📌 태그별 모듈 동적 자동 병합
// ==========================================
const modules = import.meta.glob<{ [key: string]: any }>('./*.ts', { eager: true });
const combinedApi: Record<string, any> = {};

for (const filePath in modules) {
  if (
    filePath.includes('client.ts') ||
    filePath.includes('http-client.ts') ||
    filePath.includes('data-contracts.ts') ||
    filePath.includes('Api.ts')
  ) {
    continue;
  }

  const moduleExports = modules[filePath];

  for (const key in moduleExports) {
    const ExportedItem = moduleExports[key];

    if (typeof ExportedItem === 'function' && ExportedItem.prototype) {
      const instance = new ExportedItem(httpClient);

      // 화살표 함수로 정의된 인스턴스 메서드와 프로토타입에 정의된 메서드를 모두 바인딩합니다.
      const methodNames = new Set([
        ...Object.keys(instance),
        ...Object.getOwnPropertyNames(ExportedItem.prototype)
      ]);

      methodNames.forEach((methodName) => {
        if (methodName !== 'constructor' && typeof (instance as any)[methodName] === 'function') {
          combinedApi[methodName] = (instance as any)[methodName].bind(instance);
        }
      });
    }
  }
}

export const api = {
  api: combinedApi,
};

export default apiClient;
