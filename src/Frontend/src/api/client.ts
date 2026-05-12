import { Api, HttpClient } from './generated-api';
import { useAuthStore } from '../store/useAuthStore';

/**
 * 백엔드 API 호출을 위한 기본 설정으로 HttpClient 인스턴스 생성
 * vite.config.ts의 proxy 설정을 통해 /api 요청이 백엔드(http://localhost:5175)로 전달됩니다.
 */
const httpClient = new HttpClient({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 기존 코드 호환성을 위해 axios 인스턴스 추출
 */
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
    // 401 에러(인증 만료) 또는 서버 연결 자체가 실패한 경우 (error.response가 없음)
    if (error.response?.status === 401 || !error.response) {
      const isLoginPath = window.location.pathname.includes('/login');

      if (!isLoginPath) {
        if (!error.response) {
          console.error('서버에 연결할 수 없습니다. 로그아웃 처리합니다.');
        } else {
          console.warn('인증 세션이 만료되었습니다. 로그아웃 처리합니다.');
        }

        useAuthStore.getState().logout();

        // 로그인 화면으로 강제 이동
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Swagger 기반으로 자동 생성된 API 클라이언트
 * api.api.authLoginCreate(), api.api.itemList() 형태로 사용합니다.
 */
export const api = new Api(httpClient);

export default apiClient;
