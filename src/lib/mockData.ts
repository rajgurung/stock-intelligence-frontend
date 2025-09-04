import { Stock, StockPerformance, MarketOverview, HistoricalPerformance } from '@/types/stock';

// Comprehensive list of major stocks across sectors
const STOCK_DATA: Array<{
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  exchange: string;
  basePrice: number;
}> = [
  // Technology
  { symbol: 'AAPL', company_name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', exchange: 'NASDAQ', basePrice: 185.50 },
  { symbol: 'GOOGL', company_name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services', exchange: 'NASDAQ', basePrice: 142.30 },
  { symbol: 'MSFT', company_name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', exchange: 'NASDAQ', basePrice: 378.85 },
  { symbol: 'AMZN', company_name: 'Amazon.com Inc.', sector: 'Technology', industry: 'E-commerce', exchange: 'NASDAQ', basePrice: 146.80 },
  { symbol: 'TSLA', company_name: 'Tesla Inc.', sector: 'Technology', industry: 'Electric Vehicles', exchange: 'NASDAQ', basePrice: 248.50 },
  { symbol: 'META', company_name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media', exchange: 'NASDAQ', basePrice: 296.70 },
  { symbol: 'NVDA', company_name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', basePrice: 875.30 },
  { symbol: 'NFLX', company_name: 'Netflix Inc.', sector: 'Technology', industry: 'Streaming Services', exchange: 'NASDAQ', basePrice: 445.20 },
  { symbol: 'ORCL', company_name: 'Oracle Corporation', sector: 'Technology', industry: 'Enterprise Software', exchange: 'NYSE', basePrice: 118.90 },
  { symbol: 'CRM', company_name: 'Salesforce Inc.', sector: 'Technology', industry: 'Cloud Software', exchange: 'NYSE', basePrice: 267.40 },

  // Healthcare & Pharmaceuticals
  { symbol: 'JNJ', company_name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE', basePrice: 158.90 },
  { symbol: 'UNH', company_name: 'UnitedHealth Group Inc.', sector: 'Healthcare', industry: 'Health Insurance', exchange: 'NYSE', basePrice: 524.75 },
  { symbol: 'PFE', company_name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE', basePrice: 28.45 },
  { symbol: 'ABBV', company_name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Biopharmaceuticals', exchange: 'NYSE', basePrice: 173.20 },
  { symbol: 'TMO', company_name: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Life Sciences', exchange: 'NYSE', basePrice: 548.30 },

  // Finance
  { symbol: 'JPM', company_name: 'JPMorgan Chase & Co.', sector: 'Finance', industry: 'Banking', exchange: 'NYSE', basePrice: 179.85 },
  { symbol: 'BAC', company_name: 'Bank of America Corp.', sector: 'Finance', industry: 'Banking', exchange: 'NYSE', basePrice: 40.25 },
  { symbol: 'WFC', company_name: 'Wells Fargo & Co.', sector: 'Finance', industry: 'Banking', exchange: 'NYSE', basePrice: 46.80 },
  { symbol: 'GS', company_name: 'Goldman Sachs Group Inc.', sector: 'Finance', industry: 'Investment Banking', exchange: 'NYSE', basePrice: 398.70 },
  { symbol: 'MS', company_name: 'Morgan Stanley', sector: 'Finance', industry: 'Investment Banking', exchange: 'NYSE', basePrice: 97.40 },

  // Consumer Discretionary
  { symbol: 'HD', company_name: 'Home Depot Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement', exchange: 'NYSE', basePrice: 345.60 },
  { symbol: 'MCD', company_name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants', exchange: 'NYSE', basePrice: 294.80 },
  { symbol: 'NKE', company_name: 'Nike Inc.', sector: 'Consumer Discretionary', industry: 'Footwear & Apparel', exchange: 'NYSE', basePrice: 78.95 },
  { symbol: 'SBUX', company_name: 'Starbucks Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants', exchange: 'NASDAQ', basePrice: 96.40 },
  { symbol: 'DIS', company_name: 'Walt Disney Company', sector: 'Consumer Discretionary', industry: 'Entertainment', exchange: 'NYSE', basePrice: 112.30 },

  // Energy
  { symbol: 'XOM', company_name: 'Exxon Mobil Corporation', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', basePrice: 108.75 },
  { symbol: 'CVX', company_name: 'Chevron Corporation', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', basePrice: 146.20 },
  { symbol: 'COP', company_name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', basePrice: 114.50 },

  // Consumer Staples
  { symbol: 'KO', company_name: 'Coca-Cola Company', sector: 'Consumer Staples', industry: 'Beverages', exchange: 'NYSE', basePrice: 59.85 },
  { symbol: 'PEP', company_name: 'PepsiCo Inc.', sector: 'Consumer Staples', industry: 'Beverages', exchange: 'NASDAQ', basePrice: 169.40 },
  { symbol: 'WMT', company_name: 'Walmart Inc.', sector: 'Consumer Staples', industry: 'Retail', exchange: 'NYSE', basePrice: 167.90 },
  { symbol: 'PG', company_name: 'Procter & Gamble Co.', sector: 'Consumer Staples', industry: 'Household Products', exchange: 'NYSE', basePrice: 152.30 },

  // Industrials
  { symbol: 'BA', company_name: 'Boeing Company', sector: 'Industrials', industry: 'Aerospace', exchange: 'NYSE', basePrice: 201.45 },
  { symbol: 'CAT', company_name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Construction Equipment', exchange: 'NYSE', basePrice: 348.90 },
  { symbol: 'GE', company_name: 'General Electric Co.', sector: 'Industrials', industry: 'Conglomerate', exchange: 'NYSE', basePrice: 162.85 },

  // Real Estate
  { symbol: 'AMT', company_name: 'American Tower Corp.', sector: 'Real Estate', industry: 'REITs', exchange: 'NYSE', basePrice: 198.75 },
  { symbol: 'PLD', company_name: 'Prologis Inc.', sector: 'Real Estate', industry: 'REITs', exchange: 'NYSE', basePrice: 126.40 },

  // Telecommunications
  { symbol: 'VZ', company_name: 'Verizon Communications', sector: 'Telecommunications', industry: 'Wireless', exchange: 'NYSE', basePrice: 41.20 },
  { symbol: 'T', company_name: 'AT&T Inc.', sector: 'Telecommunications', industry: 'Wireless', exchange: 'NYSE', basePrice: 22.15 },

  // Additional Tech/Growth Stocks
  { symbol: 'ADBE', company_name: 'Adobe Inc.', sector: 'Technology', industry: 'Software', exchange: 'NASDAQ', basePrice: 567.80 },
  { symbol: 'CRM', company_name: 'Salesforce Inc.', sector: 'Technology', industry: 'Cloud Software', exchange: 'NYSE', basePrice: 267.40 },
  { symbol: 'PYPL', company_name: 'PayPal Holdings Inc.', sector: 'Technology', industry: 'Financial Technology', exchange: 'NASDAQ', basePrice: 72.90 },
  { symbol: 'INTC', company_name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', basePrice: 33.85 },
  { symbol: 'AMD', company_name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', basePrice: 118.40 },
  { symbol: 'QCOM', company_name: 'Qualcomm Inc.', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', basePrice: 169.75 },
  { symbol: 'IBM', company_name: 'International Business Machines', sector: 'Technology', industry: 'Enterprise Technology', exchange: 'NYSE', basePrice: 195.30 },
  { symbol: 'CSCO', company_name: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Networking Equipment', exchange: 'NASDAQ', basePrice: 53.45 },

  // Entertainment & Media
  { symbol: 'CMCSA', company_name: 'Comcast Corporation', sector: 'Consumer Discretionary', industry: 'Media', exchange: 'NASDAQ', basePrice: 42.80 },
  { symbol: 'WBD', company_name: 'Warner Bros. Discovery', sector: 'Consumer Discretionary', industry: 'Entertainment', exchange: 'NASDAQ', basePrice: 12.45 },

  // Additional Finance
  { symbol: 'BRK.B', company_name: 'Berkshire Hathaway Inc.', sector: 'Finance', industry: 'Conglomerate', exchange: 'NYSE', basePrice: 425.80 },
  { symbol: 'V', company_name: 'Visa Inc.', sector: 'Finance', industry: 'Payment Processing', exchange: 'NYSE', basePrice: 278.90 },
  { symbol: 'MA', company_name: 'Mastercard Inc.', sector: 'Finance', industry: 'Payment Processing', exchange: 'NYSE', basePrice: 472.35 },

  // Biotech & Healthcare
  { symbol: 'GILD', company_name: 'Gilead Sciences Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ', basePrice: 78.20 },
  { symbol: 'AMGN', company_name: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ', basePrice: 278.45 },
  { symbol: 'BIIB', company_name: 'Biogen Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ', basePrice: 225.60 },

  // Additional Consumer & Retail
  { symbol: 'COST', company_name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', industry: 'Retail', exchange: 'NASDAQ', basePrice: 742.30 },
  { symbol: 'TGT', company_name: 'Target Corporation', sector: 'Consumer Discretionary', industry: 'Retail', exchange: 'NYSE', basePrice: 148.75 },
  { symbol: 'LOW', company_name: 'Lowe\'s Companies Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement', exchange: 'NYSE', basePrice: 248.90 },

  // Utilities
  { symbol: 'NEE', company_name: 'NextEra Energy Inc.', sector: 'Utilities', industry: 'Electric Utilities', exchange: 'NYSE', basePrice: 76.40 },
  { symbol: 'DUK', company_name: 'Duke Energy Corp.', sector: 'Utilities', industry: 'Electric Utilities', exchange: 'NYSE', basePrice: 102.85 },

  // Materials
  { symbol: 'LIN', company_name: 'Linde plc', sector: 'Materials', industry: 'Chemicals', exchange: 'NYSE', basePrice: 415.60 },

  // Gaming & Entertainment
  { symbol: 'TTWO', company_name: 'Take-Two Interactive Software', sector: 'Technology', industry: 'Gaming', exchange: 'NASDAQ', basePrice: 152.30 },
  { symbol: 'EA', company_name: 'Electronic Arts Inc.', sector: 'Technology', industry: 'Gaming', exchange: 'NASDAQ', basePrice: 134.85 },
  { symbol: 'ATVI', company_name: 'Activision Blizzard Inc.', sector: 'Technology', industry: 'Gaming', exchange: 'NASDAQ', basePrice: 95.20 },

  // Transportation & Logistics
  { symbol: 'UPS', company_name: 'United Parcel Service', sector: 'Industrials', industry: 'Logistics', exchange: 'NYSE', basePrice: 165.40 },
  { symbol: 'FDX', company_name: 'FedEx Corporation', sector: 'Industrials', industry: 'Logistics', exchange: 'NYSE', basePrice: 287.90 },

  // Additional High-Value Stocks
  { symbol: 'BRK.A', company_name: 'Berkshire Hathaway Inc. Class A', sector: 'Finance', industry: 'Conglomerate', exchange: 'NYSE', basePrice: 542850.00 },
  { symbol: 'GOOGL', company_name: 'Alphabet Inc. Class A', sector: 'Technology', industry: 'Internet Services', exchange: 'NASDAQ', basePrice: 142.30 },

  // Emerging Tech
  { symbol: 'SQ', company_name: 'Block Inc.', sector: 'Technology', industry: 'Financial Technology', exchange: 'NYSE', basePrice: 72.85 },
  { symbol: 'SHOP', company_name: 'Shopify Inc.', sector: 'Technology', industry: 'E-commerce Platform', exchange: 'NYSE', basePrice: 68.90 },
  { symbol: 'UBER', company_name: 'Uber Technologies Inc.', sector: 'Technology', industry: 'Ride Sharing', exchange: 'NYSE', basePrice: 68.75 },
  { symbol: 'LYFT', company_name: 'Lyft Inc.', sector: 'Technology', industry: 'Ride Sharing', exchange: 'NASDAQ', basePrice: 14.85 },

  // Additional Financial Services
  { symbol: 'AXP', company_name: 'American Express Co.', sector: 'Finance', industry: 'Credit Services', exchange: 'NYSE', basePrice: 198.40 },
  { symbol: 'C', company_name: 'Citigroup Inc.', sector: 'Finance', industry: 'Banking', exchange: 'NYSE', basePrice: 63.25 },

  // Food & Beverage
  { symbol: 'MDLZ', company_name: 'Mondelez International', sector: 'Consumer Staples', industry: 'Food Products', exchange: 'NASDAQ', basePrice: 72.60 },
  { symbol: 'KHC', company_name: 'Kraft Heinz Co.', sector: 'Consumer Staples', industry: 'Food Products', exchange: 'NASDAQ', basePrice: 36.95 },

  // Aerospace & Defense
  { symbol: 'LMT', company_name: 'Lockheed Martin Corp.', sector: 'Industrials', industry: 'Aerospace & Defense', exchange: 'NYSE', basePrice: 485.90 },
  { symbol: 'RTX', company_name: 'RTX Corporation', sector: 'Industrials', industry: 'Aerospace & Defense', exchange: 'NYSE', basePrice: 102.75 },

  // Semiconductors
  { symbol: 'TSM', company_name: 'Taiwan Semiconductor', sector: 'Technology', industry: 'Semiconductors', exchange: 'NYSE', basePrice: 102.40 },
  { symbol: 'AVGO', company_name: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ', basePrice: 875.25 },

  // Cloud & Software
  { symbol: 'NOW', company_name: 'ServiceNow Inc.', sector: 'Technology', industry: 'Enterprise Software', exchange: 'NYSE', basePrice: 748.30 },
  { symbol: 'SNOW', company_name: 'Snowflake Inc.', sector: 'Technology', industry: 'Cloud Software', exchange: 'NYSE', basePrice: 158.70 },

  // Electric Vehicles
  { symbol: 'RIVN', company_name: 'Rivian Automotive Inc.', sector: 'Technology', industry: 'Electric Vehicles', exchange: 'NASDAQ', basePrice: 18.45 },
  { symbol: 'LCID', company_name: 'Lucid Group Inc.', sector: 'Technology', industry: 'Electric Vehicles', exchange: 'NASDAQ', basePrice: 4.85 },

  // Healthcare Technology
  { symbol: 'VEEV', company_name: 'Veeva Systems Inc.', sector: 'Healthcare', industry: 'Healthcare Technology', exchange: 'NYSE', basePrice: 214.50 },
  { symbol: 'DXCM', company_name: 'DexCom Inc.', sector: 'Healthcare', industry: 'Medical Devices', exchange: 'NASDAQ', basePrice: 89.75 },

  // Renewable Energy
  { symbol: 'ENPH', company_name: 'Enphase Energy Inc.', sector: 'Technology', industry: 'Solar Energy', exchange: 'NASDAQ', basePrice: 125.80 },
  { symbol: 'SEDG', company_name: 'SolarEdge Technologies', sector: 'Technology', industry: 'Solar Energy', exchange: 'NASDAQ', basePrice: 98.40 },

  // Communications & Social Media
  { symbol: 'SNAP', company_name: 'Snap Inc.', sector: 'Technology', industry: 'Social Media', exchange: 'NYSE', basePrice: 11.95 },
  { symbol: 'TWTR', company_name: 'Twitter Inc.', sector: 'Technology', industry: 'Social Media', exchange: 'NYSE', basePrice: 54.20 }, // Historical reference
  { symbol: 'PINS', company_name: 'Pinterest Inc.', sector: 'Technology', industry: 'Social Media', exchange: 'NYSE', basePrice: 28.40 },

  // Cryptocurrency & FinTech
  { symbol: 'COIN', company_name: 'Coinbase Global Inc.', sector: 'Finance', industry: 'Cryptocurrency Exchange', exchange: 'NASDAQ', basePrice: 85.60 },
  { symbol: 'HOOD', company_name: 'Robinhood Markets Inc.', sector: 'Finance', industry: 'Financial Technology', exchange: 'NASDAQ', basePrice: 12.75 },

  // Streaming & Content
  { symbol: 'ROKU', company_name: 'Roku Inc.', sector: 'Technology', industry: 'Streaming Technology', exchange: 'NASDAQ', basePrice: 65.30 },
  { symbol: 'SPOT', company_name: 'Spotify Technology SA', sector: 'Technology', industry: 'Music Streaming', exchange: 'NYSE', basePrice: 158.90 },

  // E-commerce & Marketplace
  { symbol: 'ETSY', company_name: 'Etsy Inc.', sector: 'Consumer Discretionary', industry: 'E-commerce Marketplace', exchange: 'NASDAQ', basePrice: 78.25 },
  { symbol: 'EBAY', company_name: 'eBay Inc.', sector: 'Technology', industry: 'E-commerce Marketplace', exchange: 'NASDAQ', basePrice: 45.90 },

  // Cybersecurity
  { symbol: 'CRWD', company_name: 'CrowdStrike Holdings', sector: 'Technology', industry: 'Cybersecurity', exchange: 'NASDAQ', basePrice: 158.40 },
  { symbol: 'ZS', company_name: 'Zscaler Inc.', sector: 'Technology', industry: 'Cybersecurity', exchange: 'NASDAQ', basePrice: 174.80 },

  // Data Analytics & AI
  { symbol: 'PLTR', company_name: 'Palantir Technologies', sector: 'Technology', industry: 'Data Analytics', exchange: 'NYSE', basePrice: 17.25 },
  { symbol: 'SPLK', company_name: 'Splunk Inc.', sector: 'Technology', industry: 'Data Analytics', exchange: 'NASDAQ', basePrice: 156.70 }
];

// Generate random price movements
function generateRandomChange(): { change: number; changePercent: number } {
  const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
  return {
    changePercent: Number(changePercent.toFixed(2)),
    change: 0 // Will be calculated based on current price
  };
}

// Generate realistic volume
function generateVolume(basePrice: number): number {
  // Higher priced stocks typically have lower volume
  const baseVolume = Math.max(1000000, 50000000 / Math.sqrt(basePrice));
  const randomMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x
  return Math.floor(baseVolume * randomMultiplier);
}

// Calculate market cap based on price (simplified)
function calculateMarketCap(price: number, symbol: string): number {
  // Rough estimates based on typical share counts
  const shareCountMultipliers: { [key: string]: number } = {
    'BRK.A': 0.0015, // Very few shares outstanding
    'BRK.B': 2.4,
    'AAPL': 15.7,
    'MSFT': 7.4,
    'GOOGL': 12.9,
    'AMZN': 10.7,
    'TSLA': 3.2,
    'META': 2.7,
    'NVDA': 24.7
  };
  
  const shareCount = shareCountMultipliers[symbol] || (5 + Math.random() * 10); // Default 5-15B shares
  return Math.floor(price * shareCount * 1e9); // Convert to market cap
}

// Price range categorization
function getPriceRange(price: number): string {
  if (price < 20) return '$0-$20';
  if (price < 50) return '$20-$50';
  if (price < 100) return '$50-$100';
  if (price < 200) return '$100-$200';
  if (price < 500) return '$200-$500';
  return '$500+';
}

// Generate historical price data
function generateHistoricalData(basePrice: number, days: number): Array<{
  date: string;
  price: number;
  volume: number;
}> {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentPrice = basePrice * (0.8 + Math.random() * 0.4); // Start 20% below to above base
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic price movement (random walk with slight upward bias)
    const dailyChange = (Math.random() - 0.48) * 0.05; // Slight upward bias
    currentPrice *= (1 + dailyChange);
    currentPrice = Math.max(currentPrice, basePrice * 0.3); // Don't go below 30% of base
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      volume: generateVolume(currentPrice)
    });
  }
  
  return data;
}

// Generate all mock stocks
export function generateMockStocks(): Stock[] {
  const currentTime = new Date().toISOString();
  
  return STOCK_DATA.slice(0, 100).map((stockInfo) => {
    const priceChange = generateRandomChange();
    const currentPrice = Number((stockInfo.basePrice * (1 + priceChange.changePercent / 100)).toFixed(2));
    const change = Number((currentPrice - stockInfo.basePrice).toFixed(2));
    
    return {
      id: STOCK_DATA.indexOf(stockInfo) + 1,
      symbol: stockInfo.symbol,
      company_name: stockInfo.company_name,
      sector: stockInfo.sector,
      industry: stockInfo.industry,
      exchange: stockInfo.exchange,
      current_price: currentPrice,
      daily_change: change,
      change_percent: priceChange.changePercent,
      volume: generateVolume(currentPrice),
      market_cap: calculateMarketCap(currentPrice, stockInfo.symbol),
      price_range: getPriceRange(currentPrice),
      last_updated: currentTime
    };
  });
}

// Generate mock performance data
export function generateMockPerformance(stocks: Stock[]): StockPerformance {
  // Sort stocks by performance
  const sortedByChange = [...stocks].sort((a, b) => b.change_percent - a.change_percent);
  const sortedByVolume = [...stocks].sort((a, b) => b.volume - a.volume);
  
  return {
    top_gainers: sortedByChange.slice(0, 10),
    top_losers: sortedByChange.slice(-10).reverse(),
    most_active: sortedByVolume.slice(0, 10)
  };
}

// Generate mock market overview
export function generateMockMarketOverview(stocks: Stock[]): MarketOverview {
  const advancing = stocks.filter(s => s.change_percent > 0).length;
  const declining = stocks.filter(s => s.change_percent < 0).length;
  const unchanged = stocks.length - advancing - declining;
  
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
  const avgChange = stocks.reduce((sum, s) => sum + s.change_percent, 0) / stocks.length;
  
  return {
    total_stocks: stocks.length,
    advancing_count: advancing,
    declining_count: declining,
    unchanged_count: unchanged,
    total_volume: totalVolume,
    average_change: Number(avgChange.toFixed(2)),
    market_sentiment: avgChange > 1 ? 'Bullish' : avgChange < -1 ? 'Bearish' : 'Neutral'
  };
}

// Generate mock historical performance
export function generateMockHistoricalPerformance(symbol: string, days: number = 30): HistoricalPerformance {
  const stockInfo = STOCK_DATA.find(s => s.symbol === symbol);
  if (!stockInfo) {
    throw new Error(`Stock ${symbol} not found`);
  }
  
  const historicalData = generateHistoricalData(stockInfo.basePrice, days);
  const firstPrice = historicalData[0]?.price || stockInfo.basePrice;
  const lastPrice = historicalData[historicalData.length - 1]?.price || stockInfo.basePrice;
  const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  let timeframe = `${days}D`;
  if (days >= 365) timeframe = `${Math.floor(days/365)}Y`;
  else if (days >= 30) timeframe = `${Math.floor(days/30)}M`;
  
  return {
    symbol,
    timeframe,
    count: historicalData.length,
    data_points: historicalData,
    performance_metrics: {
      total_return: Number(totalReturn.toFixed(2)),
      data_quality: 'mock' // Indicate this is educational/demo data
    }
  };
}

// Simulate API delays
export function delay(ms: number = 300 + Math.random() * 700): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get stocks by price range filter
export function filterStocksByPriceRange(stocks: Stock[], priceRange: string | null): Stock[] {
  if (!priceRange) return stocks;
  
  return stocks.filter(stock => stock.price_range === priceRange);
}