
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';

// Mock filtered stock data
const filteredStocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    cmp: 2456.75,
    change: 23.45,
    changePercent: 0.96,
    pe: 15.2,
    roe: 14.5,
    rsi: 58.3,
    sector: 'Energy',
    call: 'BUY'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    cmp: 1687.45,
    change: 8.90,
    changePercent: 0.53,
    pe: 19.8,
    roe: 18.2,
    rsi: 62.1,
    sector: 'Banking',
    call: 'BUY'
  }
];

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [peFilter, setPeFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [callFilter, setCallFilter] = useState('');

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
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

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search & Filter</h1>
          <p className="text-slate-400">Find stocks based on your criteria</p>
        </div>

        {/* Filters Section */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Stocks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* PE Ratio Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">P/E Ratio</label>
                <Select value={peFilter} onValueChange={setPeFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select PE range" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low">Low (0-15)</SelectItem>
                    <SelectItem value="medium">Medium (15-25)</SelectItem>
                    <SelectItem value="high">High (25+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Sector</label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="pharma">Pharma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Call Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Recommendation</label>
                <Select value={callFilter} onValueChange={setCallFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select call" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                    <SelectItem value="HOLD">HOLD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Apply Filters
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Filtered Results ({filteredStocks.length} stocks)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{stock.symbol}</h3>
                      <p className="text-slate-400 text-sm">{stock.name}</p>
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
                      <span className="text-slate-300">{stock.pe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROE:</span>
                      <span className="text-slate-300">{stock.roe}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RSI:</span>
                      <span className="text-slate-300">{stock.rsi}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
