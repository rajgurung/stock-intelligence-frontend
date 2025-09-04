'use client';

import { useState, useEffect, useRef } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyLoad({ 
  children, 
  fallback = null, 
  rootMargin = '100px',
  threshold = 0.1,
  className 
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Skeleton components for lazy loading
export function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-muted/60 rounded-xl mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted/60 rounded w-3/4" />
        <div className="h-4 bg-muted/60 rounded w-1/2" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse p-6 bg-card/60 rounded-xl border border-border/50">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 bg-muted/60 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted/60 rounded w-3/4" />
          <div className="h-3 bg-muted/60 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted/60 rounded" />
        <div className="h-3 bg-muted/60 rounded w-5/6" />
        <div className="h-3 bg-muted/60 rounded w-4/6" />
      </div>
    </div>
  );
}