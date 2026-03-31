import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ mobileOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header" style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: 'auto', 
        padding: '1.5rem', 
        gap: '1rem', 
        borderBottom: '1px solid var(--border-color)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src="/assets/Growlity-Logo.webp" alt="Growlity" className="sidebar-logo" style={{ maxWidth: '100px', height: 'auto' }} />
        </div>
        
        {/* Mobile Close Button */}
        <button 
          className="btn-icon mobile-only-flex" 
          onClick={onClose}
          style={{ display: 'none', color: 'var(--text-secondary)' }}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          onClick={onClose} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon"><LayoutDashboard size={22} /></div>
          <span>Hub Dashboard</span>
        </NavLink>
        <NavLink 
          to="/calculator" 
          onClick={onClose} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon"><Calculator size={22} /></div>
          <span>Carbon Calculator</span>
        </NavLink>
        <NavLink 
          to="/history" 
          onClick={onClose} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon"><History size={22} /></div>
          <span>Emission History</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          onClick={onClose} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon"><Settings size={22} /></div>
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={handleLogout} 
          className="nav-item" 
          style={{ color: 'var(--danger)', width: '100%', border: 'none', background: 'none', padding: '0.875rem 1.25rem' }}
        >
          <div className="nav-icon"><LogOut size={22} /></div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
