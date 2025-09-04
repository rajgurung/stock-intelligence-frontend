// API utility functions tests
import { fetchStocks, fetchMarketOverview, fetchStockBySymbol } from '../api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStocks', () => {
    it('should fetch stocks successfully', async () => {
      const mockStocks = {
        success: true,
        data: [
          { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.' },
          { id: 2, symbol: 'MSFT', company_name: 'Microsoft Corporation' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStocks,
      } as Response);

      const result = await fetchStocks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/stocks');
      expect(result).toEqual(mockStocks);
    });

    it('should handle fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchStocks()).rejects.toThrow('Network error');
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchStocks()).rejects.toThrow();
    });
  });

  describe('fetchMarketOverview', () => {
    it('should fetch market overview successfully', async () => {
      const mockOverview = {
        success: true,
        data: {
          total_stocks: 100,
          advancing_count: 60,
          declining_count: 30,
          unchanged_count: 10,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOverview,
      } as Response);

      const result = await fetchMarketOverview();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/market/overview');
      expect(result).toEqual(mockOverview);
    });

    it('should handle market overview fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API unavailable'));

      await expect(fetchMarketOverview()).rejects.toThrow('API unavailable');
    });
  });

  describe('fetchStockBySymbol', () => {
    it('should fetch individual stock successfully', async () => {
      const mockStock = {
        success: true,
        data: {
          id: 1,
          symbol: 'AAPL',
          company_name: 'Apple Inc.',
          current_price: 150.25,
          change_percent: 2.5,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStock,
      } as Response);

      const result = await fetchStockBySymbol('AAPL');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/stocks/AAPL');
      expect(result).toEqual(mockStock);
    });

    it('should handle stock not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchStockBySymbol('INVALID')).rejects.toThrow();
    });

    it('should validate symbol parameter', async () => {
      await expect(fetchStockBySymbol('')).rejects.toThrow();
      await expect(fetchStockBySymbol('  ')).rejects.toThrow();
    });
  });
});

