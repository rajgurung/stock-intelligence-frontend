'use client';

import { AlertTriangle, BookOpen, X } from 'lucide-react';
import { useState } from 'react';

export function EducationalDisclaimer() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 text-amber-700">
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">
              <span className="hidden sm:inline">Educational Platform:</span>
              <span className="sm:hidden">Educational:</span>
              {' '}This application uses simulated stock data for learning purposes only.
              <span className="hidden md:inline"> Not intended for real investment decisions or financial advice.</span>
              <span className="hidden lg:inline"> All data is mock and for demonstration only.</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-amber-100 rounded-lg transition-colors flex-shrink-0 text-amber-700 hover:text-amber-900"
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