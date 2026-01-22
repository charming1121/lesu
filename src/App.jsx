import React, { useState } from 'react';
import Layout from './components/Layout';
import OverviewSection from './components/OverviewSection';
import LatestMaterials from './components/LatestMaterials';
import MaterialSearch from './components/MaterialSearch';

function App() {
  const [currentPage, setCurrentPage] = useState('monitoring');

  const renderPageContent = () => {
    switch (currentPage) {
      case 'monitoring':
        return (
          <>
            <OverviewSection />
            <LatestMaterials />
          </>
        );
      case 'material':
        return <MaterialSearch />;
      case 'compliance':
        return (
          <div className="text-gray-500 text-center py-20">
            <p className="text-lg">合规检测功能开发中...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-gray-500 text-center py-20">
            <p className="text-lg">账号设置功能开发中...</p>
          </div>
        );
      default:
        return (
          <>
            <OverviewSection />
            <LatestMaterials />
          </>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </Layout>
  );
}

export default App;
