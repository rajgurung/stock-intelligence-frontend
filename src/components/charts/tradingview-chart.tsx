'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, SeriesType, ColorType, LineSeries, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { HistoricalPerformance } from '@/types/stock';

interface TradingViewChartProps {
  data: HistoricalPerformance | null;
  selectedPeriod: string;
  symbol: string;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

interface ChartData {
  time: string | number; // Unix timestamp number for intraday data, date string for daily data
  value: number;
  volume?: number;
}

interface CandlestickData {
  time: string | number; // Unix timestamp number for intraday data, date string for daily data
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function TradingViewChart({
  data,
  selectedPeriod,
  symbol,
  loading = false,
  error = null,
  className = ""
}: TradingViewChartProps) {
  
  // Debug props when component receives them
  useEffect(() => {
    console.log('🎛️ TradingViewChart props received:', {
      hasData: !!data,
      dataStructure: data ? Object.keys(data) : null,
      dataPoints: data?.data_points?.length || 0,
      selectedPeriod,
      symbol,
      loading,
      error,
      sampleDataPoint: data?.data_points?.[0]
    });
  }, [data, selectedPeriod, symbol, loading, error]);

  // Debug component lifecycle
  useEffect(() => {
    console.log('🚀 TradingViewChart: Component mounted');
    return () => {
      console.log('💀 TradingViewChart: Component unmounted');
    };
  }, []);

  // Debug container ref availability
  useEffect(() => {
    console.log('📦 TradingViewChart: Container ref status:', {
      containerExists: !!chartContainerRef.current,
      containerWidth: chartContainerRef.current?.clientWidth,
      containerHeight: chartContainerRef.current?.clientHeight
    });
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [showMovingAverages, setShowMovingAverages] = useState(false);

  // Calculate simple moving average
  const calculateSMA = useCallback((data: ChartData[], period: number) => {
    if (data.length < period) return [];
    
    const smaData: { time: string; value: number }[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, point) => acc + point.value, 0);
      const average = sum / period;
      smaData.push({
        time: data[i].time,
        value: average
      });
    }
    
    return smaData;
  }, []);

  const createChartInstance = useCallback(() => {
    if (!chartContainerRef.current) {
      console.log('❌ TradingView createChartInstance: No container ref');
      return;
    }

    console.log('🏗️ TradingView createChartInstance: Creating chart', {
      containerWidth: chartContainerRef.current.clientWidth,
      containerHeight: chartContainerRef.current.clientHeight,
      containerElement: !!chartContainerRef.current
    });

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333333',
        fontSize: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: {
          color: 'rgba(0, 0, 0, 0.05)',
          style: LineStyle.Solid,
        },
        horzLines: {
          color: 'rgba(0, 0, 0, 0.05)',
          style: LineStyle.Solid,
        },
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          width: 1,
          color: 'rgba(0, 0, 0, 0.3)',
          style: LineStyle.Solid,
        },
        horzLine: {
          width: 1,
          color: 'rgba(0, 0, 0, 0.3)',
          style: LineStyle.Solid,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.5)',
        borderVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.5)',
        borderVisible: true,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 10,
        barSpacing: 6,
        fixLeftEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        visible: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    return chart;
  }, []);

  const updateChart = useCallback(() => {
    console.log('🔧 TradingView updateChart called:', {
      hasData: !!data,
      hasDataPoints: data?.data_points?.length || 0,
      hasChart: !!chartRef.current,
      chartType,
      showMovingAverages,
      symbol
    });

    // Detailed debugging for early return conditions
    if (!data) {
      console.log('❌ TradingView updateChart early return - NO DATA provided');
      return;
    }
    if (!data.data_points) {
      console.log('❌ TradingView updateChart early return - NO DATA_POINTS in data:', data);
      return;
    }
    if (data.data_points.length === 0) {
      console.log('❌ TradingView updateChart early return - EMPTY DATA_POINTS array:', data.data_points);
      return;
    }
    if (!chartRef.current) {
      console.log('❌ TradingView updateChart early return - NO CHART INSTANCE. Chart initialization may have failed.');
      console.log('🔍 Debug: Container ref exists?', !!chartContainerRef.current);
      return;
    }

    console.log('✅ TradingView updateChart: All prerequisites met, proceeding with chart update');
    console.log('🔍 TradingView: Chart instance methods:', Object.keys(chartRef.current));

    // Clear existing series
    if (lineSeriesRef.current) {
      chartRef.current.removeSeries(lineSeriesRef.current);
      lineSeriesRef.current = null;
    }
    if (volumeSeriesRef.current) {
      chartRef.current.removeSeries(volumeSeriesRef.current);
      volumeSeriesRef.current = null;
    }
    if (sma20SeriesRef.current && chartRef.current) {
      try {
        chartRef.current.removeSeries(sma20SeriesRef.current);
      } catch (err) {
        console.warn('Error removing SMA20 series:', err);
      }
      sma20SeriesRef.current = null;
    }
    if (sma50SeriesRef.current && chartRef.current) {
      try {
        chartRef.current.removeSeries(sma50SeriesRef.current);
      } catch (err) {
        console.warn('Error removing SMA50 series:', err);
      }
      sma50SeriesRef.current = null;
    }

    // Convert data to TradingView format
    // TradingView expects Unix timestamps (numbers) for intraday data, date strings for daily data
    const chartData: ChartData[] = data.data_points.map((point, index) => {
      let timeValue: string | number;
      
      try {
        // If the date includes time (intraday data), convert to Unix timestamp
        if (point.date.includes(':')) {
          // Convert "2025-09-02 15:45:00" to Unix timestamp
          const date = new Date(point.date);
          if (isNaN(date.getTime())) {
            console.error(`❌ Invalid date format at index ${index}:`, point.date);
            throw new Error(`Invalid date: ${point.date}`);
          }
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          timeValue = unixTimestamp; // Use number for intraday data
          
          if (index === 0) {
            console.log('🕒 TradingView: Intraday time conversion example:', {
              original: point.date,
              timestamp: unixTimestamp,
              backToDate: new Date(unixTimestamp * 1000).toISOString()
            });
          }
        } else {
          // For daily data, use date string format "YYYY-MM-DD"
          // Validate the date format
          if (!/^\d{4}-\d{2}-\d{2}$/.test(point.date)) {
            console.error(`❌ Invalid daily date format at index ${index}:`, point.date);
          }
          timeValue = point.date;
          
          if (index === 0) {
            console.log('📅 TradingView: Daily date format example:', {
              original: point.date,
              formatted: timeValue
            });
          }
        }
      } catch (error) {
        console.error(`❌ Error processing date at index ${index}:`, error, point);
        // Fallback: use index as time (not ideal but prevents crash)
        timeValue = index;
      }
      
      return {
        time: timeValue,
        value: point.price,
        volume: point.volume || 0
      };
    });

    // Sort data by time (handle both Unix timestamps and date strings)
    chartData.sort((a, b) => {
      const aTime = typeof a.time === 'number' ? a.time * 1000 : new Date(a.time).getTime();
      const bTime = typeof b.time === 'number' ? b.time * 1000 : new Date(b.time).getTime();
      return aTime - bTime;
    });

    console.log('📊 TradingView chart data processed:', {
      originalDataPoints: data.data_points.length,
      chartDataLength: chartData.length,
      firstPoint: chartData[0],
      lastPoint: chartData[chartData.length - 1],
      firstOriginalDate: data.data_points[0]?.date,
      lastOriginalDate: data.data_points[data.data_points.length - 1]?.date,
      isIntradayData: data.data_points[0]?.date?.includes(':'),
      chartType,
      timeframe: data.timeframe,
      symbol: data.symbol
    });

    // Determine colors based on performance
    const totalReturn = data.performance_metrics?.total_return || 0;
    const isPositive = totalReturn >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444'; // emerald-500 : red-500
    const gradientTopColor = isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    const gradientBottomColor = isPositive ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)';

    if (chartType === 'line') {
      console.log('📈 TradingView: Creating line series', {
        lineColor,
        dataPointsToAdd: chartData.length,
        sampleDataPoint: chartData[0]
      });

      // Add line series for line chart (v5.x uses addSeries with LineSeries type)
      console.log('📈 TradingView: Available chart methods:', Object.getOwnPropertyNames(chartRef.current));
      const lineSeries = chartRef.current.addSeries(LineSeries, {
        color: lineColor,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: lineColor,
        crosshairMarkerBackgroundColor: '#ffffff',
        lastValueVisible: true,
        priceLineVisible: true,
        priceLineColor: lineColor,
        priceLineWidth: 1,
        priceLineStyle: LineStyle.Dotted,
      });

      lineSeriesRef.current = lineSeries;
      console.log('✅ TradingView: Line series created successfully');

      // Set line data - TradingView v5.x expects specific format
      const lineData = chartData.map(d => ({
        time: d.time,
        value: d.value
      }));
      
      console.log('📊 TradingView: Setting line data', {
        dataPoints: lineData.length,
        firstPoint: lineData[0],
        lastPoint: lineData[lineData.length - 1]
      });
      
      lineSeries.setData(lineData);
      console.log('✅ TradingView: Line data set successfully');
    } else if (chartType === 'candlestick') {
      // For candlestick charts, we need to generate OHLC data from our price points
      // Since we only have single price points, we'll create synthetic OHLC data
      const candlestickData: CandlestickData[] = chartData.map((point, index) => {
        const price = point.value;
        const prevPrice = index > 0 ? chartData[index - 1].value : price;
        
        // Create synthetic OHLC data with some variation
        const variation = Math.abs(price - prevPrice) * 0.5;
        const open = index === 0 ? price : prevPrice;
        const close = price;
        const high = Math.max(open, close) + (variation * 0.3);
        const low = Math.min(open, close) - (variation * 0.3);
        
        return {
          time: point.time,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: point.volume
        };
      });

      // Add candlestick series
      const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#10b981', // emerald-500
        downColor: '#ef4444', // red-500
        borderVisible: true,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
      });

      lineSeriesRef.current = candlestickSeries;

      // Set candlestick data
      candlestickSeries.setData(candlestickData.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      })));
    }

    // Add moving averages if enabled
    if (showMovingAverages && chartData.length >= 20) {
      // 20-day SMA (orange line)
      const sma20Data = calculateSMA(chartData, 20);
      if (sma20Data.length > 0) {
        const sma20Series = chartRef.current.addSeries(LineSeries, {
          color: '#f97316', // orange-500
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 3,
          crosshairMarkerBorderColor: '#f97316',
          crosshairMarkerBackgroundColor: '#ffffff',
          lastValueVisible: true,
          priceLineVisible: false,
        });
        sma20Series.setData(sma20Data);
        sma20SeriesRef.current = sma20Series;
      }

      // 50-day SMA if we have enough data (blue line)
      if (chartData.length >= 50) {
        const sma50Data = calculateSMA(chartData, 50);
        if (sma50Data.length > 0) {
          const sma50Series = chartRef.current.addSeries(LineSeries, {
            color: '#3b82f6', // blue-500
            lineWidth: 2,
            lineStyle: LineStyle.Solid,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: '#3b82f6',
            crosshairMarkerBackgroundColor: '#ffffff',
            lastValueVisible: true,
            priceLineVisible: false,
          });
          sma50Series.setData(sma50Data);
          sma50SeriesRef.current = sma50Series;
        }
      }
    }

    // Add volume series if we have volume data
    const hasVolumeData = chartData.some(d => d.volume && d.volume > 0);
    if (hasVolumeData) {
      const volumeSeries = chartRef.current.addSeries(HistogramSeries, {
        color: 'rgba(99, 102, 241, 0.3)', // indigo-500 with opacity
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
      volumeSeries.setData(chartData.map(d => ({
        time: d.time,
        value: d.volume || 0,
        color: 'rgba(99, 102, 241, 0.3)'
      })));
    }

    // Fit content to show all data
    console.log('📏 TradingView: Fitting chart content to display all data');
    chartRef.current.timeScale().fitContent();
    console.log('✅ TradingView: Chart content fitted successfully');

  }, [data, chartType, showMovingAverages, calculateSMA]);

  // Initialize chart when container becomes available
  useEffect(() => {
    console.log('🔄 TradingView: Attempting chart initialization');
    
    if (!chartContainerRef.current) {
      console.log('❌ TradingView: Container not available yet');
      return;
    }

    if (chartRef.current) {
      console.log('⚠️ TradingView: Chart already exists');
      return;
    }

    console.log('🏗️ TradingView: Creating chart instance');
    
    try {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#ffffff' },
          textColor: '#333333',
          fontSize: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        grid: {
          vertLines: {
            color: 'rgba(0, 0, 0, 0.05)',
            style: LineStyle.Solid,
          },
          horzLines: {
            color: 'rgba(0, 0, 0, 0.05)',
            style: LineStyle.Solid,
          },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: 'rgba(0, 0, 0, 0.3)',
            style: LineStyle.Solid,
          },
          horzLine: {
            width: 1,
            color: 'rgba(0, 0, 0, 0.3)',
            style: LineStyle.Solid,
          },
        },
        rightPriceScale: {
          visible: true,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        timeScale: {
          visible: true,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          rightOffset: 12,
          barSpacing: 3,
          fixLeftEdge: false,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          visible: true,
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });
      
      chartRef.current = chart;
      console.log('✅ TradingView: Chart created successfully');
      
      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        if (chart && chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      });

      resizeObserver.observe(chartContainerRef.current);
      
      // Clean up function
      return () => {
        console.log('🧹 TradingView: Cleaning up chart');
        resizeObserver.disconnect();
        if (chart) {
          chart.remove();
        }
        chartRef.current = null;
        lineSeriesRef.current = null;
        volumeSeriesRef.current = null;
        sma20SeriesRef.current = null;
        sma50SeriesRef.current = null;
      };
    } catch (error) {
      console.error('❌ TradingView: Error creating chart:', error);
    }
  });

  // Update chart when data changes
  useEffect(() => {
    updateChart();
  }, [updateChart]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-700 font-medium">Failed to load chart</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.data_points || data.data_points.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-yellow-50 rounded-lg border border-yellow-200 ${className}`}>
        <div className="text-center">
          <div className="text-yellow-600 mb-2">📊</div>
          <p className="text-yellow-800 font-medium">No data available</p>
          <p className="text-yellow-700 text-sm mt-1">
            No historical data found for {symbol} in the selected time period
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Chart Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setChartType('line')}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            chartType === 'line'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Line
        </button>
        <button
          onClick={() => setChartType('candlestick')}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            chartType === 'candlestick'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
          title="Switch to candlestick chart view"
        >
          Candles
        </button>
        <button
          onClick={() => setShowMovingAverages(!showMovingAverages)}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            showMovingAverages
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle moving averages (SMA 20, SMA 50)"
        >
          MA
        </button>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        className="w-full h-96 bg-white border border-gray-200 rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Chart Info */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="font-medium">{symbol}</span>
          <span className="ml-2">• {data.timeframe}</span>
          <span className="ml-2">• {data.count} data points</span>
          {showMovingAverages && (
            <span className="ml-2 text-xs">
              • <span className="text-orange-500 font-medium">SMA 20</span>
              {data.count >= 50 && <span>, <span className="text-blue-500 font-medium">SMA 50</span></span>}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className={`font-medium ${
            (data.performance_metrics?.total_return || 0) >= 0 
              ? 'text-emerald-600' 
              : 'text-red-600'
          }`}>
            {(data.performance_metrics?.total_return || 0) >= 0 ? '+' : ''}
            {(data.performance_metrics?.total_return || 0).toFixed(2)}%
          </div>
          <div className="text-xs text-gray-500">
            {data.performance_metrics?.data_quality === 'real' ? 'Real Data' : 'Generated'}
          </div>
        </div>
      </div>
    </div>
  );
}