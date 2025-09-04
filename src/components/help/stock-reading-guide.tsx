'use client';

import { TrendingUp, TrendingDown, Info, DollarSign, Activity, BarChart3, Eye, EyeOff, X, Clock, Target, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function StockReadingGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESC key handler and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus on close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">How to Read Stocks</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl border border-border max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <BarChart3 className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">How to Read Stock Data</h2>
              <p className="text-sm text-muted-foreground">Complete beginner's guide to understanding market information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/30 rounded">Press ESC to close</span>
            <button
              ref={closeButtonRef}
              onClick={() => setIsVisible(false)}
              className="p-2.5 hover:bg-muted rounded-lg transition-colors group"
              aria-label="Close guide"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover:text-card-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Start Guide */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Quick Start: Reading Your First Stock
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-500">1</span>
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Find the Symbol</h4>
                <p className="text-sm text-muted-foreground">Look for the 3-5 letter code like "AAPL" or "MSFT" - this is the stock's unique identifier.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-500">2</span>
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Check the Price</h4>
                <p className="text-sm text-muted-foreground">The big number is the current price per share. This is what you'd pay to buy one share right now.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-purple-500">3</span>
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Read the Change</h4>
                <p className="text-sm text-muted-foreground">Green means up, red means down. The percentage shows how much it moved today.</p>
              </div>
            </div>
          </section>

          {/* Stock Card Example */}
          <section>
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Understanding a Stock Card
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mock Stock Card */}
              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground">Example Stock Card:</h4>
                <div className="p-6 bg-gradient-to-br from-card/50 to-card/30 rounded-xl border border-border shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-mono text-lg font-bold text-card-foreground">AAPL</div>
                        <div className="text-sm text-muted-foreground">Apple Inc.</div>
                      </div>
                    </div>
                    <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">$150+</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-card-foreground">$175.43</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500 font-medium">+$4.27</span>
                      <span className="text-green-500 font-medium">(+2.49%)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Volume</div>
                      <div className="font-medium">89.2M</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Market Cap</div>
                      <div className="font-medium">$2.8T</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Technology</span>
                      <span className="text-muted-foreground">Last: 2:31 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanations */}
              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground">What Each Part Means:</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-500">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Symbol & Company</div>
                      <div className="text-sm text-muted-foreground">"AAPL" is Apple's ticker symbol. Every public company has a unique 3-5 letter code for trading.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-500">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Current Price</div>
                      <div className="text-sm text-muted-foreground">$175.43 is what one share costs right now. If you bought 10 shares, you'd pay $1,754.30.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-purple-500">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Daily Change</div>
                      <div className="text-sm text-muted-foreground">+$4.27 (+2.49%) means the stock is up $4.27 from yesterday's closing price - a 2.49% increase.</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-amber-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-amber-500">4</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Volume & Market Cap</div>
                      <div className="text-sm text-muted-foreground">89.2M shares traded today. $2.8T market cap means the total company value is $2.8 trillion.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section>
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Key Metrics Explained
            </h3>
            
            <div className="grid gap-4 md:gap-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  💰 Current Price
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The most recent price at which the stock was traded. This updates in real-time during market hours.
                </p>
                <div className="text-xs text-muted-foreground bg-card/50 p-2 rounded">
                  <strong>Tip:</strong> Compare with previous close to see daily movement
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  📈 Change & Change %
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Shows how much the stock moved from yesterday's closing price, both in dollars and percentage.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded">
                    <span className="text-emerald-600 dark:text-emerald-400">Green = Up</span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded">
                    <span className="text-red-600 dark:text-red-400">Red = Down</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  📊 Volume
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Number of shares traded today. Higher volume often indicates stronger investor interest.
                </p>
                <div className="text-xs text-muted-foreground bg-card/50 p-2 rounded">
                  <strong>Normal volume:</strong> 1M-10M shares for large companies
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  🎯 52-Week High/Low
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The highest and lowest prices in the past year. Shows the stock's trading range.
                </p>
                <div className="text-xs text-muted-foreground bg-card/50 p-2 rounded">
                  <strong>Analysis:</strong> Near 52-week high = strong performance, near low = potential value
                </div>
              </div>
            </div>
          </section>

          {/* Performance Indicators */}
          <section>
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Performance Indicators
            </h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div className="text-emerald-500 font-bold text-lg">Top Gainers</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">Stocks with the highest percentage increases today</div>
                  <div className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 p-2 rounded">
                    <strong>What it means:</strong> Companies having a very good day - could be due to news, earnings, or market sentiment
                  </div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <div className="text-red-500 font-bold text-lg">Top Losers</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">Stocks with the largest percentage decreases today</div>
                  <div className="text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-2 rounded">
                    <strong>What it means:</strong> Companies facing challenges - check the news to understand why
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div className="text-blue-500 font-bold text-lg">Most Active</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">Stocks with the highest trading volume today</div>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 p-2 rounded">
                    <strong>What it means:</strong> Lots of people are buying/selling - something important might be happening
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2">How to Use These Lists:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Research first:</strong> High gains don't always mean "buy now" - find out why it's moving</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Volume matters:</strong> High activity with price movement = stronger signal</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span><strong>Don't panic sell:</strong> Big drops might be temporary market reactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Watch patterns:</strong> See which stocks appear frequently on these lists</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Tips */}
          <section>
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Reading Tips
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Color Coding */}
              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground mb-3">Color Coding Guide</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-emerald-700 dark:text-emerald-300">Green = Price Up</div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">Stock gained value since yesterday's close</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-red-700 dark:text-red-300">Red = Price Down</div>
                      <div className="text-sm text-red-600 dark:text-red-400">Stock lost value since yesterday's close</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-950/30 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-gray-500 mt-1 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Gray = Unchanged</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Same price as yesterday's close</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reading Strategies */}
              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground mb-3">Smart Reading Strategies</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-500">%</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Focus on Percentages</div>
                      <div className="text-sm text-muted-foreground">+5% is more significant than +$5 - percentages show relative impact</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-purple-500">📊</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Check Volume</div>
                      <div className="text-sm text-muted-foreground">High volume + price change = stronger signal than low volume moves</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Track Real-Time</div>
                      <div className="text-sm text-muted-foreground">Prices update live during market hours (9:30 AM - 4:00 PM ET)</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-500">📈</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">Compare to Sector</div>
                      <div className="text-sm text-muted-foreground">Check if similar companies are moving the same way</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                🎯 Pro Reading Tips
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-muted-foreground">
                    <strong className="text-card-foreground">Start Small:</strong> Follow 3-5 stocks you know well before exploring more
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="text-card-foreground">Daily Routine:</strong> Check your watchlist at market open (9:30 AM) and close (4:00 PM)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground">
                    <strong className="text-card-foreground">Context Matters:</strong> Big moves often have news behind them - check financial news
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="text-card-foreground">Stay Patient:</strong> Don't react to every price change - focus on longer trends
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Market Hours */}
          <section>
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Market Hours & Trading Schedule
            </h3>
            
            <div className="space-y-6">
              {/* Trading Sessions */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">Pre-Market</h4>
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">4:00 AM - 9:30 AM ET</div>
                  <div className="text-xs text-muted-foreground">Limited trading, lower volumes</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300">Regular Hours</h4>
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 mb-2">9:30 AM - 4:00 PM ET</div>
                  <div className="text-xs text-muted-foreground">Main trading session, highest volumes</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">After Hours</h4>
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">4:00 PM - 8:00 PM ET</div>
                  <div className="text-xs text-muted-foreground">Extended trading, earnings reactions</div>
                </div>
              </div>
              
              {/* Key Information */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="font-semibold text-card-foreground mb-3">Important Trading Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">📈</span>
                      <div>
                        <div className="font-medium text-card-foreground">Best Times to Watch</div>
                        <div className="text-muted-foreground">9:30-10:30 AM (market open) and 3:30-4:00 PM (market close) typically have highest activity</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">🕐</span>
                      <div>
                        <div className="font-medium text-card-foreground">Time Zones Matter</div>
                        <div className="text-muted-foreground">All times are Eastern Time (NYC). Convert to your local time zone</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">🚫</span>
                      <div>
                        <div className="font-medium text-card-foreground">Market Closed</div>
                        <div className="text-muted-foreground">Weekends, federal holidays (New Year's, Independence Day, Christmas, etc.)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">⚡</span>
                      <div>
                        <div className="font-medium text-card-foreground">Early Closures</div>
                        <div className="text-muted-foreground">Some holidays close at 1:00 PM ET (day after Thanksgiving, Christmas Eve)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beginner Tips */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3">📚 For New Investors</h4>
                <div className="text-sm text-amber-600 dark:text-amber-400 space-y-2">
                  <div><strong>Start by observing:</strong> Watch how prices change during different hours before making any trades</div>
                  <div><strong>Regular hours are safest:</strong> Most trading happens 9:30 AM - 4:00 PM with better price discovery</div>
                  <div><strong>After-hours can be volatile:</strong> Lower volumes can mean bigger price swings on smaller trades</div>
                  <div><strong>Set realistic expectations:</strong> Most of your research and learning should happen when markets are closed</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Start by watching a few stocks you know well to get familiar with the patterns
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}