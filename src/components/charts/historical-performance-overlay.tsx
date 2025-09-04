'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HistoricalPerformance } from '@/types/stock';
import { getHistoricalPerformance } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, X, BarChart3 } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalPerformanceOverlayProps {
  symbol: string;
  currentPrice: number;
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const TIME_PERIODS = [
  { key: '1d', label: '1D', name: '1 Day' },
  { key: '5d', label: '5D', name: '5 Days' },
  { key: '1m', label: '1M', name: '1 Month' },
  { key: '6m', label: '6M', name: '6 Months' },
  { key: 'ytd', label: 'YTD', name: 'Year to Date' },
  { key: '1y', label: '1Y', name: '1 Year' },
  { key: '5y', label: '5Y', name: '5 Years' },
  { key: 'max', label: 'MAX', name: 'All Time' },
] as const;

type TimePeriodKey = typeof TIME_PERIODS[number]['key'];

export function HistoricalPerformanceOverlay({ 
  symbol, 
  currentPrice,
  isVisible, 
  onClose, 
  position 
}: HistoricalPerformanceOverlayProps) {
  const [performance, setPerformance] = useState<HistoricalPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriodKey>('1d');

  // Map time periods to days for API
  const getApiDays = (period: TimePeriodKey): number => {
    switch (period) {
      case '1d': return 1;
      case '5d': return 5;
      case '1m': return 30;
      case '6m': return 180;
      case 'ytd': 
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      case '1y': return 365;
      case '5y': return 1825; // 5 * 365
      case 'max': return 3650; // 10 years max
      default: return 30;
    }
  };

  useEffect(() => {
    if (!isVisible || !symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const days = getApiDays(selectedPeriod);
        const data = await getHistoricalPerformance(symbol, days);
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

  // Add ESC key listener
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const formatPercentage = (value: number | undefined | null) => {
    const safeValue = value ?? 0;
    const isPositive = safeValue >= 0;
    return {
      text: `${isPositive ? '+' : ''}${safeValue.toFixed(2)}%`,
      isPositive,
      color: isPositive ? 'text-emerald-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-red-50 dark:bg-red-950/20',
    };
  };

  // Process real chart data from API
  const getChartData = () => {
    if (!performance || !performance.data_points || performance.data_points.length === 0) {
      return [];
    }

    // Format dates based on time period for better display
    const formatDateForPeriod = (dateStr: string, period: TimePeriodKey) => {
      const date = new Date(dateStr);
      
      switch (period) {
        case '1d':
          // For single day, show time (if we had intraday data)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case '5d':
          // Show day abbreviation
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case '1m':
          // Show month and day
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case '6m':
        case 'ytd':
        case '1y':
          // Show month and day, or just month for longer periods
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case '5y':
        case 'max':
          // Show year and month
          return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        default:
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    const chartData = performance.data_points.map(point => ({
      date: formatDateForPeriod(point.date, selectedPeriod),
      price: point.price,
      volume: point.volume
    }));

    console.log('📊 Real Chart Data:', {
      symbol: performance.symbol,
      period: selectedPeriod,
      timeframe: performance.timeframe,
      points: chartData.length,
      startPrice: chartData[0]?.price,
      endPrice: chartData[chartData.length - 1]?.price,
      totalReturn: performance.performance_metrics.total_return,
      dataQuality: performance.performance_metrics.data_quality,
      priceRange: `$${Math.min(...chartData.map(d => d.price)).toFixed(2)} - $${Math.max(...chartData.map(d => d.price)).toFixed(2)}`,
      sampleData: chartData.slice(0, 3) // Show first 3 data points
    });

    return chartData;
  };

  const chartData = getChartData();
  const selectedValue = performance ? performance.performance_metrics.total_return : 0;
  const selectedFormatted = formatPercentage(selectedValue);

  // Create the full-screen modal content - COMPLETELY FIXED LAYOUT
  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999]" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Fixed Header */}
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            padding: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <BarChart3 style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: 0
            }}>
              {symbol}
            </h2>
            <p style={{ 
              color: '#6b7280', 
              margin: 0,
              fontSize: '14px'
            }}>
              Stock Price Chart
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* ESC Key Guide */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <span style={{
              padding: '4px 8px',
              background: '#1f2937',
              color: 'white',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              ESC
            </span>
            <span>to close</span>
          </div>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb, #d1d5db)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>
      </div>

      {/* Fixed Layout Container */}
      <div 
        style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Time Period Selector - Always visible */}
        <div style={{
          marginTop: '32px',
          marginBottom: '32px',
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#64748b',
              marginRight: '16px',
              letterSpacing: '0.025em'
            }}>
              Period
            </span>
            {TIME_PERIODS.map((period) => {
              const isSelected = selectedPeriod === period.key;
              return (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  style={{
                    padding: '8px 16px',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(203, 213, 225, 0.5)',
                    borderRadius: '8px',
                    background: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.6)',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontWeight: isSelected ? '600' : '500',
                    cursor: 'pointer',
                    fontSize: '13px',
                    minWidth: '45px',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                      e.currentTarget.style.color = '#3b82f6';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  {period.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Container - Takes remaining space */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // Important for flex child to shrink
          overflow: 'hidden'
        }}>
          {/* Chart Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(241, 245, 249, 0.6)',
            background: 'rgba(248, 250, 252, 0.3)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {symbol}
              </h3>
              <div style={{
                fontSize: '13px',
                color: '#94a3b8'
              }}>
                {TIME_PERIODS.find(p => p.key === selectedPeriod)?.name}
              </div>
            </div>
          </div>

          {/* Chart Area - Chart.js Implementation */}
          <div style={{ 
            flex: 1, 
            padding: '20px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: 0
          }}>
            {loading ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Loading Chart Data...
                </div>
                <div style={{ fontSize: '14px' }}>
                  Preparing {selectedPeriod === '1d' ? 'intraday' : TIME_PERIODS.find(p => p.key === selectedPeriod)?.name} data for {symbol}
                </div>
              </div>
            ) : error ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#ef4444'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Unable to Load Chart Data
                </div>
                <div style={{ fontSize: '14px' }}>
                  {error}
                </div>
              </div>
            ) : chartData && chartData.length > 0 ? (
              <div style={{ 
                width: '100%', 
                height: '100%',
                maxWidth: '1200px',
                maxHeight: '500px',
                minHeight: '400px'
              }}>
                <Line
                  data={{
                    labels: chartData.map(d => d.date),
                    datasets: [
                      {
                        label: `${symbol} Stock Price`,
                        data: chartData.map(d => d.price),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        borderWidth: 4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointHoverBackgroundColor: '#1d4ed8',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        cubicInterpolationMode: 'monotone'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      intersect: false,
                      mode: 'index'
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: `${symbol} - ${TIME_PERIODS.find(p => p.key === selectedPeriod)?.name} Price Chart`,
                        font: {
                          size: 16,
                          weight: 'bold'
                        },
                        color: '#1f2937',
                        padding: {
                          top: 10,
                          bottom: 20
                        }
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#1f2937',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            return `Price: $${context.parsed.y.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        display: true,
                        position: 'bottom' as const,
                        title: {
                          display: true,
                          text: 'Date / Time',
                          font: {
                            size: 14,
                            weight: 'bold'
                          },
                          color: '#1f2937',
                          padding: {
                            top: 15
                          }
                        },
                        ticks: {
                          color: '#1f2937',
                          font: {
                            size: 12,
                            weight: '600'
                          },
                          maxRotation: selectedPeriod === '1y' ? 45 : 0,
                          padding: 8
                        },
                        grid: {
                          color: '#f1f5f9',
                          drawOnChartArea: true,
                          lineWidth: 1
                        }
                      },
                      y: {
                        display: true,
                        position: 'left' as const,
                        title: {
                          display: true,
                          text: 'Stock Price ($)',
                          font: {
                            size: 14,
                            weight: 'bold'
                          },
                          color: '#1f2937',
                          padding: {
                            bottom: 15
                          }
                        },
                        ticks: {
                          color: '#1f2937',
                          font: {
                            size: 12,
                            weight: '600'
                          },
                          callback: function(value) {
                            return '$' + Number(value).toFixed(0);
                          },
                          padding: 8
                        },
                        grid: {
                          color: '#f1f5f9',
                          drawOnChartArea: true,
                          lineWidth: 1
                        }
                      }
                    },
                    layout: {
                      padding: {
                        top: 20,
                        right: 30,
                        bottom: 50,
                        left: 30
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  No Chart Data Available
                </div>
                <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Unable to generate {selectedPeriod === '1d' ? 'intraday' : TIME_PERIODS.find(p => p.key === selectedPeriod)?.name} chart data for {symbol}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Try Reloading
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: 'rgba(248, 250, 252, 0.5)',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid rgba(226, 232, 240, 0.4)',
          boxShadow: 'none'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                background: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedValue >= 0 ? (
                  <TrendingUp style={{ width: '16px', height: '16px', color: 'white' }} />
                ) : (
                  <TrendingDown style={{ width: '16px', height: '16px', color: 'white' }} />
                )}
              </div>
              <div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: selectedValue >= 0 ? '#059669' : '#dc2626'
                }}>
                  {selectedFormatted.text}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {TIME_PERIODS.find(p => p.key === selectedPeriod)?.name} Return
                </div>
              </div>
            </div>
            
            <div style={{
              width: '1px',
              height: '40px',
              background: '#cbd5e1'
            }} />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#1f2937'
              }}>
                ${chartData[chartData.length - 1]?.price.toFixed(2) || currentPrice.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Current Price
              </div>
            </div>
            
            <div style={{
              width: '1px',
              height: '40px',
              background: '#cbd5e1'
            }} />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#1f2937'
              }}>
                {chartData.length > 0 ? 
                  `$${Math.min(...chartData.map(d => d.price)).toFixed(2)} - $${Math.max(...chartData.map(d => d.price)).toFixed(2)}` :
                  'No Data'
                }
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Range
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render using portal to break out of parent containers completely
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return null;
}