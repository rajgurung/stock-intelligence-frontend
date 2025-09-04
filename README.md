# Stock Intelligence Frontend

A modern, responsive React dashboard for real-time stock market analysis and portfolio management. Built with Next.js 15, TypeScript, and Tailwind CSS for exceptional user experience.

## 🚀 Features

- **Real-time Data**: Live stock price updates via WebSocket connections
- **Interactive Charts**: Dynamic visualizations with price trends and market analytics
- **Advanced Search**: Global search with filtering by price, sector, and market cap
- **Watchlist Management**: Personal stock tracking with local storage persistence  
- **Dark/Light Themes**: Automatic theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Infinite Scroll**: Smooth browsing of large stock datasets
- **Market Analytics**: Comprehensive market overview and sector performance

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/            
│   │   ├── charts/           # Interactive chart components
│   │   ├── layout/           # Page layouts and navigation
│   │   ├── markets/          # Market-specific components
│   │   ├── search/           # Search and filtering UI
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API utilities and helpers
│   ├── styles/               # Global styles and Tailwind config
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context + Custom Hooks
- **Charts**: Custom CSS-based visualizations
- **Icons**: Lucide React icon library
- **Build Tool**: Turbopack for fast development

## ⚡ Quick Start

### 1. Environment Setup

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_ML_API_URL=http://localhost:8001
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🎨 Components Overview

### Core Components
- **StockCard**: Interactive stock display with price visualization
- **MarketsDashboard**: Main dashboard with tabbed navigation
- **GlobalSearch**: Real-time search with autocomplete
- **ThemeToggle**: Dark/light mode switcher

### Chart Components
- **MiniPriceChart**: Inline price trend visualization
- **MarketHeatMap**: Sector performance heat map
- **PerformanceBarChart**: Market performance comparison
- **VolumeActivityChart**: Trading volume analysis

### Layout Components
- **DashboardLayout**: Main application layout
- **Sidebar**: Navigation sidebar with theme support
- **TopBar**: Header with search and actions

## 📱 Features Deep Dive

### Real-time Updates
```typescript
// WebSocket integration for live data
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateStockPrices(data);
};
```

### Search & Filtering
- **Global Search**: Instant stock symbol and company name search
- **Price Range Filter**: Filter stocks by minimum/maximum price
- **Sector Filter**: Browse stocks by industry sector
- **Market Cap Filter**: Filter by company size

### Watchlist Management
- **Add/Remove**: Click star icon to manage watchlist
- **Persistence**: Watchlist saved to local storage
- **Quick Access**: Dedicated watchlist view

### Theme System
- **Auto Detection**: Follows system dark/light preference
- **Manual Toggle**: User can override system setting
- **Smooth Transitions**: Animated theme switching
- **Consistent Colors**: Tailwind CSS variables for theming

## 🧪 Development Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
```

## 📊 Performance Optimizations

- **Turbopack**: Ultra-fast bundling for development
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components loaded on demand
- **Infinite Scroll**: Virtualized large dataset rendering
- **Memoization**: React.memo and useMemo for expensive operations

## 🎯 User Experience Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Touch Support**: Touch-friendly interactions
- **Adaptive Layout**: Layout adjusts to screen size
- **Accessibility**: ARIA labels and keyboard navigation

### Interactive Elements
- **Hover Effects**: Smooth hover animations
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: User-friendly error messages
- **Tooltips**: Contextual help and information

## 🔧 Customization

### Theme Customization
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // Add custom colors
      }
    }
  }
}
```

### API Integration
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const stockApi = {
  getStocks: () => fetch(`${API_BASE_URL}/api/v1/stocks`),
  getStock: (symbol: string) => 
    fetch(`${API_BASE_URL}/api/v1/stocks/${symbol}`),
  // Add custom endpoints
};
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -f Dockerfile.dev -t stock-intelligence-frontend .
docker run -p 3000:3000 stock-intelligence-frontend
```

### Static Export
```bash
npm run build
npm run export
```

## 🧪 Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and data flow
- **E2E Tests**: User journey and workflow testing
- **Performance Tests**: Core Web Vitals monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new components
- Follow the existing component structure
- Add tests for new functionality
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Port 3000 in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**WebSocket connection issues**
- Verify backend is running on port 8080
- Check NEXT_PUBLIC_WS_URL in .env.local

**Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Stock Intelligence Backend](https://github.com/rajgurung/stock-intelligence-backend) - Go API server

## 📞 Support

For support, please open an issue on GitHub or contact the development team.
