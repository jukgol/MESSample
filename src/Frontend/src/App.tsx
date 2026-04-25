import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import ItemList from './features/items/pages/ItemList';
import LoginPage from './features/auth/pages/LoginPage';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="premium-card">
    <h1 className="gradient-text">{title}</h1>
    <p style={{ color: 'var(--text-secondary)' }}>준비 중인 페이지입니다.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          {/* Dashboard / Root */}
          <Route path="/" element={<Placeholder title="메시 대시보드" />} />
          
          {/* 물품 관리 */}
          <Route path="/items" element={<Navigate to="/items/list" replace />} />
          <Route path="/items/list" element={<ItemList />} />
          <Route path="/items/lot" element={<Placeholder title="LOT 관리" />} />
          <Route path="/items/shipment" element={<Placeholder title="출하 관리" />} />
          
          {/* 공정 관리 */}
          <Route path="/process/steps" element={<Placeholder title="공정 단계 정의" />} />
          <Route path="/process/workorder" element={<Placeholder title="작업 지시 (WO)" />} />
          
          {/* 로그 / 이력 */}
          <Route path="/log-monitor/process" element={<Placeholder title="공정 이력" />} />
          <Route path="/log-monitor/qc" element={<Placeholder title="품질 검사 (QC)" />} />
          
          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
