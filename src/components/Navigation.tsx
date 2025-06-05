
import React from 'react';
import { TrendingUp, BarChart3, Search, Zap, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Stock List', href: '/stocks', icon: BarChart3 },
    { name: 'Search & Filter', href: '/search', icon: Search },
    { name: 'F&O Calls', href: '/futures-options', icon: Zap },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
              <span className="ml-2 text-xl font-bold text-white">MarketEdge Pro</span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-emerald-400 bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
