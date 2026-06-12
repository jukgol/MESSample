import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Users,
  Calculator,
  Activity
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
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
        { title: '공정 정의', path: '/dashboard/masterdata/steps', icon: <Settings size={16} />, allowedRoles: ['ADMIN'] },
        { title: '제품별 공정 관리', path: '/dashboard/masterdata/product-processes', icon: <Settings size={16} />, allowedRoles: ['ADMIN'] },
      ]
    },
    {
      title: '재고 관리',
      icon: <ClipboardList size={20} />,
      path: '/dashboard/inventory',
      allowedRoles: ['ADMIN'],
      children: [
        { title: 'LOT 관리', path: '/dashboard/inventory/lots', icon: <ClipboardList size={16} />, allowedRoles: ['ADMIN'] },
        { title: '자재 소요량 계획 (MRP)', path: '/dashboard/inventory/mrp', icon: <Calculator size={16} />, allowedRoles: ['ADMIN'] },
        { title: '출하 관리', path: '/dashboard/inventory/shipments', icon: <Truck size={16} />, allowedRoles: ['ADMIN'] },
      ]
    },
    {
      title: '공정 관리',
      icon: <Settings size={20} />,
      path: '/dashboard/process-manager',
      allowedRoles: ['ADMIN', 'OPERATOR'],
      children: [
        { title: '작업 지시 (WO)', path: '/dashboard/process-manager/workorder', icon: <ClipboardList size={16} />, allowedRoles: ['ADMIN', 'OPERATOR'] },
        { title: '모니터링', path: '/dashboard/process-manager/monitoring', icon: <Activity size={16} />, allowedRoles: ['ADMIN', 'OPERATOR'] },
      ]
    },
    {
      title: '로그 / 이력',
      icon: <History size={20} />,
      path: '/dashboard/history',
      allowedRoles: ['ADMIN', 'QC', 'VIEWER'],
      children: [
        { title: '작업지시 이력', path: '/dashboard/history/work-orders', icon: <ClipboardList size={16} />, allowedRoles: ['ADMIN', 'VIEWER'] },
        { title: 'LOT 관계 이력', path: '/dashboard/history/lot-relations', icon: <Layers size={16} />, allowedRoles: ['ADMIN', 'VIEWER'] },
        { title: 'LOT 재고 변동 이력', path: '/dashboard/history/lot-trace', icon: <Activity size={16} />, allowedRoles: ['ADMIN', 'VIEWER'] },
        { title: '품질 검사 (QC)', path: '/dashboard/history/qc', icon: <ShieldCheck size={16} />, allowedRoles: ['ADMIN', 'QC'] },
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

  // URL 경로 감지하여 서브메뉴의 부모 대메뉴 자동 펼침
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => location.pathname === child.path);
        if (hasActiveChild) {
          initialExpanded[item.title] = true;
        }
      }
    });
    setExpandedItems(prev => ({ ...initialExpanded, ...prev }));
  }, [location.pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

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
        {filteredMenuItems.map((item) => {
          const hasChildren = !!item.children;
          const isExpanded = !!expandedItems[item.title];

          return (
            <div key={item.path} className="menu-group">
              {hasChildren ? (
                <div
                  onClick={() => toggleExpand(item.title)}
                  className="menu-item"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="title">{item.title}</span>
                  <ChevronRight
                    size={14}
                    className="arrow"
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isExpanded ? 'rotate(90deg)' : 'none'
                    }}
                  />
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="title">{item.title}</span>
                </NavLink>
              )}

              {hasChildren && isExpanded && (
                <div className="submenu">
                  {item.children?.map((child) => (
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
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
