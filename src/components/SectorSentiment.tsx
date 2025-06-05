
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const SectorSentiment = () => {
  const sectors = [
    { name: 'IT', sentiment: 82, change: '+5.2%', trend: 'up', news: 12 },
    { name: 'Banking', sentiment: 76, change: '+2.1%', trend: 'up', news: 18 },
    { name: 'Pharma', sentiment: 71, change: '-1.8%', trend: 'down', news: 8 },
    { name: 'Auto', sentiment: 68, change: '+3.4%', trend: 'up', news: 15 },
    { name: 'Energy', sentiment: 65, change: '-2.9%', trend: 'down', news: 22 },
    { name: 'FMCG', sentiment: 62, change: '+1.1%', trend: 'up', news: 9 },
  ];

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return 'text-emerald-400';
    if (sentiment >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 75) return 'bg-emerald-400/20';
    if (sentiment >= 60) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Sector Sentiment</h2>
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-slate-400 text-sm mt-1">News-based sentiment analysis by sector</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {sectors.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg ${getSentimentBg(sector.sentiment)} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${getSentimentColor(sector.sentiment)}`}>
                    {sector.sentiment}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{sector.name}</h3>
                  <p className="text-slate-400 text-sm">{sector.news} news articles</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${sector.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sector.change}
                </span>
                {sector.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorSentiment;
