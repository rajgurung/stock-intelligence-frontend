'use client';

import { useState, useEffect } from 'react';
import { StockPerformance, MarketOverview as MarketOverviewType } from '@/types/stock';
import { getPerformanceData, getMarketOverview } from '@/lib/api';
import { PerformanceSection } from '@/components/performance-section';
import { MarketOverview } from '@/components/market-overview';
import { CSSPieChart } from '@/components/charts/css-pie-chart';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { InlineBetaBadge } from '@/components/ui/beta-badge';
import {
  PerformanceSectionSkeleton,
  MarketOverviewSkeleton,
  SectorPieChartSkeleton
} from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Activity, BarChart3, ArrowRight } from 'lucide-react';

interface MarketPulseTabProps {
  onNavigateToExplorer?: (filters?: { sector?: string; priceRange?: string }) => void;
}

export function MarketPulseTab({ onNavigateToExplorer }: MarketPulseTabProps) {
  const [performance, setPerformance] = useState<StockPerformance | null>(null);
  const [marketOverview, setMarketOverview] = useState<MarketOverviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [performanceData, overviewData] = await Promise.all([
          getPerformanceData(),
          getMarketOverview()
        ]);

        setPerformance(performanceData);
        setMarketOverview(overviewData);
      } catch (err) {
        console.error('Error fetching market pulse data:', err);
        setError('Failed to load market data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Market Status Skeleton */}
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

        <MarketOverviewSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectorPieChartSkeleton />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <PerformanceSectionSkeleton />
          <PerformanceSectionSkeleton />
          <PerformanceSectionSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Professional Market Status Header */}
      <div className="dashboard-card-elevated dashboard-p-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Market Status Information */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 dashboard-market-open rounded-full animate-pulse shadow-lg" />
                <h2 className="dashboard-text-heading-1">Market Open</h2>
              </div>
              <InlineBetaBadge size="sm" />
            </div>
            
            <p className="dashboard-text-body-secondary mb-4">
              Live market data • Real-time updates • NYSE & NASDAQ
            </p>
            
            {/* Status Information Panel */}
            <div className="dashboard-card dashboard-p-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 dashboard-market-open rounded-full" />
                  <span className="dashboard-text-caption">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 dashboard-text-muted rounded-full" />
                  <span className="dashboard-text-caption">
                    Market hours: 9:30 AM - 4:00 PM ET
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Sentiment Card */}
          <div className="lg:flex-shrink-0">
            {marketOverview && (
              <div className="dashboard-card-elevated dashboard-p-lg text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl">
                    {marketOverview.avg_change >= 0 ? '📈' : '📉'}
                  </div>
                  <div>
                    <div className={`dashboard-text-heading-1 tabular-nums ${
                      marketOverview.avg_change >= 0 ? 'dashboard-bullish' : 'dashboard-bearish'
                    }`}>
                      <AnimatedCounter
                        value={marketOverview.avg_change}
                        prefix={marketOverview.avg_change >= 0 ? '+' : ''}
                        suffix="%"
                        decimals={2}
                      />
                    </div>
                    <div className="dashboard-text-caption">Market Sentiment</div>
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  marketOverview.avg_change >= 0 
                    ? 'dashboard-status-success' 
                    : 'dashboard-status-error'
                }`}>
                  <span className="dashboard-text-small font-semibold">
                    {marketOverview.avg_change >= 0 ? '🐂 Bullish Trend' : '🐻 Bearish Trend'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Statistics Grid */}
        {marketOverview && (
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'hsl(var(--dashboard-card-border))' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="dashboard-card dashboard-p-md text-center dashboard-transition dashboard-hover-lift">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="dashboard-bullish text-lg">↗️</div>
                  <div className="dashboard-text-heading-2 dashboard-bullish">
                    <AnimatedCounter value={marketOverview.advancing_count} decimals={0} />
                  </div>
                </div>
                <div className="dashboard-text-caption">Advancing Stocks</div>
              </div>

              <div className="dashboard-card dashboard-p-md text-center dashboard-transition dashboard-hover-lift">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="dashboard-bearish text-lg">↘️</div>
                  <div className="dashboard-text-heading-2 dashboard-bearish">
                    <AnimatedCounter value={marketOverview.declining_count} decimals={0} />
                  </div>
                </div>
                <div className="dashboard-text-caption">Declining Stocks</div>
              </div>

              <div className="dashboard-card dashboard-p-md text-center dashboard-transition dashboard-hover-lift">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="dashboard-text-primary text-lg">📊</div>
                  <div className="dashboard-text-heading-2">
                    <AnimatedCounter value={marketOverview.total_stocks} decimals={0} />
                  </div>
                </div>
                <div className="dashboard-text-caption">Total Stocks</div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Market Breadth Indicator */}
        {marketOverview && (
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid hsl(var(--dashboard-card-border))' }}>
            <div className="dashboard-card dashboard-p-md">
              <div className="flex items-center justify-between mb-4">
                <span className="dashboard-text-heading-3">Market Breadth</span>
                <span className={`dashboard-text-small px-3 py-1 rounded-full ${
                  marketOverview.advancing_count > marketOverview.declining_count 
                    ? 'dashboard-status-success' 
                    : 'dashboard-status-error'
                }`}>
                  {marketOverview.advancing_count > marketOverview.declining_count ? 'Bullish' : 'Bearish'} Sentiment
                </span>
              </div>
              
              <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: 'hsl(var(--dashboard-surface))' }}>
                <div
                  className="h-full dashboard-transition"
                  style={{
                    backgroundColor: 'hsl(var(--dashboard-success))',
                    width: `${(marketOverview.advancing_count / (marketOverview.advancing_count + marketOverview.declining_count)) * 100}%`
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="dashboard-text-small">More Declining</span>
                <span className="dashboard-text-small">More Advancing</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Market Overview */}
      {marketOverview && <MarketOverview data={marketOverview} />}

      {/* Professional Performance Spotlight */}
      {performance && performance.top_gainers && performance.top_losers && performance.most_active ? (
        <div className="dashboard-card-elevated dashboard-p-xl">
          <div className="text-center mb-8">
            <h3 className="dashboard-text-heading-1 mb-3">Performance Spotlight</h3>
            <p className="dashboard-text-body-secondary mb-6">Today's market movers and most active stocks</p>
            
            <div className="dashboard-card dashboard-p-md inline-flex">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 dashboard-bullish rounded-full" />
                  <span className="dashboard-text-caption">Top {performance.top_gainers.length} Gainers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 dashboard-bearish rounded-full" />
                  <span className="dashboard-text-caption">Top {performance.top_losers.length} Losers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 dashboard-text-primary rounded-full" />
                  <span className="dashboard-text-caption">Most Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Top Gainers - Clean Professional Design */}
            <div className="dashboard-card dashboard-p-lg dashboard-transition dashboard-hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl dashboard-status-success">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="dashboard-text-heading-3 dashboard-bullish">Top Gainers</h4>
                    <p className="dashboard-text-caption">Biggest winners today</p>
                  </div>
                </div>
                {onNavigateToExplorer && (
                  <button
                    onClick={() => onNavigateToExplorer({ priceRange: '$100+' })}
                    className="flex items-center gap-1 dashboard-p-sm dashboard-status-success rounded-lg dashboard-transition hover:opacity-80 dashboard-text-small font-medium"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <PerformanceSection
                title=""
                stocks={performance.top_gainers.slice(0, 8)}
                type="gainers"
                showTitle={false}
              />
            </div>

            {/* Top Losers - Clean Professional Design */}
            <div className="dashboard-card dashboard-p-lg dashboard-transition dashboard-hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl dashboard-status-error">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="dashboard-text-heading-3 dashboard-bearish">Top Losers</h4>
                    <p className="dashboard-text-caption">Biggest declines today</p>
                  </div>
                </div>
                {onNavigateToExplorer && (
                  <button
                    onClick={() => onNavigateToExplorer({ priceRange: '$50-100' })}
                    className="flex items-center gap-1 dashboard-p-sm dashboard-status-error rounded-lg dashboard-transition hover:opacity-80 dashboard-text-small font-medium"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <PerformanceSection
                title=""
                stocks={performance.top_losers.slice(0, 8)}
                type="losers"
                showTitle={false}
              />
            </div>

            {/* Most Active - Clean Professional Design */}
            <div className="lg:col-span-2 xl:col-span-1 dashboard-card dashboard-p-lg dashboard-transition dashboard-hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(var(--dashboard-primary))', color: 'white' }}>
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="dashboard-text-heading-3" style={{ color: 'hsl(var(--dashboard-primary))' }}>Most Active</h4>
                    <p className="dashboard-text-caption">Highest trading volume</p>
                  </div>
                </div>
                {onNavigateToExplorer && (
                  <button
                    onClick={() => onNavigateToExplorer({ sector: 'Technology' })}
                    className="flex items-center gap-1 dashboard-p-sm rounded-lg dashboard-transition hover:opacity-80 dashboard-text-small font-medium"
                    style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <PerformanceSection
                title=""
                stocks={performance.most_active.slice(0, 8)}
                type="active"
                showTitle={false}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card-elevated dashboard-p-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="dashboard-card dashboard-p-lg text-center">
              <h3 className="dashboard-text-heading-3 mb-2">Top Gainers</h3>
              <p className="dashboard-text-caption">No data available</p>
            </div>
            <div className="dashboard-card dashboard-p-lg text-center">
              <h3 className="dashboard-text-heading-3 mb-2">Top Losers</h3>
              <p className="dashboard-text-caption">No data available</p>
            </div>
            <div className="dashboard-card dashboard-p-lg text-center">
              <h3 className="dashboard-text-heading-3 mb-2">Most Active</h3>
              <p className="dashboard-text-caption">No data available</p>
            </div>
          </div>
        </div>
      )}

      {/* Professional Market Analytics Section */}
      <div className="dashboard-card-elevated dashboard-p-xl">
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className="group flex items-center justify-center gap-4 mx-auto dashboard-p-lg dashboard-card dashboard-transition dashboard-hover-lift"
          >
            <h3 className="dashboard-text-heading-2">Market Analytics</h3>
            <div className={`dashboard-transition ${showAdvancedAnalytics ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 dashboard-text-secondary group-hover:dashboard-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <p className="dashboard-text-body-secondary mt-4">
            {showAdvancedAnalytics ? 'Hide' : 'Show'} detailed market insights and sector analysis
          </p>
        </div>

        {showAdvancedAnalytics && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
            {/* Professional Sector Breakdown */}
            <div className="xl:col-span-2 dashboard-card dashboard-p-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(var(--dashboard-primary))', color: 'white' }}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="dashboard-text-heading-3" style={{ color: 'hsl(var(--dashboard-primary))' }}>Sector Performance</h4>
                    <p className="dashboard-text-caption">Market composition by sectors</p>
                  </div>
                </div>
                {onNavigateToExplorer && (
                  <button
                    onClick={() => onNavigateToExplorer({ sector: 'Technology' })}
                    className="flex items-center gap-1 dashboard-p-sm rounded-lg dashboard-transition hover:opacity-80 dashboard-text-small font-medium"
                    style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}
                  >
                    Explore Sectors <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="h-80">
                <CSSPieChart stocks={performance?.top_gainers || []} />
              </div>
            </div>

            {/* Professional Market Insights */}
            <div className="space-y-4">
              {/* Market Sentiment Card */}
              <div className="dashboard-card dashboard-p-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl dashboard-status-success">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h4 className="dashboard-text-heading-3 dashboard-bullish">Market Sentiment</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">Overall Mood</span>
                    <span className="dashboard-text-small font-semibold dashboard-bullish">Bullish 📈</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">Fear & Greed</span>
                    <span className="dashboard-text-small font-semibold dashboard-bullish">Greed (75)</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'hsl(var(--dashboard-surface))' }}>
                    <div className="h-full rounded-full dashboard-transition" style={{ backgroundColor: 'hsl(var(--dashboard-success))', width: '75%' }} />
                  </div>
                </div>
              </div>

              {/* Trading Activity Card */}
              <div className="dashboard-card dashboard-p-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: 'hsl(var(--dashboard-primary))', color: 'white' }}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <h4 className="dashboard-text-heading-3" style={{ color: 'hsl(var(--dashboard-primary))' }}>Trading Activity</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">Volume vs Avg</span>
                    <span className="dashboard-text-small font-semibold dashboard-text-primary">+15% Above</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">Market Cap Flow</span>
                    <span className="dashboard-text-small font-semibold dashboard-text-primary">Large Cap ↗️</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'hsl(var(--dashboard-surface))' }}>
                    <div className="h-full rounded-full dashboard-transition" style={{ backgroundColor: 'hsl(var(--dashboard-primary))', width: '65%' }} />
                  </div>
                </div>
              </div>

              {/* Volatility Index Card */}
              <div className="dashboard-card dashboard-p-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl dashboard-status-warning">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <h4 className="dashboard-text-heading-3" style={{ color: 'hsl(var(--dashboard-warning))' }}>Volatility Index</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">VIX Level</span>
                    <span className="dashboard-text-small font-semibold" style={{ color: 'hsl(var(--dashboard-warning))' }}>18.5 (Moderate)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="dashboard-text-caption">Risk Level</span>
                    <span className="dashboard-text-small font-semibold" style={{ color: 'hsl(var(--dashboard-warning))' }}>Medium ⚠️</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: 'hsl(var(--dashboard-surface))' }}>
                    <div className="h-full rounded-full dashboard-transition" style={{ backgroundColor: 'hsl(var(--dashboard-warning))', width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-card-foreground mb-2">Quick Actions</h3>
          <p className="text-muted-foreground">Jump to specific market segments and analysis tools</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {onNavigateToExplorer && (
            <>
              <button
                onClick={() => onNavigateToExplorer({ sector: 'Technology' })}
                className="group relative p-6 bg-gradient-to-br from-card/80 to-card/60 hover:from-blue-50/80 hover:to-indigo-50/60 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/20 rounded-2xl border border-border/50 hover:border-blue-500/40 transition-all duration-300 text-center hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="mb-4 mx-auto w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-card-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Tech Stocks</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-blue-600/80 dark:group-hover:text-blue-400/80 transition-colors">Explore technology sector</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToExplorer({ priceRange: 'Under $10' })}
                className="group relative p-6 bg-gradient-to-br from-card/80 to-card/60 hover:from-emerald-50/80 hover:to-green-50/60 dark:hover:from-emerald-950/30 dark:hover:to-green-950/20 rounded-2xl border border-border/50 hover:border-emerald-500/40 transition-all duration-300 text-center hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="mb-4 mx-auto w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-green-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-card-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Penny Stocks</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-emerald-600/80 dark:group-hover:text-emerald-400/80 transition-colors">Under $10 stocks</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToExplorer({ priceRange: '$100+' })}
                className="group relative p-6 bg-gradient-to-br from-card/80 to-card/60 hover:from-purple-50/80 hover:to-violet-50/60 dark:hover:from-purple-950/30 dark:hover:to-violet-950/20 rounded-2xl border border-border/50 hover:border-purple-500/40 transition-all duration-300 text-center hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="mb-4 mx-auto w-14 h-14 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-violet-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-card-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Premium Stocks</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-purple-600/80 dark:group-hover:text-purple-400/80 transition-colors">$100+ high-value stocks</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToExplorer({ sector: 'Healthcare' })}
                className="group relative p-6 bg-gradient-to-br from-card/80 to-card/60 hover:from-red-50/80 hover:to-rose-50/60 dark:hover:from-red-950/30 dark:hover:to-rose-950/20 rounded-2xl border border-border/50 hover:border-red-500/40 transition-all duration-300 text-center hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="mb-4 mx-auto w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-rose-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2v8H4V8zm3 0h2v8H7V8zm3 0h2v8h-2V8z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-card-foreground mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Healthcare</h4>
                  <p className="text-sm text-muted-foreground group-hover:text-red-600/80 dark:group-hover:text-red-400/80 transition-colors">Medical & pharma stocks</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}