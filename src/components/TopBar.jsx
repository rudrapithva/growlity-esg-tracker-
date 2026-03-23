import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TopBar = ({ isAdmin = false }) => {
  const { currentUser, adminAuth } = useAuth();
  
  // Choose user profile based on context
  const activeUser = isAdmin ? adminAuth : currentUser;
  const displayName = activeUser?.name || activeUser?.displayName || activeUser?.email?.split('@')[0] || 'Member';
  const role = isAdmin ? (adminAuth?.role || 'Platform Admin') : 'Customer Dashboard';
  const initial = displayName.charAt(0).toUpperCase();
  const photoURL = activeUser?.photoURL;
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            style={{ paddingLeft: '2.5rem', width: '300px', height: '40px', borderRadius: 'var(--radius-full)' }} 
          />
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar" style={{ backgroundColor: isAdmin ? 'var(--primary)' : 'var(--blue)' }}>
            {photoURL ? <img src={photoURL} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} /> : (isAdmin ? 'SA' : initial)}
          </div>
          <div className="user-info">
            <span className="name">{displayName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="role">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
