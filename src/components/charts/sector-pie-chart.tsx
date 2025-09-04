'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Stock } from '@/types/stock';

interface SectorPieChartProps {
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

export function SectorPieChart({ stocks }: SectorPieChartProps) {
  // Early return if no stocks
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
      percentage: Math.round((count / stocks.length) * 100),
      color: SECTOR_COLORS[index % SECTOR_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  // Debug log
  console.log('Sector Chart Data:', chartData);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-sm">{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>Companies: {data.value}</div>
            <div>Percentage: {data.percentage}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        {payload.map((entry: any, index: number) => {
          const data = chartData[index];
          return (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-card-foreground truncate">{entry.value}</div>
                <div className="text-xs text-muted-foreground">
                  {data?.value || 0} stocks ({data?.percentage || 0}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for sectors < 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        className="drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/15 to-pink-500/20 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-purple-500/40 p-6 hover:shadow-purple-500/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/30 rounded-xl shadow-lg">
            <PieChartIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Market by Sector</h3>
            <p className="text-sm font-medium text-purple-300">Distribution across {chartData.length} sectors</p>
          </div>
        </div>
        <div className="text-center p-4 rounded-xl bg-purple-500/10 border-2 border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{stocks.length}</div>
          <div className="text-sm text-purple-300">Total Stocks</div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No sector data to display</p>
        </div>
      )}
    </div>
  );
}