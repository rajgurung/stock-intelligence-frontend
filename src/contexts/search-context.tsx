'use client';

import React, { createContext, useContext, useState } from 'react';
import { Stock } from '@/types/stock';
import { FilterOptions } from '@/components/search/advanced-filters';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  selectedStock: Stock | null;
  setSelectedStock: (stock: Stock | null) => void;
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (stockId: number) => void;
  isInWatchlist: (stockId: number) => boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [watchlist, setWatchlist] = useState<Stock[]>(() => {
    // Load watchlist from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stock-app-watchlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [filters, setFilters] = useState<FilterOptions>({
    sectors: [],
    priceRange: null,
    changeRange: null,
    volumeRange: null,
    marketCapRange: null
  });

  const addToWatchlist = (stock: Stock) => {
    setWatchlist(prev => {
      if (prev.find(s => s.id === stock.id)) return prev;
      const newWatchlist = [...prev, stock];
      localStorage.setItem('stock-app-watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const removeFromWatchlist = (stockId: number) => {
    setWatchlist(prev => {
      const newWatchlist = prev.filter(s => s.id !== stockId);
      localStorage.setItem('stock-app-watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const isInWatchlist = (stockId: number) => {
    return watchlist.some(s => s.id === stockId);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      selectedStock,
      setSelectedStock,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}