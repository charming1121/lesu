import React, { useState } from 'react';
import Layout from './components/Layout';
import IndustryRadar from './components/IndustryRadar';
import NewLaunchZone from './components/NewLaunchZone';
import CompetitiveIntelligenceFeed from './components/CompetitiveIntelligenceFeed';
import MaterialSearch from './components/MaterialSearch';
import AIMaterialSearch from './components/AIMaterialSearch';

function App() {
  const [currentPage, setCurrentPage] = useState('monitoring');

  const renderPageContent = () => {
    switch (currentPage) {
      case 'monitoring':
        return (
          <>
            {/* Top Section: 行业情报雷达 */}
            <IndustryRadar />
            
            {/* Middle Section: 新发基金战报专区 */}
            <NewLaunchZone />
            
            {/* Bottom Section: 全网竞品情报流 */}
            <CompetitiveIntelligenceFeed />
          </>
        );
      case 'material':
        return <AIMaterialSearch />;
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
            {/* Top Section: 行业情报雷达 */}
            <IndustryRadar />
            
            {/* Middle Section: 新发基金战报专区 */}
            <NewLaunchZone />
            
            {/* Bottom Section: 全网竞品情报流 */}
            <CompetitiveIntelligenceFeed />
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
