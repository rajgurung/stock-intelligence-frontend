'use client';

import { useState, memo, useMemo, useCallback } from 'react';
import { Stock } from '@/types/stock';
import { generateMockData } from '@/components/charts/mini-price-chart';
import { ChartJSMiniChart } from '@/components/charts/chartjs-mini-chart';
import { useStockChartData } from '@/services/stockChartService';
import { EnhancedPerformanceOverlay } from '@/components/charts/enhanced-performance-overlay';
import { StaticDisplay } from '@/components/ui/static-display';
import { useSearch } from '@/contexts/search-context';
import { TrendingUp, TrendingDown, Activity, Star, BarChart3, ChevronDown, ChevronUp, BookOpen, Target, AlertCircle } from 'lucide-react';
import { EducationalTooltip, financialTerms, EducationalTip } from '@/components/ui/educational-disclaimer';

interface StockCardProps {
  stock: Stock;
}

export const StockCard = memo(function StockCard({ stock }: StockCardProps) {
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [showLearnMore, setShowLearnMore] = useState(false);
  
  // Memoize expensive calculations that depend on stock data
  const styleCalculations = useMemo(() => {
    const isPositive = (stock.change_percent != null && typeof stock.change_percent === 'number') 
      ? stock.change_percent >= 0 : false;
    
    return {
      isPositive,
      changeColor: isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400',
      changeBgColor: isPositive ? 'bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-50 dark:from-emerald-900/60 dark:via-green-950/40 dark:to-green-950/20' : 'bg-gradient-to-r from-red-200 via-rose-100 to-red-50 dark:from-red-900/60 dark:via-rose-950/40 dark:to-rose-950/20',
      borderColor: isPositive ? 'border-emerald-200/60 dark:border-emerald-800/50' : 'border-red-200/60 dark:border-red-800/50',
      badgeBgColor: isPositive ? 'bg-gradient-to-r from-emerald-300 via-green-100 to-emerald-100 dark:from-emerald-800/70 dark:via-green-900/50 dark:to-green-900/30' : 'bg-gradient-to-r from-red-300 via-rose-100 to-red-100 dark:from-red-800/70 dark:via-rose-900/50 dark:to-rose-900/30',
      badgeTextColor: isPositive ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200',
      badgeBorderColor: isPositive ? 'border-emerald-300/50 dark:border-emerald-700/50' : 'border-red-300/50 dark:border-red-700/50',
    };
  }, [stock.change_percent]);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, setSelectedStock } = useSearch();
  const inWatchlist = useMemo(() => isInWatchlist(stock.id), [isInWatchlist, stock.id]);
  
  // Memoize event handlers to prevent unnecessary re-renders
  const handleWatchlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(stock.id);
    } else {
      addToWatchlist(stock);
    }
  }, [inWatchlist, removeFromWatchlist, addToWatchlist, stock.id, stock]);
  
  const handleCardClick = useCallback(() => {
    setSelectedStock(stock);
  }, [setSelectedStock, stock]);

  const handlePerformanceClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as Element).getBoundingClientRect();
    setOverlayPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setShowPerformanceOverlay(true);
  }, []);

  const handleCloseOverlay = () => {
    setShowPerformanceOverlay(false);
  };
  
  // Fetch real price chart data from API
  const { data: realChartData, loading: chartLoading, error: chartError } = useStockChartData(stock.symbol, 30);
  
  // Memoize chart data calculations
  const chartData = useMemo(() => {
    if (realChartData.length > 0) return realChartData;
    
    // No fallback to mock data as requested by user - use real data only
    console.log('⚠️ No real chart data available for', stock.symbol, {
      realDataLength: realChartData.length,
      stockPrice: stock.current_price,
      stockChange: stock.change_percent
    });
    
    return [];
  }, [realChartData, stock.current_price, stock.change_percent]);
  
  // DEBUG: Console logging
  console.log('🔍 STOCK CARD DEBUG:', {
    symbol: stock.symbol,
    currentPrice: stock.current_price,
    changePercent: stock.change_percent,
    realDataLength: realChartData?.length || 0,
    chartDataLength: chartData?.length || 0,
    chartLoading,
    chartError,
    usingRealData: realChartData.length > 0,
    chartData: chartData?.slice(0, 3) // Show first 3 data points
  });
  
  // Memoize formatted values to avoid recalculations
  const formattedValues = useMemo(() => {
    const formatMarketCap = (value: number | null | undefined) => {
      if (!value || value === 0) return 'N/A';
      if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value}`;
    };

    const formatVolume = (value: number | null | undefined) => {
      if (!value || value === 0) return 'N/A';
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toString();
    };

    return {
      marketCap: formatMarketCap(stock.market_cap),
      volume: formatVolume(stock.volume),
      currentPrice: stock.current_price ? `$${stock.current_price.toFixed(2)}` : 'N/A',
      changePercent: stock.change_percent ? `${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%` : '0.00%',
      dailyChange: stock.daily_change ? `${stock.daily_change >= 0 ? '+' : ''}$${Math.abs(stock.daily_change).toFixed(2)}` : '$0.00'
    };
  }, [stock.market_cap, stock.volume, stock.current_price, stock.change_percent, stock.daily_change]);

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-card/95 dark:bg-gradient-to-br dark:from-card/90 dark:via-card/80 dark:to-card/70 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 p-10 border ${styleCalculations.borderColor} overflow-hidden cursor-pointer touch-manipulation`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${stock.symbol} - ${stock.company_name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-transparent rounded-xl pointer-events-none" />
      
      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        styleCalculations.isPositive ? 'bg-gradient-to-r from-emerald-500/15 via-green-500/10 to-emerald-400/5' : 'bg-gradient-to-r from-red-500/15 via-rose-500/10 to-red-400/5'
      }`} />
      
      {/* Subtle border glow */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 ${
        styleCalculations.isPositive ? 'border-emerald-400/40' : 'border-red-400/40'
      }`} />
      
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 z-30 flex gap-2 items-center">
        {/* Enhanced Performance Button */}
        <button
          onClick={handlePerformanceClick}
          className="p-3 min-h-[44px] min-w-[44px] bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
          title="📊 View 30-Day Price Chart"
          aria-label="View 30-day price chart"
        >
          <BarChart3 className="h-4 w-4" />
        </button>
        
        {/* Enhanced Watchlist Button */}
        <button
          onClick={handleWatchlistToggle}
          className={`p-3 min-h-[44px] min-w-[44px] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation ${
            inWatchlist
              ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-950/40 text-yellow-600 dark:text-yellow-400 hover:from-yellow-200 hover:to-amber-200 dark:hover:from-yellow-950/60 dark:hover:to-amber-950/60'
              : 'bg-gradient-to-br from-muted/40 to-muted/30 text-muted-foreground hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-950/30 dark:hover:to-green-950/30 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star className={`h-4 w-4 transition-colors duration-200 ${inWatchlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Price Badge */}
        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${styleCalculations.badgeTextColor} ${styleCalculations.badgeBgColor} border ${styleCalculations.badgeBorderColor} shadow-lg`}>
          {stock.price_range}
        </span>
      </div>
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-8 pr-16">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${styleCalculations.changeBgColor} border ${styleCalculations.borderColor}`}>
            {styleCalculations.isPositive ? (
              <TrendingUp className={`h-4 w-4 ${styleCalculations.changeColor}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${styleCalculations.changeColor}`} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-1">
              {stock.symbol}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{stock.company_name}</p>
          </div>
        </div>
      </div>

      {/* Price Chart Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-end justify-between mb-8 pr-8">
          <div>
            <EducationalTooltip 
              term={financialTerms.price.term}
              definition={financialTerms.price.definition}
              example={financialTerms.price.example}
            >
              <div className="text-2xl font-semibold text-card-foreground tabular-nums mb-1">
                <span>{formattedValues.currentPrice}</span>
              </div>
            </EducationalTooltip>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium tabular-nums px-2 py-1 rounded ${styleCalculations.badgeTextColor}`}>
                {formattedValues.dailyChange}
              </span>
              <EducationalTooltip 
                term={financialTerms['change-percent'].term}
                definition={financialTerms['change-percent'].definition}
                example={financialTerms['change-percent'].example}
              >
                <span className={`text-xs font-medium tabular-nums px-2 py-1 rounded ${styleCalculations.badgeTextColor}`}>
                  ({formattedValues.changePercent})
                </span>
              </EducationalTooltip>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 dark:bg-muted/20 px-3 py-1.5 rounded-lg">
            <Activity className="h-3 w-3" />
            <span className="text-xs font-medium">30D</span>
          </div>
        </div>
        
        {/* Chart.js Mini Price Chart */}
        <div className="h-24 mb-4 rounded-xl bg-gradient-to-br from-card/50 to-card/30 dark:from-muted/30 dark:to-muted/20 p-3 border border-border/40 dark:border-border/30 shadow-inner">
          <ChartJSMiniChart data={chartData} isPositive={styleCalculations.isPositive} height={72} />
        </div>
      </div>

      {/* Enhanced Details Grid with Educational Tooltips */}
      <div className="relative z-10 grid grid-cols-2 gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex flex-col">
            <EducationalTooltip 
              term={financialTerms.sector.term}
              definition={financialTerms.sector.definition}
              example={financialTerms.sector.example}
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-normal mb-1">Sector</span>
            </EducationalTooltip>
            <span className="text-sm font-medium text-card-foreground">{stock.sector}</span>
          </div>
          <div className="flex flex-col">
            <EducationalTooltip 
              term={financialTerms.volume.term}
              definition={financialTerms.volume.definition}
              example={financialTerms.volume.example}
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-normal mb-1">Volume</span>
            </EducationalTooltip>
            <span className="text-sm font-medium text-card-foreground tabular-nums">
              {formattedValues.volume}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col">
            <EducationalTooltip 
              term={financialTerms['market-cap'].term}
              definition={financialTerms['market-cap'].definition}
              example={financialTerms['market-cap'].example}
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-normal mb-1">Market Cap</span>
            </EducationalTooltip>
            <span className="text-sm font-medium text-card-foreground tabular-nums">
              {formattedValues.marketCap}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-normal mb-1">Exchange</span>
            <span className="text-sm font-medium text-card-foreground">{stock.exchange}</span>
          </div>
        </div>
      </div>

      {/* Learn More Educational Section */}
      <div className="relative z-10 mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowLearnMore(!showLearnMore);
          }}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Learn About This Stock
            </span>
          </div>
          {showLearnMore ? (
            <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
        </button>

        {showLearnMore && (
          <div className="mt-4 space-y-4 p-4 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950/50 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700">
            <EducationalTip 
              tip={`${stock.symbol} is a ${stock.sector} company. Research the sector trends and company fundamentals before making investment decisions.`}
              variant="info"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-card-foreground">Key Metrics to Watch</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                  <li>• Price trends and volatility</li>
                  <li>• Trading volume patterns</li>
                  <li>• Sector performance comparison</li>
                  <li>• Market capitalization changes</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-card-foreground">Investment Basics</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                  <li>• Diversify your portfolio</li>
                  <li>• Understand company fundamentals</li>
                  <li>• Consider long-term trends</li>
                  <li>• Only invest what you can afford</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>📚 Educational Purpose:</strong> This platform is designed for learning about stock markets and financial concepts. 
                All data shown is for educational demonstration only and should not be used for actual investment decisions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 pt-4 border-t border-border/50 dark:border-border/30 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Live Data</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums font-normal">
            {new Date(stock.last_updated).toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      {/* Enhanced Performance Overlay */}
      <EnhancedPerformanceOverlay
        symbol={stock.symbol}
        currentPrice={stock.current_price || 0}
        isVisible={showPerformanceOverlay}
        onClose={handleCloseOverlay}
        position={overlayPosition}
      />
    </div>
  );
});