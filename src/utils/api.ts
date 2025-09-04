// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  current_price?: number;
  change_percent?: number;
  daily_change?: number;
  volume?: number;
  sector?: string;
  in_watchlist?: boolean;
}

export interface MarketOverview {
  total_stocks: number;
  advancing_count: number;
  declining_count: number;
  unchanged_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const fetchStocks = async (): Promise<ApiResponse<Stock[]>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/stocks`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchMarketOverview = async (): Promise<ApiResponse<MarketOverview>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/market/overview`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchStockBySymbol = async (symbol: string): Promise<ApiResponse<Stock>> => {
  if (!symbol || symbol.trim().length === 0) {
    throw new Error('Symbol is required');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/stocks/${symbol.trim()}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};