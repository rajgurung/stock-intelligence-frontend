'use client';

import { useState, useEffect } from 'react';
import { Stock, StockPerformance, MarketOverview as MarketOverviewType } from '@/types/stock';
import { getPerformanceData, getMarketOverview } from '@/lib/api';
import { PerformanceSection } from '@/components/performance-section';
import { CompactPriceFilter } from '@/components/compact-price-filter';
import { InfiniteStockList } from '@/components/infinite-stock-list';
import { InlineBetaBadge } from '@/components/ui/beta-badge';
import { StockReadingGuide } from '@/components/help/stock-reading-guide';
import { StaticDisplay } from '@/components/ui/static-display';
import {
  PerformanceSectionSkeleton,
  PriceRangeFilterSkeleton
} from '@/components/ui/skeleton';

interface MarketsDashboardProps {
  showDebug?: boolean;
  stocks?: Stock[];
}

export function MarketsDashboard({ showDebug = false, stocks: propStocks = [] }: MarketsDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [performance, setPerformance] = useState<StockPerformance | null>(null);
  const [marketOverview, setMarketOverview] = useState<MarketOverviewType | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Not mounted yet...');

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
        setDebugInfo('Fetching performance and market data...');

        const [performanceData, overviewData] = await Promise.all([
          getPerformanceData(),
          getMarketOverview()
        ]);

        setDebugInfo('Successfully loaded market data!');
        setPerformance(performanceData);
        setMarketOverview(overviewData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setDebugInfo(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError('Failed to load data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="p-4 lg:p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-48 bg-muted/60 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted/60 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-16 bg-muted/60 rounded animate-pulse mb-1" />
                  <div className="h-3 w-12 bg-muted/60 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Performance Sections Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <PerformanceSectionSkeleton />
          <PerformanceSectionSkeleton />
          <PerformanceSectionSkeleton />
        </div>
        
        {/* Price Filter and Stock List Skeleton */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="h-8 w-48 bg-muted/60 rounded animate-pulse mx-auto" />
            <div className="h-4 w-64 bg-muted/60 rounded animate-pulse mx-auto" />
          </div>
          <PriceRangeFilterSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-red-200/50 dark:border-red-800/50 p-8 text-center max-w-lg mx-auto">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-3">Connection Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          {showDebug && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
              <p className="text-sm text-red-700 dark:text-red-300 font-mono">Debug: {debugInfo}</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      {/* Simplified Header */}
      <div className="bg-gradient-to-r from-blue-500/15 to-purple-500/20 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground mb-2 flex items-center">
              Markets
              <InlineBetaBadge size="sm" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time data • Live stock explorer
              {showDebug && (
                <span className="ml-2 text-xs text-emerald-600 font-mono">• {debugInfo}</span>
              )}
            </p>
          </div>
          
          {/* Essential Stats Only */}
          <div className="flex items-center gap-8">
            {marketOverview && (
              <div className="text-center">
                <div className={`text-xl font-bold tabular-nums ${
                  marketOverview.avg_change >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  <StaticDisplay 
                    value={marketOverview.avg_change} 
                    prefix={marketOverview.avg_change >= 0 ? '+' : ''} 
                    suffix="%" 
                    decimals={1} 
                  />
                </div>
                <div className="text-xs text-muted-foreground">Market</div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full" />
              <span className="text-xs text-emerald-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Performance Only - Single Row */}
      {performance && performance.top_gainers && performance.top_losers && performance.most_active ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PerformanceSection
            title="Top Gainers"
            stocks={performance.top_gainers.slice(0, 3)}
            type="gainers"
            showTitle={false}
          />
          <PerformanceSection
            title="Top Losers"
            stocks={performance.top_losers.slice(0, 3)}
            type="losers"
            showTitle={false}
          />
          <PerformanceSection
            title="Most Active"
            stocks={performance.most_active.slice(0, 3)}
            type="active"
            showTitle={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-muted/20 rounded-xl border border-border/50 text-center">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Top Gainers</h3>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
          <div className="p-6 bg-muted/20 rounded-xl border border-border/50 text-center">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Top Losers</h3>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
          <div className="p-6 bg-muted/20 rounded-xl border border-border/50 text-center">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Most Active</h3>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </div>
      )}

      {/* Stock Explorer with Clean Layout */}
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-card-foreground flex items-center justify-center">
            Stock Explorer
            <InlineBetaBadge size="sm" />
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse all available stocks with infinite scroll
          </p>
        </div>

        {/* Price Range Filter */}
        <div className="flex justify-center">
          <CompactPriceFilter
            selectedRange={selectedPriceRange}
            onRangeChange={setSelectedPriceRange}
            rangeCounts={{}} // Will be populated by the infinite list
          />
        </div>

        {/* Results Summary */}
        {selectedPriceRange && (
          <div className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Showing stocks in the <span className="font-semibold">{selectedPriceRange}</span> price range
            </p>
          </div>
        )}

        {/* Infinite Stock List */}
        <InfiniteStockList 
          priceRange={selectedPriceRange || undefined}
          limit={10}
        />
      </div>

      {/* Help Guide */}
      <StockReadingGuide />
    </div>
  );
}