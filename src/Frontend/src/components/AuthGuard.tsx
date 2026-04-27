import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // 로그인이 되어 있지 않으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 로그인이 되어 있으면 요청한 페이지(children)를 렌더링
  return <>{children}</>;
};

export default AuthGuard;
