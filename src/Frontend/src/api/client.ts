import { useAuthStore } from '../store/useAuthStore';
import { HttpClient } from './http-client';
import type { AxiosInstance } from 'axios'; // 👈 AxiosInstance 타입 추가

/**
 * 📌 Axios 인스턴스에 토큰 및 인증 에러 인터셉터를 붙여주는 공통 함수
 */
const attachInterceptors = (instance: AxiosInstance) => {
  // 요청 인터셉터 추가
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 인터셉터 추가
  instance.interceptors.response.use(
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
};

// 기본 httpClient 설정
const httpClient = new HttpClient({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiClient = httpClient.instance;
// 기본 apiClient에도 인터셉터 적용
attachInterceptors(apiClient);


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

      // 💡 변경 포인트 1: 기존에 생성된 주소(httpClient) 대신, 새 설정 객체를 전달하여 생성합니다.
      const instance = new ExportedItem({
        baseURL: '/',
        headers: { 'Content-Type': 'application/json' },
      });

      // 💡 변경 포인트 2: 이 모듈이 내부적으로 새로 만든 Axios 가방(instance.instance)에 인터셉터를 심어줍니다.
      attachInterceptors(instance.instance);

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