
import React from 'react';
import { ArrowUp, ArrowDown, Minus, Star } from 'lucide-react';

const StockRecommendations = () => {
  const recommendations = [
    {
      symbol: 'RELIANCE',
      company: 'Reliance Industries Ltd',
      price: '2,387.65',
      recommendation: 'BUY',
      confidence: 85,
      target: '2,650',
      sector: 'Energy',
      fundamentalScore: 8.2,
      technicalScore: 7.8,
      sentimentScore: 8.5,
    },
    {
      symbol: 'TCS',
      company: 'Tata Consultancy Services',
      price: '3,542.30',
      recommendation: 'HOLD',
      confidence: 72,
      target: '3,700',
      sector: 'IT',
      fundamentalScore: 9.1,
      technicalScore: 6.5,
      sentimentScore: 7.2,
    },
    {
      symbol: 'HDFC',
      company: 'HDFC Bank Limited',
      price: '1,673.85',
      recommendation: 'BUY',
      confidence: 78,
      target: '1,850',
      sector: 'Banking',
      fundamentalScore: 8.7,
      technicalScore: 7.9,
      sentimentScore: 6.8,
    },
    {
      symbol: 'BHARTIARTL',
      company: 'Bharti Airtel Limited',
      price: '912.40',
      recommendation: 'SELL',
      confidence: 65,
      target: '850',
      sector: 'Telecom',
      fundamentalScore: 6.2,
      technicalScore: 5.8,
      sentimentScore: 5.5,
    },
  ];

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return <ArrowUp className="h-4 w-4" />;
      case 'SELL':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'SELL':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Top Recommendations</h2>
          <Star className="h-5 w-5 text-yellow-400" />
        </div>
        <p className="text-slate-400 text-sm mt-1">AI-powered stock analysis with confidence scores</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recommendations.map((stock) => (
            <div key={stock.symbol} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{stock.symbol}</h3>
                  <p className="text-slate-400 text-sm">{stock.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">₹{stock.price}</div>
                  <div className="text-slate-400 text-sm">Target: ₹{stock.target}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(stock.recommendation)}`}>
                    {getRecommendationIcon(stock.recommendation)}
                    <span className="ml-1">{stock.recommendation}</span>
                  </span>
                  <span className="text-slate-300 text-sm">Confidence: {stock.confidence}%</span>
                </div>
                <div className="flex space-x-4 text-xs">
                  <span className="text-slate-400">F: {stock.fundamentalScore}</span>
                  <span className="text-slate-400">T: {stock.technicalScore}</span>
                  <span className="text-slate-400">S: {stock.sentimentScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockRecommendations;
