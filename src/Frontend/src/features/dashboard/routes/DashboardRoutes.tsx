import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../../layouts/Layout';
import ItemList from '../../masterdata/item/pages/ItemList';
import ItemTypeList from '../../masterdata/itemtype/pages/ItemTypeList';
import BomManagePage from '../../masterdata/bom/pages/BomManagePage';
import LotList from '../../inventory/lot/pages/LotList';
import ProcessStepList from '../../masterdata/step/pages/ProcessStepList';
import ProductProcessList from '../../masterdata/master/pages/ProductProcessList';
import MrpContainerPage from '../../inventory/mrp/pages/MrpContainerPage';
import DashboardHome from '../pages/DashboardHome';
import UserList from '../../system/user/pages/UserList';
import RoleManager from '../../system/manager/pages/RoleManager';
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

        {/* 기준 정보 & 재고 관리 - ADMIN만 */}
        {hasAccess(['ADMIN']) && (
          <>
            <Route path="/masterdata" element={<Navigate to="items" replace />} />
            <Route path="/masterdata/items" element={<ItemList />} />
            <Route path="/masterdata/itemtype" element={<ItemTypeList />} />
            <Route path="/masterdata/boms" element={<BomManagePage />} />
            <Route path="/masterdata/steps" element={<ProcessStepList />} />
            <Route path="/masterdata/product-processes" element={<ProductProcessList />} />

            <Route path="/inventory" element={<Navigate to="lots" replace />} />
            <Route path="/inventory/lots" element={<LotList />} />
            <Route path="/inventory/mrp" element={<MrpContainerPage />} />
            <Route path="/inventory/shipments" element={<Placeholder title="출하 관리" />} />
            <Route path="/system/users" element={<UserList />} />
            <Route path="/system/roles" element={<RoleManager />} />
          </>
        )}

        {/* 공정 관리 - ADMIN, OPERATOR */}
        {hasAccess(['ADMIN', 'OPERATOR']) && (
          <>
            <Route path="/masterdata/workorder" element={<Placeholder title="작업 지시 (WO)" />} />
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
