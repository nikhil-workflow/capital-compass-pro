
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingDown } from 'lucide-react';
import { upstoxApi } from '../../services/upstoxApi';

const WeekHighLow = () => {
  const [highStocks, setHighStocks] = useState<any[]>([]);
  const [lowStocks, setLowStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highData, lowData] = await Promise.all([
          upstoxApi.get52WeekHigh(),
          upstoxApi.get52WeekLow()
        ]);
        setHighStocks(highData?.data?.slice(0, 10) || []);
        setLowStocks(lowData?.data?.slice(0, 10) || []);
      } catch (error) {
        console.error('Failed to fetch 52-week data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            52-Week Highs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {highStocks.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                  <div>
                    <div className="text-white font-medium">{stock.symbol}</div>
                    <div className="text-green-400 text-sm">₹{stock.ltp}</div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    NEW HIGH
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            52-Week Lows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {lowStocks.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/20">
                  <div>
                    <div className="text-white font-medium">{stock.symbol}</div>
                    <div className="text-red-400 text-sm">₹{stock.ltp}</div>
                  </div>
                  <Badge className="bg-red-500 text-white">
                    NEW LOW
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeekHighLow;
