
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { upstoxApi } from '../../services/upstoxApi';

const TopGainersLosers = () => {
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gainersData, losersData] = await Promise.all([
          upstoxApi.getTopGainers(),
          upstoxApi.getTopLosers()
        ]);
        setGainers(gainersData?.data?.slice(0, 5) || []);
        setLosers(losersData?.data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to fetch gainers/losers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StockItem = ({ stock, type }: { stock: any, type: 'gainer' | 'loser' }) => (
    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
      <div>
        <div className="text-white font-medium">{stock.symbol}</div>
        <div className="text-slate-400 text-sm">₹{stock.ltp}</div>
      </div>
      <div className={`flex items-center gap-1 ${type === 'gainer' ? 'text-green-400' : 'text-red-400'}`}>
        {type === 'gainer' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="font-semibold">{stock.percent_change}%</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="space-y-4">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="gainers" className="data-[state=active]:bg-green-600">
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="data-[state=active]:bg-red-600">
              Top Losers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-2">
            {gainers.map((stock, index) => (
              <StockItem key={index} stock={stock} type="gainer" />
            ))}
          </TabsContent>

          <TabsContent value="losers" className="space-y-2">
            {losers.map((stock, index) => (
              <StockItem key={index} stock={stock} type="loser" />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopGainersLosers;
