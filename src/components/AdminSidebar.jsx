import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  ChevronRight, 
  LogOut, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/main-access');
  };

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Platform Overview', end: true },
    { path: '/admin/accounts', icon: Users, label: 'Enterprise Accounts' },
    { path: '/admin/compliance', icon: FileText, label: 'Compliance Audit' },
    { path: '/admin/settings', icon: Settings, label: 'Global Standards' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '1.5rem', gap: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <img src="/assets/Growlity-Logo.webp" alt="Growlity" className="sidebar-logo" style={{ maxWidth: '120px', height: 'auto' }} />
        <div className="sidebar-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span className="sidebar-name" style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
            Admin Portal
          </span>
          <span className="sidebar-status" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Global ESG Hub
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-text">{item.label}</span>
              <ChevronRight className="nav-arrow" size={14} />
            </NavLink>
          ))}
        </div>

        <div className="nav-group" style={{ marginTop: 'auto' }}>
            <button 
              onClick={handleAdminLogout} 
              className="nav-item" 
              style={{ width: '100%', border: 'none', background: 'none', color: 'var(--danger)' }}
            >
              <LogOut className="nav-icon" size={20} />
              <span className="nav-text">Logout</span>
            </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
