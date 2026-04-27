import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AuthGuard from './components/AuthGuard';
import DashboardRoutes from './features/dashboard/routes/DashboardRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* 누구나 접근 가능한 공용 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 인증이 필요한 대시보드 시스템 라우트 (검문소 통과 필수) */}
        <Route path="/*" element={
          <AuthGuard>
            <DashboardRoutes />
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;
