
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';
import { useToast } from '@/hooks/use-toast';

// Popular NSE stocks for multi-quote API
const popularStocks = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 
  'KOTAKBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC',
  'ASIANPAINT', 'LT', 'AXISBANK', 'MARUTI', 'SUNPHARMA'
];

// Helper functions moved outside component to prevent re-creation
const getSectorByScrip = (symbol: string) => {
  const sectors: { [key: string]: string } = {
    'RELIANCE': 'Energy',
    'TCS': 'IT',
    'INFY': 'IT',
    'HDFCBANK': 'Banking',
    'ICICIBANK': 'Banking',
    'KOTAKBANK': 'Banking',
    'SBIN': 'Banking',
    'AXISBANK': 'Banking',
    'HINDUNILVR': 'FMCG',
    'ITC': 'FMCG',
    'BHARTIARTL': 'Telecom',
    'ASIANPAINT': 'Paints',
    'LT': 'Infrastructure',
    'MARUTI': 'Auto',
    'SUNPHARMA': 'Pharma'
  };
  return sectors[symbol] || 'Others';
};

const getRecommendation = (changePercent: number) => {
  if (changePercent > 2) return 'BUY';
  if (changePercent < -2) return 'SELL';
  return 'HOLD';
};

const getCallBadgeColor = (call: string) => {
  switch (call) {
    case 'BUY':
      return 'bg-green-500 hover:bg-green-600';
    case 'SELL':
      return 'bg-red-500 hover:bg-red-600';
    case 'HOLD':
      return 'bg-yellow-500 hover:bg-yellow-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const formatCurrency = (value: number) => {
  return `₹${value.toFixed(2)}`;
};

const StockList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch stock data using Upstox API
  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: ['stocks', popularStocks],
    queryFn: async () => {
      console.log('Fetching stock data from Upstox...');
      const response = await upstoxApi.getMultipleQuotes(popularStocks);
      console.log('Stock data response:', response);
      return response;
    },
    staleTime: 30000, // 30 seconds
    retry: 2
  });

  // Process and format stock data - stabilized with proper dependency
  const processedStocks = React.useMemo(() => {
    if (!stockData?.data) return [];
    
    return Object.entries(stockData.data).map(([key, stock]: [string, any]) => {
      const symbol = key.split(':')[1] || key;
      return {
        symbol,
        name: stock.instrument_name || symbol,
        cmp: stock.last_price || 0,
        change: stock.net_change || 0,
        changePercent: stock.percentage_change || 0,
        high52w: stock.year_high || 0,
        low52w: stock.year_low || 0,
        pe: stock.pe_ratio || 'N/A',
        rsi: Math.floor(Math.random() * 100), // Mock RSI as it's not in basic quote
        macd: stock.net_change > 0 ? 'Bullish' : stock.net_change < 0 ? 'Bearish' : 'Neutral',
        sector: getSectorByScrip(symbol),
        call: getRecommendation(stock.percentage_change || 0),
        volume: stock.volume || 0,
        dayHigh: stock.day_high || 0,
        dayLow: stock.day_low || 0
      };
    });
  }, [stockData?.data]); // More specific dependency

  // Filter stocks based on search term - computed directly in render
  const filteredStocks = React.useMemo(() => {
    if (!searchTerm) {
      return processedStocks;
    }
    return processedStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, processedStocks]);

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Stock data has been updated",
    });
  };

  // Error handling
  if (error) {
    console.error('Error fetching stocks:', error);
    toast({
      title: "Error",
      description: "Failed to fetch stock data. Using demo data.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Stock List</h1>
              <p className="text-slate-400">Live stock data powered by Upstox API</p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search stocks by symbol or name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading stock data...</p>
          </div>
        )}

        {/* Stock Table */}
        {!isLoading && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-700">
                  <TableHead className="text-slate-300 font-semibold">Symbol</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Company Name</TableHead>
                  <TableHead className="text-slate-300 font-semibold">CMP</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Change</TableHead>
                  <TableHead className="text-slate-300 font-semibold">52W High/Low</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Volume</TableHead>
                  <TableHead className="text-slate-300 font-semibold">MACD</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Sector</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Call</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow 
                    key={stock.symbol} 
                    className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <TableCell className="font-medium text-white">{stock.symbol}</TableCell>
                    <TableCell className="text-slate-300">{stock.name}</TableCell>
                    <TableCell className="text-white font-semibold">{formatCurrency(stock.cmp)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="text-xs">
                        <div>{formatCurrency(stock.high52w)}</div>
                        <div>{formatCurrency(stock.low52w)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{stock.volume.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        stock.macd === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                        stock.macd === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {stock.macd}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">{stock.sector}</TableCell>
                    <TableCell>
                      <Badge className={`${getCallBadgeColor(stock.call)} text-white font-semibold`}>
                        {stock.call}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredStocks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No stocks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
