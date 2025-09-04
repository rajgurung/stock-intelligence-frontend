'use client';

import dynamic from 'next/dynamic';

// Import the new Stock Intelligence App with no SSR
const StockIntelligenceApp = dynamic(() => import('@/components/stock-intelligence-app').then(mod => ({ default: mod.StockIntelligenceApp })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/30 flex items-center justify-center">
      <div className="text-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-600 shadow-2xl animate-pulse mb-6 mx-auto w-fit">
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Stock Market Educational Platform
        </h2>
        <p className="text-muted-foreground mb-4">Loading educational trading dashboard...</p>
        <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 mb-2">
          Educational Purpose Only - Not for Investment Decisions
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-600 font-medium">Initializing Bloomberg-style interface</span>
        </div>
      </div>
    </div>
  )
});

export default function StockDashboard() {
  return <StockIntelligenceApp />;
}