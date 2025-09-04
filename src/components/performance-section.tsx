'use client';

import { Stock } from '@/types/stock';
import { CSSBarChart } from '@/components/charts/css-bar-chart';
import { StaticDisplay } from '@/components/ui/static-display';
import { TrendingUp, TrendingDown, Activity, Crown, AlertTriangle, Zap } from 'lucide-react';

interface PerformanceSectionProps {
  title: string;
  stocks: Stock[];
  type: 'gainers' | 'losers' | 'active';
  showTitle?: boolean;
}

export function PerformanceSection({ title, stocks, type, showTitle = true }: PerformanceSectionProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'gainers':
        return {
          headerBg: 'bg-emerald-50 dark:bg-emerald-950/20',
          headerText: 'text-emerald-800 dark:text-emerald-200',
          headerBorder: 'border-emerald-200 dark:border-emerald-800',
          cardBorder: 'border-emerald-200 dark:border-emerald-800',
          icon: Crown,
          gradient: 'from-emerald-500 to-green-600',
          accentColor: 'emerald'
        };
      case 'losers':
        return {
          headerBg: 'bg-red-50 dark:bg-red-950/20',
          headerText: 'text-red-800 dark:text-red-200',
          headerBorder: 'border-red-200 dark:border-red-800',
          cardBorder: 'border-red-200 dark:border-red-800',
          icon: AlertTriangle,
          gradient: 'from-red-500 to-rose-600',
          accentColor: 'red'
        };
      case 'active':
        return {
          headerBg: 'bg-blue-50 dark:bg-blue-950/20',
          headerText: 'text-blue-800 dark:text-blue-200',
          headerBorder: 'border-blue-200 dark:border-blue-800',
          cardBorder: 'border-blue-200 dark:border-blue-800',
          icon: Zap,
          gradient: 'from-blue-500 to-indigo-600',
          accentColor: 'blue'
        };
    }
  };

  const styles = getTypeStyles();
  const TypeIcon = styles.icon;

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getDisplayValue = (stock: Stock) => {
    switch (type) {
      case 'gainers':
      case 'losers':
        if (stock.change_percent == null || typeof stock.change_percent !== 'number') {
          return 'N/A';
        }
        return `${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%`;
      case 'active':
        return formatVolume(stock.volume);
      default:
        return '';
    }
  };

  const getMetricLabel = () => {
    switch (type) {
      case 'gainers':
      case 'losers':
        return 'Change';
      case 'active':
        return 'Volume';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-sm rounded-2xl shadow-2xl border-2 ${styles.cardBorder} hover:shadow-3xl transition-all duration-200 group`}>
      {/* Enhanced Header with Icon */}
      <div className={`px-6 py-6 border-b ${styles.headerBorder} ${styles.headerBg} rounded-t-2xl relative overflow-hidden`}>
        {/* Animated background glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${styles.gradient} shadow-xl group-hover:shadow-2xl transition-all duration-200`}>
            <TypeIcon className="h-6 w-6 text-white" />
          </div>
          {showTitle && (
            <div>
              <h2 className={`text-2xl font-black ${styles.headerText} mb-1`}>{title}</h2>
              <p className="text-sm opacity-80 font-medium">Top {stocks.length} performing stocks</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-8">
        {stocks.length > 0 ? (
          <>
            <div className="mb-6">
              <CSSBarChart stocks={stocks} type={type} />
            </div>
            
            {/* Top 3 List */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Top Performers
              </h3>
              {stocks.slice(0, 3).map((stock, index) => {
                const isPositive = (stock.change_percent != null && typeof stock.change_percent === 'number') 
                  ? stock.change_percent >= 0 : false;
                const changeColor = type === 'active' ? 'text-blue-600' : 
                  isPositive ? 'text-emerald-600' : 'text-red-600';

                return (
                  <div 
                    key={stock.id} 
                    className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-muted/40 dark:from-muted/30 to-muted/30 dark:to-muted/20 hover:from-muted/60 dark:hover:from-muted/50 hover:to-muted/50 dark:hover:to-muted/40 transition-all duration-200 group hover:shadow-lg cursor-pointer border border-border/50 dark:border-border/30 hover:border-border/70 dark:hover:border-border/50 touch-manipulation"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${stock.symbol}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-base transition-all duration-200 shadow-md ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 text-yellow-800 dark:text-yellow-300 group-hover:from-yellow-200 group-hover:to-amber-200 dark:group-hover:from-yellow-900/60 dark:group-hover:to-amber-900/60 group-hover:shadow-xl border border-yellow-200 dark:border-yellow-800/50' :
                        index === 1 ? 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/40 text-gray-700 dark:text-gray-300 group-hover:from-gray-200 group-hover:to-slate-200 dark:group-hover:from-gray-800/60 dark:group-hover:to-slate-800/60 group-hover:shadow-xl border border-gray-200 dark:border-gray-700/50' :
                        'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-700 dark:text-orange-300 group-hover:from-orange-200 group-hover:to-red-200 dark:group-hover:from-orange-900/60 dark:group-hover:to-red-900/60 group-hover:shadow-xl border border-orange-200 dark:border-orange-800/50'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-card-foreground group-hover:text-primary transition-colors text-base">
                          {stock.symbol}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-36 leading-tight">
                          {stock.company_name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right min-w-0 flex-shrink-0">
                      <div className="font-bold text-card-foreground tabular-nums text-base mb-1">
                        <StaticDisplay value={stock.current_price} prefix="$" decimals={2} />
                      </div>
                      <div className={`text-sm font-bold ${changeColor} tabular-nums`}>
                        {getDisplayValue(stock)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-2">
              <Activity className="h-12 w-12 mx-auto opacity-30" />
            </div>
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      {stocks.length > 3 && (
        <div className={`px-8 py-6 border-t ${styles.headerBorder} ${styles.headerBg} rounded-b-2xl relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-5 hover:opacity-10 transition-opacity duration-300`}></div>
          
          <button className={`relative z-10 text-sm font-bold ${styles.headerText} hover:opacity-80 transition-all duration-300 flex items-center gap-3 group px-4 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 min-h-[44px] touch-manipulation`}>
            <span>View all {stocks.length} stocks</span>
            <TrendingUp className="h-5 w-5 transition-all duration-200" />
          </button>
        </div>
      )}
    </div>
  );
}