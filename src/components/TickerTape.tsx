'use client';

import { DEMO_STOCKS, formatPrice, formatPct } from '@/lib/finnhub';
import { usePrices } from '@/lib/usePrices';

export default function TickerTape() {
  const symbols = DEMO_STOCKS.slice(0, 10).map(s => s.symbol);
  const prices = usePrices(symbols, 30000);

  const items = DEMO_STOCKS.slice(0, 10).map(s => ({
    ...s,
    price: prices[s.symbol]?.price ?? 0,
    changePercent: prices[s.symbol]?.changePercent ?? 0,
  }));
  const doubled = [...items, ...items];

  return (
    <div style={{
      height: 36, background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden', display: 'flex', alignItems: 'center',
    }}>
      <div className="ticker-tape" style={{ display: 'flex', gap: 0 }}>
        {doubled.map((item, i) => {
          const isUp = item.changePercent >= 0;
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 20px', borderRight: '1px solid var(--border)', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.symbol}</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{item.price > 0 ? formatPrice(item.price) : '—'}</span>
              <span style={{ color: isUp ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>
                {item.price > 0 ? `${isUp ? '▲' : '▼'} ${formatPct(item.changePercent)}` : '—'}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
