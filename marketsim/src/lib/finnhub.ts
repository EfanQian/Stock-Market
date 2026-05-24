const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY ?? '';
const BASE = 'https://finnhub.io/api/v1';

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface StockProfile {
  name: string;
  ticker: string;
  exchange: string;
  industry: string;
  logo: string;
  marketCap: number;
  shareOutstanding: number;
  weburl: string;
  ipo: string;
  currency: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  datetime: number;
  image: string;
  url: string;
  related: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

async function get<T>(path: string): Promise<T> {
  const url = `${BASE}${path}&token=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Finnhub error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const raw = await get<{ c: number; d: number; dp: number; h: number; l: number; o: number; pc: number }>(
    `/quote?symbol=${symbol}`
  );
  return {
    symbol,
    price: raw.c,
    change: raw.d,
    changePercent: raw.dp,
    high: raw.h,
    low: raw.l,
    open: raw.o,
    prevClose: raw.pc,
  };
}

export async function getProfile(symbol: string): Promise<StockProfile> {
  const raw = await get<{
    name: string; ticker: string; exchange: string;
    finnhubIndustry: string; logo: string; marketCapitalization: number;
    shareOutstanding: number; weburl: string; ipo: string; currency: string;
  }>(`/stock/profile2?symbol=${symbol}`);
  return {
    name: raw.name,
    ticker: raw.ticker,
    exchange: raw.exchange,
    industry: raw.finnhubIndustry,
    logo: raw.logo,
    marketCap: raw.marketCapitalization * 1e6,
    shareOutstanding: raw.shareOutstanding,
    weburl: raw.weburl,
    ipo: raw.ipo,
    currency: raw.currency,
  };
}

export async function getCandles(symbol: string, from: number, to: number, resolution = 'D'): Promise<Candle[]> {
  const raw = await get<{ c: number[]; h: number[]; l: number[]; o: number[]; t: number[]; v: number[]; s: string }>(
    `/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
  );
  if (raw.s !== 'ok' || !raw.t) return [];
  return raw.t.map((time, i) => ({
    time,
    open: raw.o[i],
    high: raw.h[i],
    low: raw.l[i],
    close: raw.c[i],
    volume: raw.v[i],
  }));
}

export async function getMarketNews(category = 'general'): Promise<NewsItem[]> {
  const raw = await get<Array<{ id: number; headline: string; summary: string; source: string; datetime: number; image: string; url: string; related: string }>>(
    `/news?category=${category}`
  );
  return raw.slice(0, 20).map(n => ({ ...n, sentiment: undefined }));
}

export async function getCompanyNews(symbol: string, from: string, to: string): Promise<NewsItem[]> {
  const raw = await get<Array<{ id: number; headline: string; summary: string; source: string; datetime: number; image: string; url: string; related: string }>>(
    `/company-news?symbol=${symbol}&from=${from}&to=${to}`
  );
  return raw.slice(0, 15);
}

export const DEMO_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', risk: 'Medium' as const },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', risk: 'High' as const },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', risk: 'Medium' as const },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Disc.', risk: 'High' as const },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Disc.', risk: 'Medium' as const },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', risk: 'Medium' as const },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Communication', risk: 'Medium' as const },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', risk: 'Medium' as const },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', risk: 'Low' as const },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', risk: 'Low' as const },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', risk: 'Low' as const },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', risk: 'Medium' as const },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication', risk: 'Medium' as const },
  { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Disc.', risk: 'Medium' as const },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'ETF', risk: 'Low' as const },
  { symbol: 'QQQ', name: 'Invesco QQQ ETF', sector: 'ETF', risk: 'Medium' as const },
  { symbol: 'AWK', name: 'American Water Works', sector: 'Utilities', risk: 'Low' as const },
  { symbol: 'BTC-USD', name: 'Bitcoin', sector: 'Crypto', risk: 'Extreme' as const },
];

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Extreme';

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Low': return '#22C55E';
    case 'Medium': return '#F59E0B';
    case 'High': return '#EF4444';
    case 'Extreme': return '#A855F7';
  }
}

export function formatPrice(n: number): string {
  if (n < 1) return `$${n.toFixed(4)}`;
  if (n >= 10000) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toFixed(2)}`;
}

export function formatChange(n: number): string {
  return `${n >= 0 ? '+' : ''}$${Math.abs(n).toFixed(2)}`;
}

export function formatPct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

export function formatLargeNum(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

export function formatCash(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

// Realistic demo prices for when API key not set
export const DEMO_PRICES: Record<string, { price: number; change: number; changePercent: number }> = {
  AAPL:    { price: 280.07, change: 8.84,  changePercent: 3.26  },
  NVDA:    { price: 198.44, change: 5.12,  changePercent: 2.65  },
  MSFT:    { price: 425.32, change: -3.21, changePercent: -0.75 },
  TSLA:    { price: 391.20, change: 12.50, changePercent: 3.30  },
  AMZN:    { price: 268.15, change: 1.95,  changePercent: 0.73  },
  GOOGL:   { price: 186.92, change: -1.43, changePercent: -0.76 },
  META:    { price: 612.45, change: 8.30,  changePercent: 1.37  },
  JPM:     { price: 248.10, change: 2.15,  changePercent: 0.87  },
  V:       { price: 347.80, change: 1.20,  changePercent: 0.35  },
  JNJ:     { price: 155.30, change: -0.45, changePercent: -0.29 },
  UNH:     { price: 488.75, change: 5.80,  changePercent: 1.20  },
  XOM:     { price: 117.55, change: -0.95, changePercent: -0.80 },
  DIS:     { price: 103.20, change: -1.10, changePercent: -1.06 },
  NKE:     { price: 44.35,  change: 0.55,  changePercent: 1.26  },
  SPY:     { price: 581.40, change: 3.20,  changePercent: 0.55  },
  QQQ:     { price: 502.85, change: 4.15,  changePercent: 0.83  },
  AWK:     { price: 133.20, change: 0.30,  changePercent: 0.23  },
  'BTC-USD': { price: 79000, change: -1200, changePercent: -1.50 },
};
