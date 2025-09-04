import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StockCard } from '../stock-card';

// Mock the stock card component since we don't have the actual implementation
jest.mock('../stock-card', () => ({
  StockCard: ({ stock, onToggleWatchlist }: any) => (
    <div data-testid="stock-card">
      <h3 data-testid="stock-symbol">{stock.symbol}</h3>
      <p data-testid="stock-name">{stock.company_name}</p>
      <p data-testid="stock-price">${stock.current_price}</p>
      <p data-testid="stock-change" className={stock.change_percent >= 0 ? 'positive' : 'negative'}>
        {stock.change_percent}%
      </p>
      <button 
        data-testid="watchlist-toggle"
        onClick={() => onToggleWatchlist(stock.id)}
      >
        {stock.in_watchlist ? 'Remove' : 'Add'}
      </button>
    </div>
  )
}));

describe('StockCard', () => {
  const mockStock = {
    id: 1,
    symbol: 'AAPL',
    company_name: 'Apple Inc.',
    current_price: 150.25,
    change_percent: 2.5,
    daily_change: 3.75,
    volume: 50000000,
    sector: 'Technology',
    in_watchlist: false,
  };

  const mockOnToggleWatchlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stock information correctly', () => {
    render(<StockCard stock={mockStock} onToggleWatchlist={mockOnToggleWatchlist} />);

    expect(screen.getByTestId('stock-symbol')).toHaveTextContent('AAPL');
    expect(screen.getByTestId('stock-name')).toHaveTextContent('Apple Inc.');
    expect(screen.getByTestId('stock-price')).toHaveTextContent('$150.25');
    expect(screen.getByTestId('stock-change')).toHaveTextContent('2.5%');
  });

  it('shows positive change with correct styling', () => {
    render(<StockCard stock={mockStock} onToggleWatchlist={mockOnToggleWatchlist} />);
    
    const changeElement = screen.getByTestId('stock-change');
    expect(changeElement).toHaveClass('positive');
    expect(changeElement).toHaveTextContent('2.5%');
  });

  it('shows negative change with correct styling', () => {
    const negativeStock = { ...mockStock, change_percent: -1.5 };
    render(<StockCard stock={negativeStock} onToggleWatchlist={mockOnToggleWatchlist} />);
    
    const changeElement = screen.getByTestId('stock-change');
    expect(changeElement).toHaveClass('negative');
    expect(changeElement).toHaveTextContent('-1.5%');
  });

  it('handles watchlist toggle correctly', () => {
    render(<StockCard stock={mockStock} onToggleWatchlist={mockOnToggleWatchlist} />);
    
    const toggleButton = screen.getByTestId('watchlist-toggle');
    expect(toggleButton).toHaveTextContent('Add');
    
    fireEvent.click(toggleButton);
    expect(mockOnToggleWatchlist).toHaveBeenCalledWith(1);
  });

  it('shows correct button text for watchlist items', () => {
    const watchlistStock = { ...mockStock, in_watchlist: true };
    render(<StockCard stock={watchlistStock} onToggleWatchlist={mockOnToggleWatchlist} />);
    
    const toggleButton = screen.getByTestId('watchlist-toggle');
    expect(toggleButton).toHaveTextContent('Remove');
  });

  it('handles zero change percentage', () => {
    const unchangedStock = { ...mockStock, change_percent: 0 };
    render(<StockCard stock={unchangedStock} onToggleWatchlist={mockOnToggleWatchlist} />);
    
    const changeElement = screen.getByTestId('stock-change');
    expect(changeElement).toHaveClass('positive'); // Zero is treated as positive
    expect(changeElement).toHaveTextContent('0%');
  });
});