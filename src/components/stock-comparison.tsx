'use client';

import { useState, useMemo, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { AnimatedCounter } from './ui/animated-counter';
import { GlobalSearch } from './search/global-search';
import { 
  GitCompare, 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Activity,
  Volume2,
  Target,
  Zap
} from 'lucide-react';
import { MiniChartJS } from './charts/mini-chart-js';

interface StockComparisonProps {
  stocks: Stock[];
  watchlist: Stock[];
  onAddToWatchlist?: (stock: Stock) => void;
}

export function StockComparison({ stocks, watchlist, onAddToWatchlist }: StockComparisonProps) {
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'overview' | 'detailed' | 'charts'>('overview');
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load selected stocks and comparison mode from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    try {
      // Load selected stocks
      const savedStocks = localStorage.getItem('stock-comparison-selected');
      
      if (savedStocks && stocks.length > 0) {
        const parsedStocks = JSON.parse(savedStocks);
        
        // Validate that the saved stocks still exist and get fresh data
        const validStocks = parsedStocks
          .map((savedStock: Stock) => 
            stocks.find(stock => stock.id === savedStock.id)
          )
          .filter((stock: Stock | undefined) => stock !== undefined) as Stock[];
        
        if (validStocks.length > 0) {
          setSelectedStocks(validStocks);
        }
      }

      // Load comparison mode
      const savedMode = localStorage.getItem('stock-comparison-mode');
      if (savedMode && ['overview', 'detailed', 'charts'].includes(savedMode)) {
        setComparisonMode(savedMode as 'overview' | 'detailed' | 'charts');
      }
      
      // Mark as loaded after processing
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading saved comparison data:', error);
      setIsLoaded(true);
    }
  }, [stocks]);

  // Save selected stocks to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (mounted && isLoaded) {
      try {
        if (selectedStocks.length > 0) {
          localStorage.setItem('stock-comparison-selected', JSON.stringify(selectedStocks));
        } else {
          // Only remove if we're sure this isn't just the initial empty state
          if (isLoaded) {
            localStorage.removeItem('stock-comparison-selected');
          }
        }
      } catch (error) {
        console.error('Error saving comparison stocks:', error);
      }
    }
  }, [selectedStocks, mounted, isLoaded]);

  // Save comparison mode to localStorage whenever it changes
  useEffect(() => {
    if (mounted && isLoaded) {
      try {
        localStorage.setItem('stock-comparison-mode', comparisonMode);
      } catch (error) {
        console.error('Error saving comparison mode:', error);
      }
    }
  }, [comparisonMode, mounted, isLoaded]);

  const handleStockSelect = (stock: Stock) => {
    if (selectedStocks.find(s => s.id === stock.id)) {
      return; // Already selected
    }
    
    if (selectedStocks.length >= 4) {
      // Replace the last stock if we have 4 already
      setSelectedStocks([...selectedStocks.slice(0, 3), stock]);
    } else {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const removeStock = (stockId: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.id !== stockId));
  };

  const clearAll = () => {
    setSelectedStocks([]);
    // localStorage removal will be handled automatically by the useEffect
  };

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (selectedStocks.length === 0) return null;

    const metrics = {
      bestPerformer: selectedStocks.reduce((best, stock) => 
        stock.change_percent > best.change_percent ? stock : best
      ),
      worstPerformer: selectedStocks.reduce((worst, stock) => 
        stock.change_percent < worst.change_percent ? stock : worst
      ),
      highestPrice: selectedStocks.reduce((highest, stock) => 
        stock.current_price > highest.current_price ? stock : highest
      ),
      lowestPrice: selectedStocks.reduce((lowest, stock) => 
        stock.current_price < lowest.current_price ? stock : lowest
      ),
      mostActive: selectedStocks.reduce((active, stock) => 
        stock.volume > active.volume ? stock : active
      ),
      avgChange: selectedStocks.reduce((sum, stock) => sum + stock.change_percent, 0) / selectedStocks.length,
      totalVolume: selectedStocks.reduce((sum, stock) => sum + stock.volume, 0)
    };

    return metrics;
  }, [selectedStocks]);

  if (selectedStocks.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
              <GitCompare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">Stock Comparison</h3>
              <p className="text-sm text-muted-foreground">Compare up to 4 stocks side by side</p>
            </div>
          </div>

          {/* Stock Search */}
          <div className="mb-6 relative z-[9999] isolate">
            <GlobalSearch 
              stocks={stocks}
              onStockSelect={handleStockSelect}
              onAddToWatchlist={onAddToWatchlist}
              watchlist={watchlist}
              placeholder="Search stocks to compare..."
            />
          </div>

          <div className="text-center py-12">
            <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Stocks Selected</h3>
            <p className="text-muted-foreground">
              Use the search above to find and select stocks for comparison.
              <br />
              You can compare up to 4 stocks at once.
            </p>
          </div>
        </div>

        {/* Quick Watchlist Access */}
        {watchlist.length > 0 && (
          <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-6">
            <h4 className="font-semibold text-card-foreground mb-4">Quick Add from Watchlist</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {watchlist.slice(0, 8).map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => handleStockSelect(stock)}
                  className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="font-mono font-bold text-card-foreground text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{stock.company_name}</div>
                  <div className={`text-xs font-medium ${
                    stock.change_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
              <GitCompare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">Stock Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Comparing {selectedStocks.length} stock{selectedStocks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="px-3 py-2 text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Clear All
            </button>
            
            <div className="flex bg-muted/50 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'detailed', label: 'Detailed' },
                { key: 'charts', label: 'Charts' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setComparisonMode(mode.key as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    comparisonMode === mode.key
                      ? 'bg-blue-500/20 text-blue-600 shadow-sm'
                      : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/30'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Search */}
        <div className="mb-4 relative z-[9999] isolate">
          <GlobalSearch 
            stocks={stocks}
            onStockSelect={handleStockSelect}
            onAddToWatchlist={onAddToWatchlist}
            watchlist={watchlist}
            placeholder="Add more stocks to compare..."
          />
        </div>
      </div>

      {/* Comparison Summary */}
      {comparisonMetrics && (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-6 relative z-[1]">
          <h4 className="font-semibold text-card-foreground mb-4">Comparison Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Best Performer</div>
              <div className="font-bold text-emerald-600">{comparisonMetrics.bestPerformer.symbol}</div>
              <div className="text-xs">+{comparisonMetrics.bestPerformer.change_percent.toFixed(2)}%</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <TrendingDown className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Worst Performer</div>
              <div className="font-bold text-red-600">{comparisonMetrics.worstPerformer.symbol}</div>
              <div className="text-xs">{comparisonMetrics.worstPerformer.change_percent.toFixed(2)}%</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Activity className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Most Active</div>
              <div className="font-bold text-blue-600">{comparisonMetrics.mostActive.symbol}</div>
              <div className="text-xs">
                {comparisonMetrics.mostActive.volume >= 1e9 
                  ? `${(comparisonMetrics.mostActive.volume / 1e9).toFixed(1)}B`
                  : `${(comparisonMetrics.mostActive.volume / 1e6).toFixed(1)}M`}
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Avg Change</div>
              <div className={`font-bold ${comparisonMetrics.avgChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {comparisonMetrics.avgChange >= 0 ? '+' : ''}{comparisonMetrics.avgChange.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Portfolio</div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedStocks.map((stock, index) => (
          <div key={stock.id} className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-4 relative group">
            {/* Remove Button */}
            <button
              onClick={() => removeStock(stock.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Stock Info */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="font-mono font-bold text-card-foreground">{stock.symbol}</div>
                <div className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                  #{index + 1}
                </div>
              </div>
              <div className="text-sm text-muted-foreground truncate">{stock.company_name}</div>
              <div className="text-xs text-muted-foreground">{stock.sector}</div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="text-lg font-bold text-card-foreground tabular-nums">
                $<AnimatedCounter value={stock.current_price} decimals={2} />
              </div>
              <div className={`text-sm font-medium tabular-nums ${
                stock.change_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Volume:</span>
                <span className="text-card-foreground">
                  {stock.volume >= 1e9 ? `${(stock.volume / 1e9).toFixed(1)}B` : 
                   stock.volume >= 1e6 ? `${(stock.volume / 1e6).toFixed(1)}M` :
                   `${(stock.volume / 1e3).toFixed(1)}K`}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Market Cap:</span>
                <span className="text-card-foreground">
                  {stock.market_cap >= 1e12 ? `$${(stock.market_cap / 1e12).toFixed(1)}T` :
                   stock.market_cap >= 1e9 ? `$${(stock.market_cap / 1e9).toFixed(1)}B` :
                   `$${(stock.market_cap / 1e6).toFixed(1)}M`}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Placeholder */}
        {selectedStocks.length < 4 && (
          <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex items-center justify-center text-center">
            <div>
              <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <GitCompare className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                Add {4 - selectedStocks.length} more stock{4 - selectedStocks.length !== 1 ? 's' : ''}
                <br />
                for comparison
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Comparison Views */}
      {comparisonMode === 'detailed' && (
        <DetailedComparison stocks={selectedStocks} />
      )}
      
      {comparisonMode === 'charts' && (
        <ChartComparison stocks={selectedStocks} />
      )}
    </div>
  );
}

// Detailed comparison component
function DetailedComparison({ stocks }: { stocks: Stock[] }) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border border-border/50 p-6">
      <h4 className="text-lg font-semibold text-card-foreground mb-6">Detailed Metrics Comparison</h4>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Metric</th>
              {stocks.map((stock) => (
                <th key={stock.id} className="text-center p-3 font-medium text-card-foreground">
                  {stock.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { 
                label: 'Current Price', 
                getValue: (stock: Stock) => `$${stock.current_price.toFixed(2)}`,
                getColor: () => 'text-card-foreground'
              },
              { 
                label: 'Change %', 
                getValue: (stock: Stock) => `${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%`,
                getColor: (stock: Stock) => stock.change_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
              },
              { 
                label: 'Volume', 
                getValue: (stock: Stock) => {
                  if (stock.volume >= 1e9) return `${(stock.volume / 1e9).toFixed(1)}B`;
                  if (stock.volume >= 1e6) return `${(stock.volume / 1e6).toFixed(1)}M`;
                  return `${(stock.volume / 1e3).toFixed(1)}K`;
                },
                getColor: () => 'text-card-foreground'
              },
              { 
                label: 'Market Cap', 
                getValue: (stock: Stock) => {
                  if (stock.market_cap >= 1e12) return `$${(stock.market_cap / 1e12).toFixed(1)}T`;
                  if (stock.market_cap >= 1e9) return `$${(stock.market_cap / 1e9).toFixed(1)}B`;
                  return `$${(stock.market_cap / 1e6).toFixed(1)}M`;
                },
                getColor: () => 'text-card-foreground'
              },
              { 
                label: 'Sector', 
                getValue: (stock: Stock) => stock.sector,
                getColor: () => 'text-muted-foreground'
              }
            ].map((metric) => (
              <tr key={metric.label} className="border-b border-border/30">
                <td className="p-3 font-medium text-muted-foreground">{metric.label}</td>
                {stocks.map((stock) => (
                  <td key={stock.id} className={`p-3 text-center font-mono ${metric.getColor(stock)}`}>
                    {metric.getValue(stock)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Chart comparison component
function ChartComparison({ stocks }: { stocks: Stock[] }) {
  return (
    <div className="space-y-6">
      {/* Individual Stock Charts */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border border-border/50 p-6">
        <h4 className="text-lg font-semibold text-card-foreground mb-6">Individual Price Performance</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stocks.map((stock) => (
            <div key={stock.id} className="p-4 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono font-bold text-card-foreground">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.company_name}</div>
                  <div className="text-lg font-semibold text-card-foreground">${stock.current_price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium flex items-center gap-1 ${
                    stock.change_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stock.change_percent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">{stock.sector}</div>
                </div>
              </div>
              
              {/* Mini Price Chart */}
              <div className="h-16 mb-3">
                <MiniChartJS 
                  currentPrice={stock.current_price}
                  changePercent={stock.change_percent}
                  height={64}
                />
              </div>
              
              {/* Stock Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="text-card-foreground font-medium">
                    {stock.volume >= 1e9 ? `${(stock.volume / 1e9).toFixed(1)}B` : 
                     stock.volume >= 1e6 ? `${(stock.volume / 1e6).toFixed(1)}M` :
                     `${(stock.volume / 1e3).toFixed(1)}K`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap:</span>
                  <span className="text-card-foreground font-medium">
                    {stock.market_cap >= 1e12 ? `$${(stock.market_cap / 1e12).toFixed(1)}T` :
                     stock.market_cap >= 1e9 ? `$${(stock.market_cap / 1e9).toFixed(1)}B` :
                     `$${(stock.market_cap / 1e6).toFixed(1)}M`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Comparison Chart */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border border-border/50 p-6">
        <h4 className="text-lg font-semibold text-card-foreground mb-6">Comparative Performance</h4>
        
        <div className="relative">
          {/* Chart Container */}
          <div className="h-64 bg-muted/10 rounded-lg border border-border/30 relative overflow-hidden">
            {/* Overlay multiple price charts */}
            {stocks.map((stock, index) => {
              const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
              const color = colors[index % colors.length];
              
              return (
                <div key={stock.id} className="absolute inset-0" style={{ opacity: 0.8 }}>
                  <MiniChartJS 
                    currentPrice={stock.current_price}
                    changePercent={stock.change_percent}
                    height={256}
                    color={color}
                  />
                </div>
              );
            })}
            
            {/* Chart Labels */}
            <div className="absolute top-4 left-4">
              <div className="text-sm font-medium text-card-foreground mb-2">Normalized Performance</div>
              <div className="text-xs text-muted-foreground">All stocks scaled to same baseline for comparison</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {stocks.map((stock, index) => {
              const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
              const color = colors[index % colors.length];
              
              return (
                <div key={stock.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-card-foreground">{stock.symbol}</span>
                  <span className={`text-xs ${stock.change_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}