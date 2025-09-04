import { useState, useEffect, useCallback, useRef } from 'react';
import { Stock } from '@/types/stock';
import { getAllStocks } from '@/lib/api';

interface UseInfiniteStocksOptions {
  limit?: number;
  sector?: string;
  priceRange?: string;
}


export function useInfiniteStocks(options: UseInfiniteStocksOptions = {}) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const offsetRef = useRef(0);
  const { limit = 10, sector, priceRange } = options;

  const fetchStocks = useCallback(async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    const currentOffset = reset ? 0 : offsetRef.current;
    
    try {
      const params = {
        limit,
        offset: currentOffset,
        ...(sector && { sector }),
        ...(priceRange && { price_range: priceRange }),
      };
      
      const newStocks = await getAllStocks();
      
      if (reset) {
        setStocks(newStocks);
        offsetRef.current = newStocks.length;
      } else {
        setStocks(prev => [...prev, ...newStocks]);
        offsetRef.current += newStocks.length;
      }
      
      // For this educational app, we load all stocks at once
      setHasMore(false);
      setTotal(newStocks.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks';
      setError(errorMessage);
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, sector, priceRange, loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchStocks(false);
    }
  }, [fetchStocks, loading, hasMore]);

  const refresh = useCallback(() => {
    offsetRef.current = 0;
    setStocks([]);
    setHasMore(true);
    setTotal(0);
    fetchStocks(true);
  }, [fetchStocks]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [sector, priceRange, limit]);

  // Intersection Observer for infinite scroll
  const lastStockElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      threshold: 1.0,
      rootMargin: '100px'
    });
    
    if (node) observer.observe(node);
    
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loading, hasMore, loadMore]);

  return {
    stocks,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
    lastStockElementRef,
    // Computed properties
    currentCount: stocks.length,
    progress: total > 0 ? (stocks.length / total) * 100 : 0,
  };
}