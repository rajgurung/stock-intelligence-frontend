'use client';

import { MarketOverview as MarketOverviewType } from '@/types/stock';
import { MarketDonutChart } from '@/components/charts/market-donut-chart';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  BarChart3, 
  Globe,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MarketOverviewProps {
  data: MarketOverviewType;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const getMarketSentiment = () => {
    if (data.avg_change > 1) return { 
      label: 'Strong Bull Market', 
      color: 'text-bull', 
      bg: 'bg-bull/10',
      border: 'border-bull/30',
      icon: TrendingUp,
      gradient: 'from-bull to-green-600',
      intensity: 'high'
    };
    if (data.avg_change > 0) return { 
      label: 'Bull Market', 
      color: 'text-bull', 
      bg: 'bg-bull/5',
      border: 'border-bull/20',
      icon: TrendingUp,
      gradient: 'from-bull/80 to-green-500',
      intensity: 'medium'
    };
    if (data.avg_change < -1) return { 
      label: 'Strong Bear Market', 
      color: 'text-bear', 
      bg: 'bg-bear/10',
      border: 'border-bear/30',
      icon: TrendingDown,
      gradient: 'from-bear to-red-600',
      intensity: 'high'
    };
    if (data.avg_change < 0) return { 
      label: 'Bear Market', 
      color: 'text-bear', 
      bg: 'bg-bear/5',
      border: 'border-bear/20',
      icon: TrendingDown,
      gradient: 'from-bear/80 to-red-500',
      intensity: 'medium'
    };
    return { 
      label: 'Neutral Market', 
      color: 'text-gray-500', 
      bg: 'bg-gray-500/5',
      border: 'border-gray-500/20',
      icon: Minus,
      gradient: 'from-gray-500/80 to-slate-500',
      intensity: 'low'
    };
  };

  const sentiment = getMarketSentiment();
  const advancingPercentage = Math.round((data.advancing_count / data.total_stocks) * 100);
  const decliningPercentage = Math.round((data.declining_count / data.total_stocks) * 100);
  const unchangedPercentage = Math.round((data.unchanged_count / data.total_stocks) * 100);
  
  const SentimentIcon = sentiment.icon;
  const marketHealth = advancingPercentage >= 60 ? 'Healthy' : advancingPercentage >= 40 ? 'Mixed' : 'Weak';

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 animate-gradient-x" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${sentiment.gradient} shadow-lg`}>
                <Activity className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">Market Overview</h2>
                <div className={`px-2 py-1 rounded-md text-xs font-bold ${sentiment.bg} ${sentiment.color} ${sentiment.border} border`}>
                  LIVE
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Global Markets</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`px-6 py-3 rounded-xl ${sentiment.bg} ${sentiment.border} border backdrop-blur-sm`}>
            <div className="flex items-center gap-2">
              <SentimentIcon className={`h-5 w-5 ${sentiment.color}`} />
              <div className="text-right">
                <div className={`text-sm font-bold ${sentiment.color}`}>{sentiment.label}</div>
                <div className="text-xs text-gray-400">{marketHealth} Conditions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Market Metrics Cards */}
          <div className="xl:col-span-2 space-y-4">
            
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Stocks */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums mb-1">
                  <AnimatedCounter value={data.total_stocks} decimals={0} />
                </div>
                <div className="text-xs text-gray-400 font-medium">Total Stocks</div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Average Change */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${data.avg_change >= 0 ? 'bg-bull/20' : 'bg-bear/20'}`}>
                    {data.avg_change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-bull" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-bear" />
                    )}
                  </div>
                  {data.avg_change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className={`text-2xl font-bold tabular-nums mb-1 ${data.avg_change >= 0 ? 'text-bull' : 'text-bear'}`}>
                  <AnimatedCounter 
                    value={data.avg_change} 
                    prefix={data.avg_change >= 0 ? '+' : ''} 
                    suffix="%" 
                    decimals={2} 
                  />
                </div>
                <div className="text-xs text-gray-400 font-medium">Average Change</div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${
                    data.avg_change >= 0 
                      ? 'bg-gradient-to-r from-bull to-green-400' 
                      : 'bg-gradient-to-r from-bear to-red-400'
                  }`} style={{ width: `${Math.min(Math.abs(data.avg_change * 10), 100)}%` }} />
                </div>
              </div>

              {/* Market Health */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    marketHealth === 'Healthy' ? 'bg-green-500/20' : 
                    marketHealth === 'Mixed' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    <Zap className={`w-4 h-4 ${
                      marketHealth === 'Healthy' ? 'text-green-400' : 
                      marketHealth === 'Mixed' ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className={`text-2xl font-bold tabular-nums mb-1 ${
                  marketHealth === 'Healthy' ? 'text-green-400' : 
                  marketHealth === 'Mixed' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {advancingPercentage}%
                </div>
                <div className="text-xs text-gray-400 font-medium">Bulls vs Bears</div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      marketHealth === 'Healthy' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
                      marketHealth === 'Mixed' ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                      'bg-gradient-to-r from-red-500 to-rose-400'
                    }`}
                    style={{ width: `${advancingPercentage}%` }}
                  />
                </div>
              </div>

              {/* Market Momentum */}
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums mb-1">
                  <AnimatedCounter value={Math.abs(data.avg_change) * 10} decimals={1} />
                </div>
                <div className="text-xs text-gray-400 font-medium">Volatility Index</div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" 
                    style={{ width: `${Math.min(Math.abs(data.avg_change) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Market Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Market Distribution</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Real-time Analysis
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Advancing Stocks */}
                <div className="group relative overflow-hidden bg-gradient-to-r from-bull/10 to-transparent border border-bull/20 rounded-xl p-4 hover:from-bull/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-bull/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-bull" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">Advancing</span>
                          <span className="px-2 py-1 bg-bull/20 text-bull text-xs font-bold rounded-md">
                            +{advancingPercentage}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">{data.advancing_count} stocks moving higher</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-bull tabular-nums">
                        <AnimatedCounter value={data.advancing_count} decimals={0} />
                      </div>
                      <div className="text-xs text-gray-400">Securities</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-bull rounded-full transition-all duration-1000" 
                       style={{ width: `${advancingPercentage}%` }} />
                </div>

                {/* Declining Stocks */}
                <div className="group relative overflow-hidden bg-gradient-to-r from-bear/10 to-transparent border border-bear/20 rounded-xl p-4 hover:from-bear/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-bear/20 rounded-lg">
                        <TrendingDown className="h-5 w-5 text-bear" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">Declining</span>
                          <span className="px-2 py-1 bg-bear/20 text-bear text-xs font-bold rounded-md">
                            -{decliningPercentage}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">{data.declining_count} stocks moving lower</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-bear tabular-nums">
                        <AnimatedCounter value={data.declining_count} decimals={0} />
                      </div>
                      <div className="text-xs text-gray-400">Securities</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-bear rounded-full transition-all duration-1000" 
                       style={{ width: `${decliningPercentage}%` }} />
                </div>

                {/* Unchanged Stocks */}
                <div className="group relative overflow-hidden bg-gradient-to-r from-gray-500/10 to-transparent border border-gray-500/20 rounded-xl p-4 hover:from-gray-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-500/20 rounded-lg">
                        <Minus className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">Unchanged</span>
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded-md">
                            {unchangedPercentage}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">{data.unchanged_count} stocks holding steady</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-400 tabular-nums">
                        <AnimatedCounter value={data.unchanged_count} decimals={0} />
                      </div>
                      <div className="text-xs text-gray-400">Securities</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gray-500 rounded-full transition-all duration-1000" 
                       style={{ width: `${unchangedPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chart Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Market Composition</h3>
              <div className="text-sm text-gray-400">Distribution of price movements</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <MarketDonutChart data={data} />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <div className="w-3 h-3 bg-bull rounded-full mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Bulls</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-bear rounded-full mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Bears</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Neutral</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-2 w-2 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 h-2 w-2 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-medium text-green-400">LIVE</span>
              </div>
              <div className="text-sm text-gray-400">Market data streaming</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">Last update: {new Date().toLocaleTimeString()}</div>
              <div className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-400 tabular-nums">
                {data.total_stocks} Assets Tracked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}