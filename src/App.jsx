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
