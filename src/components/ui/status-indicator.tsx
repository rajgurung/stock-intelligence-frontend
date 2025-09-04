'use client';

import { Activity, Wifi, WifiOff } from 'lucide-react';

interface StatusIndicatorProps {
  isConnected: boolean;
  stockCount: number;
  lastUpdate: number | null;
  reconnectAttempts?: number;
  showDetails?: boolean;
  className?: string;
}

export function StatusIndicator({ 
  isConnected, 
  stockCount, 
  lastUpdate, 
  reconnectAttempts = 0,
  showDetails = true,
  className = '' 
}: StatusIndicatorProps) {
  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const now = Date.now();
    const diff = now - lastUpdate;
    
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const getStatusColor = () => {
    if (isConnected) return 'text-emerald-500';
    if (reconnectAttempts > 0) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusText = () => {
    if (isConnected) return 'Live';
    if (reconnectAttempts > 0) return 'Connecting...';
    return 'Offline';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <div className="relative">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {getStatusText()}
            </span>
          </>
        ) : (
          <>
            <WifiOff className={`w-4 h-4 ${getStatusColor()}`} />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {reconnectAttempts > 0 && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                ({reconnectAttempts}/5)
              </span>
            )}
          </>
        )}
      </div>

      {/* Stock Count */}
      {stockCount > 0 && (
        <>
          <div className="w-px h-4 bg-border/50" />
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              <span className="text-card-foreground font-semibold tabular-nums">
                {stockCount.toLocaleString()}
              </span>{' '}
              stocks
            </span>
          </div>
        </>
      )}

      {/* Last Update */}
      {showDetails && lastUpdate && (
        <>
          <div className="w-px h-4 bg-border/50" />
          <div className="text-xs text-muted-foreground tabular-nums">
            {isConnected ? 'Live data' : `Updated ${formatLastUpdate()}`}
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for mobile
export function StatusIndicatorCompact({ 
  isConnected, 
  stockCount, 
  className = '' 
}: Pick<StatusIndicatorProps, 'isConnected' | 'stockCount' | 'className'>) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Live
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Offline
          </span>
        </div>
      )}
      
      {stockCount > 0 && (
        <>
          <div className="w-px h-3 bg-border/50" />
          <span className="text-xs text-muted-foreground">
            {stockCount} stocks
          </span>
        </>
      )}
    </div>
  );
}