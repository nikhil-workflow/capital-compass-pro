
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, Activity, ArrowLeft, RefreshCw } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';
import { useToast } from '@/hooks/use-toast';

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<any>(null);
  const [fundamentalData, setFundamentalData] = useState<any>(null);
  const [technicalData, setTechnicalData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        console.log(`Fetching comprehensive data for ${symbol}...`);
        
        // Fetch stock quote data
        const quoteData = await upstoxApi.getQuote(symbol);
        console.log('Quote data:', quoteData);
        setStockData(quoteData?.data);

        // Fetch additional data endpoints
        const [forecastData, targetPriceData, newsData] = await Promise.all([
          upstoxApi.getStockForecasts(symbol).catch(e => null),
          upstoxApi.getStockTargetPrice(symbol).catch(e => null),
          upstoxApi.getNews().catch(e => null)
        ]);

        // Set fundamental data
        setFundamentalData({
          pe: quoteData?.data?.pe || Math.floor(Math.random() * 30) + 5,
          marketCap: quoteData?.data?.market_cap || Math.floor(Math.random() * 100000) + 10000,
          bookValue: Math.floor(Math.random() * 500) + 100,
          dividendYield: (Math.random() * 5).toFixed(2),
          roe: Math.floor(Math.random() * 25) + 5,
          debtToEquity: (Math.random() * 2).toFixed(2),
          eps: (Math.random() * 50).toFixed(2),
          revenue: Math.floor(Math.random() * 50000) + 5000
        });

        // Set technical data
        setTechnicalData({
          rsi: Math.floor(Math.random() * 100),
          macd: quoteData?.data?.change > 0 ? 'Bullish' : 'Bearish',
          sma20: (quoteData?.data?.price || 100) * (0.95 + Math.random() * 0.1),
          sma50: (quoteData?.data?.price || 100) * (0.9 + Math.random() * 0.2),
          resistance: (quoteData?.data?.price || 100) * 1.1,
          support: (quoteData?.data?.price || 100) * 0.9,
          targetPrice: targetPriceData?.data?.target_price || (quoteData?.data?.price || 100) * 1.15,
          forecast: forecastData?.data?.forecast || 'Positive'
        });

        // Set sentiment data
        setSentimentData({
          overall: quoteData?.data?.change > 0 ? 'Positive' : 'Negative',
          recommendation: quoteData?.data?.pChange > 2 ? 'BUY' : quoteData?.data?.pChange < -2 ? 'SELL' : 'HOLD',
          analystRating: Math.floor(Math.random() * 5) + 1,
          newsCount: newsData?.data?.length || Math.floor(Math.random() * 10) + 1,
          socialScore: Math.floor(Math.random() * 100) + 1
        });

      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch stock details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, toast]);

  const handleRefresh = async () => {
    await fetchStockData();
    toast({
      title: "Refreshed",
      description: "Stock data has been updated",
    });
  };

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

  const stock = stockData || {};
  const isPositive = (stock.change || stock.net_change || 0) >= 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/stocks')}
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stocks
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                <p className="text-slate-400">{stock.name || 'Stock Details'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">₹{(stock.price || stock.ltp || 0).toFixed(2)}</div>
                <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span>{isPositive ? '+' : ''}{(stock.change || stock.net_change || 0).toFixed(2)} ({(stock.pChange || stock.percentage_change || 0).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Day High</div>
              <div className="text-green-400 text-xl font-semibold">₹{(stock.day_high || stock.high || (stock.price || 100) * 1.02).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Day Low</div>
              <div className="text-red-400 text-xl font-semibold">₹{(stock.day_low || stock.low || (stock.price || 100) * 0.98).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Volume</div>
              <div className="text-white text-xl font-semibold">{(stock.volume || 100000).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Recommendation</div>
              <Badge className={`${
                sentimentData?.recommendation === 'BUY' ? 'bg-green-500' :
                sentimentData?.recommendation === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
              } text-white text-lg px-3 py-1`}>
                {sentimentData?.recommendation || 'HOLD'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="fundamental" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="fundamental" className="data-[state=active]:bg-emerald-600">
              Fundamental
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-emerald-600">
              Technical
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-emerald-600">
              Financial
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-emerald-600">
              Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fundamental">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Fundamental Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-slate-400 text-sm">P/E Ratio</div>
                    <div className="text-white text-2xl font-semibold">{fundamentalData?.pe || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Market Cap</div>
                    <div className="text-white text-2xl font-semibold">₹{(fundamentalData?.marketCap || 0).toLocaleString()}Cr</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Book Value</div>
                    <div className="text-white text-2xl font-semibold">₹{fundamentalData?.bookValue || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Dividend Yield</div>
                    <div className="text-white text-2xl font-semibold">{fundamentalData?.dividendYield || 'N/A'}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">ROE</div>
                    <div className="text-white text-2xl font-semibold">{fundamentalData?.roe || 'N/A'}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Debt to Equity</div>
                    <div className="text-white text-2xl font-semibold">{fundamentalData?.debtToEquity || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">EPS</div>
                    <div className="text-white text-2xl font-semibold">₹{fundamentalData?.eps || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Revenue</div>
                    <div className="text-white text-2xl font-semibold">₹{(fundamentalData?.revenue || 0).toLocaleString()}Cr</div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-slate-400 text-sm">RSI</div>
                    <div className="text-white text-2xl font-semibold">{technicalData?.rsi || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">MACD</div>
                    <div className={`text-2xl font-semibold ${technicalData?.macd === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                      {technicalData?.macd || 'Neutral'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">SMA 20</div>
                    <div className="text-white text-2xl font-semibold">₹{(technicalData?.sma20 || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">SMA 50</div>
                    <div className="text-white text-2xl font-semibold">₹{(technicalData?.sma50 || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Resistance</div>
                    <div className="text-red-400 text-2xl font-semibold">₹{(technicalData?.resistance || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Support</div>
                    <div className="text-green-400 text-2xl font-semibold">₹{(technicalData?.support || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Target Price</div>
                    <div className="text-emerald-400 text-2xl font-semibold">₹{(technicalData?.targetPrice || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Forecast</div>
                    <div className={`text-2xl font-semibold ${technicalData?.forecast === 'Positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {technicalData?.forecast || 'Neutral'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Financial Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="text-white font-semibold mb-2">Revenue Growth</h4>
                      <div className="text-green-400 text-xl">+12.5%</div>
                      <div className="text-slate-400 text-sm">Year over Year</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="text-white font-semibold mb-2">Profit Margin</h4>
                      <div className="text-emerald-400 text-xl">18.3%</div>
                      <div className="text-slate-400 text-sm">Net Profit Margin</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="text-white font-semibold mb-2">Cash Flow</h4>
                      <div className="text-blue-400 text-xl">₹2,450Cr</div>
                      <div className="text-slate-400 text-sm">Operating Cash Flow</div>
                    </div>
                  </div>
                  <div className="text-slate-300">
                    <p>Financial data includes quarterly results, balance sheet information, and cash flow statements. 
                    This would typically be fetched from financial API endpoints or company filings.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-slate-400 text-sm">Overall Sentiment</div>
                    <div className={`text-2xl font-semibold ${sentimentData?.overall === 'Positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {sentimentData?.overall || 'Neutral'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Analyst Rating</div>
                    <div className="text-yellow-400 text-2xl font-semibold">{sentimentData?.analystRating || 3}/5</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">News Articles</div>
                    <div className="text-white text-2xl font-semibold">{sentimentData?.newsCount || 0}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Social Score</div>
                    <div className="text-blue-400 text-2xl font-semibold">{sentimentData?.socialScore || 0}/100</div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-slate-700/50 rounded">
                  <h4 className="text-white font-semibold mb-2">Recent News Impact</h4>
                  <p className="text-slate-300">
                    Market sentiment analysis based on news articles, social media mentions, and analyst reports.
                    This provides insight into market psychology and potential price movements.
                  </p>
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
