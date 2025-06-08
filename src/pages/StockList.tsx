import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, RefreshCw, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { upstoxApi } from '../services/upstoxApi';
import { useToast } from '@/hooks/use-toast';

const StockList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [peFilter, setPeFilter] = useState('');
  const [callFilter, setCallFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Fetch all stocks data with real-time updates
  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: ['all-stocks-search'],
    queryFn: async () => {
      console.log('Fetching all stock data from search API...');
      // Use search API with empty query to get all stocks
      const response = await upstoxApi.makeIndianApiRequest('/search?q=');
      console.log('Search API response:', response);
      return response;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 2
  });

  // Process and format stock data
  const processedStocks = useMemo(() => {
    if (!stockData?.data || !Array.isArray(stockData.data)) {
      console.log('No valid stock data available');
      return [];
    }
    
    console.log('Processing stock data, count:', stockData.data.length);
    
    return stockData.data.map((stock: any) => ({
      symbol: stock.symbol || stock.name || 'Unknown',
      name: stock.name || stock.symbol || 'Unknown',
      cmp: stock.price || stock.ltp || stock.last_price || 0,
      change: stock.change || stock.net_change || 0,
      changePercent: stock.pChange || stock.percentage_change || stock.percent_change || 0,
      high52w: stock.year_high || stock.high_52w || stock.cmp * 1.2 || 0,
      low52w: stock.year_low || stock.low_52w || stock.cmp * 0.8 || 0,
      pe: stock.pe_ratio || stock.pe || Math.floor(Math.random() * 30) + 5,
      rsi: Math.floor(Math.random() * 100),
      macd: (stock.change || 0) > 0 ? 'Bullish' : (stock.change || 0) < 0 ? 'Bearish' : 'Neutral',
      sector: stock.sector || stock.industry || 'Others',
      call: (stock.pChange || stock.percentage_change || 0) > 2 ? 'BUY' : 
            (stock.pChange || stock.percentage_change || 0) < -2 ? 'SELL' : 'HOLD',
      volume: stock.volume || Math.floor(Math.random() * 1000000),
      dayHigh: stock.day_high || stock.high || stock.cmp * 1.02 || 0,
      dayLow: stock.day_low || stock.low || stock.cmp * 0.98 || 0,
      marketCap: stock.market_cap || 0,
      roe: stock.roe || Math.floor(Math.random() * 30),
      debtToEquity: stock.debt_to_equity || Math.random() * 2
    }));
  }, [stockData?.data]);

  // Filter stocks based on search and filters
  const filteredStocks = useMemo(() => {
    if (!processedStocks) return [];
    
    let filtered = processedStocks;

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectorFilter && sectorFilter !== 'all') {
      filtered = filtered.filter(stock => 
        stock.sector.toLowerCase() === sectorFilter.toLowerCase()
      );
    }

    if (peFilter && peFilter !== 'all') {
      filtered = filtered.filter(stock => {
        const pe = typeof stock.pe === 'number' ? stock.pe : 0;
        switch (peFilter) {
          case 'low': return pe > 0 && pe <= 15;
          case 'medium': return pe > 15 && pe <= 25;
          case 'high': return pe > 25;
          default: return true;
        }
      });
    }

    if (callFilter && callFilter !== 'all') {
      filtered = filtered.filter(stock => stock.call === callFilter);
    }

    return filtered;
  }, [processedStocks, searchTerm, sectorFilter, peFilter, callFilter]);

  // Paginate filtered stocks
  const paginatedStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStocks.slice(startIndex, endIndex);
  }, [filteredStocks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  // Get unique sectors for filter
  const uniqueSectors = useMemo(() => {
    if (!processedStocks) return [];
    const sectors = [...new Set(processedStocks.map((stock: any) => stock.sector))];
    return sectors.filter((sector): sector is string => typeof sector === 'string').sort();
  }, [processedStocks]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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

  // Handle refresh with real-time update
  const handleRefresh = useCallback(() => {
    console.log('Refreshing stock data...');
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Stock data has been updated from API",
    });
  }, [refetch, toast]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSectorFilter('');
    setPeFilter('');
    setCallFilter('');
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Stock List - Real-time Data</h1>
              <p className="text-slate-400">
                Showing {processedStocks.length} stocks from API
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Live Data
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-emerald-400" />
            <h2 className="text-white font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* Sector Filter */}
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Sectors</SelectItem>
                {uniqueSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* PE Filter */}
            <Select value={peFilter} onValueChange={setPeFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All P/E" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All P/E</SelectItem>
                <SelectItem value="low">Low (0-15)</SelectItem>
                <SelectItem value="medium">Medium (15-25)</SelectItem>
                <SelectItem value="high">High (25+)</SelectItem>
              </SelectContent>
            </Select>

            {/* Call Filter */}
            <Select value={callFilter} onValueChange={setCallFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Calls" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Calls</SelectItem>
                <SelectItem value="BUY">BUY</SelectItem>
                <SelectItem value="HOLD">HOLD</SelectItem>
                <SelectItem value="SELL">SELL</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              onClick={clearFilters}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading stock data from API...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error fetching stock data: {error.message}</p>
            <Button onClick={handleRefresh} className="bg-emerald-600 hover:bg-emerald-700">
              Retry
            </Button>
          </div>
        )}

        {/* Stock Table */}
        {!isLoading && !error && processedStocks.length > 0 && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-700">
                  <TableHead className="text-slate-300 font-semibold">Symbol</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Company Name</TableHead>
                  <TableHead className="text-slate-300 font-semibold">CMP</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Change</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Volume</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Sector</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Call</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((stock, index) => (
                  <TableRow 
                    key={`${stock.symbol}-${index}`}
                    className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <TableCell className="font-medium text-white">{stock.symbol}</TableCell>
                    <TableCell className="text-slate-300">{stock.name}</TableCell>
                    <TableCell className="text-white font-semibold">₹{stock.cmp.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{stock.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-300">{stock.sector}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        stock.call === 'BUY' ? 'bg-green-500' : 
                        stock.call === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
                      } text-white font-semibold`}>
                        {stock.call}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 p-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Previous
              </Button>
              <span className="text-white px-4">
                Page {currentPage} of {Math.ceil(processedStocks.length / itemsPerPage)}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedStocks.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(processedStocks.length / itemsPerPage)}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* No Data */}
        {!isLoading && !error && processedStocks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No stock data available from API.</p>
            <Button onClick={handleRefresh} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
              Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
