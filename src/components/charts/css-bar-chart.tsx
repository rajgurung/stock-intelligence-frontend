'use client';

import { Stock } from '@/types/stock';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface CSSBarChartProps {
  stocks: Stock[];
  type: 'gainers' | 'losers' | 'active';
}

export function CSSBarChart({ stocks, type }: CSSBarChartProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No performance data available</p>
      </div>
    );
  }

  const getBarColor = () => {
    switch (type) {
      case 'gainers':
        return '#10b981';
      case 'losers':
        return '#ef4444';
      case 'active':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getDataValue = (stock: Stock) => {
    switch (type) {
      case 'gainers':
      case 'losers':
        return Math.abs(stock.change_percent);
      case 'active':
        return stock.volume;
      default:
        return stock.change_percent;
    }
  };

  const formatValue = (value: number, stock: Stock) => {
    if (type === 'active') {
      // Format volume
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toString();
    } else {
      // Format percentage - handle null/undefined values
      if (stock.change_percent == null || typeof stock.change_percent !== 'number') {
        return 'N/A';
      }
      return `${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%`;
    }
  };

  // Take only top 5 for better visualization
  const chartData = stocks.slice(0, 5);
  const maxValue = Math.max(...chartData.map(stock => getDataValue(stock)));
  const barColor = getBarColor();

  return (
    <div className="w-full h-48 flex flex-col justify-between">
      {chartData.map((stock, index) => {
        const value = getDataValue(stock);
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        return (
          <div key={stock.id} className="flex items-center gap-4 group py-1">
            {/* Stock Symbol */}
            <div className="w-12 text-right">
              <span className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors">
                {stock.symbol}
              </span>
            </div>
            
            {/* Bar Container */}
            <div className="flex-1 relative bg-muted/30 rounded-full h-6 overflow-hidden group-hover:shadow-md transition-all duration-300">
              {/* Animated Bar */}
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                style={{
                  backgroundColor: barColor,
                  width: `${percentage}%`,
                  animationDelay: `${index * 200}ms`
                }}
              >
                {percentage > 30 && (
                  <span className="text-xs font-semibold text-white">
                    {formatValue(value, stock)}
                  </span>
                )}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs font-medium shadow-lg">
                  <div>{stock.company_name}</div>
                  <div className="text-muted-foreground">
                    ${stock.current_price.toFixed(2)} • {formatValue(value, stock)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Value Display */}
            <div className="w-16 text-right">
              {percentage <= 30 && (
                <span className="text-xs font-medium" style={{ color: barColor }}>
                  {formatValue(value, stock)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Chart Title at bottom */}
      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground capitalize">
          Top {chartData.length} {type === 'active' ? 'by Volume' : 'Performers'}
        </span>
      </div>
    </div>
  );
}