
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Zap, BarChart3, PieChart, Target, DollarSign, Coins, Building2, Shield, Crown } from 'lucide-react';
import { upstoxApi } from '../services/upstoxApi';

const TradingRecommendations = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Fetch all recommendation data
  const equityQuery = useQuery({
    queryKey: ['equity-recommendations'],
    queryFn: () => upstoxApi.getEquityRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const indexETFQuery = useQuery({
    queryKey: ['index-etf-recommendations'],
    queryFn: () => upstoxApi.getIndexETFRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const niftyFuturesQuery = useQuery({
    queryKey: ['nifty-futures-recommendations'],
    queryFn: () => upstoxApi.getNiftyFuturesRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const bankNiftyFuturesQuery = useQuery({
    queryKey: ['banknifty-futures-recommendations'],
    queryFn: () => upstoxApi.getBankNiftyFuturesRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const niftyOptionsQuery = useQuery({
    queryKey: ['nifty-options-recommendations'],
    queryFn: () => upstoxApi.getNiftyOptionsRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const bankNiftyOptionsQuery = useQuery({
    queryKey: ['banknifty-options-recommendations'],
    queryFn: () => upstoxApi.getBankNiftyOptionsRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const stockFuturesQuery = useQuery({
    queryKey: ['stock-futures-recommendations'],
    queryFn: () => upstoxApi.getStockFuturesRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const stockOptionsQuery = useQuery({
    queryKey: ['stock-options-recommendations'],
    queryFn: () => upstoxApi.getStockOptionsRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const sectoralETFQuery = useQuery({
    queryKey: ['sectoral-etf-recommendations'],
    queryFn: () => upstoxApi.getSectoralETFRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const mutualFundsQuery = useQuery({
    queryKey: ['mutual-funds-recommendations'],
    queryFn: () => upstoxApi.getMutualFundsRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const goldETFQuery = useQuery({
    queryKey: ['gold-etf-recommendations'],
    queryFn: () => upstoxApi.getGoldETFRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getCallBadgeColor = (call: string) => {
    switch (call) {
      case 'BUY':
        return 'bg-green-500 hover:bg-green-600';
      case 'SELL':
        return 'bg-red-500 hover:bg-red-600';
      case 'HOLD':
      case 'WAIT':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  const sections = [
    {
      id: 'index-etfs',
      title: 'Index ETFs (NiftyBees, BankBees)',
      icon: <PieChart className="h-5 w-5" />,
      query: indexETFQuery,
      description: 'Exchange Traded Funds tracking major indices'
    },
    {
      id: 'nifty-futures',
      title: 'Nifty Futures',
      icon: <TrendingUp className="h-5 w-5" />,
      query: niftyFuturesQuery,
      description: 'Nifty 50 index futures contracts'
    },
    {
      id: 'banknifty-futures',
      title: 'Bank Nifty Futures',
      icon: <BarChart3 className="h-5 w-5" />,
      query: bankNiftyFuturesQuery,
      description: 'Bank Nifty index futures contracts'
    },
    {
      id: 'nifty-options',
      title: 'Nifty Options (Call & Put)',
      icon: <Target className="h-5 w-5" />,
      query: niftyOptionsQuery,
      description: 'Nifty 50 index options - both calls and puts'
    },
    {
      id: 'banknifty-options',
      title: 'Bank Nifty Options (Call & Put)',
      icon: <Zap className="h-5 w-5" />,
      query: bankNiftyOptionsQuery,
      description: 'Bank Nifty index options - both calls and puts'
    },
    {
      id: 'stock-futures',
      title: 'Stock Futures',
      icon: <DollarSign className="h-5 w-5" />,
      query: stockFuturesQuery,
      description: 'Individual stock futures contracts'
    },
    {
      id: 'stock-options',
      title: 'Stock Options (Call & Put)',
      icon: <Shield className="h-5 w-5" />,
      query: stockOptionsQuery,
      description: 'Individual stock options - both calls and puts'
    },
    {
      id: 'sectoral-etfs',
      title: 'Sectoral ETFs (PSU Bank ETF, IT ETF)',
      icon: <Building2 className="h-5 w-5" />,
      query: sectoralETFQuery,
      description: 'Sector-specific Exchange Traded Funds'
    },
    {
      id: 'mutual-funds',
      title: 'Mutual Funds / Index Funds',
      icon: <Crown className="h-5 w-5" />,
      query: mutualFundsQuery,
      description: 'Actively managed and passive index funds'
    },
    {
      id: 'gold-etf',
      title: 'Gold ETF',
      icon: <Coins className="h-5 w-5" />,
      query: goldETFQuery,
      description: 'Gold Exchange Traded Funds'
    }
  ];

  const RecommendationTable = ({ data, isLoading, error }: { data: any[], isLoading: boolean, error: any }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-700 h-12 rounded"></div>
          ))}
        </div>
      );
    }

    if (error || !data || data.length === 0) {
      return (
        <div className="text-center py-4 text-slate-400">
          No data available or API error
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-700">
            <TableHead className="text-slate-300">Symbol</TableHead>
            <TableHead className="text-slate-300">Name</TableHead>
            <TableHead className="text-slate-300">LTP</TableHead>
            <TableHead className="text-slate-300">Target</TableHead>
            <TableHead className="text-slate-300">Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
              <TableCell className="text-white font-semibold">{item.symbol}</TableCell>
              <TableCell className="text-slate-300">{item.name || item.symbol}</TableCell>
              <TableCell className="text-white">{formatCurrency(item.ltp || item.nav || 0)}</TableCell>
              <TableCell className="text-slate-300">
                {item.target_price ? formatCurrency(item.target_price) : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge className={`${getCallBadgeColor(item.recommendation)} text-white font-semibold`}>
                  {item.recommendation}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trading Recommendations</h1>
          <p className="text-slate-400">Comprehensive trading calls across all asset classes</p>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="bg-slate-800 border-slate-700">
              <Collapsible
                open={openSections[section.id]}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <div>
                          <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                          <p className="text-slate-400 text-sm mt-1">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {section.query.isLoading && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        )}
                        {section.query.error && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {section.query.data && !section.query.error && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {openSections[section.id] ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <RecommendationTable
                      data={section.query.data?.data || []}
                      isLoading={section.query.isLoading}
                      error={section.query.error}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingRecommendations;
