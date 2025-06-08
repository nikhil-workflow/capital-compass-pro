
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';
import { useToast } from '@/hooks/use-toast';

const SearchFilter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [peFilter, setPeFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [callFilter, setCallFilter] = useState('');
  const [roeFilter, setRoeFilter] = useState('');
  const [marketCapFilter, setMarketCapFilter] = useState('');

  // Fetch all stocks data
  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: ['search-stocks'],
    queryFn: async () => {
      console.log('Fetching stocks for search...');
      const response = await upstoxApi.getAllStocks();
      return response;
    },
    staleTime: 60000,
    retry: 1
  });

  // Process stock data
  const processedStocks = React.useMemo(() => {
    if (!stockData?.data) return [];
    
    return stockData.data.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.instrument_name || stock.symbol,
      cmp: stock.last_price || 0,
      change: stock.net_change || 0,
      changePercent: stock.percentage_change || 0,
      pe: stock.pe_ratio || 0,
      roe: stock.roe || 0,
      marketCap: stock.market_cap || 0,
      sector: stock.sector || 'Others',
      call: stock.percentage_change > 2 ? 'BUY' : stock.percentage_change < -2 ? 'SELL' : 'HOLD',
      debtToEquity: stock.debt_to_equity || 0,
      dividendYield: stock.dividend_yield || 0,
      bookValue: stock.book_value || 0,
      volume: stock.volume || 0
    }));
  }, [stockData?.data]);

  // Apply filters
  const filteredStocks = React.useMemo(() => {
    let filtered = processedStocks;

    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (peFilter && peFilter !== 'all') {
      filtered = filtered.filter(stock => {
        switch (peFilter) {
          case 'low': return stock.pe > 0 && stock.pe <= 15;
          case 'medium': return stock.pe > 15 && stock.pe <= 25;
          case 'high': return stock.pe > 25;
          default: return true;
        }
      });
    }

    if (sectorFilter && sectorFilter !== 'all') {
      filtered = filtered.filter(stock => stock.sector === sectorFilter);
    }

    if (callFilter && callFilter !== 'all') {
      filtered = filtered.filter(stock => stock.call === callFilter);
    }

    if (roeFilter && roeFilter !== 'all') {
      filtered = filtered.filter(stock => {
        switch (roeFilter) {
          case 'low': return stock.roe >= 0 && stock.roe < 15;
          case 'medium': return stock.roe >= 15 && stock.roe < 25;
          case 'high': return stock.roe >= 25;
          default: return true;
        }
      });
    }

    if (marketCapFilter && marketCapFilter !== 'all') {
      filtered = filtered.filter(stock => {
        const capInCrores = stock.marketCap / 10000000;
        switch (marketCapFilter) {
          case 'small': return capInCrores < 5000;
          case 'mid': return capInCrores >= 5000 && capInCrores < 20000;
          case 'large': return capInCrores >= 20000;
          default: return true;
        }
      });
    }

    return filtered.slice(0, 50); // Limit to 50 results for performance
  }, [processedStocks, searchTerm, peFilter, sectorFilter, callFilter, roeFilter, marketCapFilter]);

  const uniqueSectors = React.useMemo(() => {
    const sectors = [...new Set(processedStocks.map(stock => stock.sector))];
    return sectors.filter((sector): sector is string => typeof sector === 'string').sort();
  }, [processedStocks]);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;
  
  const formatMarketCap = (value: number) => {
    const crores = value / 10000000;
    if (crores >= 100000) return `₹${(crores / 100000).toFixed(1)}L Cr`;
    if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
    return `₹${crores.toFixed(0)} Cr`;
  };

  const getCallBadgeColor = (call: string) => {
    switch (call) {
      case 'BUY': return 'bg-green-500 hover:bg-green-600';
      case 'SELL': return 'bg-red-500 hover:bg-red-600';
      case 'HOLD': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPeFilter('');
    setSectorFilter('');
    setCallFilter('');
    setRoeFilter('');
    setMarketCapFilter('');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Advanced Search & Filter</h1>
              <p className="text-slate-400">Find stocks based on comprehensive criteria</p>
            </div>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Search Symbol/Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="e.g., RELIANCE"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Sector</label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="All sectors" />
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
              </div>

              {/* PE Ratio Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">P/E Ratio</label>
                <Select value={peFilter} onValueChange={setPeFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="All P/E ranges" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All P/E</SelectItem>
                    <SelectItem value="low">Low (0-15)</SelectItem>
                    <SelectItem value="medium">Medium (15-25)</SelectItem>
                    <SelectItem value="high">High (25+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ROE Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">ROE (%)</label>
                <Select value={roeFilter} onValueChange={setRoeFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="All ROE ranges" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All ROE</SelectItem>
                    <SelectItem value="low">Low (0-15%)</SelectItem>
                    <SelectItem value="medium">Medium (15-25%)</SelectItem>
                    <SelectItem value="high">High (25%+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Market Cap Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Market Cap</label>
                <Select value={marketCapFilter} onValueChange={setMarketCapFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="All market caps" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Caps</SelectItem>
                    <SelectItem value="small">Small Cap (&lt;₹5K Cr)</SelectItem>
                    <SelectItem value="mid">Mid Cap (₹5K-20K Cr)</SelectItem>
                    <SelectItem value="large">Large Cap (&gt;₹20K Cr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Call Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Recommendation</label>
                <Select value={callFilter} onValueChange={setCallFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="All recommendations" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Calls</SelectItem>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="HOLD">HOLD</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={clearFilters}
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear All Filters
              </Button>
              <span className="text-slate-400 flex items-center">
                Showing {filteredStocks.length} of {processedStocks.length} stocks
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading comprehensive stock data...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStocks.map((stock) => (
                <Card 
                  key={stock.symbol} 
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{stock.symbol}</h3>
                        <p className="text-slate-400 text-sm">{stock.name}</p>
                        <p className="text-slate-500 text-xs">{stock.sector}</p>
                      </div>
                      <Badge className={`${getCallBadgeColor(stock.call)} text-white font-semibold`}>
                        {stock.call}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">CMP:</span>
                        <span className="text-white font-semibold">{formatCurrency(stock.cmp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Change:</span>
                        <span className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">P/E:</span>
                        <span className="text-slate-300">{stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ROE:</span>
                        <span className="text-slate-300">{stock.roe.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Cap:</span>
                        <span className="text-slate-300 text-xs">{formatMarketCap(stock.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Volume:</span>
                        <span className="text-slate-300">{stock.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStocks.length === 0 && processedStocks.length > 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">No stocks found matching your criteria.</p>
                <Button 
                  onClick={clearFilters}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
