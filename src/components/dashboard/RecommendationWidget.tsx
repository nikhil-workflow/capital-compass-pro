
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface RecommendationItem {
  symbol: string;
  name?: string;
  ltp?: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  target_price?: number;
  type?: string;
  expiry?: string;
  strike?: number;
  nav?: number;
}

interface RecommendationWidgetProps {
  title: string;
  data: RecommendationItem[];
  isLoading: boolean;
  error?: Error | null;
  icon?: React.ReactNode;
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ 
  title, 
  data, 
  isLoading, 
  error,
  icon 
}) => {
  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY': return <TrendingUp className="h-3 w-3" />;
      case 'SELL': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-500 hover:bg-green-600';
      case 'SELL': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-700 h-12 rounded"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>API data unavailable</span>
          </div>
          <p className="text-slate-400 text-xs">
            {error.message || 'Unable to fetch live data'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-slate-400 text-sm text-center py-4">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="bg-slate-700/50 rounded p-2 hover:bg-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-medium text-sm">{item.symbol}</span>
              <Badge className={`${getRecommendationColor(item.recommendation)} text-white text-xs px-2 py-0`}>
                {getRecommendationIcon(item.recommendation)}
                <span className="ml-1">{item.recommendation}</span>
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">
                ₹{item.ltp || item.nav || 0}
                {item.target_price && ` → ₹${item.target_price}`}
              </span>
              {item.confidence && (
                <span className="text-slate-400">{item.confidence}%</span>
              )}
            </div>
            {item.expiry && (
              <div className="text-xs text-slate-400">Exp: {item.expiry}</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendationWidget;
