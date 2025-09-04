'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { TopBar } from '@/components/layout/top-bar';
// Removed WebSocket for educational frontend-only version
import { ThemeProvider } from '@/contexts/theme-context';
import { SearchProvider, useSearch } from '@/contexts/search-context';
import { Stock } from '@/types/stock';
import { getAllStocks } from '@/lib/api';
import { EducationalDisclaimer } from '@/components/ui/educational-disclaimer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

function DashboardLayoutContent({ children, currentSection = 'markets', onSectionChange }: DashboardLayoutProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Removed WebSocket status for educational frontend-only version
  const { 
    watchlist, 
    addToWatchlist, 
    setSelectedStock, 
    filters, 
    setFilters 
  } = useSearch();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const stocksData = await getAllStocks();
        setStocks(stocksData || []);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleStockUpdate = (updatedStocks: Stock[]) => {
    setStocks(updatedStocks);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Educational Disclaimer */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <EducationalDisclaimer sidebarCollapsed={sidebarCollapsed} />
      </div>
      
      {/* Full Height Sidebar */}
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={onSectionChange || (() => {})}
        stocks={stocks}
        onStockSelect={setSelectedStock}
        onAddToWatchlist={addToWatchlist}
        watchlist={watchlist}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Main Area - Smooth margin-based positioning with synchronized timing */}
      <div 
        className={`flex-1 flex flex-col relative z-10 ${
          sidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72'
        }`}
        style={{
          transition: 'margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'margin-left'
        }}
      >
        {/* Unified Top Bar with Integrated Status */}
        <TopBar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          stockCount={stocks.length}
          currentSection={currentSection}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* WebSocket removed for educational frontend-only version */}
        
        {/* Enhanced Main Content Area */}
        <main className="flex-1 px-6 pb-6 pt-4 relative overflow-auto">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children, currentSection, onSectionChange }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <SearchProvider>
        <DashboardLayoutContent 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        >
          {children}
        </DashboardLayoutContent>
      </SearchProvider>
    </ThemeProvider>
  );
}