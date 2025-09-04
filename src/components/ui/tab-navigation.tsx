'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
  fullWidth = false,
}: TabNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn(
        "flex border-b border-border/50",
        fullWidth && "w-full",
        className
      )}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="px-4 py-2 bg-muted/30 animate-pulse rounded-t-lg mr-1"
          >
            <div className="h-4 w-16 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    default: {
      container: 'border-b border-border/50',
      tab: 'border-b-2 border-transparent hover:border-border/70 hover:text-card-foreground',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
      inactive: 'text-muted-foreground',
    },
    pills: {
      container: 'bg-muted/30 rounded-lg p-1',
      tab: 'rounded-md transition-all duration-200 hover:bg-muted/50',
      active: 'bg-card shadow-sm text-card-foreground',
      inactive: 'text-muted-foreground hover:text-card-foreground',
    },
    underline: {
      container: 'border-b border-border/30',
      tab: 'border-b-2 border-transparent hover:border-muted-foreground/50',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive: 'text-muted-foreground hover:text-card-foreground',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={cn(
      "flex",
      styles.container,
      fullWidth && "w-full",
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 font-medium transition-all duration-200 whitespace-nowrap",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              styles.tab,
              isActive ? styles.active : styles.inactive,
              fullWidth && "flex-1 justify-center"
            )}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {Icon && (
              <Icon className={cn(
                "shrink-0",
                size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
              )} />
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={cn(
                "px-1.5 py-0.5 text-xs font-bold rounded-full",
                isActive 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-muted text-muted-foreground"
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Mobile-optimized bottom tab navigation
interface MobileTabNavigationProps extends Omit<TabNavigationProps, 'variant' | 'size'> {
  fixed?: boolean;
}

export function MobileTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
  fixed = true,
}: MobileTabNavigationProps) {
  return (
    <div className={cn(
      "flex bg-card/95 backdrop-blur-sm border-t border-border/50",
      "md:hidden", // Only show on mobile
      fixed && "fixed bottom-0 left-0 right-0 z-50 safe-area-pb",
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2 px-1",
              "transition-all duration-200 min-h-[60px] justify-center",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isActive 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-muted-foreground hover:text-card-foreground"
            )}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`mobile-tab-${tab.id}`}
          >
            {Icon && (
              <Icon className={cn(
                "h-5 w-5 shrink-0",
                isActive && "scale-110"
              )} />
            )}
            <span className="text-xs font-medium truncate max-w-full">
              {tab.label}
            </span>
            {tab.badge && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Tab content wrapper with proper ARIA attributes
interface TabContentProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ tabId, activeTab, children, className }: TabContentProps) {
  const isActive = activeTab === tabId;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      hidden={!isActive}
      className={cn(
        "focus:outline-none",
        !isActive && "sr-only",
        className
      )}
      tabIndex={isActive ? 0 : -1}
    >
      {isActive && children}
    </div>
  );
}