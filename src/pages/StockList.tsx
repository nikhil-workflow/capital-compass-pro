import React, { useState, useNavigate } from 'react';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

// Mock stock data - in a real app, this would come from an API
const mockStocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    cmp: 2456.75,
    change: 23.45,
    changePercent: 0.96,
    high52w: 2856.15,
    low52w: 2220.30,
    pe: 15.2,
    rsi: 58.3,
    macd: 'Bullish',
    sector: 'Energy',
    call: 'BUY'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    cmp: 3542.80,
    change: -12.30,
    changePercent: -0.35,
    high52w: 4078.90,
    low52w: 3311.00,
    pe: 28.5,
    rsi: 45.7,
    macd: 'Bearish',
    sector: 'IT',
    call: 'HOLD'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    cmp: 1687.45,
    change: 8.90,
    changePercent: 0.53,
    high52w: 1794.90,
    low52w: 1363.55,
    pe: 19.8,
    rsi: 62.1,
    macd: 'Bullish',
    sector: 'Banking',
    call: 'BUY'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    cmp: 1456.20,
    change: -5.60,
    changePercent: -0.38,
    high52w: 1953.90,
    low52w: 1351.65,
    pe: 24.3,
    rsi: 41.2,
    macd: 'Neutral',
    sector: 'IT',
    call: 'SELL'
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    cmp: 1198.75,
    change: 15.25,
    changePercent: 1.29,
    high52w: 1257.80,
    low52w: 951.00,
    pe: 16.7,
    rsi: 68.9,
    macd: 'Bullish',
    sector: 'Banking',
    call: 'BUY'
  }
];

const StockList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState(mockStocks);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value === '') {
      setFilteredStocks(mockStocks);
    } else {
      const filtered = mockStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
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

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Stock List</h1>
          <p className="text-slate-400">Comprehensive stock analysis and recommendations powered by Upstox</p>
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

        {/* Stock Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-700">
                <TableHead className="text-slate-300 font-semibold">Symbol</TableHead>
                <TableHead className="text-slate-300 font-semibold">Company Name</TableHead>
                <TableHead className="text-slate-300 font-semibold">CMP</TableHead>
                <TableHead className="text-slate-300 font-semibold">Change</TableHead>
                <TableHead className="text-slate-300 font-semibold">52W High/Low</TableHead>
                <TableHead className="text-slate-300 font-semibold">P/E</TableHead>
                <TableHead className="text-slate-300 font-semibold">RSI</TableHead>
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
                  <TableCell className="text-slate-300">{stock.pe}</TableCell>
                  <TableCell className="text-slate-300">{stock.rsi}</TableCell>
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

        {filteredStocks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No stocks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
