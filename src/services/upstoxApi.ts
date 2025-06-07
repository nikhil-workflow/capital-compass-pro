const UPSTOX_API_KEY = 'e64f0688-9ed9-4625-a37c-71ff8fe0c0f6';
const BASE_URL = 'https://api.upstox.com/v2';

// Comprehensive mock data for when API fails
const mockStockData = {
  'NSE_EQ:RELIANCE': {
    instrument_name: 'Reliance Industries Ltd',
    last_price: 2456.75,
    net_change: 23.45,
    percentage_change: 0.96,
    year_high: 2856.15,
    year_low: 2220.30,
    day_high: 2478.90,
    day_low: 2445.20,
    volume: 2567890,
    pe_ratio: 15.2,
    market_cap: 16500000000000,
    book_value: 1245.30,
    dividend_yield: 0.35,
    roe: 14.5,
    debt_to_equity: 0.42,
    current_ratio: 1.25,
    revenue_growth: 12.5,
    profit_growth: 8.9,
    sector: 'Energy',
    industry: 'Oil & Gas',
    description: 'Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai.',
    ceo: 'Mukesh D. Ambani',
    employees: 195000,
    founded: 1973,
    website: 'www.ril.com'
  },
  'NSE_EQ:TCS': {
    instrument_name: 'Tata Consultancy Services Ltd',
    last_price: 3567.85,
    net_change: -15.20,
    percentage_change: -0.42,
    year_high: 4043.70,
    year_low: 3056.65,
    day_high: 3589.45,
    day_low: 3545.20,
    volume: 1234567,
    pe_ratio: 28.5,
    market_cap: 13200000000000,
    book_value: 856.75,
    dividend_yield: 3.2,
    roe: 42.8,
    debt_to_equity: 0.05,
    current_ratio: 4.2,
    revenue_growth: 15.2,
    profit_growth: 18.7,
    sector: 'IT',
    industry: 'Software Services',
    description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
    ceo: 'Rajesh Gopinathan',
    employees: 528748,
    founded: 1968,
    website: 'www.tcs.com'
  },
  'NSE_EQ:HDFCBANK': {
    instrument_name: 'HDFC Bank Ltd',
    last_price: 1687.45,
    net_change: 8.90,
    percentage_change: 0.53,
    year_high: 1725.80,
    year_low: 1363.55,
    day_high: 1695.30,
    day_low: 1678.20,
    volume: 3456789,
    pe_ratio: 19.8,
    market_cap: 9800000000000,
    book_value: 785.60,
    dividend_yield: 1.2,
    roe: 18.2,
    debt_to_equity: 0.15,
    current_ratio: 2.1,
    revenue_growth: 16.8,
    profit_growth: 22.1,
    sector: 'Banking',
    industry: 'Private Banking',
    description: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai.',
    ceo: 'Sashidhar Jagdishan',
    employees: 120000,
    founded: 1994,
    website: 'www.hdfcbank.com'
  }
};

// Generate comprehensive mock data for 1600+ stocks
const generateMockStockData = () => {
  const sectors = ['Banking', 'IT', 'Energy', 'Pharma', 'Auto', 'FMCG', 'Infrastructure', 'Telecom', 'Metals', 'Textiles'];
  const companies = [];
  
  for (let i = 1; i <= 1600; i++) {
    const sector = sectors[i % sectors.length];
    const basePrice = Math.random() * 5000 + 100;
    const change = (Math.random() - 0.5) * 200;
    const changePercent = (change / basePrice) * 100;
    
    companies.push({
      symbol: `STOCK${i.toString().padStart(4, '0')}`,
      instrument_name: `Company ${i} Ltd`,
      last_price: basePrice,
      net_change: change,
      percentage_change: changePercent,
      year_high: basePrice * 1.3,
      year_low: basePrice * 0.7,
      day_high: basePrice * 1.05,
      day_low: basePrice * 0.95,
      volume: Math.floor(Math.random() * 10000000),
      pe_ratio: Math.random() * 50 + 5,
      market_cap: Math.random() * 1000000000000,
      book_value: basePrice * 0.8,
      dividend_yield: Math.random() * 5,
      roe: Math.random() * 30 + 5,
      debt_to_equity: Math.random() * 2,
      current_ratio: Math.random() * 3 + 0.5,
      revenue_growth: (Math.random() - 0.3) * 50,
      profit_growth: (Math.random() - 0.3) * 60,
      sector: sector,
      industry: `${sector} Services`,
      description: `${sector} company providing quality services and products.`,
      ceo: `CEO ${i}`,
      employees: Math.floor(Math.random() * 100000),
      founded: Math.floor(Math.random() * 50) + 1970,
      website: `www.company${i}.com`
    });
  }
  
  return companies;
};

const mockStocks = generateMockStockData();

class UpstoxApiService {
  private async makeRequest(endpoint: string) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${UPSTOX_API_KEY}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upstox API Error, using mock data:', error);
      throw error;
    }
  }

  async getMarketStatus() {
    try {
      return await this.makeRequest('/market/status/NSE');
    } catch {
      return {
        data: {
          market_status: 'open',
          exchange: 'NSE'
        }
      };
    }
  }

  async getTopGainers() {
    try {
      return await this.makeRequest('/market/top-gainers/NSE');
    } catch {
      const gainers = mockStocks
        .filter(stock => stock.percentage_change > 0)
        .sort((a, b) => b.percentage_change - a.percentage_change)
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          ltp: stock.last_price,
          percent_change: stock.percentage_change.toFixed(2)
        }));
      return { data: gainers };
    }
  }

  async getTopLosers() {
    try {
      return await this.makeRequest('/market/top-losers/NSE');
    } catch {
      const losers = mockStocks
        .filter(stock => stock.percentage_change < 0)
        .sort((a, b) => a.percentage_change - b.percentage_change)
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          ltp: stock.last_price,
          percent_change: stock.percentage_change.toFixed(2)
        }));
      return { data: losers };
    }
  }

  async getAllIndices() {
    try {
      return await this.makeRequest('/market/indices/NSE');
    } catch {
      return {
        data: [
          { symbol: 'NIFTY_50', ltp: 19674.25, net_change: 127.85, percent_change: 0.65 },
          { symbol: 'BANK_NIFTY', ltp: 44312.70, net_change: -89.45, percent_change: -0.20 },
          { symbol: 'SENSEX', ltp: 65953.48, net_change: 423.12, percent_change: 0.65 }
        ]
      };
    }
  }

  async get52WeekHigh() {
    try {
      return await this.makeRequest('/market/52-week-high/NSE');
    } catch {
      const highStocks = mockStocks
        .sort((a, b) => (b.last_price / b.year_low) - (a.last_price / a.year_low))
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          ltp: stock.last_price
        }));
      return { data: highStocks };
    }
  }

  async get52WeekLow() {
    try {
      return await this.makeRequest('/market/52-week-low/NSE');
    } catch {
      const lowStocks = mockStocks
        .sort((a, b) => (a.last_price / a.year_high) - (b.last_price / b.year_high))
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          ltp: stock.last_price
        }));
      return { data: lowStocks };
    }
  }

  async getHighestTraded() {
    try {
      return await this.makeRequest('/market/highest-traded/NSE');
    } catch {
      const tradedStocks = mockStocks
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          ltp: stock.last_price,
          volume: stock.volume
        }));
      return { data: tradedStocks };
    }
  }

  async getQuote(symbol: string) {
    try {
      return await this.makeRequest(`/market/quote/NSE_EQ/${symbol}`);
    } catch {
      const stock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
      return {
        data: {
          [`NSE_EQ:${symbol}`]: {
            ...stock,
            ltp: stock.last_price,
            open: stock.last_price * 0.99,
            high: stock.day_high,
            low: stock.day_low,
            prev_close: stock.last_price - stock.net_change,
            upper_circuit: stock.year_high,
            lower_circuit: stock.year_low
          }
        }
      };
    }
  }

  async getMultipleQuotes(symbols: string[]) {
    try {
      const symbolsParam = symbols.map(s => `NSE_EQ:${s}`).join(',');
      return await this.makeRequest(`/market/quote/multi?symbols=${symbolsParam}`);
    } catch {
      const data: any = {};
      symbols.forEach((symbol, index) => {
        const stock = mockStocks[index] || mockStocks[0];
        data[`NSE_EQ:${symbol}`] = {
          ...stock,
          ltp: stock.last_price
        };
      });
      return { data };
    }
  }

  async getAllStocks() {
    // Return comprehensive stock data for search and filter functionality
    try {
      // In real implementation, this would fetch from a comprehensive stocks API
      return { data: mockStocks };
    } catch {
      return { data: mockStocks };
    }
  }

  async getAllStocksPaginated(page: number = 1, limit: number = 50) {
    try {
      // In real implementation, this would use Upstox pagination
      const allStocks = await this.getAllStocks();
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: allStocks.data.slice(startIndex, endIndex),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allStocks.data.length / limit),
          totalCount: allStocks.data.length,
          hasNext: endIndex < allStocks.data.length,
          hasPrev: page > 1
        }
      };
    } catch {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = mockStocks.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockStocks.length / limit),
          totalCount: mockStocks.length,
          hasNext: endIndex < mockStocks.length,
          hasPrev: page > 1
        }
      };
    }
  }

  async getIntradayData(symbol: string, interval: string = '1minute') {
    try {
      return await this.makeRequest(`/historical-candle/NSE_EQ|${symbol}/${interval}/2023-12-01/2023-12-31`);
    } catch {
      // Generate mock intraday data
      const data = [];
      for (let i = 0; i < 100; i++) {
        const basePrice = 2000 + Math.random() * 1000;
        data.push([
          new Date(Date.now() - i * 60000).toISOString(),
          basePrice + Math.random() * 50,
          basePrice + Math.random() * 100,
          basePrice - Math.random() * 50,
          basePrice,
          Math.floor(Math.random() * 100000)
        ]);
      }
      return { data };
    }
  }

  async getIndexComposition(indexName: string) {
    try {
      return await this.makeRequest(`/market/index/composition/${indexName}`);
    } catch {
      return { data: mockStocks.slice(0, 50) };
    }
  }

  // F&O specific methods
  async getFuturesData(symbol: string) {
    try {
      return await this.makeRequest(`/market/futures/${symbol}`);
    } catch {
      return {
        data: {
          symbol: symbol,
          expiry: '2024-03-28',
          ltp: mockStocks[0].last_price * 1.02,
          change: mockStocks[0].net_change,
          volume: Math.floor(Math.random() * 1000000),
          oi: Math.floor(Math.random() * 5000000),
          lot_size: 250
        }
      };
    }
  }

  async getOptionsChain(symbol: string) {
    try {
      return await this.makeRequest(`/market/options-chain/${symbol}`);
    } catch {
      const basePrice = mockStocks[0].last_price;
      const strikes = [];
      for (let i = -10; i <= 10; i++) {
        const strike = Math.round((basePrice + (i * 100)) / 50) * 50;
        strikes.push({
          strike: strike,
          call_ltp: Math.max(0, basePrice - strike + Math.random() * 50),
          put_ltp: Math.max(0, strike - basePrice + Math.random() * 50),
          call_volume: Math.floor(Math.random() * 100000),
          put_volume: Math.floor(Math.random() * 100000),
          call_oi: Math.floor(Math.random() * 500000),
          put_oi: Math.floor(Math.random() * 500000)
        });
      }
      return { data: strikes };
    }
  }

  async getLiveMarketData() {
    try {
      return await this.makeRequest('/market/live-feed');
    } catch {
      return {
        data: {
          timestamp: new Date().toISOString(),
          indices: [
            { symbol: 'NIFTY_50', ltp: 19674.25 + (Math.random() - 0.5) * 100, change: 127.85 },
            { symbol: 'BANK_NIFTY', ltp: 44312.70 + (Math.random() - 0.5) * 200, change: -89.45 },
            { symbol: 'SENSEX', ltp: 65953.48 + (Math.random() - 0.5) * 300, change: 423.12 }
          ]
        }
      };
    }
  }

  async getEquityRecommendations() {
    try {
      return await this.makeRequest('/recommendations/equity');
    } catch {
      return {
        data: mockStocks.slice(0, 5).map(stock => ({
          ...stock,
          recommendation: 'BUY',
          target_price: stock.last_price * 1.15,
          confidence: Math.floor(Math.random() * 30) + 70
        }))
      };
    }
  }

  async getIndexETFRecommendations() {
    try {
      return await this.makeRequest('/recommendations/index-etfs');
    } catch {
      const etfs = [
        { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES', ltp: 195.40, recommendation: 'BUY' },
        { symbol: 'BANKBEES', name: 'Nippon India ETF Bank BeES', ltp: 428.75, recommendation: 'HOLD' },
        { symbol: 'JUNIORBEES', name: 'Nippon India ETF Junior BeES', ltp: 512.30, recommendation: 'BUY' }
      ];
      return { data: etfs };
    }
  }

  async getNiftyFuturesRecommendations() {
    try {
      return await this.makeRequest('/recommendations/nifty-futures');
    } catch {
      return {
        data: [
          { symbol: 'NIFTY24DEC', expiry: '2024-12-28', ltp: 19700, recommendation: 'BUY', lot_size: 50 },
          { symbol: 'NIFTY25JAN', expiry: '2025-01-30', ltp: 19750, recommendation: 'HOLD', lot_size: 50 }
        ]
      };
    }
  }

  async getBankNiftyFuturesRecommendations() {
    try {
      return await this.makeRequest('/recommendations/banknifty-futures');
    } catch {
      return {
        data: [
          { symbol: 'BANKNIFTY24DEC', expiry: '2024-12-26', ltp: 44350, recommendation: 'SELL', lot_size: 15 },
          { symbol: 'BANKNIFTY25JAN', expiry: '2025-01-29', ltp: 44500, recommendation: 'HOLD', lot_size: 15 }
        ]
      };
    }
  }

  async getNiftyOptionsRecommendations() {
    try {
      return await this.makeRequest('/recommendations/nifty-options');
    } catch {
      const basePrice = 19700;
      return {
        data: [
          { strike: 19800, type: 'CALL', ltp: 45.50, recommendation: 'BUY', expiry: '2024-12-26' },
          { strike: 19600, type: 'PUT', ltp: 38.25, recommendation: 'SELL', expiry: '2024-12-26' }
        ]
      };
    }
  }

  async getBankNiftyOptionsRecommendations() {
    try {
      return await this.makeRequest('/recommendations/banknifty-options');
    } catch {
      return {
        data: [
          { strike: 44500, type: 'CALL', ltp: 125.75, recommendation: 'BUY', expiry: '2024-12-26' },
          { strike: 44000, type: 'PUT', ltp: 89.50, recommendation: 'HOLD', expiry: '2024-12-26' }
        ]
      };
    }
  }

  async getStockFuturesRecommendations() {
    try {
      return await this.makeRequest('/recommendations/stock-futures');
    } catch {
      return {
        data: [
          { symbol: 'RELIANCE', expiry: '2024-12-26', ltp: 2470, recommendation: 'BUY', lot_size: 250 },
          { symbol: 'TCS', expiry: '2024-12-26', ltp: 3580, recommendation: 'HOLD', lot_size: 125 }
        ]
      };
    }
  }

  async getStockOptionsRecommendations() {
    try {
      return await this.makeRequest('/recommendations/stock-options');
    } catch {
      return {
        data: [
          { symbol: 'RELIANCE', strike: 2500, type: 'CALL', ltp: 25.50, recommendation: 'BUY' },
          { symbol: 'TCS', strike: 3600, type: 'PUT', ltp: 42.75, recommendation: 'SELL' }
        ]
      };
    }
  }

  async getSectoralETFRecommendations() {
    try {
      return await this.makeRequest('/recommendations/sectoral-etfs');
    } catch {
      return {
        data: [
          { symbol: 'PSUBNKBEES', name: 'Nippon India ETF PSU Bank BeES', ltp: 45.80, recommendation: 'BUY' },
          { symbol: 'ITBEES', name: 'Nippon India ETF IT BeES', ltp: 78.90, recommendation: 'HOLD' },
          { symbol: 'PHARMABEES', name: 'Nippon India ETF Pharma BeES', ltp: 156.20, recommendation: 'BUY' }
        ]
      };
    }
  }

  async getMutualFundsRecommendations() {
    try {
      return await this.makeRequest('/recommendations/mutual-funds');
    } catch {
      return {
        data: [
          { symbol: 'ICICIPRU', name: 'ICICI Prudential Bluechip Fund', nav: 78.45, recommendation: 'BUY' },
          { symbol: 'HDFCTOP100', name: 'HDFC Top 100 Fund', nav: 856.30, recommendation: 'HOLD' },
          { symbol: 'SBISMALLCAP', name: 'SBI Small Cap Fund', nav: 145.67, recommendation: 'BUY' }
        ]
      };
    }
  }

  async getGoldETFRecommendations() {
    try {
      return await this.makeRequest('/recommendations/gold-etf');
    } catch {
      return {
        data: [
          { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', ltp: 58.45, recommendation: 'BUY' },
          { symbol: 'GOLDSHARE', name: 'HDFC Gold ETF', ltp: 145.30, recommendation: 'HOLD' },
          { symbol: 'KOTAKGOLD', name: 'Kotak Gold ETF', ltp: 28.67, recommendation: 'BUY' }
        ]
      };
    }
  }

  async getBestRecommendations() {
    try {
      const [equity, indexETF, niftyFutures, bankNiftyFutures, niftyOptions, 
             bankNiftyOptions, stockFutures, stockOptions, sectoralETF, 
             mutualFunds, goldETF] = await Promise.all([
        this.getEquityRecommendations(),
        this.getIndexETFRecommendations(),
        this.getNiftyFuturesRecommendations(),
        this.getBankNiftyFuturesRecommendations(),
        this.getNiftyOptionsRecommendations(),
        this.getBankNiftyOptionsRecommendations(),
        this.getStockFuturesRecommendations(),
        this.getStockOptionsRecommendations(),
        this.getSectoralETFRecommendations(),
        this.getMutualFundsRecommendations(),
        this.getGoldETFRecommendations()
      ]);

      // Select best from each category
      const bestPicks = [
        equity.data.find(item => item.recommendation === 'BUY'),
        indexETF.data.find(item => item.recommendation === 'BUY'),
        niftyFutures.data.find(item => item.recommendation === 'BUY'),
        stockFutures.data.find(item => item.recommendation === 'BUY'),
        sectoralETF.data.find(item => item.recommendation === 'BUY'),
        goldETF.data.find(item => item.recommendation === 'BUY')
      ].filter(Boolean);

      return { data: bestPicks };
    } catch {
      return {
        data: [
          { symbol: 'RELIANCE', type: 'Equity', recommendation: 'BUY', confidence: 85 },
          { symbol: 'NIFTYBEES', type: 'Index ETF', recommendation: 'BUY', confidence: 82 },
          { symbol: 'GOLDBEES', type: 'Gold ETF', recommendation: 'BUY', confidence: 78 }
        ]
      };
    }
  }
}

export const upstoxApi = new UpstoxApiService();
