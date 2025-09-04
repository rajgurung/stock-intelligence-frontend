import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';

// Mock implementation of a stock dashboard integration
const MockStockDashboard = () => {
  const [stocks, setStocks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [watchlist, setWatchlist] = React.useState(new Set());

  // Mock API calls
  const mockFetchStocks = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              symbol: 'AAPL',
              company_name: 'Apple Inc.',
              current_price: 150.25,
              change_percent: 2.5,
              sector: 'Technology'
            },
            {
              id: 2,
              symbol: 'MSFT',
              company_name: 'Microsoft Corporation',
              current_price: 320.15,
              change_percent: -0.39,
              sector: 'Technology'
            }
          ]
        });
      }, 100);
    });
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await mockFetchStocks();
        if (result.success) {
          setStocks(result.data);
        }
      } catch (err) {
        setError('Failed to load stocks');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleWatchlist = (stockId) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(stockId)) {
        newWatchlist.delete(stockId);
      } else {
        newWatchlist.add(stockId);
      }
      return newWatchlist;
    });
  };

  if (loading) return <div data-testid="loading">Loading stocks...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div data-testid="stock-dashboard">
      <h1>Stock Dashboard</h1>
      <div data-testid="stock-count">
        Total Stocks: {stocks.length}
      </div>
      <div data-testid="stock-list">
        {stocks.map(stock => (
          <div key={stock.id} data-testid={`stock-${stock.symbol}`}>
            <div data-testid={`symbol-${stock.symbol}`}>{stock.symbol}</div>
            <div data-testid={`name-${stock.symbol}`}>{stock.company_name}</div>
            <div data-testid={`price-${stock.symbol}`}>${stock.current_price}</div>
            <div 
              data-testid={`change-${stock.symbol}`}
              className={stock.change_percent >= 0 ? 'positive' : 'negative'}
            >
              {stock.change_percent}%
            </div>
            <button
              data-testid={`watchlist-${stock.symbol}`}
              onClick={() => toggleWatchlist(stock.id)}
            >
              {watchlist.has(stock.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        ))}
      </div>
      <div data-testid="watchlist-count">
        Watchlist Items: {watchlist.size}
      </div>
    </div>
  );
};

describe('Stock Dashboard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load and display stocks from API', async () => {
    render(<MockStockDashboard />);

    // Initially shows loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for stocks to load
    await waitFor(() => {
      expect(screen.getByTestId('stock-dashboard')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify stocks are displayed
    expect(screen.getByTestId('stock-count')).toHaveTextContent('Total Stocks: 2');
    expect(screen.getByTestId('stock-AAPL')).toBeInTheDocument();
    expect(screen.getByTestId('stock-MSFT')).toBeInTheDocument();

    // Verify stock details
    expect(screen.getByTestId('symbol-AAPL')).toHaveTextContent('AAPL');
    expect(screen.getByTestId('name-AAPL')).toHaveTextContent('Apple Inc.');
    expect(screen.getByTestId('price-AAPL')).toHaveTextContent('$150.25');
    expect(screen.getByTestId('change-AAPL')).toHaveTextContent('2.5%');
  });

  it('should handle watchlist functionality', async () => {
    render(<MockStockDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('stock-dashboard')).toBeInTheDocument();
    });

    // Initially no items in watchlist
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 0');

    // Add AAPL to watchlist
    const addButton = screen.getByTestId('watchlist-AAPL');
    expect(addButton).toHaveTextContent('Add to Watchlist');
    
    fireEvent.click(addButton);

    // Verify watchlist updated
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 1');
    expect(addButton).toHaveTextContent('Remove from Watchlist');

    // Remove from watchlist
    fireEvent.click(addButton);
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 0');
    expect(addButton).toHaveTextContent('Add to Watchlist');
  });

  it('should display positive and negative changes correctly', async () => {
    render(<MockStockDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('stock-dashboard')).toBeInTheDocument();
    });

    // Check positive change styling
    const appleChange = screen.getByTestId('change-AAPL');
    expect(appleChange).toHaveClass('positive');
    expect(appleChange).toHaveTextContent('2.5%');

    // Check negative change styling
    const msftChange = screen.getByTestId('change-MSFT');
    expect(msftChange).toHaveClass('negative');
    expect(msftChange).toHaveTextContent('-0.39%');
  });

  it('should handle multiple watchlist operations', async () => {
    render(<MockStockDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('stock-dashboard')).toBeInTheDocument();
    });

    // Add both stocks to watchlist
    fireEvent.click(screen.getByTestId('watchlist-AAPL'));
    fireEvent.click(screen.getByTestId('watchlist-MSFT'));

    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 2');

    // Remove one stock
    fireEvent.click(screen.getByTestId('watchlist-AAPL'));
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 1');

    // Verify correct buttons are updated
    expect(screen.getByTestId('watchlist-AAPL')).toHaveTextContent('Add to Watchlist');
    expect(screen.getByTestId('watchlist-MSFT')).toHaveTextContent('Remove from Watchlist');
  });

  it('should maintain state during user interactions', async () => {
    render(<MockStockDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('stock-dashboard')).toBeInTheDocument();
    });

    // Perform multiple operations
    fireEvent.click(screen.getByTestId('watchlist-AAPL'));
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 1');

    // Add second stock
    fireEvent.click(screen.getByTestId('watchlist-MSFT'));
    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('Watchlist Items: 2');

    // Verify both are still in watchlist
    expect(screen.getByTestId('watchlist-AAPL')).toHaveTextContent('Remove from Watchlist');
    expect(screen.getByTestId('watchlist-MSFT')).toHaveTextContent('Remove from Watchlist');
  });
});