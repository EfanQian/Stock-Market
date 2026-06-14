'use client';

import { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DEMO_STOCKS, formatCash, formatPct } from '@/lib/finnhub';
import { loadPortfolio, getTotalValue, getTotalReturnPct } from '@/lib/store';
import { usePrices } from '@/lib/usePrices';

function useMarketStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string }>({ open: false, label: '' });

  useEffect(() => {
    function compute() {
      // NYSE hours: 9:30–16:00 ET, Mon–Fri
      const now = new Date();
      const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = et.getDay();
      const h = et.getHours();
      const m = et.getMinutes();
      const mins = h * 60 + m;
      const isWeekday = day >= 1 && day <= 5;
      const inSession = mins >= 570 && mins < 960; // 9:30–16:00
      const open = isWeekday && inSession;

      let label: string;
      if (open) {
        const closeH = 16, closeM = 0;
        const remaining = (closeH * 60 + closeM) - mins;
        label = `OPEN · closes in ${Math.floor(remaining / 60)}h ${remaining % 60}m`;
      } else if (!isWeekday) {
        label = 'CLOSED · opens Mon 9:30 AM ET';
      } else if (mins < 570) {
        const remaining = 570 - mins;
        label = `CLOSED · opens in ${Math.floor(remaining / 60)}h ${remaining % 60}m`;
      } else {
        label = 'CLOSED · opens tomorrow 9:30 AM ET';
      }
      setStatus({ open, label });
    }
    compute();
    const t = setInterval(compute, 60000);
    return () => clearInterval(t);
  }, []);

  return status;
}

export default function Topbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof DEMO_STOCKS>([]);
  const [portfolio, setPortfolio] = useState<ReturnType<typeof loadPortfolio> | null>(null);
  const router = useRouter();
  const market = useMarketStatus();
  const livePrices = usePrices(DEMO_STOCKS.map(s => s.symbol));

  useEffect(() => {
    setPortfolio(loadPortfolio());
    const refresh = () => setPortfolio(loadPortfolio());
    window.addEventListener('portfolio-updated', refresh);
    return () => window.removeEventListener('portfolio-updated', refresh);
  }, []);

  // Update portfolio current prices when live data arrives
  useEffect(() => {
    if (!portfolio || Object.keys(livePrices).length === 0) return;
    const updated = { ...portfolio, positions: { ...portfolio.positions } };
    Object.keys(updated.positions).forEach(sym => {
      if (livePrices[sym]) updated.positions[sym] = { ...updated.positions[sym], currentPrice: livePrices[sym].price };
    });
    setPortfolio(updated);
  }, [livePrices]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toUpperCase();
    setResults(DEMO_STOCKS.filter(s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)).slice(0, 5));
  }, [query]);

  const totalValue = portfolio ? getTotalValue(portfolio) : 100000;
  const returnPct = portfolio ? getTotalReturnPct(portfolio) : 0;
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', transition: 'background 0.1s' }}
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
            {formatCash(totalValue)}
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

      {/* Market status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className={market.open ? 'live-dot' : undefined} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: market.open ? 'var(--positive)' : 'var(--text-muted)',
        }} />
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
          color: market.open ? 'var(--positive)' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}>
          {market.label || (market.open ? 'OPEN' : 'CLOSED')}
        </span>
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
