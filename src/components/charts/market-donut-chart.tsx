'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MarketOverview } from '@/types/stock';

interface MarketDonutChartProps {
  data: MarketOverview;
}

export function MarketDonutChart({ data }: MarketDonutChartProps) {
  const chartData = [
    {
      name: 'Advancing',
      value: data.advancing_count,
      percentage: Math.round((data.advancing_count / data.total_stocks) * 100),
      color: '#10b981'
    },
    {
      name: 'Declining', 
      value: data.declining_count,
      percentage: Math.round((data.declining_count / data.total_stocks) * 100),
      color: '#ef4444'
    },
    {
      name: 'Unchanged',
      value: data.unchanged_count,
      percentage: Math.round((data.unchanged_count / data.total_stocks) * 100),
      color: '#6b7280'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm font-medium">{data.name}</span>
          </div>
          <div className="mt-1 space-y-1">
            <div className="text-sm">Count: {data.value}</div>
            <div className="text-sm">Percentage: {data.percentage}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
            <span className="text-xs text-muted-foreground">
              ({chartData[index]?.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
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
      
      {/* Center text showing total */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{data.total_stocks}</div>
          <div className="text-sm text-muted-foreground">Total Stocks</div>
        </div>
      </div>
    </div>
  );
}