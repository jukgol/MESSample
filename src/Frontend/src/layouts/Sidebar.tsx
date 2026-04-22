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
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
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
      <div className="sidebar-header">
        <h2 className="gradient-text">MES TERMINAL</h2>
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
