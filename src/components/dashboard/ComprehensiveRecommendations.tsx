
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, BarChart3, PieChart, DollarSign, Coins, Building2, Target, Zap, Shield, Crown, Star } from 'lucide-react';
import { upstoxApi } from '../../services/upstoxApi';
import RecommendationWidget from './RecommendationWidget';

const ComprehensiveRecommendations = () => {
  // Fetch all recommendation types with error handling
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

  const bestRecommendationsQuery = useQuery({
    queryKey: ['best-recommendations'],
    queryFn: () => upstoxApi.getBestRecommendations(),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Live Trading Recommendations</h2>
        <p className="text-slate-400">Real-time recommendations across all asset classes powered by Upstox & Indian API</p>
      </div>

      {/* First row - 4 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecommendationWidget
          title="Equity Shares"
          data={equityQuery.data?.data?.slice(0, 3) || []}
          isLoading={equityQuery.isLoading}
          error={equityQuery.error}
          icon={<Building2 className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Index ETFs"
          data={indexETFQuery.data?.data?.slice(0, 3) || []}
          isLoading={indexETFQuery.isLoading}
          error={indexETFQuery.error}
          icon={<PieChart className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Nifty Futures"
          data={niftyFuturesQuery.data?.data?.slice(0, 3) || []}
          isLoading={niftyFuturesQuery.isLoading}
          error={niftyFuturesQuery.error}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Bank Nifty Futures"
          data={bankNiftyFuturesQuery.data?.data?.slice(0, 3) || []}
          isLoading={bankNiftyFuturesQuery.isLoading}
          error={bankNiftyFuturesQuery.error}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Second row - 4 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecommendationWidget
          title="Nifty Options"
          data={niftyOptionsQuery.data?.data?.slice(0, 3) || []}
          isLoading={niftyOptionsQuery.isLoading}
          error={niftyOptionsQuery.error}
          icon={<Target className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Bank Nifty Options"
          data={bankNiftyOptionsQuery.data?.data?.slice(0, 3) || []}
          isLoading={bankNiftyOptionsQuery.isLoading}
          error={bankNiftyOptionsQuery.error}
          icon={<Zap className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Stock Futures"
          data={stockFuturesQuery.data?.data?.slice(0, 3) || []}
          isLoading={stockFuturesQuery.isLoading}
          error={stockFuturesQuery.error}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Stock Options"
          data={stockOptionsQuery.data?.data?.slice(0, 3) || []}
          isLoading={stockOptionsQuery.isLoading}
          error={stockOptionsQuery.error}
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      {/* Third row - 3 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecommendationWidget
          title="Sectoral ETFs"
          data={sectoralETFQuery.data?.data?.slice(0, 3) || []}
          isLoading={sectoralETFQuery.isLoading}
          error={sectoralETFQuery.error}
          icon={<Wallet className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Mutual Funds"
          data={mutualFundsQuery.data?.data?.slice(0, 3) || []}
          isLoading={mutualFundsQuery.isLoading}
          error={mutualFundsQuery.error}
          icon={<Crown className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Gold ETF"
          data={goldETFQuery.data?.data?.slice(0, 3) || []}
          isLoading={goldETFQuery.isLoading}
          error={goldETFQuery.error}
          icon={<Coins className="h-4 w-4" />}
        />
      </div>

      {/* Fourth row - Best Recommendations (12th widget) */}
      <div className="mt-8">
        <RecommendationWidget
          title="🏆 Best Picks - Top Recommendations Across All Categories"
          data={bestRecommendationsQuery.data?.data || []}
          isLoading={bestRecommendationsQuery.isLoading}
          error={bestRecommendationsQuery.error}
          icon={<Star className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default ComprehensiveRecommendations;
