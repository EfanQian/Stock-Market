import { NextRequest, NextResponse } from 'next/server';
import { getBars } from '@/lib/alpaca';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const days = parseInt(req.nextUrl.searchParams.get('days') ?? '365');
  const start = req.nextUrl.searchParams.get('start') ?? undefined;
  const end = req.nextUrl.searchParams.get('end') ?? undefined;

  if (!process.env.ALPACA_KEY_ID || !process.env.ALPACA_SECRET_KEY) {
    return NextResponse.json({ bars: [], demo: true });
  }

  try {
    const bars = await getBars(symbol.toUpperCase(), days, start, end);
    return NextResponse.json({ bars });
  } catch (err) {
    console.error('Alpaca bars error:', err);
    return NextResponse.json({ bars: [], demo: true });
  }
}
