import axios from 'axios';

/**
 * 백엔드 API 호출을 위한 기본 Axios 인스턴스
 * vite.config.ts의 proxy 설정을 통해 /api 요청이 백엔드(http://localhost:5175)로 전달됩니다.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
