
import React from 'react';
import Navigation from '../components/Navigation';
import MarketOverview from '../components/MarketOverview';
import StockRecommendations from '../components/StockRecommendations';
import SectorSentiment from '../components/SectorSentiment';
import MarketHighlights from '../components/MarketHighlights';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Market Dashboard</h1>
          <p className="text-slate-400">Real-time market analysis powered by AI</p>
        </div>

        {/* Market Overview */}
        <MarketOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <StockRecommendations />
          </div>
          <div>
            <SectorSentiment />
          </div>
        </div>

        {/* Market Highlights */}
        <MarketHighlights />
      </main>
    </div>
  );
};

export default Index;
