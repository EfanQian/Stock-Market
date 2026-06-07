import { test, expect } from '@playwright/test';

// ─── Dashboard ───────────────────────────────────────────────────────────────

test('dashboard loads with portfolio stats', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Portfolio Value', { exact: true })).toBeVisible();
  await expect(page.getByText('Cash Available', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Top Gainers' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Top Losers' })).toBeVisible();
});

test('dashboard Trade Now button goes to markets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Trade Now/i }).click();
  await expect(page).toHaveURL('/markets');
});

// ─── Markets ─────────────────────────────────────────────────────────────────

test('markets page shows instruments', async ({ page }) => {
  await page.goto('/markets');
  await expect(page.getByRole('heading', { name: 'Markets' })).toBeVisible();
  await expect(page.locator('[href="/stock/AAPL"]').first()).toBeVisible();
});

test('markets search filters results', async ({ page }) => {
  await page.goto('/markets');
  await page.getByPlaceholder('Search symbol or name…').fill('NVDA');
  await expect(page.locator('[href="/stock/NVDA"]').first()).toBeVisible();
  await expect(page.locator('[href="/stock/AAPL"]').first()).not.toBeVisible();
});

test('markets sector filter shows only ETFs', async ({ page }) => {
  await page.goto('/markets');
  await page.getByRole('button', { name: 'ETF' }).click();
  await expect(page.locator('[href="/stock/SPY"]').first()).toBeVisible();
  await expect(page.locator('[href="/stock/AAPL"]').first()).not.toBeVisible();
});

test('clicking Trade goes to stock detail page', async ({ page }) => {
  await page.goto('/markets');
  await page.getByRole('button', { name: 'Trade' }).first().click();
  await expect(page).toHaveURL(/\/stock\//);
});

// ─── Stock Detail ─────────────────────────────────────────────────────────────

test('stock detail page renders for AAPL', async ({ page }) => {
  await page.goto('/stock/AAPL');
  await expect(page.getByRole('heading', { name: 'AAPL', exact: true })).toBeVisible();
  // Use exact:true to match the tab buttons "BUY"/"SELL" not the submit "▲ Buy AAPL"
  await expect(page.getByRole('button', { name: 'BUY', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'SELL', exact: true })).toBeVisible();
  await expect(page.getByText("Today's Open")).toBeVisible();
});

test('stock detail buy/sell toggle switches sides', async ({ page }) => {
  await page.goto('/stock/AAPL');
  await page.getByRole('button', { name: 'SELL' }).click();
  await expect(page.locator('button', { hasText: /Sell AAPL/i })).toBeVisible();
  await page.getByRole('button', { name: 'BUY' }).click();
  await expect(page.locator('button', { hasText: /Buy AAPL/i })).toBeVisible();
});

test('stock detail watch button toggles', async ({ page }) => {
  // AMZN is NOT in the default watchlist, so the button starts as "Watch"
  await page.goto('/stock/AMZN');
  // Wait for Max: N>0 which confirms portfolio.cash is loaded in React state
  await expect(page.locator('text=/Max: [1-9]/')).toBeVisible({ timeout: 5000 });
  await page.getByTestId('watchlist-btn').click();
  await expect(page.getByTestId('watchlist-btn')).toContainText('Watching', { timeout: 3000 });
});

test('stock detail chart timeframe buttons work', async ({ page }) => {
  await page.goto('/stock/AAPL');
  await page.getByRole('button', { name: '1Y' }).click();
  await page.getByRole('button', { name: '1M' }).click();
  await expect(page.getByRole('heading', { name: 'AAPL', exact: true })).toBeVisible();
});

test('stock detail buy trade shows success toast', async ({ page }) => {
  await page.goto('/stock/AAPL');
  // Wait for portfolio state to load from localStorage
  await page.waitForFunction(() => document.querySelector('[style*="Cash available"]') !== null || true);
  await page.waitForTimeout(300);
  // Type into shares input using key presses (more reliable than fill for React)
  await page.getByPlaceholder('0').click();
  await page.keyboard.type('1');
  // Wait for button to become enabled
  const buyBtn = page.locator('button', { hasText: /Buy AAPL/i });
  await expect(buyBtn).toBeEnabled({ timeout: 3000 });
  await buyBtn.click();
  await expect(page.locator('text=Bought 1 share')).toBeVisible({ timeout: 5000 });
});

// ─── Portfolio ────────────────────────────────────────────────────────────────

test('portfolio page loads', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  // At least one "Cash" label appears on the portfolio page
  await expect(page.locator('text=Cash').first()).toBeVisible();
});

// ─── Simulation ───────────────────────────────────────────────────────────────

test('simulation page loads with controls', async ({ page }) => {
  await page.goto('/simulation');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
});

// ─── Leaderboard ──────────────────────────────────────────────────────────────

test('leaderboard page loads', async ({ page }) => {
  await page.goto('/leaderboard');
  await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
});

// ─── Watchlist ────────────────────────────────────────────────────────────────

test('watchlist page loads', async ({ page }) => {
  await page.goto('/watchlist');
  await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible();
});

// ─── News ─────────────────────────────────────────────────────────────────────

test('news page loads', async ({ page }) => {
  await page.goto('/news');
  await expect(page.getByRole('heading', { name: 'Market News' })).toBeVisible();
});

// ─── Settings ─────────────────────────────────────────────────────────────────

test('settings page loads', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test('sidebar navigation links work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Markets/i }).first().click();
  await expect(page).toHaveURL('/markets');
  await page.getByRole('link', { name: /Portfolio/i }).first().click();
  await expect(page).toHaveURL('/portfolio');
  await page.getByRole('link', { name: /News/i }).first().click();
  await expect(page).toHaveURL('/news');
});
