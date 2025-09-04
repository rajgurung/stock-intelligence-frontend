'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniPriceChartProps {
  data?: Array<{ value: number; time: number }>;
  isPositive: boolean;
  height?: number;
  color?: string;
}

// Generate mock historical data based on current price and change
const generateMockData = (currentPrice: number, changePercent: number): Array<{ value: number; time: number }> => {
  // Validate input data
  if (!currentPrice || currentPrice <= 0 || !isFinite(currentPrice)) {
    return [];
  }
  
  const points = 24; // 24 data points for sparkline
  const data: Array<{ value: number; time: number }> = [];
  const safeChangePercent = isFinite(changePercent) ? changePercent : 0;
  const startPrice = currentPrice - (currentPrice * safeChangePercent / 100);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% random variation
    const baseProgress = startPrice + (currentPrice - startPrice) * progress;
    const value = baseProgress * (1 + randomVariation);
    
    data.push({
      value: Math.max(value, currentPrice * 0.1), // Ensure minimum value
      time: Date.now() - (points - i) * 3600000 // Hourly intervals
    });
  }
  
  return data;
};

export function MiniPriceChart({ data, isPositive, height = 60, color }: MiniPriceChartProps) {
  // If no data provided, show a better fallback
  if (!data || data.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-orange-50 dark:bg-orange-950/20 rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-lg text-orange-500 font-bold">🧡</div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">ORANGE FALLBACK - No Chart Data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color || (isPositive ? '#10b981' : '#ef4444')}
            strokeWidth={3}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Export the data generator for use in components
export { generateMockData };