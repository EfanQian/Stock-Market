import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3099';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('marketsim_tutorial_v1', '1');
    localStorage.setItem('marketsim_theme', 'dark');
  });
});

test('Dashboard loads with portfolio value', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('header').getByText('PORTFOLIO')).toBeVisible();
  await expect(page.locator('text=Portfolio Value').first()).toBeVisible();
  await expect(page.locator('text=Total Return').first()).toBeVisible();
});

test('Markets page loads with stock list', async ({ page }) => {
  await page.goto(`${BASE}/markets`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=AAPL').first()).toBeVisible();
  await expect(page.locator('text=NVDA').first()).toBeVisible();
  await expect(page.locator('text=MSFT').first()).toBeVisible();
});

test('Stock detail page — chart renders', async ({ page }) => {
  await page.goto(`${BASE}/stock/AAPL`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('input[type="number"]').first()).toBeVisible();
  await expect(page.locator('button:text-is("BUY")')).toBeVisible();
});

test('Buy stock', async ({ page }) => {
  await page.addInitScript(() => {
    const p = { cash: 100000, positions: {}, transactions: [], xp: 0 };
    localStorage.setItem('marketsim_portfolio', JSON.stringify(p));
    localStorage.setItem('marketsim_tutorial_v1', '1');
  });
  await page.goto(`${BASE}/stock/MSFT`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10000 });
  await page.locator('input[type="number"]').first().fill('1');
  await page.locator('button:text-is("BUY")').click();
  await page.waitForTimeout(800);
  const body = await page.locator('body').innerText();
  expect(body).toMatch(/MSFT|Microsoft/i);
});

test('Portfolio page shows positions', async ({ page }) => {
  await page.addInitScript(() => {
    const p = { cash: 95000, positions: { AAPL: { symbol: 'AAPL', shares: 10, avgCost: 180, currentPrice: 190, xp: 0 } }, transactions: [], xp: 0 };
    localStorage.setItem('marketsim_portfolio', JSON.stringify(p));
    localStorage.setItem('marketsim_tutorial_v1', '1');
  });
  await page.goto(`${BASE}/portfolio`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=AAPL').first()).toBeVisible();
  await expect(page.locator('text=Cash').first()).toBeVisible();
});

test('Settings — Alpaca connection card visible', async ({ page }) => {
  await page.goto(`${BASE}/settings`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Alpaca Markets — Data Connection')).toBeVisible();
  const body = await page.locator('body').innerText();
  expect(body.includes('Live') || body.includes('Demo mode')).toBeTruthy();
});

test('Settings — light/dark theme toggle', async ({ page }) => {
  await page.goto(`${BASE}/settings`);
  await page.waitForLoadState('networkidle');
  await page.locator('button', { hasText: 'Light Mode' }).click();
  await page.waitForTimeout(300);
  expect(await page.locator('html').getAttribute('data-theme')).toBe('light');
  await page.locator('button', { hasText: 'Dark Mode' }).click();
  await page.waitForTimeout(300);
  expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
});

test('Settings — portfolio reset updates topbar', async ({ page }) => {
  await page.addInitScript(() => {
    const p = { cash: 50000, positions: {}, transactions: [], xp: 0 };
    localStorage.setItem('marketsim_portfolio', JSON.stringify(p));
    localStorage.setItem('marketsim_tutorial_v1', '1');
  });
  await page.goto(`${BASE}/settings`);
  await page.waitForLoadState('networkidle');
  await page.locator('button', { hasText: 'Reset to $100,000' }).click();
  await expect(page.locator('text=Reset Portfolio?')).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).last().click();
  await expect(page.locator('text=Portfolio reset').first()).toBeVisible({ timeout: 4000 });
  const topbar = await page.locator('header').innerText();
  expect(topbar).toContain('100,000');
});

test('Simulation — Start triggers AI prediction card', async ({ page }) => {
  await page.goto(`${BASE}/simulation`);
  await page.waitForLoadState('networkidle');
  await page.locator('button:text-is("Start")').click();
  await expect(
    page.locator('text=/Why (BULLISH|BEARISH|NEUTRAL)/').first()
  ).toBeVisible({ timeout: 20000 });
  await expect(page.locator('canvas').first()).toBeVisible();
});

test('Watchlist page loads', async ({ page }) => {
  await page.goto(`${BASE}/watchlist`);
  await page.waitForLoadState('networkidle');
  const body = await page.locator('body').innerText();
  expect(body.toLowerCase()).toMatch(/watchlist/i);
});

test('News page loads with articles', async ({ page }) => {
  await page.goto(`${BASE}/news`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Market News')).toBeVisible();
  await expect(page.locator('text=POSITIVE').first()).toBeVisible();
});
