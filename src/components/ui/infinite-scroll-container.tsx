'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollContainerProps {
  children: ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  total?: number;
  currentCount?: number;
  error?: string | null;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
}

export function InfiniteScrollContainer({
  children,
  hasMore,
  loading,
  onLoadMore,
  total = 0,
  currentCount = 0,
  error,
  loadingMessage = "Loading more stocks...",
  errorMessage = "Failed to load more stocks",
  emptyMessage = "No stocks available",
  className = "",
}: InfiniteScrollContainerProps) {
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>
      
      {/* Progress Indicator */}
      {total > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {currentCount} of {total} stocks
            {currentCount > 0 && total > 0 && (
              <span className="ml-2 text-xs">
                ({Math.round((currentCount / total) * 100)}% loaded)
              </span>
            )}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 max-w-md mx-auto">
            <div 
              className="bg-primary rounded-full h-1.5 transition-all duration-300" 
              style={{ width: `${Math.min((currentCount / total) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{loadingMessage}</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{errorMessage}: {error}</p>
          <button
            onClick={onLoadMore}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Load More Button */}
      {!loading && !error && hasMore && currentCount > 0 && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Load More Stocks
          </button>
        </div>
      )}
      
      {/* End of Results */}
      {!loading && !hasMore && currentCount > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <span className="text-sm text-muted-foreground">
              🎉 All {total} stocks loaded
            </span>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && currentCount === 0 && total === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="h-12 w-12 mx-auto opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}