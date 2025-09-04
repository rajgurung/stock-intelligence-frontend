'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Stock } from '@/types/stock';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface GlobalSearchProps {
  stocks: Stock[];
  onStockSelect?: (stock: Stock) => void;
  onAddToWatchlist?: (stock: Stock) => void;
  watchlist?: Stock[];
  placeholder?: string;
}

export function GlobalSearch({ 
  stocks, 
  onStockSelect, 
  onAddToWatchlist, 
  watchlist = [],
  placeholder = "Search stocks..." 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter stocks based on search query
  const filteredStocks = query.length >= 1 
    ? stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.company_name.toLowerCase().includes(query.toLowerCase()) ||
        stock.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Limit to 8 results for performance
    : [];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredStocks.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredStocks.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredStocks.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && filteredStocks[selectedIndex]) {
            handleStockSelect(filteredStocks[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredStocks, selectedIndex]);

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  // Handle click outside - updated for portal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Check if click is inside dropdown portal
        const dropdown = document.querySelector('[data-search-dropdown]');
        if (dropdown && dropdown.contains(event.target as Node)) {
          return; // Don't close if clicking inside dropdown
        }
        
        // Delay closing to allow for clicks on results
        setTimeout(() => {
          setIsOpen(false);
          setSelectedIndex(-1);
        }, 150);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleStockSelect = (stock: Stock) => {
    onStockSelect?.(stock);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleAddToWatchlist = (e: React.MouseEvent, stock: Stock) => {
    e.stopPropagation();
    onAddToWatchlist?.(stock);
  };

  const isInWatchlist = (stock: Stock) => {
    return watchlist.some(w => w.id === stock.id);
  };

  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      // Ensure minimum width of 320px for better layout
      const minWidth = 320;
      const dropdownWidth = Math.max(rect.width, minWidth);
      
      // If dropdown is wider than input, center it over the input
      const leftOffset = (dropdownWidth - rect.width) / 2;
      const adjustedLeft = rect.left - leftOffset;
      
      // Make sure dropdown doesn't go off screen
      const viewportWidth = window.innerWidth;
      const finalLeft = Math.max(16, Math.min(adjustedLeft, viewportWidth - dropdownWidth - 16));
      
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap
        left: finalLeft,
        width: dropdownWidth
      });
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
            updateDropdownPosition();
          }}
          onFocus={() => {
            if (query.length >= 1) {
              setIsOpen(true);
              updateDropdownPosition();
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results - Portal to body */}
      {mounted && isOpen && query.length >= 1 && createPortal(
        <div 
          data-search-dropdown
          className="fixed z-[999999] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl max-h-96 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 999999
          }}
        >
          {filteredStocks.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="p-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Found {filteredStocks.length} result{filteredStocks.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Use ↑↓ to navigate, Enter to select
                  </span>
                </div>
              </div>

              {/* Results List */}
              <div className="p-1">
                {filteredStocks.map((stock, index) => {
                  const isSelected = index === selectedIndex;
                  const isPositive = stock.change_percent >= 0;
                  
                  return (
                    <div
                      key={stock.id}
                      onClick={() => handleStockSelect(stock)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-left group cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Stock Icon */}
                        <div className={`p-1 rounded-md ${
                          isPositive ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-red-50 dark:bg-red-950/30'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className={`h-2.5 w-2.5 ${
                              isPositive ? 'text-emerald-600' : 'text-red-600'
                            }`} />
                          ) : (
                            <TrendingDown className={`h-2.5 w-2.5 ${
                              isPositive ? 'text-emerald-600' : 'text-red-600'
                            }`} />
                          )}
                        </div>

                        {/* Stock Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold text-xs ${
                              isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-card-foreground'
                            }`}>
                              {stock.symbol}
                            </span>
                            <span className="text-[10px] px-1 py-0.5 rounded bg-muted/50 text-muted-foreground">
                              {stock.sector}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate leading-tight">
                            {stock.company_name}
                          </div>
                        </div>
                      </div>

                      {/* Stock Price & Change */}
                      <div className="flex items-center gap-1.5">
                        <div className="text-right">
                          <div className="text-xs font-semibold text-card-foreground tabular-nums">
                            <AnimatedCounter value={stock.current_price} prefix="$" decimals={2} />
                          </div>
                          <div className={`text-[10px] font-semibold tabular-nums ${
                            isPositive ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
                          </div>
                        </div>

                        {/* Watchlist Button */}
                        {onAddToWatchlist && (
                          <button
                            onClick={(e) => handleAddToWatchlist(e, stock)}
                            className={`p-1 rounded transition-all duration-200 ${
                              isInWatchlist(stock)
                                ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600'
                                : 'bg-muted/30 text-muted-foreground hover:bg-emerald-100 dark:hover:bg-emerald-950/30 hover:text-emerald-600'
                            }`}
                            title={isInWatchlist(stock) ? 'In watchlist' : 'Add to watchlist'}
                          >
                            <Star className={`h-2 w-2 ${
                              isInWatchlist(stock) ? 'fill-current' : ''
                            }`} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More */}
              {stocks.length > filteredStocks.length && (
                <div className="p-3 border-t border-border/50 bg-muted/20">
                  <div className="text-center text-sm text-muted-foreground">
                    Showing top {filteredStocks.length} results. 
                    <span className="ml-1 font-medium">
                      {stocks.filter(s => 
                        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
                        s.company_name.toLowerCase().includes(query.toLowerCase()) ||
                        s.sector.toLowerCase().includes(query.toLowerCase())
                      ).length - filteredStocks.length} more available
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="p-6 text-center">
              <div className="mb-4">
                <Search className="h-8 w-8 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-sm font-semibold text-card-foreground mb-1">No stocks found</h3>
              <p className="text-xs text-muted-foreground">
                Try searching by symbol, company name, or sector
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}