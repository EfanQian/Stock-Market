'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Square, Zap, Brain, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DEMO_STOCKS, DEMO_PRICES, formatPrice, formatPct, formatCash, getRiskColor, type RiskLevel } from '@/lib/finnhub';
import { usePrice } from '@/lib/usePrices';
import { loadPortfolio, executeBuy, executeSell } from '@/lib/store';

const StockChart = dynamic(() => import('@/components/StockChart'), { ssr: false });

type Speed = 1 | 10 | 100;
type SimState = 'idle' | 'loading' | 'running' | 'paused' | 'done';

interface Bar { time: number; open: number; high: number; low: number; close: number; volume: number; }

interface SimPortfolio {
  cash: number;
  positions: Record<string, { shares: number; avgCost: number }>;
}

interface Prediction {
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  summary: string;
  factors: Array<{ f: string; s: string; w: string }>;
}

function countTradingDays(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur < e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function generateAIDrivenBars(
  basePrice: number,
  numDays: number,
  startDateStr: string,
  direction: 'bullish' | 'bearish' | 'neutral',
  confidence: number,
): Bar[] {
  const bars: Bar[] = [];
  const startTime = Math.floor(new Date(startDateStr + 'T12:00:00').getTime() / 1000);
  const dirFactor = direction === 'bullish' ? 1 : direction === 'bearish' ? -1 : 0;
  // annual drift scaled by direction + confidence, daily vol ~1.2%
  const dailyDrift = dirFactor * (confidence / 100) * 0.4 / 252;
  const dailyVol = 0.012;

  let price = basePrice;
  let time = startTime;
  let count = 0;

  while (count < numDays) {
    const dow = new Date(time * 1000).getDay();
    if (dow !== 0 && dow !== 6) {
      const noise = (Math.random() - 0.5) * 2 * dailyVol;
      const open = price;
      const close = Math.max(price * (1 + dailyDrift + noise), 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.007);
      const low  = Math.min(open, close) * (1 - Math.random() * 0.007);
      bars.push({ time, open, high, low, close, volume: Math.floor(40e6 + Math.random() * 90e6) });
      price = close;
      count++;
    }
    time += 86400;
  }
  return bars;
}

export default function SimulationPage() {
  const [selectedSym, setSelectedSym] = useState('AAPL');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [speed, setSpeed] = useState<Speed>(10);
  const [simState, setSimState] = useState<SimState>('idle');
  const [simDay, setSimDay] = useState(0);
  const [simBars, setSimBars] = useState<Bar[]>([]);
  const [simPortfolio, setSimPortfolio] = useState<SimPortfolio>({ cash: 100000, positions: {} });
  const [simShares, setSimShares] = useState('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [horizon, setHorizon] = useState<'1_day' | '1_week' | '1_month'>('1_week');
  const [showPrediction, setShowPrediction] = useState(false);
  const [toast, setToast] = useState('');
  const [predictionLine, setPredictionLine] = useState<{ time: number; value: number }[] | null>(null);
  const [aiDriven, setAiDriven] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const livePrice = usePrice(selectedSym);
  const stock = DEMO_STOCKS.find(s => s.symbol === selectedSym)!;
  const basePrice = livePrice?.price ?? DEMO_PRICES[selectedSym]?.price ?? 150;
  const isUp = livePrice ? livePrice.changePercent >= 0 : (DEMO_PRICES[selectedSym]?.changePercent ?? 0) >= 0;

  // Days to show before sim starts (estimate)
  const previewDays = useMemo(() => countTradingDays(startDate, endDate), [startDate, endDate]);

  // Total days during simulation: use loaded bar count, fall back to estimate
  const totalDays = simBars.length > 0 ? simBars.length : previewDays;

  const simPrice = simBars.length > 0 && simDay < simBars.length
    ? simBars[simDay].close
    : basePrice;

  const simStartCash = useMemo(() => loadPortfolio().cash, []); // eslint-disable-line react-hooks/exhaustive-deps
  const simReturn = simPortfolio.cash + Object.values(simPortfolio.positions).reduce((s, p) => s + p.shares * simPrice, 0) - simStartCash;
  const simReturnPct = (simReturn / (simStartCash || 100000)) * 100;

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);


  // Restart interval when speed changes while running
  useEffect(() => {
    if (simState !== 'running') return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const days = simBars.length > 0 ? simBars.length : previewDays;
    intervalRef.current = setInterval(() => {
      setSimDay(d => {
        if (d >= days - 1) {
          setSimState('done');
          if (intervalRef.current) clearInterval(intervalRef.current);
          return days - 1;
        }
        return d + 1;
      });
    }, 1000 / speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSim = async () => {
    setSimState('loading');
    setSimDay(0);
    const real = loadPortfolio();
    setSimPortfolio({ cash: real.cash, positions: {} });
    setSimBars([]);
    setPredictionLine(null);
    setPrediction(null);

    // Fetch real bars and AI prediction in parallel
    const [barsResult, predResult] = await Promise.allSettled([
      fetch(`/api/bars/${selectedSym}?start=${startDate}&end=${endDate}`)
        .then(r => r.json() as Promise<{ bars: Bar[]; demo?: boolean }>),
      fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSym,
          stockName: stock?.name ?? selectedSym,
          horizon: '1_month',
          price: basePrice,
          changePercent: DEMO_PRICES[selectedSym]?.changePercent ?? 0,
        }),
      }).then(r => r.json() as Promise<Prediction>),
    ]);

    let bars: Bar[] = [];
    if (barsResult.status === 'fulfilled' && barsResult.value.bars?.length > 0) {
      bars = barsResult.value.bars;
    }

    const pred = predResult.status === 'fulfilled' ? predResult.value : null;
    if (pred) setPrediction(pred);

    // No real bars → generate AI-driven candlesticks
    if (bars.length === 0) {
      const numDays = countTradingDays(startDate, endDate);
      if (numDays === 0) {
        setToast('Invalid date range');
        setTimeout(() => setToast(''), 2000);
        setSimState('idle');
        return;
      }
      bars = generateAIDrivenBars(
        basePrice,
        numDays,
        startDate,
        pred?.direction ?? (isUp ? 'bullish' : 'bearish'),
        pred?.confidence ?? 55,
      );
      setAiDriven(true);
    } else {
      setAiDriven(false);
    }

    setSimBars(bars);

    const days = bars.length;
    setSimState('running');
    intervalRef.current = setInterval(() => {
      setSimDay(d => {
        if (d >= days - 1) {
          setSimState('done');
          if (intervalRef.current) clearInterval(intervalRef.current);
          return days - 1;
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
    const days = simBars.length > 0 ? simBars.length : previewDays;
    intervalRef.current = setInterval(() => {
      setSimDay(d => {
        if (d >= days - 1) { setSimState('done'); if (intervalRef.current) clearInterval(intervalRef.current); return days - 1; }
        return d + 1;
      });
    }, 1000 / speed);
  };

  const stopSim = () => {
    setSimState('idle');
    setSimDay(0);
    setSimBars([]);
    setPredictionLine(null);
    setPrediction(null);
    setAiDriven(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };


  function buildPredictionLine(pred: Prediction, bars: Bar[], day: number, h: typeof horizon) {
    if (bars.length === 0 || day >= bars.length) return;
    const horizonBars = h === '1_day' ? 1 : h === '1_week' ? 5 : 21;
    const dirFactor = pred.direction === 'bullish' ? 1 : pred.direction === 'bearish' ? -1 : 0;
    const driftPerBar = dirFactor * (pred.confidence / 100) * 0.004;

    const startBar = bars[day];
    const line: { time: number; value: number }[] = [{ time: startBar.time, value: startBar.close }];
    let price = startBar.close;
    const endIdx = Math.min(day + horizonBars, bars.length - 1);
    for (let i = day + 1; i <= endIdx; i++) {
      price = price * (1 + driftPerBar);
      line.push({ time: bars[i].time, value: price });
    }
    if (line.length >= 2) setPredictionLine(line);
  }

  const handleSimTrade = (side: 'buy' | 'sell') => {
    const sh = parseFloat(simShares);
    if (!sh || sh <= 0) return;
    const info = DEMO_STOCKS.find(s => s.symbol === selectedSym);
    if (side === 'buy') {
      const cost = sh * simPrice;
      if (cost > simPortfolio.cash) { setToast('Insufficient cash'); setTimeout(() => setToast(''), 2000); return; }
      const pos = simPortfolio.positions[selectedSym];
      setSimPortfolio(p => ({ ...p, cash: p.cash - cost, positions: { ...p.positions, [selectedSym]: { shares: (pos?.shares ?? 0) + sh, avgCost: pos ? (pos.shares * pos.avgCost + cost) / (pos.shares + sh) : simPrice } } }));
      executeBuy(loadPortfolio(), selectedSym, info?.name ?? selectedSym, sh, simPrice, info?.sector ?? 'Unknown');
    } else {
      const pos = simPortfolio.positions[selectedSym];
      if (!pos || pos.shares < sh) { setToast('Insufficient shares'); setTimeout(() => setToast(''), 2000); return; }
      const newShares = pos.shares - sh;
      const newPos = { ...simPortfolio.positions };
      if (newShares === 0) delete newPos[selectedSym]; else newPos[selectedSym] = { ...pos, shares: newShares };
      setSimPortfolio(p => ({ ...p, cash: p.cash + sh * simPrice, positions: newPos }));
      executeSell(loadPortfolio(), selectedSym, sh, simPrice);
    }
    setSimShares('');
  };

  const runPrediction = async () => {
    setPredicting(true);
    setPrediction(null);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSym,
          stockName: stock?.name ?? selectedSym,
          horizon,
          price: simState !== 'idle' ? simPrice : basePrice,
          changePercent: DEMO_PRICES[selectedSym]?.changePercent ?? 0,
        }),
      });
      if (res.ok) {
        const pred = await res.json() as Prediction;
        setPrediction(pred);
        buildPredictionLine(pred, simBars, simDay, horizon);
      }
    } catch { /* show nothing */ }
    setPredicting(false);
  };

  const progress = totalDays > 0 ? (simDay / (totalDays - 1)) * 100 : 0;
  const isActive = simState !== 'idle';

  // Current simulated date label
  const simDateLabel = useMemo(() => {
    if (!isActive || simBars.length === 0) return null;
    const bar = simBars[simDay];
    if (!bar) return null;
    return new Date(bar.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [simDay, simBars, isActive]);

  const dirColor = prediction?.direction === 'bullish' ? 'var(--positive)' : prediction?.direction === 'bearish' ? 'var(--negative)' : 'var(--text-secondary)';
  const predLineColor = prediction?.direction === 'bullish' ? '#22C55E' : prediction?.direction === 'bearish' ? '#EF4444' : '#8B5CF6';
  const confColor = !prediction ? 'var(--text-muted)' : prediction.confidence >= 70 ? 'var(--positive)' : prediction.confidence >= 41 ? 'var(--warning)' : 'var(--negative)';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Simulation Mode</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Travel back in time and trade using real historical prices. Test your strategy.
        </p>
      </div>

      {toast && <div style={{ position: 'fixed', top: 80, right: 24, background: toast === 'Portfolio updated!' ? 'rgba(34,197,94,0.1)' : 'var(--negative-bg)', border: `1px solid ${toast === 'Portfolio updated!' ? 'rgba(34,197,94,0.3)' : 'var(--negative)'}`, borderRadius: 9, padding: '10px 16px', color: toast === 'Portfolio updated!' ? 'var(--positive)' : 'var(--negative)', fontWeight: 600, fontSize: '0.875rem', zIndex: 100 }}>{toast}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <div>
          {/* Config + controls */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 14, alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</div>
                <select value={selectedSym} onChange={e => setSelectedSym(e.target.value)} disabled={isActive} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none' }}>
                  {DEMO_STOCKS.filter(s => s.symbol !== 'BTC-USD').map(s => (
                    <option key={s.symbol} value={s.symbol} style={{ background: 'var(--bg-secondary)' }}>{s.symbol} — {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</div>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isActive} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</div>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isActive} style={{ width: '100%', height: 38, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', padding: '0 10px', outline: 'none', colorScheme: 'dark' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {simState === 'idle' && (
                  <button onClick={startSim} disabled={previewDays === 0} style={{ height: 38, padding: '0 18px', background: 'var(--brand)', color: '#000', fontWeight: 800, borderRadius: 8, border: 'none', cursor: previewDays === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', opacity: previewDays === 0 ? 0.5 : 1 }}>
                    <Play size={15} /> Start
                  </button>
                )}
                {simState === 'loading' && (
                  <button disabled style={{ height: 38, padding: '0 14px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontWeight: 700, borderRadius: 8, border: '1px solid var(--border)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                    <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading…
                  </button>
                )}
                {simState === 'running' && <button onClick={pauseSim} style={{ height: 38, padding: '0 14px', background: 'var(--warning)', color: '#000', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Pause size={15} /></button>}
                {simState === 'paused' && <button onClick={resumeSim} style={{ height: 38, padding: '0 14px', background: 'var(--positive)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Play size={15} /></button>}
                {isActive && simState !== 'loading' && <button onClick={stopSim} style={{ height: 38, padding: '0 14px', background: 'var(--negative)', color: '#fff', fontWeight: 800, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Square size={15} /></button>}
              </div>
            </div>

            {/* Date range preview when idle */}
            {simState === 'idle' && previewDays > 0 && (
              <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ~<strong style={{ color: 'var(--text-secondary)' }}>{previewDays.toLocaleString()} trading days</strong> · {startDate} → {endDate}
              </div>
            )}

            {/* Speed + progress */}
            {(simState === 'running' || simState === 'paused') && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {([1, 10, 100] as Speed[]).map(s => (
                      <button key={s} onClick={() => setSpeed(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, background: speed === s ? 'rgba(139,92,246,0.12)' : 'transparent', color: speed === s ? 'var(--violet)' : 'var(--text-muted)', borderColor: speed === s ? 'rgba(139,92,246,0.3)' : 'var(--border-light)' }}>
                        {s}×
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {simDateLabel ? simDateLabel : `Day ${simDay + 1} / ${totalDays}`} ({progress.toFixed(0)}%)
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--brand)', borderRadius: 3, transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

          {/* Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedSym}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stock?.name}</span>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700, color: getRiskColor(stock?.risk as RiskLevel), background: `${getRiskColor(stock?.risk as RiskLevel)}20` }}>{stock?.risk} Risk</span>
                {simBars.length > 0 && simState !== 'idle' && !aiDriven && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700, color: 'var(--positive)', background: 'rgba(34,197,94,0.1)' }}>REAL DATA</span>
                )}
                {aiDriven && prediction && simState !== 'idle' && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700, color: predLineColor, background: `${predLineColor}20`, border: `1px solid ${predLineColor}40` }}>
                    AI — {prediction.direction.toUpperCase()} {prediction.confidence}%
                  </span>
                )}
                {predictionLine && !aiDriven && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700, color: predLineColor, background: `${predLineColor}20`, border: `1px solid ${predLineColor}40` }}>
                    AI PROJECTION — {prediction?.direction?.toUpperCase()} {prediction?.confidence}%
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem' }}>
                {formatPrice(isActive ? simPrice : basePrice)}
                {isActive && simBars.length > 0 && simDay > 0 && (
                  <span style={{ fontSize: '0.8rem', marginLeft: 8, color: simBars[simDay]?.close >= simBars[simDay - 1]?.close ? 'var(--positive)' : 'var(--negative)' }}>
                    {simBars[simDay]?.close >= simBars[simDay - 1]?.close ? '▲' : '▼'} {formatPct(((simBars[simDay]?.close - simBars[simDay - 1]?.close) / simBars[simDay - 1]?.close) * 100)}
                  </span>
                )}
                {(!isActive || simBars.length === 0) && (
                  <span style={{ fontSize: '0.8rem', marginLeft: 8, color: isUp ? 'var(--positive)' : 'var(--negative)' }}>
                    {isUp ? '▲' : '▼'} {formatPct(livePrice?.changePercent ?? DEMO_PRICES[selectedSym]?.changePercent ?? 0)}
                  </span>
                )}
              </div>
            </div>
            <div style={{ height: 320, padding: 16 }}>
              <StockChart
                symbol={selectedSym}
                basePrice={basePrice}
                isUp={isUp}
                type="candle"
                days={Math.max(previewDays, 365)}
                externalBars={simBars.length > 0 && simState !== 'idle' ? simBars.slice(0, simDay + 1) : undefined}
                predictionLine={predictionLine ?? undefined}
                predictionColor={predLineColor}
              />
            </div>
          </div>

          {/* Results */}
          {simState === 'done' && (
            <div style={{ background: simReturn >= 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${simReturn >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800 }}>Simulation Complete!</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  { label: 'Final Value', value: formatCash(simStartCash + simReturn) },
                  { label: 'Total Return', value: `${simReturnPct >= 0 ? '+' : ''}${simReturnPct.toFixed(2)}%`, color: simReturn >= 0 ? 'var(--positive)' : 'var(--negative)' },
                  { label: 'Period', value: `${startDate} → ${endDate}`, color: 'var(--text-secondary)' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    <div style={{ fontSize: s.label === 'Period' ? '0.9rem' : '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: s.color ?? 'var(--text-primary)' }}>{s.value}</div>
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

            {(simState === 'running' || simState === 'paused') && (
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

          {/* AI Reasoning Card — auto-shown when sim starts */}
          {prediction && isActive && (
            <div style={{ background: 'var(--bg-card)', border: `1px solid ${predLineColor}30`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${predLineColor}20`, background: `${predLineColor}08`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={16} color={predLineColor} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: predLineColor }}>Why {prediction.direction.toUpperCase()}?</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: predLineColor }}>{prediction.confidence}% confidence</span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {prediction.summary}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {prediction.factors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, width: 20, textAlign: 'center',
                        color: f.s === 'positive' ? 'var(--positive)' : f.s === 'negative' ? 'var(--negative)' : 'var(--text-muted)',
                      }}>
                        {f.s === 'positive' ? '▲' : f.s === 'negative' ? '▼' : '—'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', flex: 1 }}>{f.f}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>{f.w.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {([['1_day', '1 Day'], ['1_week', '1 Week'], ['1_month', '1 Month']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => { setHorizon(val); setPrediction(null); setPredictionLine(null); }} style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, background: horizon === val ? 'rgba(139,92,246,0.12)' : 'transparent', color: horizon === val ? 'var(--violet)' : 'var(--text-muted)', borderColor: horizon === val ? 'rgba(139,92,246,0.3)' : 'var(--border-light)' }}>
                      {label}
                    </button>
                  ))}
                </div>

                {!prediction && !predicting && (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                      AI analyses {selectedSym} to predict price direction over the next {horizon === '1_day' ? 'trading day' : horizon === '1_week' ? 'week' : 'month'}.
                    </p>
                    <button onClick={runPrediction} style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--violet)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
                      <Zap size={15} /> Run AI Prediction
                    </button>
                  </div>
                )}

                {predicting && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analysing {selectedSym} with AI…</div>
                  </div>
                )}

                {prediction && !predicting && (
                  <div>
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

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                      {prediction.summary}
                    </div>

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
