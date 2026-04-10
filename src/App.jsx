import React from 'react';
import Layout from './components/Layout';
import MultiDimDashboard from './components/MultiDimDashboard';

function App() {
  return (
    <Layout currentPage="multidim">
      <MultiDimDashboard />
    </Layout>
  );
}

export default App;
