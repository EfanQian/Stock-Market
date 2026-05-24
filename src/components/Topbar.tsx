'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DEMO_STOCKS, DEMO_PRICES, formatCash, formatPct } from '@/lib/finnhub';
import { loadPortfolio, getTotalValue, getTotalReturnPct } from '@/lib/store';

export default function Topbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof DEMO_STOCKS>([]);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [returnPct, setReturnPct] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const p = loadPortfolio();
    // Update prices
    Object.keys(p.positions).forEach(sym => {
      if (DEMO_PRICES[sym]) {
        p.positions[sym].currentPrice = DEMO_PRICES[sym].price;
      }
    });
    setPortfolioValue(getTotalValue(p));
    setReturnPct(getTotalReturnPct(p));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toUpperCase();
    setResults(
      DEMO_STOCKS.filter(s =>
        s.symbol.includes(q) || s.name.toUpperCase().includes(q)
      ).slice(0, 5)
    );
  }, [query]);

  const isUp = returnPct >= 0;

  return (
    <header style={{
      height: 60, background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search stocks, ETFs, crypto…"
          style={{
            width: '100%', paddingLeft: 36, paddingRight: 12,
            height: 36, background: 'var(--bg-card)',
            border: '1px solid var(--border-light)', borderRadius: 8,
            color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
          }}
          onBlur={() => setTimeout(() => setResults([]), 200)}
        />
        {results.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            borderRadius: 10, overflow: 'hidden', zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {results.map(s => (
              <div
                key={s.symbol}
                onClick={() => { router.push(`/stock/${s.symbol}`); setQuery(''); setResults([]); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{s.symbol}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.name}</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--border)', padding: '2px 6px', borderRadius: 4 }}>
                  {s.sector}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Portfolio value */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>PORTFOLIO</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {formatCash(portfolioValue)}
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '2px 7px', borderRadius: 6,
            background: isUp ? 'var(--positive-bg)' : 'var(--negative-bg)',
            color: isUp ? 'var(--positive)' : 'var(--negative)',
          }}>
            {formatPct(returnPct)}
          </span>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--positive)' }} />
        <span style={{ fontSize: '0.7rem', color: 'var(--positive)', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
      </div>

      {/* Notifications */}
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6 }}>
        <Bell size={18} />
      </button>

      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--brand), var(--violet))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 700, color: '#000', cursor: 'pointer',
      }}>
        U
      </div>
    </header>
  );
}
