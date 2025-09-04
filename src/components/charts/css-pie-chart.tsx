'use client';

import { useState } from 'react';
import { Stock } from '@/types/stock';

interface CSSPieChartProps {
  stocks: Stock[];
}

const SECTOR_COLORS = [
  '#10b981', // Technology - Emerald
  '#3b82f6', // Financial Services - Blue  
  '#ef4444', // Healthcare - Red
  '#f59e0b', // Consumer Discretionary - Amber
  '#8b5cf6', // Consumer Staples - Purple
  '#06b6d4', // Communication Services - Cyan
  '#84cc16', // Energy - Lime
  '#f97316', // Industrials - Orange
  '#ec4899', // Materials - Pink
  '#6b7280', // Others - Gray
];

export function CSSPieChart({ stocks }: CSSPieChartProps) {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-card-foreground">Market by Sector</h3>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No sector data to display</p>
        </div>
      </div>
    );
  }

  // Calculate sector distribution
  const sectorCount = stocks.reduce((acc, stock) => {
    const sector = stock.sector || 'Other';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sectorCount)
    .map(([sector, count], index) => ({
      name: sector,
      value: count,
      percentage: (count / stocks.length) * 100,
      color: SECTOR_COLORS[index % SECTOR_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate cumulative percentages for conic-gradient
  let cumulativePercentage = 0;
  const gradientStops = chartData.map((item, index) => {
    const start = cumulativePercentage;
    cumulativePercentage += item.percentage;
    const end = cumulativePercentage;
    
    if (index === chartData.length - 1) {
      // Last slice should go to 100%
      return `${item.color} ${start}% 100%`;
    }
    
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-border/50 p-8 group hover:shadow-3xl transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-card-foreground mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            Market by Sector
          </h3>
          <p className="text-sm text-muted-foreground font-medium">Distribution across {chartData.length} sectors</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-muted/30 to-muted/20 rounded-xl border border-border/30 group-hover:shadow-lg transition-all duration-300">
          <div className="text-3xl font-black text-card-foreground group-hover:scale-110 transition-transform duration-300">{stocks.length}</div>
          <div className="text-sm text-muted-foreground font-semibold">Total Stocks</div>
        </div>
      </div>

      <div className="h-80 flex items-center justify-center mb-8">
        {/* Enhanced CSS Pie Chart */}
        <div className="relative group-hover:scale-105 transition-transform duration-500">
          <div 
            className="w-64 h-64 rounded-full shadow-2xl group-hover:shadow-3xl transition-shadow duration-500 border-4 border-white/20 dark:border-black/20"
            style={{
              background: `conic-gradient(from 0deg, ${gradientStops})`
            }}
          />
          {/* Enhanced center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-gradient-to-br from-card to-card/90 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/30 dark:border-black/30 group-hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-black text-card-foreground mb-1">{chartData.length}</div>
                <div className="text-xs text-muted-foreground font-semibold">Sectors</div>
              </div>
            </div>
          </div>
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {chartData.map((entry, index) => (
          <div 
            key={index} 
            className="relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/20 hover:from-muted/50 hover:to-muted/40 transition-all duration-300 cursor-pointer group border border-border/30 hover:border-border/50 hover:shadow-lg hover:scale-105 touch-manipulation"
            onMouseEnter={() => setHoveredSector(entry.name)}
            onMouseLeave={() => setHoveredSector(null)}
            title={`${entry.name}: ${entry.value} stocks (${Math.round(entry.percentage)}%)`}
            role="button"
            tabIndex={0}
          >
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg shadow-md" 
              style={{ backgroundColor: entry.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-card-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {entry.name}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {entry.value} stocks ({Math.round(entry.percentage)}%)
              </div>
            </div>
            
            {/* Hover tooltip */}
            {hoveredSector === entry.name && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-3 min-w-max">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-semibold text-sm">{entry.name}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>Companies: {entry.value}</div>
                  <div>Percentage: {Math.round(entry.percentage)}%</div>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-card/95"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}