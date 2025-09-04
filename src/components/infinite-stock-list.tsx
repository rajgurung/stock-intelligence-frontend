'use client';

import { useInfiniteStocks } from '@/hooks/useInfiniteStocks';
import { StockCard } from '@/components/stock-card';
import { InfiniteScrollContainer } from '@/components/ui/infinite-scroll-container';
import { StockCardSkeleton } from '@/components/ui/skeleton';
import { useSearch } from '@/contexts/search-context';
import { Stock } from '@/types/stock';
import { useMemo } from 'react';

interface InfiniteStockListProps {
  sector?: string;
  priceRange?: string;
  limit?: number;
  className?: string;
}

export function InfiniteStockList({
  sector,
  priceRange,
  limit = 50,
  className = "",
}: InfiniteStockListProps) {
  const {
    stocks,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    currentCount,
    lastStockElementRef,
  } = useInfiniteStocks({ 
    sector, 
    priceRange, 
    limit 
  });

  const { filters } = useSearch();

  // Apply advanced filters to the stocks
  const filteredStocks = useMemo(() => {
    if (!stocks.length) return stocks;

    return stocks.filter(stock => {
      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
        return false;
      }
      
      // Price range filter
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if ((min !== null && stock.current_price < min) || 
            (max !== null && stock.current_price > max)) {
          return false;
        }
      }
      
      // Change range filter
      if (filters.changeRange) {
        const { min, max } = filters.changeRange;
        if ((min !== null && (stock.change_percent ?? 0) < min) || 
            (max !== null && (stock.change_percent ?? 0) > max)) {
          return false;
        }
      }
      
      // Volume range filter
      if (filters.volumeRange) {
        const { min, max } = filters.volumeRange;
        if ((min !== null && stock.volume < min) || 
            (max !== null && stock.volume > max)) {
          return false;
        }
      }
      
      // Market cap range filter
      if (filters.marketCapRange) {
        const { min, max } = filters.marketCapRange;
        if ((min !== null && stock.market_cap < min) || 
            (max !== null && stock.market_cap > max)) {
          return false;
        }
      }
      
      return true;
    });
  }, [stocks, filters]);

  // Check if advanced filters are active
  const hasActiveAdvancedFilters = filters.sectors.length > 0 || 
    filters.priceRange || filters.changeRange || 
    filters.volumeRange || filters.marketCapRange;

  return (
    <InfiniteScrollContainer
      hasMore={hasMore && !hasActiveAdvancedFilters} // Disable infinite scroll when filters are active
      loading={loading}
      onLoadMore={loadMore}
      total={hasActiveAdvancedFilters ? filteredStocks.length : total}
      currentCount={hasActiveAdvancedFilters ? filteredStocks.length : currentCount}
      error={error}
      className={className}
      loadingMessage="Loading more stocks..."
      errorMessage="Failed to load stocks"
      emptyMessage={hasActiveAdvancedFilters ? "No stocks match your filters" : "No stocks available"}
    >
      {hasActiveAdvancedFilters && filteredStocks.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
          <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center">
            Showing {filteredStocks.length} stock{filteredStocks.length !== 1 ? 's' : ''} matching your advanced filters
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredStocks.map((stock, index) => (
          <div 
            key={stock.id}
            ref={index === filteredStocks.length - 1 ? lastStockElementRef : undefined}
            className="" 
            style={{ animationDelay: `${(index % 12) * 20}ms` }}
          >
            <StockCard stock={stock} />
          </div>
        ))}
        
        {/* Loading skeletons for smooth UX */}
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={`skeleton-${i}`} 
                className="" 
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <StockCardSkeleton />
              </div>
            ))}
          </>
        )}
      </div>
    </InfiniteScrollContainer>
  );
}