
import React from 'react';
import Navigation from '../components/Navigation';
import MarketOverview from '../components/MarketOverview';
import SectorSentiment from '../components/SectorSentiment';
import MarketHighlights from '../components/MarketHighlights';
import MarketStatus from '../components/widgets/MarketStatus';
import TopGainersLosers from '../components/widgets/TopGainersLosers';
import WeekHighLow from '../components/widgets/WeekHighLow';
import ComprehensiveRecommendations from '../components/dashboard/ComprehensiveRecommendations';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Market Dashboard - Real-time Data</h1>
          <p className="text-slate-400">Live market analysis powered by Upstox API with comprehensive trading recommendations</p>
        </div>

        {/* Market Status Widget */}
        <div className="mb-6">
          <MarketStatus />
        </div>

        {/* Market Overview */}
        <MarketOverview />

        {/* New Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopGainersLosers />
          <SectorSentiment />
        </div>

        {/* 52-Week High/Low */}
        <div className="mb-8">
          <WeekHighLow />
        </div>

        {/* Comprehensive Recommendations - 12 Widget System */}
        <div className="mb-8">
          <ComprehensiveRecommendations />
        </div>

        {/* Market Highlights */}
        <MarketHighlights />
      </main>
    </div>
  );
};

export default Index;
