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
import WorkOrderPage from '../../process/workorder/pages/WorkOrderPage';
import ProcessMonitoringPage from '../../process/monitoring/pages/ProcessMonitoringPage';
import { useAuthStore } from '../../../store/useAuthStore';
import WorkOrderHistoryPage from '../../history/workorder/pages/WorkOrderHistoryPage';
import LotRelationHistoryPage from '../../history/lotrelation/pages/LotRelationHistoryPage';
import LotTraceHistoryPage from '../../history/lottrace/pages/LotTraceHistoryPage';
import { hasAccess, PERMISSIONS } from '../../../store/permissions';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="premium-card">
    <h1 className="gradient-text">{title}</h1>
    <p style={{ color: 'var(--text-secondary)' }}>준비 중인 페이지입니다.</p>
  </div>
);

const DashboardRoutes = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Dashboard / Root */}
        <Route path="/" element={<DashboardHome />} />

        {(hasAccess(user, { allowedPermissions: [PERMISSIONS.masterDataView] }) ||
          hasAccess(user, { allowedPermissions: [PERMISSIONS.processView] })) && (
          <>
            <Route path="/masterdata" element={<Navigate to={hasAccess(user, { allowedPermissions: [PERMISSIONS.masterDataView] }) ? 'items' : 'steps'} replace />} />
            {hasAccess(user, { allowedPermissions: [PERMISSIONS.masterDataView] }) && (
              <>
                <Route path="/masterdata/items" element={<ItemList />} />
                <Route path="/masterdata/itemtype" element={<ItemTypeList />} />
                <Route path="/masterdata/boms" element={<BomManagePage />} />
              </>
            )}
            {hasAccess(user, { allowedPermissions: [PERMISSIONS.processView] }) && (
              <>
                <Route path="/masterdata/steps" element={<ProcessStepList />} />
                <Route path="/masterdata/product-processes" element={<ProductProcessList />} />
              </>
            )}
          </>
        )}

        {(hasAccess(user, { allowedPermissions: [PERMISSIONS.inventoryView] }) ||
          hasAccess(user, { allowedPermissions: [PERMISSIONS.masterDataView] })) && (
          <>
            <Route path="/inventory" element={<Navigate to={hasAccess(user, { allowedPermissions: [PERMISSIONS.inventoryView] }) ? 'lots' : 'mrp'} replace />} />
            {hasAccess(user, { allowedPermissions: [PERMISSIONS.inventoryView] }) && (
              <>
                <Route path="/inventory/lots" element={<LotList />} />
                <Route path="/inventory/shipments" element={<Placeholder title="출하 관리" />} />
              </>
            )}
            {hasAccess(user, { allowedPermissions: [PERMISSIONS.masterDataView] }) && (
              <Route path="/inventory/mrp" element={<MrpContainerPage />} />
            )}
          </>
        )}

        {hasAccess(user, { allowedRoles: ['ADMIN'] }) && (
          <>
            <Route path="/system/users" element={<UserList />} />
            <Route path="/system/roles" element={<RoleManager />} />
          </>
        )}

        {hasAccess(user, { allowedPermissions: [PERMISSIONS.processView] }) && (
          <>
            <Route path="/process-manager/workorder" element={<WorkOrderPage />} />
            <Route path="/process-manager/monitoring" element={<ProcessMonitoringPage />} />
          </>
        )}

        {hasAccess(user, { allowedPermissions: [PERMISSIONS.processView] }) && (
          <>
            <Route path="/history/work-orders" element={<WorkOrderHistoryPage />} />
            <Route path="/history/lot-relations" element={<LotRelationHistoryPage />} />
            <Route path="/history/lot-trace" element={<LotTraceHistoryPage />} />
          </>
        )}

        {hasAccess(user, { allowedPermissions: [PERMISSIONS.qcView] }) && (
          <Route path="/history/qc" element={<Placeholder title="품질 검사 (QC)" />} />
        )}

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
