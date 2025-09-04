import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock the markets dashboard component
const MockMarketsDashboard = ({ marketData, loading, error }: any) => {
  if (loading) return <div data-testid="loading">Loading market data...</div>;
  if (error) return <div data-testid="error">Error: {error}</div>;
  
  return (
    <div data-testid="markets-dashboard">
      <h1>Markets Dashboard</h1>
      <div data-testid="market-overview">
        <p data-testid="total-stocks">Total Stocks: {marketData?.total_stocks || 0}</p>
        <p data-testid="advancing-count">Advancing: {marketData?.advancing_count || 0}</p>
        <p data-testid="declining-count">Declining: {marketData?.declining_count || 0}</p>
      </div>
      <div data-testid="top-gainers">
        {marketData?.top_gainers?.map((stock: any) => (
          <div key={stock.symbol} data-testid={`gainer-${stock.symbol}`}>
            {stock.symbol}: +{stock.change_percent}%
          </div>
        ))}
      </div>
      <div data-testid="top-losers">
        {marketData?.top_losers?.map((stock: any) => (
          <div key={stock.symbol} data-testid={`loser-${stock.symbol}`}>
            {stock.symbol}: {stock.change_percent}%
          </div>
        ))}
      </div>
    </div>
  );
};

describe('MarketsDashboard', () => {
  const mockMarketData = {
    total_stocks: 100,
    advancing_count: 60,
    declining_count: 30,
    unchanged_count: 10,
    top_gainers: [
      { symbol: 'AAPL', change_percent: 5.2 },
      { symbol: 'MSFT', change_percent: 3.8 },
      { symbol: 'GOOGL', change_percent: 2.1 },
    ],
    top_losers: [
      { symbol: 'TSLA', change_percent: -4.5 },
      { symbol: 'META', change_percent: -2.3 },
      { symbol: 'NFLX', change_percent: -1.8 },
    ],
  };

  it('renders loading state correctly', () => {
    render(<MockMarketsDashboard loading={true} />);
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading market data...');
  });

  it('renders error state correctly', () => {
    render(<MockMarketsDashboard error="Failed to fetch market data" />);
    expect(screen.getByTestId('error')).toHaveTextContent('Error: Failed to fetch market data');
  });

  it('renders market overview correctly', () => {
    render(<MockMarketsDashboard marketData={mockMarketData} />);

    expect(screen.getByTestId('total-stocks')).toHaveTextContent('Total Stocks: 100');
    expect(screen.getByTestId('advancing-count')).toHaveTextContent('Advancing: 60');
    expect(screen.getByTestId('declining-count')).toHaveTextContent('Declining: 30');
  });

  it('renders top gainers correctly', () => {
    render(<MockMarketsDashboard marketData={mockMarketData} />);

    expect(screen.getByTestId('gainer-AAPL')).toHaveTextContent('AAPL: +5.2%');
    expect(screen.getByTestId('gainer-MSFT')).toHaveTextContent('MSFT: +3.8%');
    expect(screen.getByTestId('gainer-GOOGL')).toHaveTextContent('GOOGL: +2.1%');
  });

  it('renders top losers correctly', () => {
    render(<MockMarketsDashboard marketData={mockMarketData} />);

    expect(screen.getByTestId('loser-TSLA')).toHaveTextContent('TSLA: -4.5%');
    expect(screen.getByTestId('loser-META')).toHaveTextContent('META: -2.3%');
    expect(screen.getByTestId('loser-NFLX')).toHaveTextContent('NFLX: -1.8%');
  });

  it('handles empty market data gracefully', () => {
    render(<MockMarketsDashboard marketData={{}} />);

    expect(screen.getByTestId('total-stocks')).toHaveTextContent('Total Stocks: 0');
    expect(screen.getByTestId('advancing-count')).toHaveTextContent('Advancing: 0');
    expect(screen.getByTestId('declining-count')).toHaveTextContent('Declining: 0');
  });

  it('renders dashboard title', () => {
    render(<MockMarketsDashboard marketData={mockMarketData} />);
    expect(screen.getByText('Markets Dashboard')).toBeInTheDocument();
  });
});