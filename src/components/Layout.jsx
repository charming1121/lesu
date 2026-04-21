import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1680px] p-6">
        <div className="min-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
