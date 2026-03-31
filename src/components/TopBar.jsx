import React from 'react';
import { Bell, Search, User, X, Check, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TopBar = ({ isAdmin = false, onMenuClick }) => {
  const { currentUser, adminAuth, updateName } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [updating, setUpdating] = React.useState(false);
  
  // Choose user profile based on context
  const activeUser = isAdmin ? adminAuth : currentUser;
  const displayName = activeUser?.name || activeUser?.displayName || activeUser?.email?.split('@')[0] || 'Member';
  const role = isAdmin ? (adminAuth?.role || 'Platform Admin') : 'Customer Dashboard';

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === displayName) {
      setIsEditing(false);
      return;
    }
    
    setUpdating(true);
    try {
      await updateName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      alert("Failed to update name. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const openProfile = () => {
    setNewName(displayName);
    setShowProfile(true);
  };

  return (
    <header className="topbar">
      <div className="topbar-left" style={{ gap: '1rem' }}>
        <button 
          className="btn-icon mobile-only-flex" 
          onClick={onMenuClick}
          style={{ display: 'none' }} 
        >
          <Menu size={24} />
        </button>
        <div className="search-bar" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ 
              paddingLeft: '2.5rem', 
              width: '100%', 
              height: '40px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem'
            }} 
          />
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div className="user-profile" onClick={openProfile}>
          <div className="avatar">
            {isAdmin ? 'AD' : displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info hide-mobile">
            <span className="name">{displayName}</span>
            <span className="role">{role}</span>
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="profile-card" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)',
            width: '400px', boxShadow: 'var(--shadow-xl)', position: 'relative'
          }}>
            <button onClick={() => setShowProfile(false)} style={{
              position: 'absolute', top: '1rem', right: '1rem', border: 'none',
              background: 'none', cursor: 'pointer', color: 'var(--text-muted)'
            }}>
              <X size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
                backgroundColor: isAdmin ? 'var(--primary)' : 'var(--secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 700, color: 'white'
              }}>
                {isAdmin ? 'AD' : displayName.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.25rem' }}>{isAdmin ? 'Admin Profile' : 'User Profile'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{role}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Display Name</label>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', flex: 1, paddingLeft: '0.75rem' }}
                    />
                    <button 
                      onClick={handleUpdateName} 
                      disabled={updating}
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}
                    >
                      {updating ? '...' : <Check size={18} />}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{displayName}</span>
                    <button 
                      onClick={() => setIsEditing(true)}
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Edit Name
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</label>
                <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  {activeUser?.email}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Email cannot be changed for security reasons.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
