'use client';

import { useState, useEffect } from 'react';
import { Stock, StockPerformance, MarketOverview as MarketOverviewType } from '@/types/stock';
import { getAllStocks, getPerformanceData, getMarketOverview } from '@/lib/api';
import { StockCard } from '@/components/stock-card';
import { PerformanceSection } from '@/components/performance-section';
import { PriceRangeFilter } from '@/components/price-range-filter';
import { MarketOverview } from '@/components/market-overview';
import { CSSPieChart } from '@/components/charts/css-pie-chart';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import {
  StockCardSkeleton,
  PerformanceSectionSkeleton,
  MarketOverviewSkeleton,
  PriceRangeFilterSkeleton,
  SectorPieChartSkeleton
} from '@/components/ui/skeleton';

interface ClientOnlyDashboardProps {
  showDebug?: boolean;
}

export function ClientOnlyDashboard({ showDebug = false }: ClientOnlyDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [performance, setPerformance] = useState<StockPerformance | null>(null);
  const [marketOverview, setMarketOverview] = useState<MarketOverviewType | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Not mounted yet...');

  // Calculate price range counts
  const rangeCounts = stocks.reduce((acc, stock) => {
    acc[stock.price_range] = (acc[stock.price_range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter stocks by selected price range
  const filteredStocks = selectedPriceRange
    ? stocks.filter(stock => stock.price_range === selectedPriceRange)
    : stocks;

  useEffect(() => {
    setMounted(true);
    setDebugInfo('Component mounted, starting data fetch...');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo('Fetching all endpoints...');

        const [stocksData, performanceData, overviewData] = await Promise.all([
          getAllStocks(),
          getPerformanceData(),
          getMarketOverview(),
        ]);

        setDebugInfo(`Successfully loaded ${stocksData.length} stocks!`);
        setStocks(stocksData);
        setPerformance(performanceData);
        setMarketOverview(overviewData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setDebugInfo(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError('Failed to load stock data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure everything is ready
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/30">
        {/* Gradient Overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        {/* Loading Header */}
        <header className="relative bg-card/60 backdrop-blur-xl shadow-2xl border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-600 shadow-2xl animate-pulse">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                    Stock Intelligence
                    <span className="px-3 py-1 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full animate-pulse">
                      Beta
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-lg">Loading market data...</p>
                  {showDebug && (
                    <p className="text-xs text-emerald-600 mt-1 font-mono">Status: {debugInfo}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* Market Overview Skeleton */}
          <div className="animate-slide-up">
            <MarketOverviewSkeleton />
          </div>

          {/* Market Analytics Skeleton */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-48 bg-muted/60 rounded-lg animate-pulse mx-auto mb-2" />
              <div className="h-4 w-80 bg-muted/60 rounded-lg animate-pulse mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="animate-slide-up">
                <SectorPieChartSkeleton />
              </div>
              <div className="animate-slide-up">
                <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 bg-muted/60 rounded-xl animate-pulse" />
                    <div>
                      <div className="h-6 w-32 bg-muted/60 rounded animate-pulse mb-1" />
                      <div className="h-4 w-48 bg-muted/60 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="h-3 w-24 bg-muted/60 rounded animate-pulse mb-2" />
                            <div className="h-6 w-16 bg-muted/60 rounded animate-pulse" />
                          </div>
                          <div className="h-8 w-8 bg-muted/60 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Sections Skeleton */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-48 bg-muted/60 rounded-lg animate-pulse mx-auto mb-2" />
              <div className="h-4 w-72 bg-muted/60 rounded-lg animate-pulse mx-auto" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <PerformanceSectionSkeleton />
              <PerformanceSectionSkeleton />
              <PerformanceSectionSkeleton />
            </div>
          </div>

          {/* Stock Explorer Skeleton */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-48 bg-muted/60 rounded-lg animate-pulse mx-auto mb-2" />
              <div className="h-4 w-64 bg-muted/60 rounded-lg animate-pulse mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Price Range Filter Skeleton */}
              <div className="xl:col-span-1">
                <div className="sticky top-8">
                  <PriceRangeFilterSkeleton />
                </div>
              </div>

              {/* Stock Cards Skeleton */}
              <div className="xl:col-span-4 space-y-6">
                <div className="flex items-center justify-between p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
                  <div>
                    <div className="h-6 w-32 bg-muted/60 rounded animate-pulse mb-2" />
                    <div className="h-4 w-48 bg-muted/60 rounded animate-pulse" />
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-20 bg-muted/60 rounded animate-pulse mb-1" />
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div className="h-3 w-8 bg-muted/60 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, index) => (
                    <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <StockCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/30 flex items-center justify-center">
        {/* Gradient Overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        
        <div className="relative text-center max-w-lg mx-4">
          {/* Error Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-red-200/50 dark:border-red-800/50 p-8">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Error Content */}
            <h2 className="text-2xl font-bold text-card-foreground mb-3">Connection Error</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
            
            {showDebug && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
                <p className="text-sm text-red-700 dark:text-red-300 font-mono">Debug: {debugInfo}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Connection
              </button>
              
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.reload();
                }}
                className="px-6 py-3 bg-muted/50 hover:bg-muted/70 text-card-foreground rounded-xl transition-all duration-200 border border-border/50 hover:border-border font-medium"
              >
                Refresh Page
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Make sure the backend services are running and accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/30">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      {/* Header */}
      <header className="relative bg-card/60 backdrop-blur-xl shadow-2xl border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-600 shadow-2xl">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                  Stock Intelligence
                  <span className="px-3 py-1 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full animate-pulse">
                    Beta
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg">Real-time market analysis and insights</p>
                {showDebug && (
                  <p className="text-xs text-emerald-600 mt-1 font-mono">Status: {debugInfo}</p>
                )}
              </div>
            </div>
            
            {/* Header Stats */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 lg:pb-0">
              <div className="text-center flex-shrink-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground tabular-nums">
                  <AnimatedCounter value={filteredStocks.length} decimals={0} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Stocks Displayed</div>
              </div>
              
              {marketOverview && (
                <div className="text-center flex-shrink-0">
                  <div className={`text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums ${
                    marketOverview.avg_change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <AnimatedCounter 
                      value={marketOverview.avg_change} 
                      prefix={marketOverview.avg_change >= 0 ? '+' : ''} 
                      suffix="%" 
                      decimals={2} 
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Market Avg</div>
                </div>
              )}
              
              <div className="text-center flex-shrink-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground tabular-nums">
                  <AnimatedCounter value={stocks.length} decimals={0} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Total Stocks</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Market Overview */}
        {marketOverview && (
          <div className="animate-slide-up">
            <MarketOverview data={marketOverview} />
          </div>
        )}

        {/* Market Analytics Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Market Analytics</h2>
            <p className="text-muted-foreground">Sector distribution and market composition insights</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Sector Distribution */}
            <div className="animate-slide-up">
              <CSSPieChart stocks={filteredStocks} />
            </div>
            
            {/* Market Stats Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Market Statistics</h3>
                  <p className="text-sm text-muted-foreground">Key market metrics and insights</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Total Market Value */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Market Value</div>
                      <div className="text-2xl font-bold text-card-foreground tabular-nums">
                        $<AnimatedCounter value={filteredStocks.reduce((sum, stock) => sum + (stock.current_price * 1000000), 0) / 1000000000} decimals={1} />B
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>


                {/* Market Sentiment */}
                {marketOverview && (
                  <div className={`p-4 rounded-xl border ${
                    marketOverview.avg_change >= 0 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20'
                      : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Market Sentiment</div>
                        <div className={`text-lg font-bold tabular-nums ${
                          marketOverview.avg_change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          <AnimatedCounter 
                            value={marketOverview.avg_change} 
                            prefix={marketOverview.avg_change >= 0 ? '+' : ''} 
                            suffix="%" 
                            decimals={2} 
                          />
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${
                        marketOverview.avg_change >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}>
                        <svg 
                          className={`h-5 w-5 ${
                            marketOverview.avg_change >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={marketOverview.avg_change >= 0 
                              ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                              : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                            } 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Sections */}
        {performance && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-card-foreground mb-2">Market Performance</h2>
              <p className="text-muted-foreground">Top performing stocks across categories</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <PerformanceSection
                title="Top Gainers"
                stocks={performance.top_gainers}
                type="gainers"
              />
              <PerformanceSection
                title="Top Losers"
                stocks={performance.top_losers}
                type="losers"
              />
              <PerformanceSection
                title="Most Active"
                stocks={performance.most_active}
                type="active"
              />
            </div>
          </div>
        )}

        {/* Stock Explorer Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Stock Explorer</h2>
            <p className="text-muted-foreground">Browse and filter stocks by price range</p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Price Range Filter Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <PriceRangeFilter
                  selectedRange={selectedPriceRange}
                  onRangeChange={setSelectedPriceRange}
                  rangeCounts={rangeCounts}
                />
              </div>
            </div>

            {/* Stock Cards Grid */}
            <div className="xl:col-span-4 space-y-6">
              <div className="flex items-center justify-between p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">
                    {selectedPriceRange ? `${selectedPriceRange} Stocks` : 'All Stocks'}
                  </h3>
                  <p className="text-muted-foreground">
                    Showing {filteredStocks.length} of {stocks.length} stocks
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Real-time data</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-600">Live</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredStocks.map((stock, index) => (
                  <div key={stock.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <StockCard stock={stock} />
                  </div>
                ))}
              </div>

              {filteredStocks.length === 0 && (
                <div className="text-center py-20 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
                  <div className="mb-4">
                    <svg className="h-16 w-16 mx-auto text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">No stocks found</h3>
                  <p className="text-muted-foreground">No stocks found for the selected price range. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-card/40 backdrop-blur-xl border-t border-border/50 mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600 to-blue-600 shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-card-foreground flex items-center">
                  Stock Intelligence
                  <span className="ml-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">
                    Beta
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Professional financial market analysis platform with real-time insights and advanced visualizations. Currently in beta development.
              </p>
            </div>
            
            {/* Stats Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                    <AnimatedCounter value={stocks.length} decimals={0} />
                  </div>
                  <div className="text-xs text-muted-foreground">Tracked Stocks</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-blue-600 tabular-nums">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
            
            {/* Status Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live Market Data</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Real-time Analytics</span>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Stock Intelligence Platform (Beta) • Some features may be incomplete • Real market data via Alpha Vantage
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Market Data</span>
                <span>•</span>
                <span>Charts</span>
                <span>•</span>
                <span>Analytics</span>
                {showDebug && (
                  <>
                    <span>•</span>
                    <span className="text-xs text-emerald-600 font-mono">Debug: OK</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}