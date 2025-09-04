'use client';

import { Stock } from '@/types/stock';
import { AnimatedCounter } from './ui/animated-counter';
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Shield } from 'lucide-react';

interface TechnicalIndicatorsProps {
  stocks: Stock[];
}

interface TechnicalAnalysis {
  symbol: string;
  rsi: number;
  movingAverage: number;
  volatility: number;
  momentum: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
}

export function TechnicalIndicators({ stocks }: TechnicalIndicatorsProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">No Technical Data</h2>
          <p className="text-muted-foreground">Technical indicators will be displayed when data is available.</p>
        </div>
      </div>
    );
  }

  // Calculate technical indicators (simplified calculations for demo)
  const calculateTechnicalAnalysis = (stock: Stock): TechnicalAnalysis => {
    // RSI calculation (simplified - using price change as proxy)
    const rsi = Math.max(0, Math.min(100, 50 + stock.change_percent * 2));
    
    // Moving average (using current price as reference)
    const movingAverage = stock.current_price * (1 + (Math.random() - 0.5) * 0.02);
    
    // Volatility based on change percentage
    const volatility = Math.abs(stock.change_percent);
    
    // Momentum based on volume and price change
    const momentum = (stock.volume / 1000000) * stock.change_percent;
    
    // Trend determination
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (stock.change_percent > 2) trend = 'bullish';
    else if (stock.change_percent < -2) trend = 'bearish';
    
    // Strength calculation
    let strength: 'strong' | 'moderate' | 'weak' = 'weak';
    if (Math.abs(stock.change_percent) > 5) strength = 'strong';
    else if (Math.abs(stock.change_percent) > 2) strength = 'moderate';
    
    return {
      symbol: stock.symbol,
      rsi,
      movingAverage,
      volatility,
      momentum,
      trend,
      strength
    };
  };

  const technicalData = stocks.slice(0, 10).map(calculateTechnicalAnalysis);
  
  // Market-wide technical summary
  const bullishStocks = technicalData.filter(t => t.trend === 'bullish').length;
  const bearishStocks = technicalData.filter(t => t.trend === 'bearish').length;
  const avgRSI = technicalData.reduce((sum, t) => sum + t.rsi, 0) / technicalData.length;
  const highVolatilityStocks = technicalData.filter(t => t.volatility > 3).length;

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-600'; // Overbought
    if (rsi < 30) return 'text-emerald-600'; // Oversold
    return 'text-yellow-600'; // Neutral
  };

  const getRSILabel = (rsi: number) => {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    return 'Neutral';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'bearish':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Summary */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-card-foreground">Technical Analysis Overview</h3>
            <p className="text-sm text-muted-foreground">Market-wide technical indicators and trends</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-muted-foreground">Bullish Trend</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              <AnimatedCounter value={bullishStocks} decimals={0} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Bearish Trend</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              <AnimatedCounter value={bearishStocks} decimals={0} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Avg RSI</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              <AnimatedCounter value={avgRSI} decimals={0} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">High Volatility</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              <AnimatedCounter value={highVolatilityStocks} decimals={0} />
            </div>
          </div>
        </div>
      </div>

      {/* Individual Stock Analysis */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-6">Stock Technical Indicators</h3>
        
        <div className="space-y-4">
          {technicalData.map((analysis, index) => (
            <div key={analysis.symbol} className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Stock Symbol */}
                <div className="flex items-center gap-3">
                  <div className="font-mono font-bold text-card-foreground">
                    {analysis.symbol}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrendColor(analysis.trend)}`}>
                    {analysis.trend}
                  </div>
                </div>

                {/* RSI */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">RSI</div>
                  <div className={`text-lg font-bold ${getRSIColor(analysis.rsi)}`}>
                    {analysis.rsi.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRSILabel(analysis.rsi)}
                  </div>
                </div>

                {/* Moving Average */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">MA</div>
                  <div className="text-lg font-bold text-card-foreground">
                    ${analysis.movingAverage.toFixed(2)}
                  </div>
                  <div className={`text-xs ${stocks[index]?.current_price > analysis.movingAverage ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stocks[index]?.current_price > analysis.movingAverage ? 'Above' : 'Below'}
                  </div>
                </div>

                {/* Volatility */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Volatility</div>
                  <div className={`text-lg font-bold ${
                    analysis.volatility > 3 ? 'text-red-600' : 
                    analysis.volatility > 1 ? 'text-yellow-600' : 'text-emerald-600'
                  }`}>
                    {analysis.volatility.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {analysis.volatility > 3 ? 'High' : analysis.volatility > 1 ? 'Medium' : 'Low'}
                  </div>
                </div>

                {/* Momentum */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Momentum</div>
                  <div className={`text-lg font-bold ${analysis.momentum > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {analysis.momentum > 0 ? '+' : ''}{analysis.momentum.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.abs(analysis.momentum) > 50 ? 'Strong' : 'Weak'}
                  </div>
                </div>

                {/* Trend Strength */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Strength</div>
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(analysis.trend)}
                    <span className={`text-sm font-medium ${
                      analysis.strength === 'strong' ? 'text-emerald-600' :
                      analysis.strength === 'moderate' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {analysis.strength}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Indicators Legend */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-4">
        <h4 className="font-semibold text-card-foreground mb-3">Technical Indicators Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">RSI (Relative Strength Index)</div>
              <div className="text-muted-foreground text-xs">
                &gt;70: Overbought, &lt;30: Oversold, 30-70: Neutral
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Moving Average</div>
              <div className="text-muted-foreground text-xs">
                Price above MA: Bullish, Below MA: Bearish
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Volatility</div>
              <div className="text-muted-foreground text-xs">
                Measures price movement intensity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}