'use client';

import { useState } from 'react';
import { CompactPriceFilter } from '@/components/compact-price-filter';
import { InfiniteStockList } from '@/components/infinite-stock-list';
import { AdvancedFilters, FilterOptions } from '@/components/search/advanced-filters';
import { InlineBetaBadge } from '@/components/ui/beta-badge';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ArrowUpDown, X, DollarSign } from 'lucide-react';

interface StockExplorerTabProps {
  initialFilters?: {
    sector?: string;
    priceRange?: string;
  };
}

export function StockExplorerTab({ initialFilters }: StockExplorerTabProps) {
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    initialFilters?.priceRange || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('symbol');
  
  const [filters, setFilters] = useState<FilterOptions>({
    sectors: initialFilters?.sector ? [initialFilters.sector] : [],
    priceRange: null,
    changeRange: null,
    volumeRange: null,
    marketCapRange: null,
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Update price range if it's set in advanced filters
    if (newFilters.priceRange) {
      const priceRange = `$${newFilters.priceRange.min}-${newFilters.priceRange.max}`;
      setSelectedPriceRange(priceRange);
    }
  };

  const activeFiltersCount = [
    filters.sectors.length > 0,
    filters.priceRange !== null,
    filters.changeRange !== null,
    filters.volumeRange !== null,
    filters.marketCapRange !== null,
    selectedPriceRange !== null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Professional Stock Explorer Header */}
      <div className="dashboard-card-elevated dashboard-p-xl">
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="p-4 rounded-2xl dashboard-transition dashboard-hover-lift" style={{ backgroundColor: 'hsl(var(--dashboard-primary))', color: 'white' }}>
              <Search className="h-8 w-8" />
            </div>
            <h2 className="dashboard-text-display" style={{ color: 'hsl(var(--dashboard-primary))' }}>Stock Explorer</h2>
            <InlineBetaBadge size="sm" />
          </div>
          
          <p className="dashboard-text-body-secondary mb-6">
            Discover, compare, and analyze stocks with powerful search and filtering
          </p>
          
          {/* Status Information Panel */}
          <div className="dashboard-card dashboard-p-md inline-flex">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 dashboard-text-primary rounded-full" />
                <span className="dashboard-text-caption font-medium">88 Stocks Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 dashboard-market-open rounded-full animate-pulse" />
                <span className="dashboard-text-caption font-medium">Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 dashboard-text-primary rounded-full" />
                <span className="dashboard-text-caption font-medium">Advanced Filtering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Search Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="relative">
            {/* Clean Search Icon */}
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
              <div className="p-2 rounded-lg dashboard-transition" style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}>
                <Search className="h-5 w-5" />
              </div>
            </div>
            
            {/* Clean Input Field */}
            <input
              type="text"
              placeholder="Search by symbol (AAPL), company name (Apple Inc.), or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 md:pl-18 pr-6 py-5 md:py-6 dashboard-text-body dashboard-card border-2 dashboard-transition focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium"
              style={{ 
                borderColor: 'hsl(var(--dashboard-card-border))',
                focusRingColor: 'hsl(var(--dashboard-primary))',
                focusBorderColor: 'hsl(var(--dashboard-primary))'
              }}
              aria-label="Search stocks by symbol, company name, or sector"
              role="searchbox"
              autoComplete="off"
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 rounded-full dashboard-transition hover:opacity-70"
                style={{ backgroundColor: 'hsl(var(--dashboard-surface))' }}
              >
                <X className="h-4 w-4 dashboard-text-secondary" />
              </button>
            )}
          </div>
          
          {/* Professional Search Suggestions */}
          {searchQuery && (
            <div className="mt-4 dashboard-card dashboard-p-md">
              <div className="dashboard-text-caption mb-3">Quick suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'].map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setSearchQuery(symbol)}
                    className="px-3 py-2 dashboard-text-small font-medium rounded-lg dashboard-transition hover:opacity-80"
                    style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Professional Quick Actions */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 dashboard-p-md min-h-[44px] rounded-xl font-medium dashboard-transition touch-manipulation ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'dashboard-card border-2 dashboard-hover-lift'
                  : 'dashboard-card dashboard-hover-lift'
              }`}
              style={{
                borderColor: showAdvancedFilters || activeFiltersCount > 0 ? 'hsl(var(--dashboard-primary))' : 'hsl(var(--dashboard-card-border))',
                color: showAdvancedFilters || activeFiltersCount > 0 ? 'hsl(var(--dashboard-primary))' : 'hsl(var(--dashboard-text-secondary))'
              }}
              aria-label={`${showAdvancedFilters ? 'Hide' : 'Show'} advanced filters`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-1 dashboard-text-small font-bold rounded-full min-w-[20px] text-center text-white" style={{ backgroundColor: 'hsl(var(--dashboard-primary))' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Filter Presets */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSelectedPriceRange('Under $10')}
                className="dashboard-p-sm min-h-[44px] dashboard-text-small dashboard-status-success rounded-lg dashboard-transition touch-manipulation"
                aria-label="Filter by penny stocks under $10"
              >
                Penny Stocks
              </button>
              <button
                onClick={() => setSelectedPriceRange('$100+')}
                className="dashboard-p-sm min-h-[44px] dashboard-text-small rounded-lg dashboard-transition touch-manipulation"
                style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}
                aria-label="Filter by premium stocks over $100"
              >
                Premium
              </button>
            </div>
          </div>

          {/* Professional View and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Clean View Mode Toggle */}
            <div className="flex items-center gap-1 dashboard-card p-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 min-h-[44px] min-w-[44px] rounded-lg dashboard-transition touch-manipulation ${
                  viewMode === 'grid'
                    ? 'dashboard-card-elevated dashboard-text-primary'
                    : 'dashboard-text-secondary hover:dashboard-text-primary'
                }`}
                title="Grid view"
                aria-label="Switch to grid view"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 min-h-[44px] min-w-[44px] rounded-lg dashboard-transition touch-manipulation ${
                  viewMode === 'list'
                    ? 'dashboard-card-elevated dashboard-text-primary'
                    : 'dashboard-text-secondary hover:dashboard-text-primary'
                }`}
                title="List view"
                aria-label="Switch to list view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Professional Sort Dropdown */}
            <div className="flex items-center gap-3 dashboard-card dashboard-p-md dashboard-transition dashboard-hover-lift min-h-[44px]">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'hsl(var(--dashboard-primary) / 0.1)', color: 'hsl(var(--dashboard-primary))' }}>
                <ArrowUpDown className="h-4 w-4" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent border-none dashboard-text-small focus:outline-none dashboard-text-primary font-medium cursor-pointer"
                aria-label="Sort stocks by"
              >
                <option value="symbol">Symbol A-Z</option>
                <option value="price">Price High-Low</option>
                <option value="change">% Change</option>
                <option value="volume">Volume</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Popular Searches */}
        <div className="mt-8 text-center">
          <div className="dashboard-text-caption mb-4 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 dashboard-market-open rounded-full animate-pulse"></span>
            Popular searches:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: '🚀 Tech Giants', action: () => setFilters({...filters, sectors: ['Technology']}) },
              { label: '💰 Dividend Stocks', action: () => setSelectedPriceRange('$50-100') },
              { label: '📈 Growth Stocks', action: () => setSelectedPriceRange('$100+') },
              { label: '🏥 Healthcare', action: () => setFilters({...filters, sectors: ['Healthcare']}) },
              { label: '⚡ Energy Sector', action: () => setFilters({...filters, sectors: ['Energy']}) },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="dashboard-p-sm min-h-[44px] dashboard-text-small dashboard-card dashboard-transition dashboard-hover-lift touch-manipulation font-medium"
                style={{ 
                  backgroundColor: 'hsl(var(--dashboard-surface))',
                  color: 'hsl(var(--dashboard-text-secondary))'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Advanced Filters */}
      {showAdvancedFilters && (
        <div className="dashboard-card-elevated dashboard-p-lg">
          <AdvancedFilters
            stocks={[]} // Will be populated with actual stocks
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClose={() => setShowAdvancedFilters(false)}
          />
        </div>
      )}

      {/* Price Range Filter */}
      <div className="flex justify-center">
        <CompactPriceFilter
          selectedRange={selectedPriceRange}
          onRangeChange={setSelectedPriceRange}
          rangeCounts={{}} // Will be populated by the infinite list
        />
      </div>

      {/* Enhanced Active Filters Summary */}
      {(selectedPriceRange || searchQuery || activeFiltersCount > 0) && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Active Filters ({[searchQuery, selectedPriceRange, ...filters.sectors].filter(Boolean).length})
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <Search className="h-3 w-3" />
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {selectedPriceRange && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                    <DollarSign className="h-3 w-3" />
                    <span>{selectedPriceRange}</span>
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.sectors.map((sector) => (
                  <div key={sector} className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <span>{sector}</span>
                    <button
                      onClick={() => setFilters({...filters, sectors: filters.sectors.filter(s => s !== sector)})}
                      className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPriceRange(null);
                setSearchQuery('');
                setFilters({
                  sectors: [],
                  priceRange: null,
                  changeRange: null,
                  volumeRange: null,
                  marketCapRange: null,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Results Header */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-card-foreground mb-2">Stock Results</h3>
            <p className="text-muted-foreground">
              Browse and discover stocks with infinite scroll • Real-time data
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <span>View: {viewMode === 'grid' ? 'Grid Layout' : 'List Layout'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                <span>Sort: {sortBy === 'symbol' ? 'Alphabetical' : sortBy === 'price' ? 'Price' : sortBy === 'change' ? 'Change %' : 'Volume'}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Results Statistics */}
          <div className="flex items-center gap-4">
            <div className="group text-center p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-xl border border-blue-200/40 dark:border-blue-800/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">88</div>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Total Stocks</div>
            </div>
            
            <div className="group text-center p-4 bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-950/30 dark:to-green-950/20 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">45</div>
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Advancing</div>
            </div>
            
            <div className="group text-center p-4 bg-gradient-to-br from-red-50/80 to-rose-50/60 dark:from-red-950/30 dark:to-rose-950/20 rounded-xl border border-red-200/40 dark:border-red-800/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="text-2xl font-black text-red-600 dark:text-red-400">32</div>
              </div>
              <div className="text-xs text-red-700 dark:text-red-300 font-semibold">Declining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stock List */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 p-6">
        <InfiniteStockList 
          priceRange={selectedPriceRange || undefined}
          sector={filters.sectors[0]} // Use first selected sector
          limit={viewMode === 'grid' ? 12 : 20}
          className={`${viewMode === 'list' ? 'list-view' : ''} stock-explorer-list`}
        />
      </div>

      {/* Enhanced Tips Section */}
      <div className="bg-gradient-to-br from-slate-50/90 via-gray-50/80 to-slate-50/70 dark:from-slate-900/90 dark:via-gray-900/80 dark:to-slate-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">Explorer Tips</h3>
          </div>
          <p className="text-lg text-muted-foreground">Make the most of your stock discovery experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-6 bg-gradient-to-br from-card/80 to-card/60 rounded-2xl border border-border/40 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔍</div>
            <h4 className="font-bold text-card-foreground mb-2 text-lg">Smart Search</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Search by symbol, company name, or even sector keywords for instant results</p>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-card/80 to-card/60 rounded-2xl border border-border/40 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h4 className="font-bold text-card-foreground mb-2 text-lg">Quick Filters</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Use preset buttons for common searches like "Tech Giants" or "Penny Stocks"</p>
          </div>
          
          <div className="group text-center p-6 bg-gradient-to-br from-card/80 to-card/60 rounded-2xl border border-border/40 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h4 className="font-bold text-card-foreground mb-2 text-lg">Compare Stocks</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Switch to list view for easier comparison and detailed analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}