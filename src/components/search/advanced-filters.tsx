'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';
import { Stock } from '@/types/stock';

export interface FilterOptions {
  sectors: string[];
  priceRange: { min: number; max: number } | null;
  changeRange: { min: number; max: number } | null;
  volumeRange: { min: number; max: number } | null;
  marketCapRange: { min: number; max: number } | null;
}

interface AdvancedFiltersProps {
  stocks: Stock[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose?: () => void;
}

export function AdvancedFilters({ stocks, filters, onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  // Section collapse states - important sections expanded by default
  const [sectionStates, setSectionStates] = useState({
    sectors: true,      // Most important - expanded
    priceRange: true,   // Very common filter - expanded  
    changeRange: false, // Advanced - collapsed
    volumeRange: false, // Advanced - collapsed
    marketCap: false    // Advanced - collapsed
  });

  const toggleSection = (section: keyof typeof sectionStates) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Validation helper
  const getRangeValidation = (
    type: 'priceRange' | 'changeRange' | 'volumeRange' | 'marketCapRange',
    min: number | null,
    max: number | null
  ) => {
    if (min === null && max === null) return null;
    if (min !== null && max !== null && min > max) {
      return { type: 'error', message: 'Min value cannot be greater than max value' };
    }
    if (min !== null && min < 0 && type !== 'changeRange') {
      return { type: 'error', message: 'Value cannot be negative' };
    }
    return null;
  };

  // Input component with validation
  const ValidatedInput = ({ 
    type, 
    field, 
    value, 
    placeholder, 
    label, 
    inputMode = 'decimal',
    step
  }: {
    type: 'priceRange' | 'changeRange' | 'volumeRange' | 'marketCapRange';
    field: 'min' | 'max';
    value: number | null;
    placeholder: string;
    label: string;
    inputMode?: string;
    step?: string;
  }) => {
    const range = localFilters[type];
    const validation = getRangeValidation(type, range?.min || null, range?.max || null);
    const hasError = validation?.type === 'error';

    return (
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{label}</label>
        <input
          type="number"
          step={step}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => handleRangeChange(type, field, e.target.value)}
          className={`w-full px-3 py-3 sm:py-2 bg-muted/30 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-border/50 focus:ring-emerald-500 focus:border-emerald-500'
          }`}
          inputMode={inputMode}
        />
      </div>
    );
  };

  // Tooltip component for help text
  const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div className="group relative inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
      </div>
    </div>
  );

  // Help explanations for financial terms
  const helpTexts = {
    sectors: "Industry classifications help categorize stocks by business type (e.g., Technology, Healthcare).",
    priceRange: "Current stock price per share. Filter by minimum and maximum dollar amounts.",
    dailyChange: "Percentage change in stock price from previous trading day. Positive = gains, negative = losses.",
    volume: "Number of shares traded in a day. Higher volume often indicates more investor interest.",
    marketCap: "Total value of all company shares (Price × Outstanding Shares). Large cap = $10B+, Small cap = $50M-$2B."
  };

  // Collapsible section header component
  const SectionHeader = ({ title, isExpanded, onToggle, activeCount, helpKey }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    activeCount?: number;
    helpKey?: keyof typeof helpTexts;
  }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full mb-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-card-foreground">{title}</h4>
        {helpKey && (
          <Tooltip content={helpTexts[helpKey]}>
            <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-blue-500 transition-colors" />
          </Tooltip>
        )}
        {activeCount && activeCount > 0 && (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
            {activeCount}
          </span>
        )}
      </div>
      {isExpanded ? (
        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-card-foreground transition-colors" />
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-card-foreground transition-colors" />
      )}
    </button>
  );

  // Get unique sectors from stocks
  const availableSectors = Array.from(new Set(stocks.map(s => s.sector))).sort();

  // Get price and volume ranges from data
  const prices = stocks.map(s => s.current_price);
  const changes = stocks.map(s => s.change_percent);
  const volumes = stocks.map(s => s.volume);
  const marketCaps = stocks.map(s => s.market_cap);

  const dataRanges = {
    price: { min: Math.min(...prices), max: Math.max(...prices) },
    change: { min: Math.min(...changes), max: Math.max(...changes) },
    volume: { min: Math.min(...volumes), max: Math.max(...volumes) },
    marketCap: { min: Math.min(...marketCaps), max: Math.max(...marketCaps) }
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = localFilters.sectors.includes(sector)
      ? localFilters.sectors.filter(s => s !== sector)
      : [...localFilters.sectors, sector];
    
    setLocalFilters(prev => ({ ...prev, sectors: newSectors }));
  };

  const handleRangeChange = (
    type: 'priceRange' | 'changeRange' | 'volumeRange' | 'marketCapRange',
    field: 'min' | 'max',
    value: string
  ) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    // Validate and constrain the input
    let constrainedValue = numValue;
    if (constrainedValue !== null) {
      // Prevent negative values for price, volume, and market cap
      if ((type === 'priceRange' || type === 'volumeRange' || type === 'marketCapRange') && constrainedValue < 0) {
        constrainedValue = 0;
      }
      
      // Set reasonable upper bounds
      const maxValues = {
        priceRange: 10000,      // $10,000 max price
        changeRange: 100,       // 100% max change
        volumeRange: 1e12,      // 1T max volume
        marketCapRange: 1e15    // 1 quadrillion max market cap
      };
      
      if (constrainedValue > maxValues[type]) {
        constrainedValue = maxValues[type];
      }
    }
    
    setLocalFilters(prev => {
      const currentRange = prev[type] || { min: null, max: null };
      const newRange = {
        ...currentRange,
        [field]: constrainedValue
      };
      
      // Auto-fix min > max scenarios
      if (newRange.min !== null && newRange.max !== null && newRange.min > newRange.max) {
        if (field === 'min') {
          newRange.max = newRange.min;
        } else {
          newRange.min = newRange.max;
        }
      }
      
      return {
        ...prev,
        [type]: newRange
      };
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const resetFilters = () => {
    const resetFilters: FilterOptions = {
      sectors: [],
      priceRange: null,
      changeRange: null,
      volumeRange: null,
      marketCapRange: null
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Smart filter presets
  const filterPresets = [
    {
      name: "Growth Stocks",
      description: "High growth potential stocks",
      icon: "📈",
      filters: {
        sectors: ["Technology", "Healthcare", "Consumer Discretionary"],
        priceRange: { min: 10, max: 500 },
        changeRange: { min: 2, max: null },
        volumeRange: { min: 1000000, max: null },
        marketCapRange: { min: 1000000000, max: null }
      }
    },
    {
      name: "Value Picks",
      description: "Undervalued dividend stocks",
      icon: "💎",
      filters: {
        sectors: ["Utilities", "Financial Services", "Consumer Staples"],
        priceRange: { min: 5, max: 100 },
        changeRange: { min: -2, max: 5 },
        volumeRange: { min: 500000, max: null },
        marketCapRange: { min: 500000000, max: null }
      }
    },
    {
      name: "Large Cap",
      description: "Stable large companies",
      icon: "🏛️",
      filters: {
        sectors: [],
        priceRange: { min: 50, max: null },
        changeRange: null,
        volumeRange: { min: 2000000, max: null },
        marketCapRange: { min: 10000000000, max: null }
      }
    },
    {
      name: "Small Cap",
      description: "High potential small companies",
      icon: "🚀",
      filters: {
        sectors: [],
        priceRange: { min: 1, max: 50 },
        changeRange: null,
        volumeRange: { min: 100000, max: null },
        marketCapRange: { min: 50000000, max: 2000000000 }
      }
    }
  ];

  const applyPreset = (preset: typeof filterPresets[0]) => {
    setLocalFilters(preset.filters);
    // Auto-expand relevant sections when applying presets
    const newSectionStates = { ...sectionStates };
    if (preset.filters.sectors.length > 0) newSectionStates.sectors = true;
    if (preset.filters.priceRange) newSectionStates.priceRange = true;
    if (preset.filters.changeRange) newSectionStates.changeRange = true;
    if (preset.filters.volumeRange) newSectionStates.volumeRange = true;
    if (preset.filters.marketCapRange) newSectionStates.marketCap = true;
    setSectionStates(newSectionStates);
  };

  // Calculate filtered results count
  const getFilteredCount = () => {
    return stocks.filter(stock => {
      // Sector filter
      if (localFilters.sectors.length > 0 && !localFilters.sectors.includes(stock.sector)) {
        return false;
      }
      
      // Price range filter
      if (localFilters.priceRange) {
        const { min, max } = localFilters.priceRange;
        if ((min !== null && stock.current_price < min) || 
            (max !== null && stock.current_price > max)) {
          return false;
        }
      }
      
      // Change range filter
      if (localFilters.changeRange) {
        const { min, max } = localFilters.changeRange;
        if ((min !== null && (stock.change_percent ?? 0) < min) || 
            (max !== null && (stock.change_percent ?? 0) > max)) {
          return false;
        }
      }
      
      // Volume range filter
      if (localFilters.volumeRange) {
        const { min, max } = localFilters.volumeRange;
        if ((min !== null && stock.volume < min) || 
            (max !== null && stock.volume > max)) {
          return false;
        }
      }
      
      // Market cap range filter
      if (localFilters.marketCapRange) {
        const { min, max } = localFilters.marketCapRange;
        if ((min !== null && stock.market_cap < min) || 
            (max !== null && stock.market_cap > max)) {
          return false;
        }
      }
      
      return true;
    }).length;
  };

  const filteredCount = getFilteredCount();
  const hasActiveFilters = localFilters.sectors.length > 0 || 
    localFilters.priceRange || localFilters.changeRange || 
    localFilters.volumeRange || localFilters.marketCapRange;

  const formatNumber = (num: number, type: 'currency' | 'percent' | 'volume' | 'marketCap') => {
    switch (type) {
      case 'currency':
        return `$${num.toFixed(2)}`;
      case 'percent':
        return `${num.toFixed(2)}%`;
      case 'volume':
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toString();
      case 'marketCap':
        if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        return `$${num}`;
      default:
        return num.toString();
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-xl p-4 sm:p-6 w-full sm:w-96 lg:w-[28rem] max-w-[95vw] sm:max-w-none max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex-shrink-0">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-card-foreground truncate">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Refine your stock search</p>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                hasActiveFilters
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                {filteredCount} of {stocks.length} stocks
              </div>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation flex-shrink-0"
            aria-label="Close filters"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Presets */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-card-foreground mb-3">Quick Presets</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filterPresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-500/30 transition-all duration-200 text-left touch-manipulation group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{preset.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-card-foreground text-sm">{preset.name}</div>
                <div className="text-xs text-muted-foreground truncate">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Sectors */}
        <div>
          <SectionHeader
            title="Sectors"
            isExpanded={sectionStates.sectors}
            onToggle={() => toggleSection('sectors')}
            activeCount={localFilters.sectors.length}
            helpKey="sectors"
          />
          {sectionStates.sectors && (
            <div className="space-y-2 pl-2">
              <div className="grid grid-cols-1 gap-2 max-h-48 sm:max-h-52 overflow-y-auto">
                {availableSectors.map(sector => {
                  const isSelected = localFilters.sectors.includes(sector);
                  return (
                    <button
                      key={sector}
                      onClick={() => handleSectorToggle(sector)}
                      className={`flex items-center justify-between p-3 sm:p-2 rounded-lg text-left transition-all duration-200 touch-manipulation ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-muted/30 hover:bg-muted/50 text-card-foreground'
                      }`}
                    >
                      <span className="text-sm font-medium">{sector}</span>
                      {isSelected && (
                        <svg className="h-4 w-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {localFilters.sectors.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {localFilters.sectors.length} sector{localFilters.sectors.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <SectionHeader
            title="Price Range"
            isExpanded={sectionStates.priceRange}
            onToggle={() => toggleSection('priceRange')}
            activeCount={(localFilters.priceRange?.min || localFilters.priceRange?.max) ? 1 : 0}
            helpKey="priceRange"
          />
          {sectionStates.priceRange && (
            <div className="space-y-2 pl-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ValidatedInput
                  type="priceRange"
                  field="min"
                  value={localFilters.priceRange?.min || null}
                  placeholder={formatNumber(dataRanges.price.min, 'currency')}
                  label="Min Price"
                  inputMode="decimal"
                />
                <ValidatedInput
                  type="priceRange"
                  field="max"
                  value={localFilters.priceRange?.max || null}
                  placeholder={formatNumber(dataRanges.price.max, 'currency')}
                  label="Max Price"
                  inputMode="decimal"
                />
              </div>
              {(() => {
                const validation = getRangeValidation('priceRange', localFilters.priceRange?.min || null, localFilters.priceRange?.max || null);
                return validation ? (
                  <div className="text-xs text-red-600 mt-1 pl-1">
                    {validation.message}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Change Range */}
        <div>
          <SectionHeader
            title="Daily Change %"
            isExpanded={sectionStates.changeRange}
            onToggle={() => toggleSection('changeRange')}
            activeCount={(localFilters.changeRange?.min || localFilters.changeRange?.max) ? 1 : 0}
            helpKey="dailyChange"
          />
          {sectionStates.changeRange && (
            <div className="space-y-2 pl-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ValidatedInput
                  type="changeRange"
                  field="min"
                  value={localFilters.changeRange?.min || null}
                  placeholder={formatNumber(dataRanges.change.min, 'percent')}
                  label="Min Change"
                  inputMode="decimal"
                  step="0.1"
                />
                <ValidatedInput
                  type="changeRange"
                  field="max"
                  value={localFilters.changeRange?.max || null}
                  placeholder={formatNumber(dataRanges.change.max, 'percent')}
                  label="Max Change"
                  inputMode="decimal"
                  step="0.1"
                />
              </div>
              {(() => {
                const validation = getRangeValidation('changeRange', localFilters.changeRange?.min || null, localFilters.changeRange?.max || null);
                return validation ? (
                  <div className="text-xs text-red-600 mt-1 pl-1">
                    {validation.message}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Volume Range */}
        <div>
          <SectionHeader
            title="Trading Volume"
            isExpanded={sectionStates.volumeRange}
            onToggle={() => toggleSection('volumeRange')}
            activeCount={(localFilters.volumeRange?.min || localFilters.volumeRange?.max) ? 1 : 0}
            helpKey="volume"
          />
          {sectionStates.volumeRange && (
            <div className="space-y-2 pl-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ValidatedInput
                  type="volumeRange"
                  field="min"
                  value={localFilters.volumeRange?.min || null}
                  placeholder={formatNumber(dataRanges.volume.min, 'volume')}
                  label="Min Volume"
                  inputMode="numeric"
                />
                <ValidatedInput
                  type="volumeRange"
                  field="max"
                  value={localFilters.volumeRange?.max || null}
                  placeholder={formatNumber(dataRanges.volume.max, 'volume')}
                  label="Max Volume"
                  inputMode="numeric"
                />
              </div>
              {(() => {
                const validation = getRangeValidation('volumeRange', localFilters.volumeRange?.min || null, localFilters.volumeRange?.max || null);
                return validation ? (
                  <div className="text-xs text-red-600 mt-1 pl-1">
                    {validation.message}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Market Cap Range */}
        <div>
          <SectionHeader
            title="Market Capitalization"
            isExpanded={sectionStates.marketCap}
            onToggle={() => toggleSection('marketCap')}
            activeCount={(localFilters.marketCapRange?.min || localFilters.marketCapRange?.max) ? 1 : 0}
            helpKey="marketCap"
          />
          {sectionStates.marketCap && (
            <div className="space-y-2 pl-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ValidatedInput
                  type="marketCapRange"
                  field="min"
                  value={localFilters.marketCapRange?.min || null}
                  placeholder={formatNumber(dataRanges.marketCap.min, 'marketCap')}
                  label="Min Market Cap"
                  inputMode="numeric"
                />
                <ValidatedInput
                  type="marketCapRange"
                  field="max"
                  value={localFilters.marketCapRange?.max || null}
                  placeholder={formatNumber(dataRanges.marketCap.max, 'marketCap')}
                  label="Max Market Cap"
                  inputMode="numeric"
                />
              </div>
              {(() => {
                const validation = getRangeValidation('marketCapRange', localFilters.marketCapRange?.min || null, localFilters.marketCapRange?.max || null);
                return validation ? (
                  <div className="text-xs text-red-600 mt-1 pl-1">
                    {validation.message}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-6 border-t border-border/50">
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-muted/50 hover:bg-muted/70 text-muted-foreground hover:text-card-foreground rounded-lg transition-all duration-200 border border-border/50 hover:border-border touch-manipulation font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium touch-manipulation"
        >
          Apply Filters ({filteredCount} stocks)
        </button>
      </div>
    </div>
  );
}