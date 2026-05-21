import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../../layouts/Layout';
import ItemList from '../../items/pages/ItemList';
import DashboardHome from '../pages/DashboardHome';
import { useAuthStore } from '../../../store/useAuthStore';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="premium-card">
    <h1 className="gradient-text">{title}</h1>
    <p style={{ color: 'var(--text-secondary)' }}>준비 중인 페이지입니다.</p>
  </div>
);

const DashboardRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const roleCode = user?.roleCode || 'VIEWER';

  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(roleCode);
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Dashboard / Root */}
        <Route path="/" element={<DashboardHome />} />

        {/* 물품 관리 - ADMIN만 */}
        {hasAccess(['ADMIN']) && (
          <>
            <Route path="/items" element={<Navigate to="/items/list" replace />} />
            <Route path="/items/list" element={<ItemList />} />
            <Route path="/items/lot" element={<Placeholder title="LOT 관리" />} />
            <Route path="/items/shipment" element={<Placeholder title="출하 관리" />} />
          </>
        )}

        {/* 공정 관리 - ADMIN, OPERATOR */}
        {hasAccess(['ADMIN', 'OPERATOR']) && (
          <>
            <Route path="/process/steps" element={<Placeholder title="공정 단계 정의" />} />
            <Route path="/process/workorder" element={<Placeholder title="작업 지시 (WO)" />} />
          </>
        )}

        {/* 로그 / 이력 */}
        {hasAccess(['ADMIN', 'VIEWER']) && (
          <Route path="/log-monitor/process" element={<Placeholder title="공정 이력" />} />
        )}
        {hasAccess(['ADMIN', 'QC']) && (
          <Route path="/log-monitor/qc" element={<Placeholder title="품질 검사 (QC)" />} />
        )}

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
