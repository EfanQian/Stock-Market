'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatChange, formatLargeNum, getRiskColor, type RiskLevel } from '@/lib/finnhub';
import { usePrices, type LivePrice } from '@/lib/usePrices';

const SECTORS = ['All', 'Technology', 'Consumer Disc.', 'Financials', 'Healthcare', 'Energy', 'Communication', 'Utilities', 'ETF', 'Crypto'];

function PriceTooltip({ price, isUp }: { price: LivePrice; isUp: boolean }) {
  const rows = [
    { label: 'Open',       value: formatPrice(price.open ?? price.price) },
    { label: 'High',       value: formatPrice(price.high ?? price.price) },
    { label: 'Low',        value: formatPrice(price.low ?? price.price) },
    { label: 'Prev Close', value: formatPrice(price.prevClose ?? (price.price - price.change)) },
    { label: 'Volume',     value: price.volume ? formatLargeNum(price.volume) : '—' },
  ];
  return (
    <div style={{
      position: 'absolute', top: '50%', left: 'calc(100% + 12px)', transform: 'translateY(-50%)',
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', zIndex: 200, minWidth: 160,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', pointerEvents: 'none',
    }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>
        TODAY&apos;S DETAILS
      </div>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.label}</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{r.value}</span>
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Change</span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
          {isUp ? '+' : ''}{formatChange(price.change)} ({formatPct(price.changePercent)})
        </span>
      </div>
    </div>
  );
}

export default function MarketsPage() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('change');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const livePrices = usePrices(DEMO_STOCKS.map(s => s.symbol));
  const getPrice = (sym: string) => livePrices[sym] ?? DEMO_PRICES[sym];

  const filtered = DEMO_STOCKS.filter(s => {
    const q = query.toUpperCase();
    const matchesQuery = !q || s.symbol.includes(q) || s.name.toUpperCase().includes(q);
    const matchesSector = sector === 'All' || s.sector === sector;
    return matchesQuery && matchesSector;
  }).sort((a, b) => {
    let av: number, bv: number;
    if (sortBy === 'symbol') return sortDir * a.symbol.localeCompare(b.symbol);
    if (sortBy === 'price') { av = getPrice(a.symbol)?.price ?? 0; bv = getPrice(b.symbol)?.price ?? 0; }
    else { av = getPrice(a.symbol)?.changePercent ?? 0; bv = getPrice(b.symbol)?.changePercent ?? 0; }
    return sortDir * (bv - av);
  });

  const toggle = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortBy(col); setSortDir(-1); }
  };

  const SortHeader = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <button onClick={() => toggle(col)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: sortBy === col ? 'var(--brand)' : 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
      {label} {sortBy === col ? (sortDir === -1 ? '↓' : '↑') : '↕'}
    </button>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Markets</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          {DEMO_STOCKS.length} instruments · Live prices
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search symbol or name…"
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12, height: 38, background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.1s', background: sector === s ? 'rgba(13,191,118,0.12)' : 'transparent', color: sector === s ? 'var(--brand)' : 'var(--text-secondary)', borderColor: sector === s ? 'rgba(13,191,118,0.3)' : 'var(--border-light)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 0.7fr 100px', gap: 0, padding: '12px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
          <SortHeader col="symbol" label="Name" />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Sector</div>
          <SortHeader col="price" label="Price" />
          <SortHeader col="change" label="Change" />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Risk</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trend</div>
          <div />
        </div>

        {filtered.map((stock, i) => {
          const price = getPrice(stock.symbol);
          if (!price) return null;
          const isUp = price.changePercent >= 0;
          const riskColor = getRiskColor(stock.risk as RiskLevel);

          return (
            <div key={stock.symbol} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 0.7fr 100px', gap: 0, padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', transition: 'background 0.1s', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; setHoveredSymbol(stock.symbol); }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; setHoveredSymbol(null); }}
            >
              {hoveredSymbol === stock.symbol && <PriceTooltip price={price} isUp={isUp} />}
              {/* Name */}
              <Link href={`/stock/${stock.symbol}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: isUp ? 'var(--positive)' : 'var(--negative)', flexShrink: 0 }}>
                  {stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{stock.symbol}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{stock.name}</div>
                </div>
              </Link>

              {/* Sector */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{stock.sector}</div>

              {/* Price */}
              <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{formatPrice(price.price)}</div>

              {/* Change */}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
                  {isUp ? '+' : ''}{formatChange(price.change)}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, padding: '1px 5px', borderRadius: 4, background: isUp ? 'var(--positive-bg)' : 'var(--negative-bg)', color: isUp ? 'var(--positive)' : 'var(--negative)', display: 'inline-block', marginTop: 2 }}>
                  {formatPct(price.changePercent)}
                </div>
              </div>

              {/* Risk */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor }} />
                <span style={{ fontSize: '0.78rem', color: riskColor, fontWeight: 600 }}>{stock.risk}</span>
              </div>

              {/* Mini spark (bars) */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
                {[0.4, 0.6, 0.5, 0.8, isUp ? 1 : 0.3].map((h, j) => (
                  <div key={j} style={{ flex: 1, height: `${h * 100}%`, background: isUp ? 'var(--positive)' : 'var(--negative)', borderRadius: 2, opacity: 0.7 }} />
                ))}
              </div>

              {/* Trade button */}
              <Link href={`/stock/${stock.symbol}`} style={{ textDecoration: 'none' }}>
                <button style={{ background: 'rgba(13,191,118,0.1)', color: 'var(--brand)', border: '1px solid rgba(13,191,118,0.25)', borderRadius: 7, padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                  Trade
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
