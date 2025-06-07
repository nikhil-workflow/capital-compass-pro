
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { upstoxApi } from '../../services/upstoxApi';

const MarketStatus = () => {
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const data = await upstoxApi.getMarketStatus();
        setMarketStatus(data);
      } catch (error) {
        console.error('Failed to fetch market status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStatus();
  }, []);

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300">Loading market status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOpen = marketStatus?.data?.market_status === 'open';

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-medium">Market Status</span>
          </div>
          <Badge className={`${isOpen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-slate-400">
          NSE • {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStatus;
