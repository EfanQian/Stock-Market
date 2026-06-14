'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Zap, ArrowRight, Star } from 'lucide-react';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatCash } from '@/lib/finnhub';
import { loadPortfolio, getTotalValue, getTotalReturn, getTotalReturnPct, PortfolioState } from '@/lib/store';
import { usePrices } from '@/lib/usePrices';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 24px', flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'monospace', color: color ?? 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MoverRow({ symbol, name, price, changePercent }: {
  symbol: string; name: string; price: number; change: number; changePercent: number; sector: string;
}) {
  const isUp = changePercent >= 0;
  return (
    <Link href={`/stock/${symbol}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, fontWeight: 800,
            background: isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', color: isUp ? 'var(--positive)' : 'var(--negative)',
          }}>{symbol.slice(0, 2)}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{symbol}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{name}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formatPrice(price)}</div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '2px 6px', borderRadius: 5, marginTop: 2,
            background: isUp ? 'var(--positive-bg)' : 'var(--negative-bg)',
            color: isUp ? 'var(--positive)' : 'var(--negative)', display: 'inline-block',
          }}>
            {isUp ? '▲' : '▼'} {formatPct(changePercent)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const livePrices = usePrices(DEMO_STOCKS.map(s => s.symbol));
  const getPrice = (sym: string) => livePrices[sym] ?? DEMO_PRICES[sym];

  useEffect(() => {
    const p = loadPortfolio();
    Object.keys(p.positions).forEach(sym => {
      const lp = getPrice(sym);
      if (lp) p.positions[sym].currentPrice = lp.price;
    });
    setPortfolio(p);
  }, [Object.keys(livePrices).length]);

  const totalValue = portfolio ? getTotalValue(portfolio) : 100000;
  const totalReturn = portfolio ? getTotalReturn(portfolio) : 0;
  const totalReturnPct = portfolio ? getTotalReturnPct(portfolio) : 0;
  const isUp = totalReturn >= 0;

  const gainers = DEMO_STOCKS.filter(s => (getPrice(s.symbol)?.changePercent ?? 0) > 0)
    .sort((a, b) => (getPrice(b.symbol)?.changePercent ?? 0) - (getPrice(a.symbol)?.changePercent ?? 0))
    .slice(0, 5);
  const losers = DEMO_STOCKS.filter(s => (getPrice(s.symbol)?.changePercent ?? 0) < 0)
    .sort((a, b) => (getPrice(a.symbol)?.changePercent ?? 0) - (getPrice(b.symbol)?.changePercent ?? 0))
    .slice(0, 5);

  const positions = portfolio ? Object.values(portfolio.positions) : [];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Welcome back. Here&apos;s your market overview.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/markets">
            <button style={{ background: 'var(--brand)', color: '#000', fontWeight: 700, padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}>
              <Zap size={15} /> Trade Now
            </button>
          </Link>
          <Link href="/simulation">
            <button style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '10px 18px', borderRadius: 8, border: '1px solid var(--border-light)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              Run Simulation
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard label="Portfolio Value" value={formatCash(totalValue)} sub={`${isUp ? '+' : ''}${formatCash(totalReturn)} all time`} />
        <StatCard label="Total Return" value={`${totalReturnPct >= 0 ? '+' : ''}${totalReturnPct.toFixed(2)}%`} sub="vs. $100,000 starting cash" color={isUp ? 'var(--positive)' : 'var(--negative)'} />
        <StatCard label="Cash Available" value={portfolio ? formatCash(portfolio.cash) : '$100,000.00'} sub="Ready to deploy" />
        <StatCard label="Positions" value={String(positions.length)} sub="Active holdings" />
      </div>

      {/* Movers grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--positive)" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Top Gainers</h2>
            </div>
            <Link href="/markets" style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>See all <ArrowRight size={13} /></Link>
          </div>
          {gainers.map(s => { const p = getPrice(s.symbol); return p ? <MoverRow key={s.symbol} {...s} price={p.price} change={p.change} changePercent={p.changePercent} /> : null; })}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingDown size={18} color="var(--negative)" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Top Losers</h2>
            </div>
            <Link href="/markets" style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>See all <ArrowRight size={13} /></Link>
          </div>
          {losers.map(s => { const p = getPrice(s.symbol); return p ? <MoverRow key={s.symbol} {...s} price={p.price} change={p.change} changePercent={p.changePercent} /> : null; })}
        </div>
      </div>

      {/* Positions + Watchlist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={18} color="var(--brand)" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Your Positions</h2>
            </div>
            <Link href="/portfolio" style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>Full portfolio <ArrowRight size={13} /></Link>
          </div>
          {positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <DollarSign size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No positions yet</div>
              <div style={{ fontSize: '0.8rem', marginBottom: 16 }}>Start trading with your $100,000 virtual cash</div>
              <Link href="/markets">
                <button style={{ background: 'var(--brand)', color: '#000', fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Browse Markets
                </button>
              </Link>
            </div>
          ) : (
            positions.slice(0, 6).map(pos => {
              const pnl = (pos.currentPrice - pos.avgCost) * pos.shares;
              const pnlPct = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;
              const posUp = pnl >= 0;
              return (
                <Link key={pos.symbol} href={`/stock/${pos.symbol}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{pos.symbol}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{pos.shares} shares · avg {formatPrice(pos.avgCost)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem' }}>{formatCash(pos.shares * pos.currentPrice)}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: posUp ? 'var(--positive)' : 'var(--negative)' }}>
                        {posUp ? '+' : ''}{formatCash(pnl)} ({formatPct(pnlPct)})
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={18} color="var(--warning)" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Watchlist</h2>
            </div>
            <Link href="/watchlist" style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>Manage <ArrowRight size={13} /></Link>
          </div>
          {(portfolio?.watchlist ?? ['AAPL', 'NVDA', 'TSLA', 'MSFT']).map(sym => {
            const stock = DEMO_STOCKS.find(s => s.symbol === sym);
            const price = getPrice(sym);
            if (!stock || !price) return null;
            const up = price.changePercent >= 0;
            return (
              <Link key={sym} href={`/stock/${sym}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{sym}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{stock.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem' }}>{formatPrice(price.price)}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: up ? 'var(--positive)' : 'var(--negative)' }}>{formatPct(price.changePercent)}</div>
                  </div>
                </div>
              </Link>
            );
          })}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>INDICES</div>
            {[
              { name: 'S&P 500', value: '5,842.30', change: '+0.55%', up: true },
              { name: 'NASDAQ', value: '19,021.40', change: '+0.83%', up: true },
              { name: 'Dow Jones', value: '42,215.80', change: '+0.21%', up: true },
            ].map(idx => (
              <div key={idx.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{idx.name}</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600 }}>
                  {idx.value} <span style={{ color: idx.up ? 'var(--positive)' : 'var(--negative)' }}>{idx.change}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
