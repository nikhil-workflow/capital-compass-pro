import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, BarChart3, PieChart, DollarSign, Coins, Building2, Target, Zap, Shield, Crown, Star } from 'lucide-react';
import { upstoxApi } from '../../services/upstoxApi';
import RecommendationWidget from './RecommendationWidget';

const ComprehensiveRecommendations = () => {
  // Fetch trending stocks for equity recommendations
  const equityQuery = useQuery({
    queryKey: ['equity-recommendations'],
    queryFn: async () => {
      const trending = await upstoxApi.getTopGainers();
      return {
        data: trending.data?.slice(0, 5).map((stock: any) => ({
          symbol: stock.symbol || stock.name,
          name: stock.name || stock.symbol,
          ltp: stock.price || stock.ltp || 0,
          recommendation: stock.pChange > 0 ? 'BUY' : stock.pChange < 0 ? 'SELL' : 'HOLD',
          target_price: (stock.price || stock.ltp || 0) * 1.15,
          confidence: 85
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  // Use search API for ETF recommendations
  const indexETFQuery = useQuery({
    queryKey: ['index-etf-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=NIFTY BEES');
      return {
        data: response.data?.slice(0, 3).map((etf: any) => ({
          symbol: etf.symbol,
          name: etf.name,
          ltp: etf.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  // Get futures recommendations from trending data
  const niftyFuturesQuery = useQuery({
    queryKey: ['nifty-futures-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=NIFTY FUT');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const bankNiftyFuturesQuery = useQuery({
    queryKey: ['banknifty-futures-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=BANKNIFTY FUT');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const niftyOptionsQuery = useQuery({
    queryKey: ['nifty-options-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=NIFTY CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const bankNiftyOptionsQuery = useQuery({
    queryKey: ['banknifty-options-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=BANKNIFTY CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const stockFuturesQuery = useQuery({
    queryKey: ['stock-futures-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=FUT');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const stockOptionsQuery = useQuery({
    queryKey: ['stock-options-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const sectoralETFQuery = useQuery({
    queryKey: ['sectoral-etf-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=SECTORAL ETF');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const mutualFundsQuery = useQuery({
    queryKey: ['mutual-funds-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/mutual_funds');
      return {
        data: response.data?.slice(0, 3).map((fund: any) => ({
          symbol: fund.scheme_code || fund.symbol,
          name: fund.scheme_name || fund.name,
          nav: fund.nav || fund.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1
  });

  const goldETFQuery = useQuery({
    queryKey: ['gold-etf-recommendations'],
    queryFn: async () => {
      const response = await upstoxApi.makeIndianApiRequest('/search?q=GOLD ETF');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    },
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
        <p className="text-slate-400">Real-time recommendations across all asset classes powered by Indian API</p>
      </div>

      {/* First row - 4 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecommendationWidget
          title="Equity Shares"
          data={equityQuery.data?.data || []}
          isLoading={equityQuery.isLoading}
          error={equityQuery.error}
          icon={<Building2 className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Index ETFs"
          data={indexETFQuery.data?.data || []}
          isLoading={indexETFQuery.isLoading}
          error={indexETFQuery.error}
          icon={<PieChart className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Nifty Futures"
          data={niftyFuturesQuery.data?.data || []}
          isLoading={niftyFuturesQuery.isLoading}
          error={niftyFuturesQuery.error}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Bank Nifty Futures"
          data={bankNiftyFuturesQuery.data?.data || []}
          isLoading={bankNiftyFuturesQuery.isLoading}
          error={bankNiftyFuturesQuery.error}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Second row - 4 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecommendationWidget
          title="Nifty Options"
          data={niftyOptionsQuery.data?.data || []}
          isLoading={niftyOptionsQuery.isLoading}
          error={niftyOptionsQuery.error}
          icon={<Target className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Bank Nifty Options"
          data={bankNiftyOptionsQuery.data?.data || []}
          isLoading={bankNiftyOptionsQuery.isLoading}
          error={bankNiftyOptionsQuery.error}
          icon={<Zap className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Stock Futures"
          data={stockFuturesQuery.data?.data || []}
          isLoading={stockFuturesQuery.isLoading}
          error={stockFuturesQuery.error}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Stock Options"
          data={stockOptionsQuery.data?.data || []}
          isLoading={stockOptionsQuery.isLoading}
          error={stockOptionsQuery.error}
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      {/* Third row - 3 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecommendationWidget
          title="Sectoral ETFs"
          data={sectoralETFQuery.data?.data || []}
          isLoading={sectoralETFQuery.isLoading}
          error={sectoralETFQuery.error}
          icon={<Wallet className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Mutual Funds"
          data={mutualFundsQuery.data?.data || []}
          isLoading={mutualFundsQuery.isLoading}
          error={mutualFundsQuery.error}
          icon={<Crown className="h-4 w-4" />}
        />
        <RecommendationWidget
          title="Gold ETF"
          data={goldETFQuery.data?.data || []}
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
