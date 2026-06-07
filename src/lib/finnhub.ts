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

// Fallback prices used when Alpaca API key is not configured
export const DEMO_PRICES: Record<string, { price: number; change: number; changePercent: number }> = {
  AAPL:    { price: 226.84, change: 2.15,  changePercent: 0.96  },
  NVDA:    { price: 131.38, change: 4.20,  changePercent: 3.31  },
  MSFT:    { price: 449.20, change: -2.85, changePercent: -0.63 },
  TSLA:    { price: 263.55, change: 8.30,  changePercent: 3.25  },
  AMZN:    { price: 211.40, change: 1.45,  changePercent: 0.69  },
  GOOGL:   { price: 188.60, change: -1.20, changePercent: -0.63 },
  META:    { price: 591.80, change: 7.80,  changePercent: 1.34  },
  JPM:     { price: 257.30, change: 1.95,  changePercent: 0.76  },
  V:       { price: 293.10, change: 0.90,  changePercent: 0.31  },
  JNJ:     { price: 159.45, change: -0.35, changePercent: -0.22 },
  UNH:     { price: 497.60, change: 4.60,  changePercent: 0.93  },
  XOM:     { price: 118.20, change: -0.85, changePercent: -0.71 },
  DIS:     { price: 107.35, change: -0.95, changePercent: -0.88 },
  NKE:     { price: 73.80,  change: 0.45,  changePercent: 0.61  },
  SPY:     { price: 576.40, change: 2.80,  changePercent: 0.49  },
  QQQ:     { price: 496.90, change: 3.60,  changePercent: 0.73  },
  AWK:     { price: 130.55, change: 0.25,  changePercent: 0.19  },
  'BTC-USD': { price: 64200, change: -820, changePercent: -1.26 },
};
