'use client';

import { BarChart3, Filter, DollarSign, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface PriceRangeFilterProps {
  selectedRange: string | null;
  onRangeChange: (range: string | null) => void;
  rangeCounts?: Record<string, number>;
}

const PRICE_RANGES = [
  { label: 'Under $10', value: 'Under $10', color: 'bg-blue-500', icon: DollarSign },
  { label: '$10-50', value: '$10-50', color: 'bg-emerald-500', icon: TrendingUp },
  { label: '$50-100', value: '$50-100', color: 'bg-amber-500', icon: BarChart3 },
  { label: '$100+', value: '$100+', color: 'bg-purple-500', icon: Filter },
];

export function PriceRangeFilter({ 
  selectedRange, 
  onRangeChange, 
  rangeCounts = {} 
}: PriceRangeFilterProps) {
  const totalStocks = Object.values(rangeCounts).reduce((sum, count) => sum + count, 0) || 1;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6 animate-slide-up">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Price Filter</h3>
          <p className="text-sm text-muted-foreground">Browse by price range</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* All Stocks Button */}
        <button
          onClick={() => onRangeChange(null)}
          className={`group w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
            selectedRange === null
              ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50 shadow-lg'
              : 'bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-border/80 hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                selectedRange === null ? 'bg-blue-500 shadow-lg' : 'bg-muted-foreground/20'
              } transition-all duration-300`}>
                <BarChart3 className={`h-4 w-4 ${
                  selectedRange === null ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
              <span className={`font-semibold ${
                selectedRange === null ? 'text-blue-700 dark:text-blue-300' : 'text-card-foreground'
              }`}>
                All Stocks
              </span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold tabular-nums ${
                selectedRange === null ? 'text-blue-700 dark:text-blue-300' : 'text-card-foreground'
              }`}>
                <AnimatedCounter value={totalStocks} decimals={0} />
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </button>

        {/* Price Range Buttons */}
        {PRICE_RANGES.map((range) => {
          const count = rangeCounts[range.value] || 0;
          const percentage = Math.round((count / totalStocks) * 100);
          const isSelected = selectedRange === range.value;
          const RangeIcon = range.icon;

          return (
            <button
              key={range.value}
              onClick={() => onRangeChange(range.value)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/50 shadow-lg'
                  : 'bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-border/80 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${range.color} ${
                    isSelected ? 'shadow-lg scale-110' : 'opacity-70 group-hover:opacity-100'
                  } transition-all duration-300`}>
                    <RangeIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className={`font-semibold ${
                      isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-card-foreground'
                    }`}>
                      {range.label}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {percentage}% of market
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold tabular-nums ${
                    isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-card-foreground'
                  }`}>
                    <AnimatedCounter value={count} decimals={0} />
                  </div>
                  <div className="text-xs text-muted-foreground">Stocks</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Market Statistics Chart */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <h4 className="text-sm font-bold text-card-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Price Distribution
        </h4>
        <div className="space-y-4">
          {PRICE_RANGES.map((range) => {
            const count = rangeCounts[range.value] || 0;
            const percentage = Math.round((count / totalStocks) * 100);
            const RangeIcon = range.icon;

            return (
              <div key={`stat-${range.value}`} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <RangeIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-card-foreground font-medium">{range.label}</span>
                  </div>
                  <span className="text-sm font-bold text-card-foreground tabular-nums">{percentage}%</span>
                </div>
                <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${range.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ 
                      width: `${percentage}%`,
                      animationDelay: `${PRICE_RANGES.indexOf(range) * 200}ms`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}