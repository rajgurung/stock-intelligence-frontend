'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MarketsDashboard } from '@/components/markets-dashboard';
import { TechnicalIndicators } from '@/components/technical-indicators';
import { StockComparison } from '@/components/stock-comparison';
import { StockCard } from '@/components/stock-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { GlobalSearch } from '@/components/search/global-search';
import { useSearch } from '@/contexts/search-context';
import { Stock } from '@/types/stock';
import { getAllStocks, getMarketOverview } from '@/lib/api';
import { Star, Search, X, TrendingUp, TrendingDown, GitCompare, Plus, Activity, DollarSign } from 'lucide-react';

function WatchlistSection() {
  const { watchlist, removeFromWatchlist, selectedStock, setSelectedStock } = useSearch();

  if (watchlist.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Your Watchlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Start building your watchlist by adding stocks from the Markets section.
              <br />
              Click the star icon on any stock card to add it to your watchlist.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Use the search bar to find stocks quickly</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-12">
      {/* Header */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              Personal Watchlist
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full ml-3">
                Beta
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your favorite stocks and monitor their performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-card-foreground">
              <AnimatedCounter value={watchlist.length} decimals={0} />
            </div>
            <div className="text-sm text-muted-foreground">Stocks tracked</div>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
        {watchlist.map((stock) => (
          <div key={stock.id} className="relative">
            <StockCard stock={stock} />
            <button
              onClick={() => removeFromWatchlist(stock.id)}
              className="absolute top-2 right-2 z-30 p-1.5 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-950/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Remove from watchlist"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


function ComparisonSection() {
  const { watchlist, addToWatchlist } = useSearch();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const stocksData = await getAllStocks({ limit: 100 });
        // Handle new pagination API format
        const stocksArray = Array.isArray(stocksData) ? stocksData : (stocksData?.data || []);
        setStocks(stocksArray);
      } catch (error) {
        console.error('Error fetching stocks for comparison:', error);
        setStocks([]); // Ensure we always have an array
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);
  
  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <StockComparison 
          stocks={stocks}
          watchlist={watchlist}
          onAddToWatchlist={addToWatchlist}
        />
      </div>
    </div>
  );
}


function AlertsSection() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Price Alerts</h2>
          <p className="text-muted-foreground mb-6">Set up notifications for important price movements</p>
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-sm text-muted-foreground">Coming next...</p>
        </div>
      </div>
    </div>
  );
}

function ExportSection() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Export & Reports</h2>
          <p className="text-muted-foreground mb-6">Download charts, data, and generate reports</p>
          <div className="text-6xl mb-4">📤</div>
          <p className="text-sm text-muted-foreground">Coming next...</p>
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-border/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Settings</h2>
          <p className="text-muted-foreground mb-6">Customize your dashboard preferences and notifications</p>
          <div className="text-6xl mb-4">⚙️</div>
          <p className="text-sm text-muted-foreground">Coming next...</p>
        </div>
      </div>
    </div>
  );
}

export function StockIntelligenceApp() {
  const [currentSection, setCurrentSection] = useState('markets');

  const renderCurrentSection = () => {
    return (
      <>
        <div style={{ display: currentSection === 'markets' ? 'block' : 'none' }}>
          <MarketsDashboard showDebug={false} />
        </div>
        <div style={{ display: currentSection === 'watchlist' ? 'block' : 'none' }}>
          <WatchlistSection />
        </div>
        <div style={{ display: currentSection === 'comparison' ? 'block' : 'none' }}>
          <ComparisonSection />
        </div>
        <div style={{ display: currentSection === 'alerts' ? 'block' : 'none' }}>
          <AlertsSection />
        </div>
        <div style={{ display: currentSection === 'export' ? 'block' : 'none' }}>
          <ExportSection />
        </div>
        <div style={{ display: currentSection === 'settings' ? 'block' : 'none' }}>
          <SettingsSection />
        </div>
      </>
    );
  };

  return (
    <DashboardLayout 
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderCurrentSection()}
    </DashboardLayout>
  );
}