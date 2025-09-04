'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BarChart3, 
  Star, 
  Menu, 
  X,
  GitCompare,
  Zap
} from 'lucide-react';
import { GlobalSearch } from '@/components/search/global-search';
import { Stock } from '@/types/stock';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  stocks?: Stock[];
  onStockSelect?: (stock: Stock) => void;
  onAddToWatchlist?: (stock: Stock) => void;
  watchlist?: Stock[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function Sidebar({ 
  currentSection, 
  onSectionChange, 
  stocks = [], 
  onStockSelect, 
  onAddToWatchlist, 
  watchlist = [],
  isMobileOpen = false,
  onMobileClose,
  onCollapseChange
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const navigation = [
    { 
      id: 'markets', 
      label: 'Markets', 
      icon: BarChart3, 
      description: 'Market overview and stock listings',
      badge: 'Live'
    },
    { 
      id: 'watchlist', 
      label: 'Watchlist', 
      icon: Star, 
      description: 'Your tracked stocks',
      badge: watchlist.length > 0 ? watchlist.length.toString() : undefined
    },
    { 
      id: 'comparison', 
      label: 'Compare', 
      icon: GitCompare, 
      description: 'Stock comparison tool'
    }
  ];

  // Removed duplicate functionality - alerts, export, and settings are now handled in the top bar

  const NavItem = ({ 
    item, 
    isActive, 
    onClick, 
    showLabel = true 
  }: { 
    item: any; 
    isActive: boolean; 
    onClick: () => void;
    showLabel?: boolean;
  }) => {
    const Icon = item.icon;
    
    return (
      <button
        onClick={onClick}
        className={`group relative w-full flex items-center gap-3 px-4 py-4 min-h-[44px] rounded-xl transition-all duration-300 touch-manipulation ${
          isActive
            ? 'bg-gradient-to-r from-emerald-500/20 via-blue-500/15 to-indigo-500/20 text-emerald-700 dark:text-emerald-300 shadow-xl border-2 border-emerald-500/40'
            : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 text-muted-foreground hover:text-card-foreground hover:shadow-md'
        }`}
        aria-label={item.label}
      >
        <Icon className={`h-6 w-6 flex-shrink-0 transition-all duration-300 ${
          isActive 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-muted-foreground group-hover:text-card-foreground'
        }`} />
        
        {showLabel && (
          <div className="flex-1 text-left min-w-0">
            <div className={`text-sm font-medium truncate ${
              isActive ? 'text-emerald-700 dark:text-emerald-300' : ''
            }`}>
              {item.label}
            </div>
            {item.description && !isCollapsed && (
              <div className="text-xs text-muted-foreground truncate">
                {item.description}
              </div>
            )}
          </div>
        )}
        
        {item.badge && showLabel && (
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
            item.badge === 'Live' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25' 
              : 'bg-gradient-to-r from-muted to-muted/80 text-muted-foreground'
          }`}>
            {item.badge}
          </div>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && !isMobileOpen && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="text-sm font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground">{item.description}</div>
            )}
          </div>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Brand Header - Stock Intelligence */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-600 shadow-xl transition-all duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-card-foreground bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Stock Intelligence
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Professional Dashboard</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors lg:flex hidden"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors lg:hidden"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search Only - No Advanced Filters */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border/50">
          <GlobalSearch 
            stocks={stocks}
            onStockSelect={onStockSelect}
            onAddToWatchlist={onAddToWatchlist}
            watchlist={watchlist}
            placeholder="Search stocks..."
          />
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentSection === item.id}
              onClick={() => {
                onSectionChange(item.id);
                if (onMobileClose) onMobileClose();
              }}
              showLabel={!isCollapsed}
            />
          ))}
        </div>
      </div>

      {/* Clean bottom spacing */}
      <div className="p-4"></div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Full Height Desktop Sidebar */}
      <div 
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-card/90 via-card/80 to-card/70 backdrop-blur-xl border-r-2 border-border/60 shadow-2xl ${
          isCollapsed ? 'w-24' : 'w-72'
        }`} 
        style={{ 
          zIndex: 100,
          transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width'
        }}
      >
        {sidebarContent}
      </div>

      {/* Enhanced Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 z-50 h-full w-72 bg-gradient-to-b from-card/95 via-card/90 to-card/85 backdrop-blur-2xl border-r-2 border-border/60 shadow-2xl transform transition-all duration-500 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>


    </>
  );
}