
import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    {
      name: 'NIFTY 50',
      value: '19,674.25',
      change: '+127.85',
      percentage: '+0.65%',
      trend: 'up',
    },
    {
      name: 'BANK NIFTY',
      value: '44,312.70',
      change: '-89.45',
      percentage: '-0.20%',
      trend: 'down',
    },
    {
      name: 'SENSEX',
      value: '65,953.48',
      change: '+423.12',
      percentage: '+0.65%',
      trend: 'up',
    },
    {
      name: 'VIX',
      value: '13.42',
      change: '-0.67',
      percentage: '-4.76%',
      trend: 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {marketData.map((market) => (
        <div key={market.name} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-300 text-sm font-medium">{market.name}</h3>
            {market.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{market.value}</div>
          <div className={`text-sm flex items-center ${
            market.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <span>{market.change}</span>
            <span className="ml-2">({market.percentage})</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOverview;
