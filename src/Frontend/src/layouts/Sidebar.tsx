import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Settings, 
  History, 
  LayoutDashboard, 
  ChevronRight,
  Database,
  Truck,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Layers,
  Users
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  allowedRoles?: string[];
  children?: MenuItem[];
}

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const menuItems: MenuItem[] = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/dashboard' 
    },
    { 
      title: '기준 정보', 
      icon: <Database size={20} />, 
      path: '/dashboard/masterdata',
      allowedRoles: ['ADMIN'],
      children: [
        { title: '품목 리스트', path: '/dashboard/masterdata/items', icon: <Package size={16} />, allowedRoles: ['ADMIN'] },
        { title: '품목 유형 관리', path: '/dashboard/masterdata/itemtype', icon: <Layers size={16} />, allowedRoles: ['ADMIN'] },
        { title: 'BOM 레시피 관리', path: '/dashboard/masterdata/boms', icon: <Settings size={16} />, allowedRoles: ['ADMIN'] },
      ]
    },
    { 
      title: '재고 관리', 
      icon: <ClipboardList size={20} />, 
      path: '/dashboard/inventory',
      allowedRoles: ['ADMIN'],
      children: [
        { title: 'LOT 관리', path: '/dashboard/inventory/lots', icon: <ClipboardList size={16} />, allowedRoles: ['ADMIN'] },
        { title: '출하 관리', path: '/dashboard/inventory/shipments', icon: <Truck size={16} />, allowedRoles: ['ADMIN'] },
      ]
    },
    { 
      title: '공정 관리', 
      icon: <Settings size={20} />, 
      path: '/dashboard/process',
      allowedRoles: ['ADMIN', 'OPERATOR'],
      children: [
        { title: '공정 단계 정의', path: '/dashboard/process/steps', icon: <Settings size={16} />, allowedRoles: ['ADMIN', 'OPERATOR'] },
        { title: '작업 지시 (WO)', path: '/dashboard/process/workorder', icon: <ClipboardList size={16} />, allowedRoles: ['ADMIN', 'OPERATOR'] },
      ]
    },
    { 
      title: '로그 / 이력', 
      icon: <History size={20} />, 
      path: '/dashboard/log-monitor',
      allowedRoles: ['ADMIN', 'QC', 'VIEWER'],
      children: [
        { title: '공정 이력', path: '/dashboard/log-monitor/process', icon: <History size={16} />, allowedRoles: ['ADMIN', 'VIEWER'] },
        { title: '품질 검사 (QC)', path: '/dashboard/log-monitor/qc', icon: <ShieldCheck size={16} />, allowedRoles: ['ADMIN', 'QC'] },
      ]
    },
    {
      title: '시스템 설정',
      icon: <Settings size={20} />,
      path: '/dashboard/system',
      allowedRoles: ['ADMIN'],
      children: [
        { title: '사용자 관리', path: '/dashboard/system/users', icon: <Users size={16} />, allowedRoles: ['ADMIN'] },
        { title: '직책 권한 설정', path: '/dashboard/system/roles', icon: <ShieldCheck size={16} />, allowedRoles: ['ADMIN'] }
      ]
    },
  ];

  // 유저 역할에 맞게 선언적으로 메뉴 필터링 (하드코딩 제거)
  const roleCode = user?.roleCode || 'VIEWER';
  const filteredMenuItems = menuItems.map(item => {
    // 1. 상위 메뉴 접근 권한 확인
    if (item.allowedRoles && !item.allowedRoles.includes(roleCode)) {
      return null;
    }

    // 2. 하위 메뉴가 있을 경우 하위 메뉴 권한 확인
    if (item.children) {
      const filteredChildren = item.children.filter(child => 
        !child.allowedRoles || child.allowedRoles.includes(roleCode)
      );

      // 하위 메뉴가 권한 필터링으로 하나도 없으면 상위 메뉴도 숨김 (Dashboard 제외)
      if (filteredChildren.length === 0 && item.path !== '/dashboard') {
        return null;
      }

      return { ...item, children: filteredChildren };
    }

    return item;
  }).filter(Boolean) as MenuItem[];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h2 className="gradient-text">MES TERMINAL</h2>
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {user.userName || user.userId}님 접속중
                </span>
              </div>
              <button 
                onClick={logout}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
                title="로그아웃"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
            
            {/* 권한 뱃지 표시 */}
            <div style={{ 
              alignSelf: 'flex-start',
              fontSize: '0.7rem', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(99, 102, 241, 0.15)', 
              color: 'var(--accent-primary)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              marginTop: '1px',
              fontWeight: 500
            }}>
              권한: {user.roleName || user.roleCode || '일반 조회자'}
            </div>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <div key={item.path} className="menu-group">
            <NavLink 
              to={item.path} 
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="title">{item.title}</span>
              {item.children && <ChevronRight size={14} className="arrow" />}
            </NavLink>
            
            {item.children && (
              <div className="submenu">
                {item.children.map((child) => (
                  <NavLink 
                    key={child.path} 
                    to={child.path}
                    className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="icon">{child.icon}</span>
                    <span className="title">{child.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
