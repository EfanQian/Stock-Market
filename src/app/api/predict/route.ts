import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_POOL = [
  { direction: 'bullish' as const, confidence: 72, summary: 'Strong institutional buying pressure observed. Analyst upgrades following positive earnings guidance. Broader sector momentum supports continued upside.', factors: [{ f: 'Earnings beat', s: 'positive', w: 'high' }, { f: 'Sector rotation into growth', s: 'positive', w: 'medium' }, { f: 'Fed rate hold', s: 'positive', w: 'medium' }] },
  { direction: 'bearish' as const, confidence: 65, summary: 'Elevated valuation multiples and recent insider selling raise concern. Rising bond yields are drawing capital away from equities. Watch for a potential pullback.', factors: [{ f: 'High P/E vs peers', s: 'negative', w: 'high' }, { f: 'Insider selling', s: 'negative', w: 'medium' }, { f: 'Rising yields', s: 'negative', w: 'medium' }] },
  { direction: 'neutral' as const, confidence: 48, summary: 'Mixed signals in the near term. Positive fundamentals offset by macro uncertainty. Price likely to consolidate before next directional move.', factors: [{ f: 'Strong cash flow', s: 'positive', w: 'medium' }, { f: 'Macro uncertainty', s: 'negative', w: 'medium' }, { f: 'Sideways price action', s: 'neutral', w: 'low' }] },
  { direction: 'bullish' as const, confidence: 81, summary: 'Recent product launch exceeded expectations. Supply chain improvements and margin expansion suggest robust quarterly results ahead.', factors: [{ f: 'Product launch success', s: 'positive', w: 'high' }, { f: 'Margin expansion', s: 'positive', w: 'high' }, { f: 'Supply chain resolved', s: 'positive', w: 'medium' }] },
];

export async function POST(req: NextRequest) {
  const { symbol, stockName, horizon, price, changePercent } = await req.json() as {
    symbol: string; stockName: string; horizon: string; price: number; changePercent: number;
  };

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const fallback = FALLBACK_POOL[Math.floor(Math.random() * FALLBACK_POOL.length)];
    return NextResponse.json({ ...fallback, _source: 'fallback_no_key' });
  }

  const horizonLabel = horizon === '1_day' ? '1 trading day' : horizon === '1_week' ? '1 week' : '1 month';

  const prompt = `You are a financial analyst. Analyze ${symbol} (${stockName}) for a ${horizonLabel} outlook.

Current price: $${price.toFixed(2)}
Today's change: ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%

Respond ONLY with valid JSON in exactly this structure:
{
  "direction": "bullish" or "bearish" or "neutral",
  "confidence": <integer 30-95>,
  "summary": "<2-3 sentence analysis mentioning ${symbol} specifically>",
  "factors": [
    { "f": "<factor>", "s": "positive" or "negative" or "neutral", "w": "high" or "medium" or "low" },
    { "f": "<factor>", "s": "positive" or "negative" or "neutral", "w": "high" or "medium" or "low" },
    { "f": "<factor>", "s": "positive" or "negative" or "neutral", "w": "high" or "medium" or "low" }
  ]
}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stockmarket.vercel.app',
        'X-Title': 'Stock Market Simulator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 400,
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const text = data.choices?.[0]?.message?.content ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const prediction = JSON.parse(jsonMatch[0]);
    return NextResponse.json(prediction);
  } catch (err) {
    console.error('OpenRouter predict error:', err instanceof Error ? err.message : err);
    const fallback = FALLBACK_POOL[Math.floor(Math.random() * FALLBACK_POOL.length)];
    return NextResponse.json({ ...fallback, _source: 'fallback_error' });
  }
}
