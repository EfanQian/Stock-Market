import { NextRequest, NextResponse } from 'next/server';
import { getSnapshots } from '@/lib/alpaca';
import { DEMO_PRICES, DEMO_STOCKS } from '@/lib/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get('symbols');
  const syms = symbols ? symbols.split(',') : DEMO_STOCKS.map(s => s.symbol);

  const keyId = process.env.ALPACA_KEY_ID;
  const secret = process.env.ALPACA_SECRET_KEY;

  if (!keyId || !secret) {
    const demo: Record<string, object> = {};
    syms.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { ...DEMO_PRICES[s], symbol: s }; });
    return NextResponse.json({ ...demo, _source: 'demo_no_keys' });
  }

  try {
    const stockSyms = syms.filter(s => !s.includes('-'));
    const data = await getSnapshots(stockSyms);

    syms.forEach(s => {
      if (!data[s] && DEMO_PRICES[s]) data[s] = { ...DEMO_PRICES[s], symbol: s } as any;
    });

    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Alpaca snapshot error:', msg);
    const demo: Record<string, object> = {};
    syms.forEach(s => { if (DEMO_PRICES[s]) demo[s] = { ...DEMO_PRICES[s], symbol: s }; });
    return NextResponse.json({ ...demo, _error: msg, _source: 'demo_fallback' });
  }
}
