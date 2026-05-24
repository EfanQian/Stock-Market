'use client';

import { useState, useEffect, useRef } from 'react';
import { DEMO_PRICES } from './finnhub';

export interface LivePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
}

// Fetch real prices from our API route (which proxies Alpaca server-side)
async function fetchPrices(symbols: string[]): Promise<Record<string, LivePrice>> {
  try {
    const res = await fetch(`/api/snapshot?symbols=${symbols.join(',')}`);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json() as Record<string, LivePrice>;
  } catch {
    // Fallback to demo prices
    const demo: Record<string, LivePrice> = {};
    symbols.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { symbol: s, ...DEMO_PRICES[s] }; });
    return demo;
  }
}

// Hook: polls live prices every 30 seconds
export function usePrices(symbols: string[], intervalMs = 30000): Record<string, LivePrice> {
  const [prices, setPrices] = useState<Record<string, LivePrice>>(() => {
    const demo: Record<string, LivePrice> = {};
    symbols.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { symbol: s, ...DEMO_PRICES[s] }; });
    return demo;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;

    const load = async () => {
      const data = await fetchPrices(symbols);
      setPrices(data);
    };

    load();
    timerRef.current = setInterval(load, intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [symbols.join(','), intervalMs]);

  return prices;
}

// Hook: single symbol, refreshes every 15 seconds on the stock detail page
export function usePrice(symbol: string): LivePrice | null {
  const prices = usePrices([symbol], 15000);
  return prices[symbol] ?? null;
}
