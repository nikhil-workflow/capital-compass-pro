
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        console.log('Fetching market indices data...');
        const indicesData = await upstoxApi.getAllIndices();
        console.log('Indices data received:', indicesData);
        
        if (indicesData?.data && Array.isArray(indicesData.data)) {
          const formattedData = indicesData.data.slice(0, 4).map((index: any) => ({
            name: index.instrument_name || index.symbol || 'Unknown',
            value: index.last_price ? index.last_price.toFixed(2) : '0.00',
            change: index.net_change ? (index.net_change >= 0 ? `+${index.net_change.toFixed(2)}` : index.net_change.toFixed(2)) : '0.00',
            percentage: index.percentage_change ? `${index.percentage_change >= 0 ? '+' : ''}${index.percentage_change.toFixed(2)}%` : '0.00%',
            trend: (index.net_change || 0) >= 0 ? 'up' : 'down',
          }));
          setMarketData(formattedData);
        } else {
          // Fallback to mock data if API fails
          setMarketData([
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
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        // Use fallback data
        setMarketData([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-8 bg-slate-700 rounded mb-1"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {marketData.map((market, index) => (
        <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-300 text-sm font-medium">{market.name}</h3>
            {market.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹{market.value}</div>
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
