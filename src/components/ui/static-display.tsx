'use client';

interface StaticDisplayProps {
  value: number | undefined | null;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StaticDisplay({ 
  value, 
  decimals = 2, 
  prefix = '', 
  suffix = '', 
  className = '' 
}: StaticDisplayProps) {
  const formatValue = (num: number | undefined | null) => {
    // Handle null, undefined, or invalid numbers
    if (num === null || num === undefined || isNaN(num)) {
      return '--';
    }
    
    if (decimals === 0) {
      return Math.round(num).toLocaleString();
    }
    return num.toFixed(decimals);
  };

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatValue(value)}{suffix}
    </span>
  );
}