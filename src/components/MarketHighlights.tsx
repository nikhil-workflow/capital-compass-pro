
import React from 'react';
import { Activity, Crown, Zap } from 'lucide-react';

const MarketHighlights = () => {
  const topGainers = [
    { symbol: 'ADANIPORTS', change: '+8.45%', price: '1,234.56' },
    { symbol: 'TATASTEEL', change: '+6.23%', price: '987.65' },
    { symbol: 'HINDALCO', change: '+5.89%', price: '543.21' },
  ];

  const topLosers = [
    { symbol: 'BAJFINANCE', change: '-4.56%', price: '6,789.01' },
    { symbol: 'HDFCLIFE', change: '-3.78%', price: '654.32' },
    { symbol: 'ICICIBANK', change: '-2.91%', price: '876.54' },
  ];

  const mostActive = [
    { symbol: 'RELIANCE', volume: '2.45M', price: '2,387.65' },
    { symbol: 'TCS', volume: '1.89M', price: '3,542.30' },
    { symbol: 'INFY', volume: '1.67M', price: '1,456.78' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Gainers */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Top Gainers</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {topGainers.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{stock.symbol}</div>
                <div className="text-slate-400 text-sm">₹{stock.price}</div>
              </div>
              <div className="text-emerald-400 font-semibold">{stock.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Top Losers</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {topLosers.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{stock.symbol}</div>
                <div className="text-slate-400 text-sm">₹{stock.price}</div>
              </div>
              <div className="text-red-400 font-semibold">{stock.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Most Active</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {mostActive.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{stock.symbol}</div>
                <div className="text-slate-400 text-sm">₹{stock.price}</div>
              </div>
              <div className="text-blue-400 font-semibold">{stock.volume}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketHighlights;
