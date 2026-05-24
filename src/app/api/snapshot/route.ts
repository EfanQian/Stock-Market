import { NextRequest, NextResponse } from 'next/server';
import { getSnapshots } from '@/lib/alpaca';
import { DEMO_PRICES, DEMO_STOCKS } from '@/lib/finnhub';

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get('symbols');
  const syms = symbols ? symbols.split(',') : DEMO_STOCKS.map(s => s.symbol);

  // If no API keys configured, return demo prices
  if (!process.env.ALPACA_KEY_ID || !process.env.ALPACA_SECRET_KEY) {
    const demo: Record<string, object> = {};
    syms.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { ...DEMO_PRICES[s], symbol: s }; });
    return NextResponse.json(demo);
  }

  try {
    // Alpaca doesn't support crypto symbols like BTC-USD — filter them out
    const stockSyms = syms.filter(s => !s.includes('-'));
    const data = await getSnapshots(stockSyms);

    // Fill in demo prices for anything Alpaca doesn't cover
    syms.forEach(s => {
      if (!data[s] && DEMO_PRICES[s]) {
        data[s] = { ...DEMO_PRICES[s], symbol: s } as any;
      }
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Alpaca snapshot error:', err);
    // Fallback to demo prices on any error
    const demo: Record<string, object> = {};
    syms.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { ...DEMO_PRICES[s], symbol: s }; });
    return NextResponse.json(demo);
  }
}
