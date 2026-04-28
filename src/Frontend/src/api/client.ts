import axios from 'axios';
import { Api, HttpClient } from './generated-api';

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

/**
 * Swagger 기반으로 자동 생성된 API 클라이언트
 * api.api.authLoginCreate(), api.api.itemList() 형태로 사용합니다.
 */
export const api = new Api(httpClient);

export default apiClient;
