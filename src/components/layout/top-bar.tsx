'use client';

import { useState } from 'react';
import { 
  Menu,
  Maximize2,
  HelpCircle,
  Moon,
  Sun,
  Zap,
  Download
} from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { useTheme } from '@/contexts/theme-context';
import { StatusIndicator, StatusIndicatorCompact } from '@/components/ui/status-indicator';
// Removed WebSocket status for educational frontend-only version

interface TopBarProps {
  onMenuToggle?: () => void;
  stockCount?: number;
  currentSection?: string;
  sidebarCollapsed?: boolean;
}

export function TopBar({ 
  onMenuToggle,
  stockCount = 0,
  currentSection = 'Markets',
  sidebarCollapsed = false
}: TopBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);

  const quickThemeToggle = () => {
    // This will be a simple toggle between light/dark, ignoring system
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 w-full bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-b border-border/60 shadow-lg" style={{ zIndex: 110 }}>
      <div className={`grid items-center px-3 lg:px-6 py-3 lg:py-4 transition-all duration-300 gap-2 lg:gap-4 ${
        sidebarCollapsed 
          ? 'grid-cols-[1fr_auto_auto] lg:grid-cols-[minmax(240px,280px)_1fr_minmax(180px,200px)]' 
          : 'grid-cols-[1fr_auto_auto] lg:grid-cols-[minmax(200px,240px)_1fr_minmax(180px,200px)]'
      }`}>
        {/* Left Section - Mobile Menu + Status */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-border/30 hover:border-border/50 touch-manipulation"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-card-foreground" />
          </button>
          
          {/* Desktop Status Information - Expanded when sidebar collapsed */}
          <div className="hidden lg:block">
            <div
              className="transition-transform duration-300"
              style={{
                transform: sidebarCollapsed ? 'scale(1.1)' : 'scale(1)',
                transformOrigin: 'left center'
              }}
            >
              {/* Educational version - Static status */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">Educational Mode</span>
                </div>
                <div className="text-gray-500">•</div>
                <span className="text-gray-600">{stockCount} Stocks</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Compact Status */}
          <div className="block lg:hidden">
            <div className="flex items-center gap-1 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{stockCount}</span>
            </div>
          </div>
        </div>

        {/* Center Section - Current Section Title */}
        <div className="hidden lg:flex justify-center items-center overflow-hidden relative z-0">
          <div 
            className="flex items-center gap-3 transition-transform duration-300 whitespace-nowrap"
            style={{
              transform: sidebarCollapsed ? 'scale(1.1)' : 'scale(1)',
              transformOrigin: 'center center'
            }}
          >
            <h1 className={`font-semibold text-card-foreground capitalize transition-all duration-300 ${
              sidebarCollapsed ? 'text-xl' : 'text-lg'
            }`}>
              {currentSection}
            </h1>
            <div className={`text-xs text-muted-foreground bg-muted/30 rounded-full transition-all duration-300 ${
              sidebarCollapsed ? 'px-3 py-1.5' : 'px-2 py-1'
            }`}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Mobile: Compact title display */}
        <div className="flex lg:hidden justify-center items-center">
          <h1 className="text-sm font-semibold text-card-foreground capitalize truncate">
            {currentSection}
          </h1>
        </div>

        {/* Right Section - Quick Actions */}
        <div className="flex items-center justify-end gap-1 lg:gap-2 relative z-10">
          {/* Quick Theme Toggle */}
          <button
            onClick={quickThemeToggle}
            className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-border/30 hover:border-border/50 group touch-manipulation"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
            )}
          </button>

          {/* Full Screen Toggle */}
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="hidden lg:flex p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-border/30 hover:border-border/50 group touch-manipulation"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-5 w-5 text-muted-foreground group-hover:text-card-foreground transition-colors" />
          </button>

          {/* Help & Documentation */}
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-border/30 hover:border-border/50 group touch-manipulation"
              aria-label="Help & Documentation"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground group-hover:text-card-foreground transition-colors" />
            </button>

            {/* Help Dropdown */}
            {showHelp && (
              <>
                <div 
                  className="fixed inset-0 z-[115]" 
                  onClick={() => setShowHelp(false)} 
                />
                <div className="absolute top-full right-0 mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4 z-[120] animate-scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-card-foreground">Help & Documentation</h3>
                      <p className="text-xs text-muted-foreground">Educational Stock Platform</p>
                    </div>
                  </div>
                  
                  {/* Quick Start */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-card-foreground mb-2">Quick Start</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>• Browse stocks in the <strong>Markets</strong> section</p>
                      <p>• Add favorites to your <strong>Watchlist</strong></p>
                      <p>• Use <strong>Compare</strong> to analyze multiple stocks</p>
                      <p>• Search stocks using the sidebar search</p>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-card-foreground mb-2">Keyboard Shortcuts</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Search</span>
                        <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">Ctrl + K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Navigate results</span>
                        <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">↑ ↓</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fullscreen</span>
                        <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px]">F11</kbd>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-3 border-t border-border/50">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-card-foreground">Export Data</div>
                        <div className="text-xs text-muted-foreground">Download stock data as CSV</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-card-foreground">About Platform</div>
                        <div className="text-xs text-muted-foreground">Educational stock analysis tool</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


    </header>
  );
}