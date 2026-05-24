'use client';

import { DEMO_PRICES, DEMO_STOCKS, formatPrice, formatPct } from '@/lib/finnhub';

export default function TickerTape() {
  const items = DEMO_STOCKS.slice(0, 10).map(s => ({
    ...s,
    ...DEMO_PRICES[s.symbol],
  }));
  const doubled = [...items, ...items]; // seamless loop

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
              <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatPrice(item.price)}</span>
              <span style={{ color: isUp ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>
                {isUp ? '▲' : '▼'} {formatPct(item.changePercent)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
