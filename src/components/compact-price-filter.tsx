'use client';

import { DollarSign, TrendingUp, BarChart3, Filter } from 'lucide-react';

interface CompactPriceFilterProps {
  selectedRange: string | null;
  onRangeChange: (range: string | null) => void;
  rangeCounts?: Record<string, number>;
}

const PRICE_RANGES = [
  { label: 'All', value: null, icon: BarChart3 },
  { label: 'Under $10', value: 'Under $10', icon: DollarSign },
  { label: '$10-50', value: '$10-50', icon: TrendingUp },
  { label: '$50-100', value: '$50-100', icon: BarChart3 },
  { label: '$100+', value: '$100+', icon: Filter },
];

export function CompactPriceFilter({ 
  selectedRange, 
  onRangeChange, 
  rangeCounts = {} 
}: CompactPriceFilterProps) {
  const totalStocks = Object.values(rangeCounts).reduce((sum, count) => sum + count, 0) || 1;

  const getStockCount = (rangeValue: string | null) => {
    if (rangeValue === null) return totalStocks;
    return rangeCounts[rangeValue] || 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Filter Label */}
        <div className="flex items-center gap-3 sm:shrink-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-card-foreground">Filter by Price:</span>
        </div>
        
        {/* Filter Buttons - Responsive Grid */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-wrap flex-1">
          {PRICE_RANGES.map((range) => {
            const isSelected = selectedRange === range.value;
            const count = getStockCount(range.value);
            const RangeIcon = range.icon;

            return (
              <button
                key={range.value || 'all'}
                onClick={() => onRangeChange(range.value)}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-200 min-w-0 sm:min-w-fit
                  ${isSelected 
                    ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500/30' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-card-foreground hover:shadow-sm'
                  }
                `}
              >
                <RangeIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{range.label}</span>
                {count > 0 && (
                  <span className={`
                    px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0
                    ${isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-500/10 text-blue-600'
                    }
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}