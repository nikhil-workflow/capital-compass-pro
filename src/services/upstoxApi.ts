
const UPSTOX_API_KEY = 'e64f0688-9ed9-4625-a37c-71ff8fe0c0f6';
const BASE_URL = 'https://api.upstox.com/v2';

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
      console.error('Upstox API Error:', error);
      throw error;
    }
  }

  async getMarketStatus() {
    return this.makeRequest('/market/status/NSE');
  }

  async getTopGainers() {
    return this.makeRequest('/market/top-gainers/NSE');
  }

  async getTopLosers() {
    return this.makeRequest('/market/top-losers/NSE');
  }

  async getAllIndices() {
    return this.makeRequest('/market/indices/NSE');
  }

  async get52WeekHigh() {
    return this.makeRequest('/market/52-week-high/NSE');
  }

  async get52WeekLow() {
    return this.makeRequest('/market/52-week-low/NSE');
  }

  async getHighestTraded() {
    return this.makeRequest('/market/highest-traded/NSE');
  }

  async getQuote(symbol: string) {
    return this.makeRequest(`/market/quote/NSE_EQ/${symbol}`);
  }

  async getMultipleQuotes(symbols: string[]) {
    const symbolsParam = symbols.map(s => `NSE_EQ:${s}`).join(',');
    return this.makeRequest(`/market/quote/multi?symbols=${symbolsParam}`);
  }

  async getIntradayData(symbol: string, interval: string = '1minute') {
    return this.makeRequest(`/historical-candle/NSE_EQ|${symbol}/${interval}/2023-12-01/2023-12-31`);
  }

  async getIndexComposition(indexName: string) {
    return this.makeRequest(`/market/index/composition/${indexName}`);
  }
}

export const upstoxApi = new UpstoxApiService();
