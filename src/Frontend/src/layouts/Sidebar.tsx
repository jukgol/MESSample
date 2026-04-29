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
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore((state) => ({ user: state.user, logout: state.logout }));
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/' 
    },
    { 
      title: '물품 관리', 
      icon: <Package size={20} />, 
      path: '/items',
      children: [
        { title: '품목 리스트', path: '/items/list', icon: <Database size={16} /> },
        { title: 'LOT 관리', path: '/items/lot', icon: <ClipboardList size={16} /> },
        { title: '출하 관리', path: '/items/shipment', icon: <Truck size={16} /> },
      ]
    },
    { 
      title: '공정 관리', 
      icon: <Settings size={20} />, 
      path: '/process',
      children: [
        { title: '공정 단계 정의', path: '/process/steps', icon: <Settings size={16} /> },
        { title: '작업 지시 (WO)', path: '/process/workorder', icon: <ClipboardList size={16} /> },
      ]
    },
    { 
      title: '로그 / 이력', 
      icon: <History size={20} />, 
      path: '/log-monitor',
      children: [
        { title: '공정 이력', path: '/log-monitor/process', icon: <History size={16} /> },
        { title: '품질 검사 (QC)', path: '/log-monitor/qc', icon: <ShieldCheck size={16} /> },
      ]
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h2 className="gradient-text">MES TERMINAL</h2>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
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
        )}
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
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
