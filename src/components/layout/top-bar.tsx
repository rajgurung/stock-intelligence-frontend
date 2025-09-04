'use client';

import { useState } from 'react';
import { 
  Menu,
  Maximize2,
  HelpCircle,
  Moon,
  Sun,
  Zap,
  Download,
  BookOpen,
  GraduationCap,
  Target,
  PlayCircle,
  ArrowRight,
  Star,
  TrendingUp,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { useTheme } from '@/contexts/theme-context';
import { StatusIndicator, StatusIndicatorCompact } from '@/components/ui/status-indicator';
import { TourTrigger } from '@/components/ui/educational-tour';
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
  const [learningTab, setLearningTab] = useState<'help' | 'pathways' | 'tutorials'>('help');

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

            {/* Enhanced Educational Help Dropdown */}
            {showHelp && (
              <>
                <div 
                  className="fixed inset-0 z-[115]" 
                  onClick={() => setShowHelp(false)} 
                />
                <div className="absolute top-full right-0 mt-2 w-96 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-[120] animate-scale-in overflow-hidden">
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-card-foreground">Learning Center</h3>
                        <p className="text-xs text-muted-foreground">Master stock market fundamentals</p>
                      </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex gap-1 p-1 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      {[
                        { key: 'help', label: 'Quick Help', icon: HelpCircle },
                        { key: 'pathways', label: 'Learning Paths', icon: Target },
                        { key: 'tutorials', label: 'Tutorials', icon: PlayCircle }
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setLearningTab(key as any)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                            learningTab === key
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'text-muted-foreground hover:text-card-foreground hover:bg-white/30 dark:hover:bg-slate-700/30'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 max-h-80 overflow-y-auto">
                    {/* Quick Help Tab */}
                    {learningTab === 'help' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Platform Features
                          </h4>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Browse stocks in the <strong>Markets</strong> section</p>
                            <p>• Add favorites to your <strong>Watchlist</strong></p>
                            <p>• Use <strong>Compare</strong> to analyze multiple stocks</p>
                            <p>• Hover over metrics for explanations</p>
                          </div>
                        </div>

                        <div>
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
                      </div>
                    )}

                    {/* Learning Pathways Tab */}
                    {learningTab === 'pathways' && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Beginner Path</span>
                          </div>
                          <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>Learn what stocks are</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>Understand price & market cap</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Practice using watchlists</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Intermediate Path</span>
                          </div>
                          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Analyze financial ratios</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Compare stocks by sector</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Read price charts</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Advanced Path</span>
                          </div>
                          <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Technical analysis patterns</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Portfolio diversification</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span>Risk assessment strategies</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Tutorials Tab */}
                    {learningTab === 'tutorials' && (
                      <div className="space-y-3">
                        <button className="w-full p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-950/40 dark:hover:to-green-950/40 transition-all duration-200 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg">
                              <PlayCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">Getting Started Tour</div>
                              <div className="text-xs text-muted-foreground">5-minute guided walkthrough</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-emerald-600 ml-auto" />
                          </div>
                        </button>

                        <button className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-950/40 dark:hover:to-indigo-950/40 transition-all duration-200 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <Star className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">Building Your First Watchlist</div>
                              <div className="text-xs text-muted-foreground">Learn to track favorite stocks</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-blue-600 ml-auto" />
                          </div>
                        </button>

                        <button className="w-full p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-950/40 dark:hover:to-amber-950/40 transition-all duration-200 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500 rounded-lg">
                              <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">Reading Stock Charts</div>
                              <div className="text-xs text-muted-foreground">Understand price movements</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-orange-600 ml-auto" />
                          </div>
                        </button>

                        <div className="pt-3 border-t border-border/50 space-y-3">
                          <div className="flex justify-center">
                            <TourTrigger />
                          </div>
                          <div className="text-xs text-muted-foreground text-center">
                            💡 <strong>Pro Tip:</strong> Click "Learn About This Stock" on any stock card for contextual learning!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-muted/20 border-t border-border/50">
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground">Export Data</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground">About</span>
                      </button>
                    </div>
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