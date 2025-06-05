
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react';

// Mock F&O data
const niftyOptions = [
  { strike: 24000, type: 'CE', ltp: 156.25, change: 12.50, oi: 2547800, volume: 156780, call: 'BUY' },
  { strike: 24100, type: 'CE', ltp: 98.75, change: -8.25, oi: 1876540, volume: 98450, call: 'SELL' },
  { strike: 24200, type: 'CE', ltp: 67.80, change: 15.40, oi: 3245670, volume: 234560, call: 'BUY' },
  { strike: 23900, type: 'PE', ltp: 89.45, change: -5.60, oi: 2134890, volume: 167890, call: 'HOLD' },
  { strike: 24000, type: 'PE', ltp: 134.70, change: 18.90, oi: 4567890, volume: 345670, call: 'BUY' },
];

const bankNiftyOptions = [
  { strike: 51000, type: 'CE', ltp: 245.80, change: 23.45, oi: 1234560, volume: 87650, call: 'BUY' },
  { strike: 51200, type: 'CE', ltp: 167.25, change: -12.30, oi: 987654, volume: 54320, call: 'SELL' },
  { strike: 50800, type: 'PE', ltp: 198.90, change: 34.50, oi: 2345670, volume: 123450, call: 'BUY' },
];

const FuturesOptions = () => {
  const [activeTab, setActiveTab] = useState('nifty');

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }
    return value.toLocaleString();
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

  const OptionsTable = ({ data, title }: { data: typeof niftyOptions, title: string }) => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title} Options Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-700">
              <TableHead className="text-slate-300">Strike</TableHead>
              <TableHead className="text-slate-300">Type</TableHead>
              <TableHead className="text-slate-300">LTP</TableHead>
              <TableHead className="text-slate-300">Change</TableHead>
              <TableHead className="text-slate-300">OI</TableHead>
              <TableHead className="text-slate-300">Volume</TableHead>
              <TableHead className="text-slate-300">Call</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((option, index) => (
              <TableRow key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                <TableCell className="text-white font-semibold">{option.strike}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    option.type === 'CE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {option.type}
                  </span>
                </TableCell>
                <TableCell className="text-white">{formatCurrency(option.ltp)}</TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${option.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {option.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{option.change >= 0 ? '+' : ''}{option.change.toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">{formatNumber(option.oi)}</TableCell>
                <TableCell className="text-slate-300">{formatNumber(option.volume)}</TableCell>
                <TableCell>
                  <Badge className={`${getCallBadgeColor(option.call)} text-white font-semibold`}>
                    {option.call}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Futures & Options</h1>
          <p className="text-slate-400">F&O analysis and trading calls</p>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">NIFTY Futures</p>
                  <p className="text-white text-2xl font-bold">24,156.75</p>
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>+23.45 (0.10%)</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">BANKNIFTY Futures</p>
                  <p className="text-white text-2xl font-bold">51,234.80</p>
                  <div className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="h-4 w-4" />
                    <span>-45.20 (-0.09%)</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">VIX</p>
                  <p className="text-white text-2xl font-bold">14.23</p>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>+0.85 (6.35%)</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Options Chain Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="nifty" className="data-[state=active]:bg-emerald-600">
              NIFTY Options
            </TabsTrigger>
            <TabsTrigger value="banknifty" className="data-[state=active]:bg-emerald-600">
              BANKNIFTY Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nifty">
            <OptionsTable data={niftyOptions} title="NIFTY" />
          </TabsContent>

          <TabsContent value="banknifty">
            <OptionsTable data={bankNiftyOptions} title="BANKNIFTY" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FuturesOptions;
