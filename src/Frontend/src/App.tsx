import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AuthGuard from './components/AuthGuard';
import DashboardRoutes from './features/dashboard/routes/DashboardRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* 앱 시작 시 무조건 로그인 페이지로 이동 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />

        {/* 인증이 필요한 대시보드 시스템 라우트 */}
        <Route path="/dashboard/*" element={
          <AuthGuard>
            <DashboardRoutes />
          </AuthGuard>
        } />

        {/* 그 외 모든 경로는 로그인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
