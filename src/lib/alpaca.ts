const BASE = 'https://data.alpaca.markets/v2';

function headers() {
  return {
    'APCA-API-KEY-ID': process.env.ALPACA_KEY_ID ?? '',
    'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY ?? '',
  };
}

export interface AlpacaQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
}

export interface AlpacaBar {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Fetch snapshot for multiple symbols at once
export async function getSnapshots(symbols: string[]): Promise<Record<string, AlpacaQuote>> {
  const syms = symbols.join(',');
  const res = await fetch(`${BASE}/stocks/snapshots?symbols=${syms}&feed=iex`, {
    headers: headers(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Alpaca snapshot error ${res.status}`);
  const data = await res.json() as Record<string, {
    latestTrade: { p: number };
    dailyBar: { o: number; h: number; l: number; c: number; v: number };
    prevDailyBar: { c: number };
  }>;

  const result: Record<string, AlpacaQuote> = {};
  for (const [sym, snap] of Object.entries(data)) {
    const price = snap.latestTrade?.p ?? snap.dailyBar?.c ?? 0;
    const prevClose = snap.prevDailyBar?.c ?? price;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    result[sym] = {
      symbol: sym,
      price,
      change,
      changePercent,
      open: snap.dailyBar?.o ?? price,
      high: snap.dailyBar?.h ?? price,
      low: snap.dailyBar?.l ?? price,
      prevClose,
      volume: snap.dailyBar?.v ?? 0,
    };
  }
  return result;
}

// Fetch historical daily bars for a single symbol
export async function getBars(symbol: string, days = 365): Promise<AlpacaBar[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const params = new URLSearchParams({
    timeframe: '1Day',
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    limit: '1000',
    feed: 'iex',
  });

  const res = await fetch(`${BASE}/stocks/${symbol}/bars?${params}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Alpaca bars error ${res.status}`);
  const data = await res.json() as { bars: Array<{ t: string; o: number; h: number; l: number; c: number; v: number }> };

  return (data.bars ?? []).map(b => ({
    time: Math.floor(new Date(b.t).getTime() / 1000),
    open: b.o,
    high: b.h,
    low: b.l,
    close: b.c,
    volume: b.v,
  }));
}
