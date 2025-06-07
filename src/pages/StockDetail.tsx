
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stockData, setStockData] = useState<any>(null);
  const [intradayData, setIntradayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      try {
        const [quoteData, intradayInfo] = await Promise.all([
          upstoxApi.getQuote(symbol),
          upstoxApi.getIntradayData(symbol)
        ]);
        setStockData(quoteData?.data);
        setIntradayData(intradayInfo?.data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-800 rounded w-1/3"></div>
            <div className="h-32 bg-slate-800 rounded"></div>
            <div className="h-64 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const stock = stockData?.NSE_EQ?.[symbol] || {};
  const isPositive = stock.net_change >= 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{symbol}</h1>
              <p className="text-slate-400">{stock.instrument_name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">₹{stock.ltp}</div>
              <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span>{isPositive ? '+' : ''}{stock.net_change} ({stock.percent_change}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Open</div>
              <div className="text-white text-xl font-semibold">₹{stock.open}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">High</div>
              <div className="text-green-400 text-xl font-semibold">₹{stock.high}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Low</div>
              <div className="text-red-400 text-xl font-semibold">₹{stock.low}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Volume</div>
              <div className="text-white text-xl font-semibold">{stock.volume}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-emerald-600">
              Technical
            </TabsTrigger>
            <TabsTrigger value="fundamental" className="data-[state=active]:bg-emerald-600">
              Fundamental
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Previous Close</div>
                    <div className="text-white font-semibold">₹{stock.prev_close}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Day Range</div>
                    <div className="text-white font-semibold">₹{stock.low} - ₹{stock.high}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">52W High</div>
                    <div className="text-green-400 font-semibold">₹{stock.upper_circuit}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">52W Low</div>
                    <div className="text-red-400 font-semibold">₹{stock.lower_circuit}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-slate-300">
                    Technical indicators and chart analysis would be displayed here.
                    Integration with charting libraries like TradingView can be added.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundamental">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Fundamental Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-slate-300">
                    Company fundamentals, financial ratios, and earnings data would be displayed here.
                    This requires additional API endpoints for company financials.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockDetail;
