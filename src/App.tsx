import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import Index from './pages/Index';
import StockList from './pages/StockList';
import SearchFilter from './pages/SearchFilter';
import StockDetail from './pages/StockDetail';
import NotFound from './pages/NotFound';
import TradingRecommendations from './pages/TradingRecommendations';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/stocks" element={
              <ProtectedRoute>
                <StockList />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchFilter />
              </ProtectedRoute>
            } />
            <Route path="/trading-recommendations" element={
              <ProtectedRoute>
                <TradingRecommendations />
              </ProtectedRoute>
            } />
            <Route path="/stock/:symbol" element={
              <ProtectedRoute>
                <StockDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
