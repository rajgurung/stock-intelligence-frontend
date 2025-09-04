'use client';

import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

interface MiniChartJSProps {
  currentPrice: number;
  changePercent: number;
  height?: number;
  color?: string;
}

// Generate mock historical data based on current price and change
const generateMockData = (currentPrice: number, changePercent: number): number[] => {
  if (!currentPrice || currentPrice <= 0 || !isFinite(currentPrice)) {
    return [];
  }
  
  const points = 24; // 24 data points for sparkline
  const data: number[] = [];
  const safeChangePercent = isFinite(changePercent) ? changePercent : 0;
  const startPrice = currentPrice - (currentPrice * safeChangePercent / 100);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% random variation
    const baseProgress = startPrice + (currentPrice - startPrice) * progress;
    const value = baseProgress * (1 + randomVariation);
    
    data.push(Math.max(value, currentPrice * 0.1)); // Ensure minimum value
  }
  
  return data;
};

export function MiniChartJS({ currentPrice, changePercent, height = 60, color }: MiniChartJSProps) {
  const chartRef = useRef<ChartJS<"line">>(null);
  
  // Generate mock data
  const mockData = generateMockData(currentPrice, changePercent);
  
  if (mockData.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-xs text-muted-foreground">No Chart Data</div>
        </div>
      </div>
    );
  }

  const isPositive = changePercent >= 0;
  const lineColor = color || (isPositive ? '#10b981' : '#ef4444');
  const gradientColor = color || (isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)');

  const data = {
    labels: Array.from({ length: mockData.length }, (_, i) => `${i}`),
    datasets: [
      {
        data: mockData,
        fill: true,
        borderColor: lineColor,
        backgroundColor: gradientColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    interaction: {
      intersect: false,
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div className="w-full" style={{ height }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}