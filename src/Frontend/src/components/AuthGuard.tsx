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
          // 토큰이 유효한지 확인하기 위해 가벼운 API 호출 (예: 품목 리스트 첫 페이지 등)
          // 만약 토큰이 만료되었다면 아까 만든 interceptor에서 401을 감지하고 로그아웃 시킬 것입니다.
          await apiClient.get('/api/Item');
        } catch (error) {
          // interceptor에서 처리되지만, 만약의 경우를 대비해 여기서도 처리
          console.error('Token verification failed', error);
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
