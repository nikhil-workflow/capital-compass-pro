
import React from 'react';
import Navigation from '../components/Navigation';

const StockList = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Stock List</h1>
          <p className="text-slate-400 text-lg">Comprehensive stock analysis coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default StockList;
