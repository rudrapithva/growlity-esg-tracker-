import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calculator, History, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout, isAdmin } = useAuth();
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
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/Growlity-Logo.webp" alt="Growlity Logo" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><LayoutDashboard size={22} /></div>
          <span>Hub Dashboard</span>
        </NavLink>
        <NavLink to="/calculator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Calculator size={22} /></div>
          <span>Carbon Calculator</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><History size={22} /></div>
          <span>Emission History</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-icon"><Settings size={22} /></div>
          <span>Settings</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--danger)', width: '100%', border: 'none', background: 'none' }}>
          <div className="nav-icon"><LogOut size={22} /></div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
