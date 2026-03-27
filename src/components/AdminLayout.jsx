import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import TopBar from './TopBar';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const { adminAuth, loading } = useAuth();

  if (loading) return <div className="loading-spinner">Initializing Admin Context...</div>;
  if (!adminAuth) return <Navigate to="/main-access" replace />;

  return (
    <div className="app-layout">
      <AdminSidebar />
      <main className="main-wrapper">
        <TopBar isAdmin={true} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
