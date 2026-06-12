import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (isAuthenticated) {
        try {
          // 토큰이 유효한지 확인하기 위해 가벼운 API 호출
          await apiClient.get('/api/Item');
        } catch (error: any) {
          // 403 Forbidden은 토큰은 유효하지만 리소스 접근 권한이 없음을 뜻하므로 로그아웃 처리하지 않습니다.
          if (error.response?.status !== 403) {
            console.error('Token verification failed', error);
            logout(); // 401 등 진짜 토큰 오류일 때만 로그아웃
          }
        }
      }
      setIsVerifying(false);
    };

    verifyToken();
  }, [isAuthenticated, logout]);

  if (isVerifying) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
