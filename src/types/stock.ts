export interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  current_price: number;
  daily_change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  price_range: string;
  exchange: string;
  last_updated: string;
}

export interface HistoricalPerformance {
  symbol: string;
  timeframe: string;
  count: number;
  data_points: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  performance_metrics: {
    total_return: number;
    data_quality: string;
  };
  // Legacy percentage fields (for backward compatibility if needed)
  "1d"?: number;
  "5d"?: number;
  "1m"?: number;
  "6m"?: number;
  ytd?: number;
  "1y"?: number;
  "5y"?: number;
  max?: number;
}

export interface StockPerformance {
  top_gainers: Stock[];
  top_losers: Stock[];
  most_active: Stock[];
}

export interface MarketOverview {
  total_stocks: number;
  advancing_count: number;
  declining_count: number;
  unchanged_count: number;
  avg_change: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}