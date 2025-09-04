// Service for fetching mock stock chart data for educational purposes
import { useState, useEffect } from 'react';
import { getHistoricalPerformance } from '@/lib/api';
import { HistoricalPerformance } from '@/types/stock';

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface ChartData {
  value: number;
  time: number;
}

// Convert historical performance data to chart format
export const convertToChartData = (historicalData: HistoricalPerformance): ChartData[] => {
  if (!historicalData.data_points || historicalData.data_points.length === 0) {
    return [];
  }
  
  return historicalData.data_points.map(point => ({
    value: point.price,
    time: new Date(point.date).getTime(),
  }));
};

// Custom hook to fetch mock chart data for a stock
export const useStockChartData = (symbol: string, days: number = 30) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 StockChartService: Fetching mock data for', symbol, 'with', days, 'days');
        
        const historicalData = await getHistoricalPerformance(symbol, days);
        
        console.log('📊 StockChartService: Mock data response for', symbol, ':', {
          dataPointsLength: historicalData.data_points?.length || 0,
          symbol: historicalData.symbol,
          timeframe: historicalData.timeframe,
          totalReturn: historicalData.performance_metrics?.total_return,
          dataQuality: historicalData.performance_metrics?.data_quality,
          firstDataPoint: historicalData.data_points?.[0],
          lastDataPoint: historicalData.data_points?.[historicalData.data_points?.length - 1]
        });
        
        if (historicalData.data_points && historicalData.data_points.length > 0) {
          const chartData = convertToChartData(historicalData);
          console.log('📊 Converted chart data for', symbol, ':', {
            originalLength: historicalData.data_points.length,
            convertedLength: chartData.length,
            firstConverted: chartData[0],
            lastConverted: chartData[chartData.length - 1]
          });
          setData(chartData);
        } else {
          console.log('📊 No data points available for', symbol);
          setData([]); // Set empty array when no data available
        }
      } catch (err) {
        console.error('Error fetching chart data for', symbol, ':', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData([]); // Fall back to empty data
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, days]);

  return { data, loading, error };
};

// Synchronous function to fetch mock chart data (for use in components that can't use hooks)
export const fetchStockChartData = async (symbol: string, days: number = 30): Promise<ChartData[]> => {
  if (!symbol) return [];

  try {
    console.log('📊 fetchStockChartData: Getting mock data for', symbol, 'with', days, 'days');
    
    const historicalData = await getHistoricalPerformance(symbol, days);
    
    if (historicalData.data_points && historicalData.data_points.length > 0) {
      return convertToChartData(historicalData);
    } else {
      console.log('📊 No data points available for', symbol);
      return []; // Return empty array when no data available
    }
  } catch (err) {
    console.error('Error fetching chart data for', symbol, ':', err);
    return []; // Fall back to empty data
  }
};