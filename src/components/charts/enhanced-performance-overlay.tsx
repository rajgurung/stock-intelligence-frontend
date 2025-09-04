'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HistoricalPerformance } from '@/types/stock';
import { getHistoricalPerformance } from '@/lib/api';
import { TradingViewChart } from './tradingview-chart';
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  BarChart3, 
  Calendar,
  Activity,
  DollarSign,
  Info,
  Settings
} from 'lucide-react';

interface EnhancedPerformanceOverlayProps {
  symbol: string;
  currentPrice: number;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const TIME_PERIODS = [
  { key: '1d', label: '1D', name: '1 Day', days: 1 },
  { key: '5d', label: '5D', name: '5 Days', days: 5 },
  { key: '1m', label: '1M', name: '1 Month', days: 30 },
  { key: '6m', label: '6M', name: '6 Months', days: 180 },
  { key: 'ytd', label: 'YTD', name: 'Year to Date', days: null },
  { key: '1y', label: '1Y', name: '1 Year', days: 365 },
  { key: '5y', label: '5Y', name: '5 Years', days: 1825 },
  { key: 'max', label: 'MAX', name: 'All Time', days: 3650 },
] as const;

type TimePeriodKey = typeof TIME_PERIODS[number]['key'];

export function EnhancedPerformanceOverlay({ 
  symbol, 
  currentPrice,
  isVisible, 
  onClose, 
  position 
}: EnhancedPerformanceOverlayProps) {
  const [performance, setPerformance] = useState<HistoricalPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriodKey>('1m');

  // Calculate days for API
  const getApiDays = (period: TimePeriodKey): number => {
    const periodConfig = TIME_PERIODS.find(p => p.key === period);
    if (periodConfig?.days) return periodConfig.days;
    
    if (period === 'ytd') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    return 30; // fallback
  };

  // Fetch data when period changes
  useEffect(() => {
    if (!isVisible || !symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const days = getApiDays(selectedPeriod);
        console.log('🌐 EnhancedPerformanceOverlay: Fetching data', { symbol, days, selectedPeriod });
        const data = await getHistoricalPerformance(symbol, days);
        console.log('📡 EnhancedPerformanceOverlay: API response', {
          hasData: !!data,
          dataStructure: data ? Object.keys(data) : null,
          dataPointsLength: data?.data_points?.length || 0,
          samplePoint: data?.data_points?.[0]
        });
        setPerformance(data);
      } catch (err) {
        setError('Failed to load performance data');
        console.error('Error fetching performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, isVisible, selectedPeriod]);

  // ESC key handler
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const formatPerformance = (value: number | null | undefined) => {
    const safeValue = value ?? 0;
    const isPositive = safeValue >= 0;
    return {
      text: `${isPositive ? '+' : ''}${safeValue.toFixed(2)}%`,
      isPositive,
      color: isPositive ? 'text-emerald-600' : 'text-red-600',
      bgColor: isPositive 
        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20' 
        : 'bg-red-50 border-red-200 dark:bg-red-950/20',
    };
  };

  const performanceDisplay = formatPerformance(performance?.performance_metrics?.total_return);

  // Full-screen modal with modern design
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl max-h-screen mx-4 my-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Stock Info */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>${currentPrice.toFixed(2)}</span>
                <span className="text-gray-400">•</span>
                <Calendar className="w-4 h-4" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl border ${performanceDisplay.bgColor}`}>
              <div className="flex items-center gap-2">
                {performanceDisplay.isPositive ? (
                  <TrendingUp className={`w-4 h-4 ${performanceDisplay.color}`} />
                ) : (
                  <TrendingDown className={`w-4 h-4 ${performanceDisplay.color}`} />
                )}
                <span className={`font-semibold ${performanceDisplay.color}`}>
                  {performanceDisplay.text}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {TIME_PERIODS.find(p => p.key === selectedPeriod)?.name}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close chart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Activity className="w-4 h-4" />
              <span className="font-medium">Time Period</span>
            </div>
            <div className="flex gap-1">
              {TIME_PERIODS.map((period) => {
                const isSelected = selectedPeriod === period.key;
                return (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 p-6 overflow-auto">
          <TradingViewChart
            data={performance}
            selectedPeriod={selectedPeriod}
            symbol={symbol}
            loading={loading}
            error={error}
            className="w-full"
          />

          {/* Educational Info Panel */}
          {performance && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Data Quality Info */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Data Quality</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {performance.performance_metrics?.data_quality === 'real' 
                    ? 'Real market data from Alpha Vantage'
                    : 'Generated data for demonstration'
                  }
                </p>
              </div>

              {/* Price Range */}
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">Price Range</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {performance.data_points && performance.data_points.length > 0 ? (
                    <>
                      ${Math.min(...performance.data_points.map(d => d.price)).toFixed(2)} - 
                      ${Math.max(...performance.data_points.map(d => d.price)).toFixed(2)}
                    </>
                  ) : (
                    'No data available'
                  )}
                </p>
              </div>

              {/* Data Points */}
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900 dark:text-purple-100">Data Points</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {performance.count} data points over {performance.timeframe}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}