'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/60",
        className
      )}
      {...props}
    />
  );
}

interface StockCardSkeletonProps {
  className?: string;
}

function StockCardSkeleton({ className }: StockCardSkeletonProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-border/50 p-6 animate-fade-in",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      {/* Price */}
      <div className="mb-4">
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Chart Area */}
      <div className="mb-4">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

interface PerformanceSectionSkeletonProps {
  className?: string;
}

function PerformanceSectionSkeleton({ className }: PerformanceSectionSkeletonProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50",
      className
    )}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-muted/30 rounded-t-xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <Skeleton className="h-48 w-full rounded-lg mb-6" />
        
        {/* Top 3 List */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-20 mb-3" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MarketOverviewSkeletonProps {
  className?: string;
}

function MarketOverviewSkeleton({ className }: MarketOverviewSkeletonProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Chart */}
      <Skeleton className="h-64 w-full rounded-lg mb-6" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 rounded-xl bg-muted/30">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-20 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PriceRangeFilterSkeletonProps {
  className?: string;
}

function PriceRangeFilterSkeleton({ className }: PriceRangeFilterSkeletonProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-3 mb-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4 rounded-xl bg-muted/30 border-2 border-border/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-8 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      <div className="pt-6 border-t border-border/50">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SectorPieChartSkeletonProps {
  className?: string;
}

function SectorPieChartSkeleton({ className }: SectorPieChartSkeletonProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-12 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-80 flex items-center justify-center mb-6">
        <Skeleton className="h-60 w-60 rounded-full" />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
            <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-2 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  Skeleton,
  StockCardSkeleton,
  PerformanceSectionSkeleton,
  MarketOverviewSkeleton,
  PriceRangeFilterSkeleton,
  SectorPieChartSkeleton
};