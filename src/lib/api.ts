import { ApiResponse, Stock, StockPerformance, MarketOverview, HistoricalPerformance } from '@/types/stock';
import { 
  generateMockStocks, 
  generateMockPerformance, 
  generateMockMarketOverview, 
  generateMockHistoricalPerformance,
  filterStocksByPriceRange,
  delay 
} from '@/lib/mockData';

// Cache for consistent data across component re-renders
let stocksCache: Stock[] | null = null;

class MockApiClient {
  private async getMockStocks(): Promise<Stock[]> {
    if (!stocksCache) {
      await delay(); // Simulate network delay
      stocksCache = generateMockStocks();
    }
    return stocksCache;
  }

  async getAllStocks(): Promise<ApiResponse<Stock[]>> {
    await delay();
    const stocks = await this.getMockStocks();
    
    return {
      success: true,
      data: stocks,
      message: 'Educational stock data loaded successfully',
      timestamp: new Date().toISOString()
    };
  }

  async getStockBySymbol(symbol: string): Promise<ApiResponse<Stock>> {
    await delay();
    const stocks = await this.getMockStocks();
    const stock = stocks.find(s => s.symbol === symbol);
    
    if (!stock) {
      return {
        success: false,
        data: null as any,
        message: `Stock ${symbol} not found`,
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      data: stock,
      message: 'Stock data retrieved successfully',
      timestamp: new Date().toISOString()
    };
  }

  async getPerformanceData(): Promise<ApiResponse<StockPerformance>> {
    await delay();
    const stocks = await this.getMockStocks();
    const performance = generateMockPerformance(stocks);
    
    return {
      success: true,
      data: performance,
      message: 'Performance data loaded successfully',
      timestamp: new Date().toISOString()
    };
  }

  async getMarketOverview(): Promise<ApiResponse<MarketOverview>> {
    await delay();
    const stocks = await this.getMockStocks();
    const overview = generateMockMarketOverview(stocks);
    
    return {
      success: true,
      data: overview,
      message: 'Market overview loaded successfully',
      timestamp: new Date().toISOString()
    };
  }

  async getStocksByPriceRange(minPrice?: number, maxPrice?: number): Promise<ApiResponse<Stock[]>> {
    await delay();
    const stocks = await this.getMockStocks();
    
    let filteredStocks = stocks;
    if (minPrice !== undefined) {
      filteredStocks = filteredStocks.filter(s => s.current_price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filteredStocks = filteredStocks.filter(s => s.current_price <= maxPrice);
    }
    
    return {
      success: true,
      data: filteredStocks,
      message: 'Price range filtered stocks loaded successfully',
      timestamp: new Date().toISOString()
    };
  }

  async getHistoricalPerformance(symbol: string, days: number = 30): Promise<ApiResponse<HistoricalPerformance>> {
    await delay();
    
    try {
      const historicalData = generateMockHistoricalPerformance(symbol, days);
      
      return {
        success: true,
        data: historicalData,
        message: 'Historical performance data loaded successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : 'Failed to load historical data',
        timestamp: new Date().toISOString()
      };
    }
  }

  // System health endpoints (mock for compatibility)
  async getSystemHealth(): Promise<ApiResponse<any>> {
    await delay(100);
    return {
      success: true,
      data: {
        status: 'healthy',
        uptime: '24h 15m',
        memory_usage: '45%',
        cpu_usage: '12%',
        database: 'connected',
        cache: 'connected'
      },
      message: 'System is running normally (educational mode)',
      timestamp: new Date().toISOString()
    };
  }

  async getDataSourceInfo(): Promise<ApiResponse<any>> {
    await delay(100);
    return {
      success: true,
      data: {
        source: 'Educational Mock Data',
        description: 'This application uses simulated stock data for educational and demonstration purposes only.',
        last_updated: new Date().toISOString(),
        data_quality: 'mock',
        disclaimer: 'Not for investment decisions'
      },
      message: 'Data source information retrieved',
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const apiClient = new MockApiClient();

// Export functions that match the original API interface
export async function getAllStocks(): Promise<Stock[]> {
  const response = await apiClient.getAllStocks();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getStockBySymbol(symbol: string): Promise<Stock> {
  const response = await apiClient.getStockBySymbol(symbol);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getPerformanceData(): Promise<StockPerformance> {
  const response = await apiClient.getPerformanceData();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getMarketOverview(): Promise<MarketOverview> {
  const response = await apiClient.getMarketOverview();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getStocksByPriceRange(minPrice?: number, maxPrice?: number): Promise<Stock[]> {
  const response = await apiClient.getStocksByPriceRange(minPrice, maxPrice);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getHistoricalPerformance(symbol: string, days: number = 30): Promise<HistoricalPerformance> {
  const response = await apiClient.getHistoricalPerformance(symbol, days);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getSystemHealth(): Promise<any> {
  const response = await apiClient.getSystemHealth();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function getDataSourceInfo(): Promise<any> {
  const response = await apiClient.getDataSourceInfo();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

// Helper function for price range filtering (used by components)
export async function getStocksByPriceRangeFilter(priceRange: string | null): Promise<Stock[]> {
  const allStocks = await getAllStocks();
  return filterStocksByPriceRange(allStocks, priceRange);
}

// Export the client for direct use if needed
export { MockApiClient };
export default apiClient;