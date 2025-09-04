import { fetchStocks, fetchMarketOverview, fetchStockBySymbol } from '../../utils/api';

// Mock fetch for integration testing
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    mockFetch.mockClear();
  });

  describe('End-to-End API Flow', () => {
    it('should handle complete stock data flow', async () => {
      // Mock successful API responses
      const mockStocksResponse = {
        success: true,
        data: [
          { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.', current_price: 150.25, change_percent: 2.5 },
          { id: 2, symbol: 'MSFT', company_name: 'Microsoft Corporation', current_price: 320.15, change_percent: -0.39 }
        ]
      };

      const mockMarketOverview = {
        success: true,
        data: {
          total_stocks: 100,
          advancing_count: 60,
          declining_count: 30,
          unchanged_count: 10
        }
      };

      const mockIndividualStock = {
        success: true,
        data: {
          id: 1,
          symbol: 'AAPL',
          company_name: 'Apple Inc.',
          current_price: 150.25,
          change_percent: 2.5,
          sector: 'Technology'
        }
      };

      // Setup fetch mock responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStocksResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMarketOverview,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndividualStock,
        } as Response);

      // Test complete flow
      const stocks = await fetchStocks();
      expect(stocks.success).toBe(true);
      expect(stocks.data).toHaveLength(2);
      expect(stocks.data[0].symbol).toBe('AAPL');

      const overview = await fetchMarketOverview();
      expect(overview.success).toBe(true);
      expect(overview.data.total_stocks).toBe(100);
      expect(overview.data.advancing_count).toBe(60);

      const individualStock = await fetchStockBySymbol('AAPL');
      expect(individualStock.success).toBe(true);
      expect(individualStock.data.symbol).toBe('AAPL');
      expect(individualStock.data.company_name).toBe('Apple Inc.');

      // Verify API calls were made correctly
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:8080/api/v1/stocks');
      expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:8080/api/v1/market/overview');
      expect(mockFetch).toHaveBeenNthCalledWith(3, 'http://localhost:8080/api/v1/stocks/AAPL');
    });

    it('should handle error scenarios in complete flow', async () => {
      // Mock network errors
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

      // Test error handling
      await expect(fetchStocks()).rejects.toThrow('Network error');

      await expect(fetchMarketOverview()).rejects.toThrow();

      await expect(fetchStockBySymbol('NONEXISTENT')).rejects.toThrow();

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('API Response Validation', () => {
    it('should validate stock data structure', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            symbol: 'AAPL',
            company_name: 'Apple Inc.',
            current_price: 150.25,
            change_percent: 2.5,
            daily_change: 3.75,
            volume: 50000000,
            sector: 'Technology'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchStocks();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      
      const stock = result.data[0];
      expect(stock).toHaveProperty('id');
      expect(stock).toHaveProperty('symbol');
      expect(stock).toHaveProperty('company_name');
      expect(stock).toHaveProperty('current_price');
      expect(stock).toHaveProperty('change_percent');
      expect(typeof stock.current_price).toBe('number');
      expect(typeof stock.change_percent).toBe('number');
    });

    it('should validate market overview structure', async () => {
      const mockResponse = {
        success: true,
        data: {
          total_stocks: 100,
          advancing_count: 60,
          declining_count: 30,
          unchanged_count: 10
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchMarketOverview();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('total_stocks');
      expect(result.data).toHaveProperty('advancing_count');
      expect(result.data).toHaveProperty('declining_count');
      expect(result.data).toHaveProperty('unchanged_count');
      
      // Verify totals add up
      const { total_stocks, advancing_count, declining_count, unchanged_count } = result.data;
      expect(advancing_count + declining_count + unchanged_count).toBe(total_stocks);
    });
  });

  describe('API Parameter Validation', () => {
    it('should validate stock symbol parameters', async () => {
      // Test empty symbol
      await expect(fetchStockBySymbol('')).rejects.toThrow('Symbol is required');
      
      // Test whitespace symbol
      await expect(fetchStockBySymbol('   ')).rejects.toThrow('Symbol is required');
      
      // Verify no API calls were made for invalid symbols
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle valid symbol with trimming', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchStockBySymbol('  AAPL  ');
      
      // Verify trimmed symbol was used in API call
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/stocks/AAPL');
    });
  });

  describe('Concurrent API Calls', () => {
    it('should handle multiple concurrent API calls', async () => {
      const mockStockResponse = {
        success: true,
        data: { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.' }
      };

      // Mock multiple responses
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => mockStockResponse,
        } as Response)
      );

      // Make concurrent API calls
      const promises = [
        fetchStockBySymbol('AAPL'),
        fetchStockBySymbol('MSFT'),
        fetchStockBySymbol('GOOGL')
      ];

      const results = await Promise.all(promises);
      
      // Verify all calls succeeded
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success/failure in concurrent calls', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: { symbol: 'AAPL' } }),
        } as Response)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

      const promises = [
        fetchStockBySymbol('AAPL'),
        fetchStockBySymbol('INVALID1').catch(err => ({ error: err.message })),
        fetchStockBySymbol('INVALID2').catch(err => ({ error: err.message }))
      ];

      const results = await Promise.all(promises);
      
      // First call should succeed
      expect(results[0]).toHaveProperty('success', true);
      
      // Other calls should have errors
      expect(results[1]).toHaveProperty('error');
      expect(results[2]).toHaveProperty('error');
    });
  });

  describe('API Response Time', () => {
    it('should complete API calls within reasonable time', async () => {
      const mockResponse = { success: true, data: [] };
      
      mockFetch.mockImplementation(() =>
        new Promise(resolve => {
          // Simulate 50ms response time
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => mockResponse,
            } as Response);
          }, 50);
        })
      );

      const startTime = Date.now();
      await fetchStocks();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('API Base URL Configuration', () => {
    it('should use correct API base URL', async () => {
      const mockResponse = { success: true, data: [] };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchStocks();
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/stocks');
    });

    it('should construct URLs correctly for different endpoints', async () => {
      const mockResponse = { success: true, data: {} };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchStocks();
      await fetchMarketOverview();
      await fetchStockBySymbol('AAPL');
      
      expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:8080/api/v1/stocks');
      expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:8080/api/v1/market/overview');
      expect(mockFetch).toHaveBeenNthCalledWith(3, 'http://localhost:8080/api/v1/stocks/AAPL');
    });
  });
});