'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, X, Plus, Search } from 'lucide-react';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatChange } from '@/lib/finnhub';
import { loadPortfolio, savePortfolio, PortfolioState } from '@/lib/store';

export default function WatchlistPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DEMO_STOCKS>([]);

  useEffect(() => {
    setPortfolio(loadPortfolio());
  }, []);

  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    const q = query.toUpperCase();
    setSearchResults(DEMO_STOCKS.filter(s => (s.symbol.includes(q) || s.name.toUpperCase().includes(q)) && !portfolio?.watchlist.includes(s.symbol)).slice(0, 5));
  }, [query, portfolio]);

  const remove = (sym: string) => {
    if (!portfolio) return;
    const np = { ...portfolio, watchlist: portfolio.watchlist.filter(s => s !== sym) };
    savePortfolio(np); setPortfolio(np);
  };

  const add = (sym: string) => {
    if (!portfolio) return;
    if (portfolio.watchlist.includes(sym)) return;
    const np = { ...portfolio, watchlist: [...portfolio.watchlist, sym] };
    savePortfolio(np); setPortfolio(np);
    setQuery(''); setSearchResults([]);
  };

  const watchlist = portfolio?.watchlist ?? [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Watchlist</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{watchlist.length} stocks being tracked</p>
        </div>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Add stock to watchlist…" style={{ paddingLeft: 36, paddingRight: 12, height: 38, background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', width: '100%' }} />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, left: 0, background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              {searchResults.map(s => (
                <div key={s.symbol} onClick={() => add(s.symbol)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{s.symbol}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.name}</div>
                  </div>
                  <Plus size={16} color="var(--brand)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {watchlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <Star size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Your watchlist is empty</div>
            <div style={{ fontSize: '0.82rem' }}>Search for a stock above to start tracking it</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 50px', padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
              {['Stock', 'Price', 'Change', 'Change %', ''].map(h => (
                <div key={h} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {watchlist.map(sym => {
              const stock = DEMO_STOCKS.find(s => s.symbol === sym);
              const price = DEMO_PRICES[sym];
              if (!price) return null;
              const isUp = price.changePercent >= 0;
              return (
                <div key={sym} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 50px', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Link href={`/stock/${sym}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
                      {sym.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sym}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{stock?.name}</div>
                    </div>
                  </Link>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }}>{formatPrice(price.price)}</div>
                  <div style={{ fontWeight: 600, color: isUp ? 'var(--positive)' : 'var(--negative)', fontFamily: 'monospace' }}>{formatChange(price.change)}</div>
                  <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: isUp ? 'var(--positive-bg)' : 'var(--negative-bg)', color: isUp ? 'var(--positive)' : 'var(--negative)', fontWeight: 700, fontSize: '0.8rem' }}>
                    {formatPct(price.changePercent)}
                  </div>
                  <button onClick={() => remove(sym)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6, transition: 'color 0.1s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--negative)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
