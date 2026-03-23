import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-wrapper">
        <TopBar />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
