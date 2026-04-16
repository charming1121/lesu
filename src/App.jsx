import React, { useState } from 'react';
import Layout from './components/Layout';
import MultiDimDashboard from './components/MultiDimDashboard';
import ContentCenterInsight from './components/ContentCenterInsight';
import OperationsInsight from './components/OperationsInsight';

function App() {
  const [currentPage, setCurrentPage] = useState('multidim');

  const renderPage = () => {
    if (currentPage === 'content-center-insight') {
      return <ContentCenterInsight />;
    }
    if (currentPage === 'operations-insight') {
      return <OperationsInsight />;
    }

    return <MultiDimDashboard />;
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
