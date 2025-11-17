import React from 'react';
import CryptoAnalysisDashboard from './components/CryptoAnalysisDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Crypto Seasonal Analysis Dashboard
        </h1>
        <CryptoAnalysisDashboard />
      </div>
    </div>
  );
}

export default App;
