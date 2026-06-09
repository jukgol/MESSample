import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../api/client';

export const useLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 컴포넌트 마운트 시 저장된 정보 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('last_login_id');
    const savedPw = localStorage.getItem('last_login_pw');
    if (savedId) setUserId(savedId);
    if (savedPw) setPassword(savedPw);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await api.api.authLoginCreate({ userId, password });

      if (response.data.success && response.data.token && response.data.user) {
        // 로그인 성공 시 정보를 localStorage에 저장 (테스트용 평문 저장)
        localStorage.setItem('last_login_id', userId);
        localStorage.setItem('last_login_pw', password);

        // 글로벌 상태에 토큰 및 사용자 정보 저장
        login(response.data.token, response.data.user);

        // 대시보드로 이동
        navigate('/dashboard');
      } else {
        setErrorMsg(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('서버와 통신 중 오류가 발생했습니다. (아이디/비밀번호 확인)');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userId,
    setUserId,
    password,
    setPassword,
    errorMsg,
    isLoading,
    handleLogin
  };
};
