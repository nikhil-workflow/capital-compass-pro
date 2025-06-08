
const UPSTOX_ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI2M0I5WFkiLCJqdGkiOiI2ODQ1MmI5YmE0Y2FkMTUyOTg2Mzg5ZTMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc0OTM2MzYxMSwiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzQ5NDIwMDAwfQ.HDdS_xTSugziSQFpN8X5BaJhJzka778NlOwc0JlXDXc';
const UPSTOX_BASE_URL = 'https://api.upstox.com/v2';

const INDIAN_API_KEY = 'sk-live-hqKLoB5xRJMy6MGGUGsxzxiHh2PEtNFCj47wUOco';
const INDIAN_API_BASE_URL = 'https://stock.indianapi.in';

class UpstoxApiService {
  private async makeUpstoxRequest(endpoint: string) {
    try {
      console.log(`Making Upstox API request to: ${UPSTOX_BASE_URL}${endpoint}`);
      const response = await fetch(`${UPSTOX_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${UPSTOX_ACCESS_TOKEN}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Upstox API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Upstox API response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('Upstox API Error:', error);
      throw error;
    }
  }

  private async makeIndianApiRequest(endpoint: string) {
    try {
      console.log(`Making Indian API request to: ${INDIAN_API_BASE_URL}${endpoint}`);
      const response = await fetch(`${INDIAN_API_BASE_URL}${endpoint}`, {
        headers: {
          'X-Api-Key': INDIAN_API_KEY,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Indian API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Indian API response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('Indian API Error:', error);
      throw error;
    }
  }

  async getMarketStatus() {
    try {
      return await this.makeUpstoxRequest('/market/status/NSE');
    } catch (error) {
      // Return mock data if API fails
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
      return await this.makeIndianApiRequest('/trending');
    } catch (error) {
      console.error('Failed to fetch top gainers:', error);
      // Return mock data structure for fallback
      return {
        data: [
          { symbol: 'RELIANCE', ltp: 2500, percent_change: 2.5 },
          { symbol: 'TCS', ltp: 3200, percent_change: 1.8 },
          { symbol: 'HDFCBANK', ltp: 1650, percent_change: 1.2 }
        ]
      };
    }
  }

  async getTopLosers() {
    try {
      return await this.makeIndianApiRequest('/price_shockers');
    } catch (error) {
      console.error('Failed to fetch top losers:', error);
      return {
        data: [
          { symbol: 'WIPRO', ltp: 400, percent_change: -2.1 },
          { symbol: 'INFY', ltp: 1800, percent_change: -1.5 },
          { symbol: 'ICICIBANK', ltp: 950, percent_change: -1.2 }
        ]
      };
    }
  }

  async getAllIndices() {
    try {
      return await this.makeUpstoxRequest('/market/indices/NSE');
    } catch (error) {
      console.error('Failed to fetch indices:', error);
      return { data: [] };
    }
  }

  async get52WeekHigh() {
    try {
      const response = await this.makeIndianApiRequest('/fetch_52_week_high_low_data');
      // Extract high data from response
      return {
        data: response.data?.high || []
      };
    } catch (error) {
      console.error('Failed to fetch 52-week high:', error);
      return {
        data: [
          { symbol: 'RELIANCE', ltp: 2500 },
          { symbol: 'TCS', ltp: 3200 }
        ]
      };
    }
  }

  async get52WeekLow() {
    try {
      const response = await this.makeIndianApiRequest('/fetch_52_week_high_low_data');
      // Extract low data from response
      return {
        data: response.data?.low || []
      };
    } catch (error) {
      console.error('Failed to fetch 52-week low:', error);
      return {
        data: [
          { symbol: 'WIPRO', ltp: 400 },
          { symbol: 'INFY', ltp: 1800 }
        ]
      };
    }
  }

  async getHighestTraded() {
    try {
      return await this.makeIndianApiRequest('/NSE_most_active');
    } catch (error) {
      console.error('Failed to fetch highest traded:', error);
      return { data: [] };
    }
  }

  async getQuote(symbol: string) {
    try {
      return await this.makeIndianApiRequest(`/stock?symbol=${symbol}`);
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getMultipleQuotes(symbols: string[]) {
    try {
      // Indian API doesn't have batch quotes, so we'll fetch individually
      const quotes = await Promise.allSettled(
        symbols.map(symbol => this.getQuote(symbol))
      );
      
      const data: any = {};
      quotes.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          data[`NSE_EQ:${symbols[index]}`] = result.value.data;
        }
      });
      
      return { data };
    } catch (error) {
      console.error('Failed to fetch multiple quotes:', error);
      return { data: {} };
    }
  }

  async getAllStocks() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=');
      return {
        data: response.data || []
      };
    } catch (error) {
      console.error('Failed to fetch all stocks:', error);
      // Return fallback data
      return {
        data: [
          {
            symbol: 'RELIANCE',
            instrument_name: 'Reliance Industries Ltd',
            last_price: 2500,
            net_change: 25,
            percentage_change: 1.0,
            sector: 'Energy'
          },
          {
            symbol: 'TCS',
            instrument_name: 'Tata Consultancy Services Ltd',
            last_price: 3200,
            net_change: 32,
            percentage_change: 1.0,
            sector: 'IT'
          }
        ]
      };
    }
  }

  async getAllStocksPaginated(page: number = 1, limit: number = 50) {
    try {
      const allData = await this.getAllStocks();
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: allData.data.slice(startIndex, endIndex),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allData.data.length / limit),
          totalCount: allData.data.length,
          hasNext: endIndex < allData.data.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Failed to fetch paginated stocks:', error);
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }

  async getIntradayData(symbol: string, interval: string = '1minute') {
    try {
      return await this.makeIndianApiRequest(`/historical_data?symbol=${symbol}&interval=${interval}`);
    } catch (error) {
      console.error(`Failed to fetch intraday data for ${symbol}:`, error);
      throw error;
    }
  }

  async getIndexComposition(indexName: string) {
    try {
      return await this.makeUpstoxRequest(`/market/index/composition/${indexName}`);
    } catch (error) {
      console.error(`Failed to fetch index composition for ${indexName}:`, error);
      throw error;
    }
  }

  // Recommendations using available endpoints
  async getEquityRecommendations() {
    try {
      const trending = await this.makeIndianApiRequest('/trending');
      return {
        data: trending.data?.slice(0, 5).map((stock: any) => ({
          symbol: stock.symbol || stock.name,
          name: stock.name || stock.symbol,
          ltp: stock.price || stock.ltp || 0,
          recommendation: stock.change > 0 ? 'BUY' : stock.change < 0 ? 'SELL' : 'HOLD',
          target_price: (stock.price || stock.ltp || 0) * 1.15,
          confidence: 85
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch equity recommendations:', error);
      return { data: [] };
    }
  }

  async getIndexETFRecommendations() {
    try {
      // Get ETF data from trending or search
      const response = await this.makeIndianApiRequest('/search?q=ETF');
      return {
        data: response.data?.slice(0, 3).map((etf: any) => ({
          symbol: etf.symbol,
          name: etf.name,
          ltp: etf.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Index ETF recommendations:', error);
      return { data: [] };
    }
  }

  async getNiftyFuturesRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=NIFTY');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Nifty Futures recommendations:', error);
      return { data: [] };
    }
  }

  async getBankNiftyFuturesRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=BANKNIFTY');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Bank Nifty Futures recommendations:', error);
      return { data: [] };
    }
  }

  async getNiftyOptionsRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=NIFTY CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Nifty Options recommendations:', error);
      return { data: [] };
    }
  }

  async getBankNiftyOptionsRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=BANKNIFTY CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Bank Nifty Options recommendations:', error);
      return { data: [] };
    }
  }

  async getStockFuturesRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=FUT');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Stock Futures recommendations:', error);
      return { data: [] };
    }
  }

  async getStockOptionsRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=CE');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Stock Options recommendations:', error);
      return { data: [] };
    }
  }

  async getSectoralETFRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=SECTORAL ETF');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Sectoral ETF recommendations:', error);
      return { data: [] };
    }
  }

  async getMutualFundsRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/mutual_funds');
      return {
        data: response.data?.slice(0, 3).map((fund: any) => ({
          symbol: fund.scheme_code || fund.symbol,
          name: fund.scheme_name || fund.name,
          nav: fund.nav || fund.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Mutual Funds recommendations:', error);
      return { data: [] };
    }
  }

  async getGoldETFRecommendations() {
    try {
      const response = await this.makeIndianApiRequest('/search?q=GOLD ETF');
      return {
        data: response.data?.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          ltp: item.price || 0,
          recommendation: 'BUY'
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch Gold ETF recommendations:', error);
      return { data: [] };
    }
  }

  async getBestRecommendations() {
    try {
      const [equity, indexETF, goldETF] = await Promise.all([
        this.getEquityRecommendations(),
        this.getIndexETFRecommendations(),
        this.getGoldETFRecommendations()
      ]);

      const bestPicks = [
        ...(equity.data?.slice(0, 2) || []),
        ...(indexETF.data?.slice(0, 1) || []),
        ...(goldETF.data?.slice(0, 1) || [])
      ];

      return { data: bestPicks };
    } catch (error) {
      console.error('Failed to fetch best recommendations:', error);
      return { data: [] };
    }
  }
}

export const upstoxApi = new UpstoxApiService();
