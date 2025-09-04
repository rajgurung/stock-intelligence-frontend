'use client';

import { AlertTriangle, BookOpen, X, GraduationCap, Info, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface EducationalDisclaimerProps {
  sidebarCollapsed?: boolean;
}

export function EducationalDisclaimer({ sidebarCollapsed = false }: EducationalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-amber-200 dark:border-amber-800 py-3 relative transition-all duration-400 ease-in-out ${
        sidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72'
      }`}
      style={{
        willChange: 'margin-left'
      }}
    >
      <div className="px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              <span className="hidden sm:inline">Educational Platform:</span>
              <span className="sm:hidden">Educational:</span>
              {' '}This application uses simulated stock data for learning purposes only.
              <span className={`transition-opacity duration-300 ${sidebarCollapsed ? 'inline' : 'hidden md:inline'}`}> Not intended for real investment decisions or financial advice.</span>
              <span className={`transition-opacity duration-300 ${sidebarCollapsed ? 'inline' : 'hidden lg:inline'}`}> All data is mock and for demonstration only.</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors flex-shrink-0 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function FooterDisclaimer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-800">Stock Market Educational Platform</span>
          </div>
          
          <div className="text-center sm:text-right">
            <p className="text-xs leading-relaxed">
              <span className="font-medium text-amber-700">Educational Purpose Only</span> • 
              All data is simulated for learning • 
              Not financial advice • 
              <span className="hidden sm:inline">Built for demonstration and educational use</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Educational Tooltip Component for Financial Terms
export function EducationalTooltip({
  term,
  definition,
  example,
  children,
  className = '',
  position = 'top'
}: {
  term: string;
  definition: string;
  example?: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-800'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`cursor-help border-b border-dotted border-blue-500 hover:border-blue-600 transition-colors ${className}`}
      >
        {children}
      </div>
      
      {showTooltip && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-in fade-in-0 zoom-in-95 duration-200`}>
          <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl max-w-xs text-sm border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-300 flex-shrink-0" />
              <div className="font-semibold text-blue-200">{term}</div>
            </div>
            <div className="text-slate-100 mb-2 leading-relaxed">{definition}</div>
            {example && (
              <div className="text-slate-300 text-xs italic border-t border-slate-600 pt-2">
                <Lightbulb className="h-3 w-3 inline mr-1 text-yellow-400" />
                Example: {example}
              </div>
            )}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Financial Glossary Data
export const financialTerms = {
  'market-cap': {
    term: 'Market Cap',
    definition: 'Market capitalization is the total value of a company\'s shares. It\'s calculated by multiplying the stock price by the number of shares outstanding.',
    example: 'If Apple has 1 billion shares at $150 each, its market cap is $150 billion.'
  },
  'pe-ratio': {
    term: 'P/E Ratio',
    definition: 'Price-to-Earnings ratio compares a company\'s stock price to its earnings per share. It shows how much investors are willing to pay for each dollar of earnings.',
    example: 'A P/E of 20 means investors pay $20 for every $1 of annual earnings.'
  },
  'dividend-yield': {
    term: 'Dividend Yield',
    definition: 'The annual dividend payment divided by the stock price, expressed as a percentage. It shows the return on investment from dividends alone.',
    example: 'A $100 stock paying $3 annually has a 3% dividend yield.'
  },
  'volume': {
    term: 'Volume',
    definition: 'The number of shares traded during a specific time period. High volume often indicates strong interest in the stock.',
    example: 'If 1 million shares of Apple traded today, that\'s the daily volume.'
  },
  'change-percent': {
    term: 'Change %',
    definition: 'The percentage change in stock price from the previous trading day\'s close. Positive means the stock went up, negative means it went down.',
    example: 'A stock closing at $110 after opening at $100 has a +10% change.'
  },
  'price': {
    term: 'Stock Price',
    definition: 'The current market price of one share of the company\'s stock. This changes throughout the trading day based on supply and demand.',
    example: 'If Apple trades at $150, you need $150 to buy one share.'
  },
  'sector': {
    term: 'Sector',
    definition: 'A group of companies in the same industry or business area. Stocks in the same sector often move together based on industry trends.',
    example: 'Apple and Microsoft are both in the Technology sector.'
  },
  'watchlist': {
    term: 'Watchlist',
    definition: 'A personal list of stocks you want to monitor. It helps you track potential investments without actually buying them yet.',
    example: 'Add interesting stocks to your watchlist to monitor their performance.'
  }
};

// Quick Educational Tip Component
export function EducationalTip({ 
  tip, 
  variant = 'info',
  className = '' 
}: { 
  tip: string;
  variant?: 'info' | 'success' | 'warning';
  className?: string;
}) {
  const variants = {
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
  };

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${variants[variant]} ${className}`}>
      <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium">
        <strong>💡 Tip:</strong> {tip}
      </p>
    </div>
  );
}