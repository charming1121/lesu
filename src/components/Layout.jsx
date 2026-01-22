import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <Header currentPage={currentPage} />
      <main className="ml-[240px] mt-16 p-6">
        <div className="min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
