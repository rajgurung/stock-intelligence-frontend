'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartJSMiniChartProps {
  data?: Array<{ value: number; time: number }>;
  isPositive: boolean;
  height?: number;
}

export function ChartJSMiniChart({ data, isPositive, height = 72 }: ChartJSMiniChartProps) {
  // If no data provided, show fallback
  if (!data || data.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-lg text-muted-foreground">📈</div>
          <div className="text-xs text-muted-foreground mt-1">Chart data unavailable</div>
        </div>
      </div>
    );
  }

  // Prepare data for Chart.js
  const chartData = {
    labels: data.map((_, index) => ''), // Empty labels for clean look
    datasets: [
      {
        label: 'Price',
        data: data.map(point => point.value),
        fill: true,
        backgroundColor: isPositive 
          ? 'rgba(16, 185, 129, 0.1)' // Emerald with transparency
          : 'rgba(239, 68, 68, 0.1)',  // Red with transparency
        borderColor: isPositive 
          ? 'rgb(16, 185, 129)'        // Emerald
          : 'rgb(239, 68, 68)',        // Red
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4, // Smooth curves
      },
    ],
  };

  // Chart.js options for mini sparkline style
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        display: false, // Hide x-axis for clean look
      },
      y: {
        display: false, // Hide y-axis for clean look
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
  };

  return (
    <div className="w-full" style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}