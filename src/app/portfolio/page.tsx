'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart, BarChart2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { DEMO_PRICES, DEMO_STOCKS, formatCash, formatPrice, formatPct } from '@/lib/finnhub';
import { loadPortfolio, getTotalValue, getTotalReturn, getTotalReturnPct, resetPortfolio, PortfolioState } from '@/lib/store';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const p = loadPortfolio();
    Object.keys(p.positions).forEach(sym => {
      if (DEMO_PRICES[sym]) p.positions[sym].currentPrice = DEMO_PRICES[sym].price;
    });
    setPortfolio(p);
  }, []);

  if (!portfolio) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading portfolio…</div>;

  const totalValue = getTotalValue(portfolio);
  const totalReturn = getTotalReturn(portfolio);
  const totalReturnPct = getTotalReturnPct(portfolio);
  const positions = Object.values(portfolio.positions);
  const isUp = totalReturn >= 0;

  // Sector allocation
  const sectorMap: Record<string, number> = {};
  positions.forEach(pos => {
    const stock = DEMO_STOCKS.find(s => s.symbol === pos.symbol);
    const sector = stock?.sector ?? 'Unknown';
    sectorMap[sector] = (sectorMap[sector] ?? 0) + pos.shares * pos.currentPrice;
  });
  const sectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
  const totalPositionsValue = positions.reduce((s, p) => s + p.shares * p.currentPrice, 0);

  // Diversification warning
  const largestPosition = positions.reduce((max, p) => {
    const val = p.shares * p.currentPrice;
    return val > max.val ? { sym: p.symbol, val } : max;
  }, { sym: '', val: 0 });
  const largestPct = totalPositionsValue > 0 ? (largestPosition.val / totalValue) * 100 : 0;
  const showDiversificationWarning = largestPct > 50 && positions.length > 0;

  const SECTOR_COLORS = ['#0DBF76', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Portfolio</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Your holdings and performance</p>
        </div>
        <button onClick={() => setConfirmReset(true)} style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Reset Portfolio
        </button>
      </div>

      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <AlertTriangle size={40} color="var(--warning)" style={{ display: 'block', margin: '0 auto 16px' }} />
            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Reset Portfolio?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>This will clear all positions, transactions, and reset cash to $100,000. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmReset(false)} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { setPortfolio(resetPortfolio()); setConfirmReset(false); }} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--negative)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Value', value: formatCash(totalValue), sub: 'cash + positions' },
          { label: 'Total Return', value: `${isUp ? '+' : ''}${totalReturnPct.toFixed(2)}%`, sub: `${isUp ? '+' : ''}${formatCash(totalReturn)}`, color: isUp ? 'var(--positive)' : 'var(--negative)' },
          { label: 'Cash', value: formatCash(portfolio.cash), sub: `${((portfolio.cash / totalValue) * 100).toFixed(1)}% of portfolio` },
          { label: 'Positions', value: String(positions.length), sub: 'active holdings' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: s.color ?? 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {showDiversificationWarning && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={18} color="var(--warning)" />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)' }}>Concentration Risk — </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {largestPosition.sym} makes up {largestPct.toFixed(0)}% of your portfolio. Consider diversifying to reduce risk.
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 20 }}>

        {/* Holdings table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={18} color="var(--brand)" />
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Holdings</h2>
          </div>

          {positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>📊</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No holdings</div>
              <div style={{ fontSize: '0.8rem', marginBottom: 20 }}>Start trading to build your portfolio</div>
              <Link href="/markets"><button style={{ background: 'var(--brand)', color: '#000', fontWeight: 700, padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Browse Markets</button></Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
                {['Symbol', 'Shares', 'Avg Cost', 'Value', 'P&L'].map(h => (
                  <div key={h} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {positions.map(pos => {
                const pnl = (pos.currentPrice - pos.avgCost) * pos.shares;
                const pnlPct = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;
                const posUp = pnl >= 0;
                return (
                  <Link key={pos.symbol} href={`/stock/${pos.symbol}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pos.symbol}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{formatPrice(pos.currentPrice)}</div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{pos.shares}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{formatPrice(pos.avgCost)}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700 }}>{formatCash(pos.shares * pos.currentPrice)}</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: posUp ? 'var(--positive)' : 'var(--negative)' }}>{posUp ? '+' : ''}{formatCash(pnl)}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: posUp ? 'var(--positive)' : 'var(--negative)' }}>{formatPct(pnlPct)}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Sector allocation */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <PieChart size={18} color="var(--brand)" />
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Sector Allocation</h2>
            </div>
            {sectors.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 20 }}>No positions to display</div>
            ) : (
              sectors.map(([sector, val], i) => {
                const pct = (val / totalValue) * 100;
                return (
                  <div key={sector} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sector}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{pct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: SECTOR_COLORS[i % SECTOR_COLORS.length], borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                );
              })
            )}
            {/* Cash */}
            {portfolio.cash > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Cash</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{((portfolio.cash / totalValue) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(portfolio.cash / totalValue) * 100}%`, background: 'var(--text-muted)', borderRadius: 3 }} />
                </div>
              </div>
            )}
          </div>

          {/* Transaction history */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 }}>Recent Transactions</h2>
            {portfolio.transactions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: 16 }}>No transactions yet</div>
            ) : (
              [...portfolio.transactions].reverse().slice(0, 8).map(tx => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: tx.side === 'buy' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tx.side === 'buy' ? <TrendingUp size={14} color="var(--positive)" /> : <TrendingDown size={14} color="var(--negative)" />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{tx.side === 'buy' ? 'Buy' : 'Sell'} {tx.symbol}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.shares} shares @ {formatPrice(tx.price)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: tx.side === 'buy' ? 'var(--negative)' : 'var(--positive)' }}>
                      {tx.side === 'buy' ? '-' : '+'}{formatCash(tx.total)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(tx.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
