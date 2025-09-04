'use client';

import { cn } from '@/lib/utils';

interface BetaBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'subtle';
  className?: string;
  showTooltip?: boolean;
  pulse?: boolean;
}

export function BetaBadge({ 
  size = 'md', 
  variant = 'default',
  className,
  showTooltip = true,
  pulse = false
}: BetaBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg',
    outline: 'border-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-transparent',
    subtle: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
  };

  return (
    <div className="relative inline-block group">
      <span 
        className={cn(
          'inline-flex items-center rounded-full font-bold uppercase tracking-wider transition-all duration-200',
          sizeClasses[size],
          variantClasses[variant],
          pulse && 'animate-pulse',
          'hover:scale-105 hover:shadow-xl',
          className
        )}
        role="status"
        aria-label="Beta version indicator"
      >
        Beta
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium">Beta Version</div>
          <div className="text-gray-300 dark:text-gray-600">Some features may be incomplete</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}
    </div>
  );
}

// Inline variant for use within text/headings
export function InlineBetaBadge({ size = 'sm', className }: Pick<BetaBadgeProps, 'size' | 'className'>) {
  return (
    <BetaBadge 
      size={size}
      variant="subtle"
      className={cn('ml-2 align-middle', className)}
      showTooltip={false}
      pulse={false}
    />
  );
}