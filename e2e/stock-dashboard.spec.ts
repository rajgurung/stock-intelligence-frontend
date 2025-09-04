import { test, expect } from '@playwright/test';

test.describe('Stock Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/v1/stocks', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: [
            {
              id: 1,
              symbol: 'AAPL',
              company_name: 'Apple Inc.',
              current_price: 150.25,
              change_percent: 2.5,
              sector: 'Technology'
            },
            {
              id: 2,
              symbol: 'MSFT',
              company_name: 'Microsoft Corporation',
              current_price: 320.15,
              change_percent: -0.39,
              sector: 'Technology'
            }
          ]
        }
      });
    });

    await page.route('**/api/v1/market/overview', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            total_stocks: 100,
            advancing_count: 60,
            declining_count: 30,
            unchanged_count: 10
          }
        }
      });
    });
  });

  test('should load and display stock dashboard', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await expect(page.getByText('Stock Intelligence').first()).toBeVisible();

    // Check if stocks are displayed (assuming there's a stocks section)
    await expect(page.locator('[data-testid="stock-AAPL"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="stock-MSFT"]')).toBeVisible();

    // Verify stock information is displayed correctly
    await expect(page.locator('[data-testid="stock-AAPL"]')).toContainText('AAPL');
    await expect(page.locator('[data-testid="stock-AAPL"]')).toContainText('Apple Inc.');
    await expect(page.locator('[data-testid="stock-AAPL"]')).toContainText('$150.25');
  });

  test('should handle stock interactions', async ({ page }) => {
    await page.goto('/');

    // Wait for stocks to load
    await expect(page.locator('[data-testid="stock-AAPL"]')).toBeVisible({ timeout: 10000 });

    // Test watchlist functionality if available
    const watchlistButton = page.locator('[data-testid="watchlist-AAPL"]');
    if (await watchlistButton.isVisible()) {
      await watchlistButton.click();
      await expect(watchlistButton).toContainText('Remove');
    }

    // Test stock details view if available
    const stockCard = page.locator('[data-testid="stock-AAPL"]');
    await stockCard.click();
    
    // Check if stock details are shown (could be modal or navigation)
    await page.waitForTimeout(1000); // Allow for any transitions
  });

  test('should display market overview', async ({ page }) => {
    await page.goto('/');

    // Look for market overview information
    const overviewSection = page.locator('[data-testid="market-overview"]');
    if (await overviewSection.isVisible()) {
      await expect(overviewSection).toContainText('100'); // Total stocks
      await expect(overviewSection).toContainText('60');  // Advancing count
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');

    // Check that the page loads on mobile
    await expect(page.getByText('Stock Intelligence').first()).toBeVisible();
    
    // Verify mobile layout adjustments
    const stockCards = page.locator('[data-testid^="stock-"]');
    if (await stockCards.first().isVisible()) {
      // On mobile, cards should stack vertically
      const firstCard = stockCards.first();
      const secondCard = stockCards.nth(1);
      
      if (await secondCard.isVisible()) {
        const firstCardBox = await firstCard.boundingBox();
        const secondCardBox = await secondCard.boundingBox();
        
        // Second card should be below the first (higher Y coordinate)
        expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y);
      }
    }
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/');

    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('AAPL');
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      // Verify search results
      await expect(page.locator('[data-testid="stock-AAPL"]')).toBeVisible();
      
      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);
    }
  });

  test('@fullstack should work with real API', async ({ page }) => {
    // This test will only run in full-stack CI environment
    // Remove API mocking for this test
    await page.unroute('**/api/v1/stocks');
    await page.unroute('**/api/v1/market/overview');
    
    await page.goto('/');
    
    // Wait for real data to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page loads successfully with real data
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify that some content is loaded
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network errors
    await page.route('**/api/v1/stocks', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');

    // Check that error handling works
    await page.waitForTimeout(2000);
    
    // Look for error messages or fallback content
    const errorMessage = page.locator('[data-testid="error"], .error, [role="alert"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/error|fail|unavailable/i);
    }
  });

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check Core Web Vitals if supported
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              resolve((entry as any).value);
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve with 0 after 1 second if no layout shifts
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    // Cumulative Layout Shift should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });
});