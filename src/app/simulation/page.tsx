'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Zap, FastForward, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatCash, getRiskColor, type RiskLevel } from '@/lib/finnhub';

const StockChart = dynamic(() => import('@/components/StockChart'), { ssr: false });

type Speed = 1 | 10 | 100;
type SimState = 'idle' | 'running' | 'paused' | 'done';

interface SimPortfolio {
  cash: number;
  positions: Record<string, { shares: number; avgCost: number }>;
}

const PREDICTION_POOL = [
  { direction: 'bullish' as const, confidence: 72, summary: 'Strong institutional buying pressure observed. Analyst upgrades following positive earnings guidance. Broader sector momentum supports continued upside.', factors: [{ f: 'Earnings beat', s: 'positive', w: 'high' }, { f: 'Sector rotation into growth', s: 'positive', w: 'medium' }, { f: 'Fed rate hold', s: 'positive', w: 'medium' }] },
  { direction: 'bearish' as const, confidence: 65, summary: 'Elevated valuation multiples and recent insider selling raise concern. Rising bond yields are drawing capital away from equities. Watch for a potential pullback.', factors: [{ f: 'High P/E vs peers', s: 'negative', w: 'high' }, { f: 'Insider selling', s: 'negative', w: 'medium' }, { f: 'Rising yields', s: 'negative', w: 'medium' }] },
  { direction: 'neutral' as const, confidence: 48, summary: 'Mixed signals in the near term. Positive fundamentals offset by macro uncertainty. Price likely to consolidate before next directional move.', factors: [{ f: 'Strong cash flow', s: 'positive', w: 'medium' }, { f: 'Macro uncertainty', s: 'negative', w: 'medium' }, { f: 'Sideways price action', s: 'neutral', w: 'low' }] },
  { direction: 'bullish' as const, confidence: 81, summary: 'Recent product launch exceeded expectations and generated significant media coverage. Supply chain improvements and margin expansion suggest robust quarterly results ahead.', factors: [{ f: 'Viral product launch', s: 'positive', w: 'high' }, { f: 'Margin expansion', s: 'positive', w: 'high' }, { f: 'Supply chain resolved', s: 'positive', w: 'medium' }] },
];

export default function SimulationPage() {
  const [selectedSym, setSelectedSym] = useState('AAPL');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [speed, setSpeed] = useState<Speed>(10);
  const [simState, setSimState] = useState<SimState>('idle');
  const [simDay, setSimDay] = useState(0);
  const [totalDays] = useState(252); // ~1 year trading days
  const [simPortfolio, setSimPortfolio] = useState<SimPortfolio>({ cash: 100000, positions: {} });
  const [simShares, setSimShares] = useState('');
  const [prediction, setPrediction] = useState<typeof PREDICTION_POOL[0] | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [horizon, setHorizon] = useState<'1_day' | '1_week' | '1_month'>('1_week');
  const [showPrediction, setShowPrediction] = useState(false);
  const [toast, setToast] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stock = DEMO_STOCKS.find(s => s.symbol === selectedSym)!;
  const basePrice = DEMO_PRICES[selectedSym]?.price ?? 150;
  const isUp = (DEMO_PRICES[selectedSym]?.changePercent ?? 0) >= 0;

  // Simulated current price drifts as days advance
  const simPrice = basePrice * (1 + (simDay / totalDays) * (isUp ? 0.25 : -0.12) + (Math.sin(simDay * 0.3) * 0.04));
  const simReturn = simPortfolio.cash + Object.values(simPortfolio.positions).reduce((s, p) => s + p.shares * simPrice, 0) - 100000;
  const simReturnPct = (simReturn / 100000) * 100;

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startSim = () => {
    setSimState('running');
    setSimDay(0);
    setSimPortfolio({ cash: 100000, positions: {} });
    intervalRef.current = setInterval(() => {
      setSimDay(d => {
        if (d >= totalDays) {
          setSimState('done');
          if (intervalRef.current) clearInterval(intervalRef.current);
          return totalDays;
        }
        return d + 1;
      });
    }, 1000 / speed);
  };

  const pauseSim = () => {
    setSimState('paused');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resumeSim = () => {
    setSimState('running');
    intervalRef.current = setInterval(() => {
      setSimDay(d => {
        if (d >= totalDays) { setSimState('done'); if (intervalRef.current) clearInterval(intervalRef.current); return totalDays; }
        return d + 1;
      });
    }, 1000 / speed);
  };

  const stopSim = () => {
    setSimState('idle');
    setSimDay(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleSimTrade = (side: 'buy' | 'sell') => {
    const sh = parseFloat(simShares);
    if (!sh || sh <= 0) return;
    if (side === 'buy') {
      const cost = sh * simPrice;
      if (cost > simPortfolio.cash) { setToast('Insufficient cash'); setTimeout(() => setToast(''), 2000); return; }
      const pos = simPortfolio.positions[selectedSym];
      setSimPortfolio(p => ({ ...p, cash: p.cash - cost, positions: { ...p.positions, [selectedSym]: { shares: (pos?.shares ?? 0) + sh, avgCost: pos ? (pos.shares * pos.avgCost + cost) / (pos.shares + sh) : simPrice } } }));
    } else {
      const pos = simPortfolio.positions[selectedSym];
      if (!pos || pos.shares < sh) { setToast('Insufficient shares'); setTimeout(() => setToast(''), 2000); return; }
      const newShares = pos.shares - sh;
      const newPos = { ...simPortfolio.positions };
      if (newShares === 0) delete newPos[selectedSym]; else newPos[selectedSym] = { ...pos, shares: newShares };
      setSimPortfolio(p => ({ ...p, cash: p.cash + sh * simPrice, positions: newPos }));
    }
    setSimShares('');
  };

  const runPrediction = () => {
    setPredicting(true);
    setTimeout(() => {
      setPrediction(PREDICTION_POOL[Math.floor(Math.random() * PREDICTION_POOL.length)]);
      setPredicting(false);
    }, 1800);
  };

  const progress = totalDays > 0 ? (simDay / totalDays) * 100 : 0;

  const dirColor = prediction?.direction === 'bullish' ? 'var(--positive)' : prediction?.direction === 'bearish' ? 'var(--negative)' : 'var(--text-secondary)';
  const confColor = !prediction ? 'var(--text-muted)' : prediction.confidence >= 70 ? 'var(--positive)' : prediction.confidence >= 41 ? 'var(--warning)' : 'var(--negative)';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Simulation Mode</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Travel back in time and trade using real historical prices. Test your strategy.
        </p>
      </div>

      {toast && <div style={{ position: 'fixed', top: 80, right: 24, background: 'var(--negative-bg)', border: '1px solid var(--negative)', borderRadius: 9, padding: '10px 16px', color: 'var(--negative)', fontWeight: 600, fontSize: '0.875rem', zIndex: 100 }}>{toast}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <div>
          {/* Config + controls */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 14, alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</div>
                <select value={selectedSym} onChange={e => setSelectedSym(e.target.value)} disabled={simState !== 'idle'} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none' }}>
                  {DEMO_STOCKS.filter(s => s.symbol !== 'BTC-USD').map(s => (
                    <option key={s.symbol} value={s.symbol} style={{ background: 'var(--bg-secondary)' }}>{s.symbol} — {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</div>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={simState !== 'idle'} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</div>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={simState !== 'idle'} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {simState === 'idle' && <button onClick={startSim} style={{ height: 38, padding: '0 18px', background: 'var(--brand)', color: '#000', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}><Play size={15} /> Start</button>}
                {simState === 'running' && <button onClick={pauseSim} style={{ height: 38, padding: '0 14px', background: 'var(--warning)', color: '#000', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Pause size={15} /></button>}
                {simState === 'paused' && <button onClick={resumeSim} style={{ height: 38, padding: '0 14px', background: 'var(--positive)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Play size={15} /></button>}
                {simState !== 'idle' && <button onClick={stopSim} style={{ height: 38, padding: '0 14px', background: 'var(--negative)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Square size={15} /></button>}
              </div>
            </div>

            {/* Speed + progress */}
            {simState !== 'idle' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {([1, 10, 100] as Speed[]).map(s => (
                      <button key={s} onClick={() => setSpeed(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, background: speed === s ? 'rgba(139,92,246,0.12)' : 'transparent', color: speed === s ? 'var(--violet)' : 'var(--text-muted)', borderColor: speed === s ? 'rgba(139,92,246,0.3)' : 'var(--border-light)' }}>
                        {s}×
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Day {simDay} / {totalDays} ({progress.toFixed(0)}%)</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--brand)', borderRadius: 3, transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedSym}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stock?.name}</span>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700, color: getRiskColor(stock?.risk as RiskLevel), background: `${getRiskColor(stock?.risk as RiskLevel)}20` }}>{stock?.risk} Risk</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem' }}>
                {formatPrice(simState !== 'idle' ? simPrice : basePrice)}
                <span style={{ fontSize: '0.8rem', marginLeft: 8, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
                  {isUp ? '▲' : '▼'} {formatPct(DEMO_PRICES[selectedSym]?.changePercent ?? 0)}
                </span>
              </div>
            </div>
            <div style={{ height: 320, padding: 16 }}>
              <StockChart symbol={selectedSym} basePrice={basePrice} isUp={isUp} type="candle" days={365} />
            </div>
          </div>

          {/* Results */}
          {simState === 'done' && (
            <div style={{ background: simReturn >= 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${simReturn >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800 }}>Simulation Complete!</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  { label: 'Final Value', value: formatCash(100000 + simReturn) },
                  { label: 'Total Return', value: `${simReturnPct >= 0 ? '+' : ''}${simReturnPct.toFixed(2)}%`, color: simReturn >= 0 ? 'var(--positive)' : 'var(--negative)' },
                  { label: 'vs S&P 500', value: '+12.4% S&P 500', color: 'var(--text-secondary)' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: s.color ?? 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <button onClick={stopSim} style={{ marginTop: 20, padding: '10px 20px', background: 'var(--brand)', color: '#000', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                Run Another Simulation
              </button>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Sim portfolio */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 }}>Simulation Portfolio</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Cash</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem' }}>{formatCash(simPortfolio.cash)}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Return</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: simReturn >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                  {simReturn >= 0 ? '+' : ''}{simReturnPct.toFixed(2)}%
                </div>
              </div>
            </div>

            {simState !== 'idle' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <input value={simShares} onChange={e => setSimShares(e.target.value)} type="number" placeholder="Shares" min="1" style={{ padding: '8px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 7, color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>
                    {simShares ? formatCash(parseFloat(simShares) * simPrice) : '—'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => handleSimTrade('buy')} style={{ padding: '9px', background: 'var(--positive)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>▲ Buy</button>
                  <button onClick={() => handleSimTrade('sell')} style={{ padding: '9px', background: 'var(--negative)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>▼ Sell</button>
                </div>
              </>
            )}

            {Object.keys(simPortfolio.positions).length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Holdings</div>
                {Object.entries(simPortfolio.positions).map(([sym, pos]) => (
                  <div key={sym} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{sym}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{pos.shares} shares</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700 }}>{formatCash(pos.shares * simPrice)}</div>
                      <div style={{ fontSize: '0.7rem', color: ((simPrice - pos.avgCost) * pos.shares) >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                        {formatPct(((simPrice - pos.avgCost) / pos.avgCost) * 100)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Prediction Panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={18} color="var(--violet)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--violet)' }}>AI Prediction</span>
              </div>
              <button onClick={() => setShowPrediction(!showPrediction)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                {showPrediction ? '▲' : '▼'}
              </button>
            </div>

            {showPrediction && (
              <div style={{ padding: 16 }}>
                {/* Horizon selector */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {([['1_day', '1 Day'], ['1_week', '1 Week'], ['1_month', '1 Month']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setHorizon(val)} style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, background: horizon === val ? 'rgba(139,92,246,0.12)' : 'transparent', color: horizon === val ? 'var(--violet)' : 'var(--text-muted)', borderColor: horizon === val ? 'rgba(139,92,246,0.3)' : 'var(--border-light)' }}>
                      {label}
                    </button>
                  ))}
                </div>

                {!prediction && !predicting && (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                      AI analyses current and historical news to predict price direction for {selectedSym}.
                    </p>
                    <button onClick={runPrediction} style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--violet)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
                      <Zap size={15} /> Run AI Prediction
                    </button>
                  </div>
                )}

                {predicting && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analysing news and market data…</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {prediction && !predicting && (
                  <div>
                    {/* Direction */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Direction</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '1rem', color: dirColor }}>
                          {prediction.direction === 'bullish' ? <TrendingUp size={18} /> : prediction.direction === 'bearish' ? <TrendingDown size={18} /> : <Minus size={18} />}
                          {prediction.direction.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Confidence</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: confColor, fontFamily: 'monospace' }}>{prediction.confidence}%</div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: confColor }}>{prediction.confidence >= 70 ? 'HIGH' : prediction.confidence >= 41 ? 'MODERATE' : 'LOW'}</div>
                      </div>
                    </div>

                    {/* Key factors */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Key Factors</div>
                      {prediction.factors.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.7rem', color: f.s === 'positive' ? 'var(--positive)' : f.s === 'negative' ? 'var(--negative)' : 'var(--text-muted)', fontWeight: 700 }}>
                              {f.s === 'positive' ? '[+]' : f.s === 'negative' ? '[−]' : '[~]'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.f}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--border)', padding: '2px 6px', borderRadius: 4 }}>{f.w.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                      {prediction.summary}
                    </div>

                    {/* Disclaimer */}
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.5, padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 7 }}>
                      ⚠ AI estimate only. Not financial advice. Actual performance may differ.
                    </div>

                    <button onClick={runPrediction} style={{ marginTop: 10, width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 7, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                      Refresh Prediction
                    </button>
                  </div>
                )}
              </div>
            )}

            {!showPrediction && (
              <div style={{ padding: '12px 16px' }}>
                <button onClick={() => { setShowPrediction(true); runPrediction(); }} style={{ width: '100%', padding: '9px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, color: 'var(--violet)', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Zap size={14} /> AI Prediction — {selectedSym}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
