'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatChange, formatCash, formatLargeNum, getRiskColor, type RiskLevel } from '@/lib/finnhub';
import { loadPortfolio, executeBuy, executeSell, PortfolioState, savePortfolio } from '@/lib/store';

const StockChart = dynamic(() => import('@/components/StockChart'), { ssr: false });

type OrderType = 'market' | 'limit' | 'stop';
type Side = 'buy' | 'sell';

interface Toast { msg: string; ok: boolean; }

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const sym = symbol.toUpperCase();

  const stock = DEMO_STOCKS.find(s => s.symbol === sym);
  const price = DEMO_PRICES[sym] ?? { price: 100, change: 0, changePercent: 0 };

  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [side, setSide] = useState<Side>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [shares, setShares] = useState('');
  const [limitPrice, setLimitPrice] = useState(String(price.price.toFixed(2)));
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [chartDays, setChartDays] = useState(180);
  const [toast, setToast] = useState<Toast | null>(null);
  const [watchlisted, setWatchlisted] = useState(false);

  useEffect(() => {
    const p = loadPortfolio();
    setPortfolio(p);
    setWatchlisted(p.watchlist.includes(sym));
  }, [sym]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const position = portfolio?.positions[sym];
  const sharesNum = parseFloat(shares) || 0;
  const execPrice = orderType === 'market' ? price.price : parseFloat(limitPrice) || price.price;
  const total = sharesNum * execPrice;

  const handleTrade = () => {
    if (!portfolio || sharesNum <= 0) return;
    let result;
    if (side === 'buy') {
      result = executeBuy(portfolio, sym, stock?.name ?? sym, sharesNum, execPrice, stock?.sector ?? 'Unknown');
    } else {
      result = executeSell(portfolio, sym, sharesNum, execPrice);
    }
    if (result.success) {
      setPortfolio(result.state);
      setShares('');
      showToast(`${side === 'buy' ? 'Bought' : 'Sold'} ${sharesNum} share${sharesNum !== 1 ? 's' : ''} of ${sym} at ${formatPrice(execPrice)}`, true);
    } else {
      showToast(result.error ?? 'Trade failed', false);
    }
  };

  const toggleWatchlist = () => {
    if (!portfolio) return;
    const newList = watchlisted
      ? portfolio.watchlist.filter(s => s !== sym)
      : [...portfolio.watchlist, sym];
    const newPortfolio = { ...portfolio, watchlist: newList };
    savePortfolio(newPortfolio);
    setPortfolio(newPortfolio);
    setWatchlisted(!watchlisted);
  };

  const maxBuy = portfolio ? Math.floor(portfolio.cash / execPrice) : 0;
  const isUp = price.changePercent >= 0;

  // Education tooltip content per stock
  const RISK_EXPLANATIONS: Record<string, string> = {
    Low: 'This stock moves slowly and is considered stable. Lower risk of sudden large losses.',
    Medium: 'Moderate price swings. A solid balance between growth potential and risk.',
    High: 'This stock can move dramatically in short periods. High reward potential with high risk.',
    Extreme: 'Extremely volatile. Can gain or lose 10%+ in a single day. Only for risk-tolerant traders.',
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 1000, background: toast.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? 'var(--positive)' : 'var(--negative)'}`, borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(8px)' }}>
          {toast.ok ? <CheckCircle size={18} color="var(--positive)" /> : <AlertCircle size={18} color="var(--negative)" />}
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: toast.ok ? 'var(--positive)' : 'var(--negative)' }}>{toast.msg}</span>
        </div>
      )}

      {/* Back + header */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/markets" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
          <ArrowLeft size={15} /> Back to Markets
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
              {sym.slice(0, 2)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{sym}</h1>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '3px 8px', borderRadius: 6 }}>{stock?.sector}</span>
                {stock && (
                  <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6, fontWeight: 700, color: getRiskColor(stock.risk as RiskLevel), background: `${getRiskColor(stock.risk as RiskLevel)}20` }}>
                    {stock.risk} Risk
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 3 }}>{stock?.name ?? sym}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleWatchlist} style={{ background: watchlisted ? 'rgba(245,158,11,0.12)' : 'transparent', border: `1px solid ${watchlisted ? 'rgba(245,158,11,0.3)' : 'var(--border-light)'}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: watchlisted ? 'var(--warning)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
              <Star size={16} fill={watchlisted ? 'currentColor' : 'none'} /> {watchlisted ? 'Watching' : 'Watch'}
            </button>
          </div>
        </div>

        {/* Price display */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {formatPrice(price.price)}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
              {isUp ? '▲' : '▼'} {formatChange(price.change)} ({formatPct(price.changePercent)})
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today</span>
          </div>
        </div>
      </div>

      {/* Main grid: chart + trade panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>

        {/* Chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Chart controls */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['candle', 'line'] as const).map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: chartType === t ? 'var(--bg-hover)' : 'transparent', color: chartType === t ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {t === 'candle' ? 'Candlestick' : 'Line'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['1W', 7], ['1M', 30], ['3M', 90], ['6M', 180], ['1Y', 365]].map(([label, d]) => (
                <button key={label} onClick={() => setChartDays(Number(d))} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: chartDays === d ? 'rgba(13,191,118,0.12)' : 'transparent', color: chartDays === d ? 'var(--brand)' : 'var(--text-muted)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 380, padding: 16 }}>
            <StockChart symbol={sym} basePrice={price.price} isUp={isUp} type={chartType} days={chartDays} />
          </div>
        </div>

        {/* Trade Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Trade {sym}</h2>

          {/* Buy / Sell toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, gap: 0 }}>
            {(['buy', 'sell'] as Side[]).map(s => (
              <button key={s} onClick={() => setSide(s)} style={{ padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.15s', background: side === s ? (s === 'buy' ? 'var(--positive)' : 'var(--negative)') : 'transparent', color: side === s ? '#fff' : 'var(--text-secondary)' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Order type */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Order Type</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['market', 'limit', 'stop'] as OrderType[]).map(t => (
                <button key={t} onClick={() => setOrderType(t)} style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: orderType === t ? 'rgba(13,191,118,0.1)' : 'transparent', color: orderType === t ? 'var(--brand)' : 'var(--text-secondary)', borderColor: orderType === t ? 'rgba(13,191,118,0.3)' : 'var(--border-light)' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Limit / stop price */}
          {orderType !== 'market' && (
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
              </div>
              <input value={limitPrice} onChange={e => setLimitPrice(e.target.value)} type="number" step="0.01" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }} />
            </div>
          )}

          {/* Shares */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Shares</span>
              {side === 'buy' && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max: {maxBuy}</span>}
              {side === 'sell' && position && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Owned: {position.shares}</span>}
            </div>
            <div style={{ position: 'relative' }}>
              <input value={shares} onChange={e => setShares(e.target.value)} type="number" min="0" step="1" placeholder="0" style={{ width: '100%', padding: '10px 60px 10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', fontFamily: 'monospace' }} />
              {side === 'buy' && (
                <button onClick={() => setShares(String(maxBuy))} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-hover)', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: '0.68rem', color: 'var(--brand)', fontWeight: 700, cursor: 'pointer' }}>MAX</button>
              )}
            </div>
          </div>

          {/* Quick fractions */}
          {side === 'buy' && maxBuy > 0 && (
            <div style={{ display: 'flex', gap: 6 }}>
              {[25, 50, 75, 100].map(pct => (
                <button key={pct} onClick={() => setShares(String(Math.floor(maxBuy * pct / 100)))} style={{ flex: 1, padding: '5px 0', borderRadius: 6, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                  {pct}%
                </button>
              ))}
            </div>
          )}

          {/* Summary */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Market price</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{formatPrice(price.price)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shares</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{sharesNum || '—'}</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }}>{sharesNum > 0 ? formatCash(total) : '—'}</span>
            </div>
          </div>

          {/* Cash available */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Cash available: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{portfolio ? formatCash(portfolio.cash) : '—'}</strong>
          </div>

          {/* Submit */}
          <button onClick={handleTrade} disabled={sharesNum <= 0} style={{ background: side === 'buy' ? 'var(--positive)' : 'var(--negative)', color: '#fff', fontWeight: 800, padding: '13px', borderRadius: 10, border: 'none', cursor: sharesNum <= 0 ? 'not-allowed' : 'pointer', fontSize: '0.95rem', opacity: sharesNum <= 0 ? 0.4 : 1, transition: 'opacity 0.15s' }}>
            {side === 'buy' ? '▲ Buy' : '▼ Sell'} {sym}
          </button>

          {/* Education note */}
          {stock && (
            <div style={{ background: 'rgba(13,191,118,0.06)', border: '1px solid rgba(13,191,118,0.15)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--brand)', fontWeight: 700, marginBottom: 4 }}>RISK INDICATOR</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {RISK_EXPLANATIONS[stock.risk]}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: "Today's Open", value: formatPrice(price.price * 0.99) },
          { label: "Day High", value: formatPrice(price.price * 1.008) },
          { label: "Day Low", value: formatPrice(price.price * 0.992) },
          { label: "Prev. Close", value: formatPrice(price.price - price.change) },
          { label: "52W High", value: formatPrice(price.price * 1.28) },
          { label: "52W Low", value: formatPrice(price.price * 0.72) },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Current position */}
      {position && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 }}>Your Position in {sym}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
            {[
              { label: 'Shares', value: String(position.shares) },
              { label: 'Avg Cost', value: formatPrice(position.avgCost) },
              { label: 'Current Value', value: formatCash(position.shares * price.price) },
              { label: 'Unrealized P&L', value: `${(price.price - position.avgCost) * position.shares >= 0 ? '+' : ''}${formatCash((price.price - position.avgCost) * position.shares)}`, color: (price.price - position.avgCost) >= 0 ? 'var(--positive)' : 'var(--negative)' },
              { label: 'Return', value: formatPct(((price.price - position.avgCost) / position.avgCost) * 100), color: (price.price - position.avgCost) >= 0 ? 'var(--positive)' : 'var(--negative)' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem', color: s.color ?? 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
