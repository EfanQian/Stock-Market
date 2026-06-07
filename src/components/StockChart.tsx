'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, type IChartApi, CandlestickSeries, LineSeries, HistogramSeries, type UTCTimestamp } from 'lightweight-charts';

interface Bar { time: number; open: number; high: number; low: number; close: number; volume: number; }

function generateBars(basePrice: number, days: number, isUp: boolean): Bar[] {
  const bars: Bar[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = basePrice * (isUp ? 0.85 : 1.15);
  for (let i = days; i >= 0; i--) {
    const ts = now - i * 86400;
    const dayOfWeek = new Date(ts * 1000).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    const drift = isUp ? 0.0008 : -0.0005;
    const change = price * (drift + (Math.random() - 0.5) * 0.018 * 2);
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);
    bars.push({ time: ts, open, high, low, close, volume: Math.floor(50e6 + Math.random() * 80e6) });
    price = close;
  }
  return bars;
}

interface Props {
  symbol: string;
  basePrice: number;
  isUp: boolean;
  type?: 'candle' | 'line';
  days?: number;
  externalBars?: Bar[]; // when provided, skip fetch and use these bars
}

export default function StockChart({ symbol, basePrice, isUp, type = 'candle', days = 180, externalBars }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<{ date: string; ohlcv: string } | null>(null);
  const [loadedDays, setLoadedDays] = useState(days);
  const barsRef = useRef<Bar[]>([]);
  const seriesRef = useRef<any>(null);
  const volSeriesRef = useRef<any>(null);
  const isDemoRef = useRef(false);
  const fetchingRef = useRef(false);

  function applyBarsToChart(chart: IChartApi, bars: Bar[]) {
    if (type === 'candle') {
      if (!seriesRef.current) {
        seriesRef.current = chart.addSeries(CandlestickSeries, {
          upColor: '#22C55E', downColor: '#EF4444',
          borderUpColor: '#22C55E', borderDownColor: '#EF4444',
          wickUpColor: '#22C55E', wickDownColor: '#EF4444',
        });
        volSeriesRef.current = chart.addSeries(HistogramSeries, {
          color: '#22C55E', priceFormat: { type: 'volume' }, priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      }
      seriesRef.current.setData(bars.map(b => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close })));
      volSeriesRef.current?.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.volume, color: b.close >= b.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)' })));
    } else {
      if (!seriesRef.current) {
        seriesRef.current = chart.addSeries(LineSeries, {
          color: isUp ? '#22C55E' : '#EF4444', lineWidth: 2,
          crosshairMarkerVisible: true, crosshairMarkerRadius: 5,
        });
      }
      seriesRef.current.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.close })));
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const chart = createChart(container, {
      layout: { background: { color: 'transparent' }, textColor: '#94A3B8' },
      grid: { vertLines: { color: '#1E293B' }, horzLines: { color: '#1E293B' } },
      crosshair: {
        mode: 1,
        vertLine: { color: '#475569', labelBackgroundColor: '#0DBF76' },
        horzLine: { color: '#475569', labelBackgroundColor: '#0DBF76' },
      },
      rightPriceScale: { borderColor: '#1E293B', scaleMargins: { top: 0.1, bottom: 0.2 } },
      timeScale: { borderColor: '#1E293B', timeVisible: true, secondsVisible: false },
      width: container.clientWidth,
      height: container.clientHeight,
    });

    chartRef.current = chart;

    // Crosshair move → show date + OHLCV overlay
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.seriesData.size) { setHoverInfo(null); return; }
      const ts = param.time as number;
      const d = new Date(ts * 1000);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      const bar = barsRef.current.find(b => b.time === ts);
      let ohlcv = '';
      if (bar) {
        ohlcv = `O $${bar.open.toFixed(2)}  H $${bar.high.toFixed(2)}  L $${bar.low.toFixed(2)}  C $${bar.close.toFixed(2)}`;
        if (bar.volume > 0) ohlcv += `  Vol ${(bar.volume / 1e6).toFixed(1)}M`;
      }
      setHoverInfo({ date: dateStr, ohlcv });
    });

    // Lazy-load more history when user scrolls left past the first 10 bars
    chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (!range || fetchingRef.current || isDemoRef.current) return;
      if (range.from < 10) {
        setLoadedDays(prev => prev + 365);
      }
    });

    async function loadData(numDays: number) {
      setLoading(true);
      let bars: Bar[] = [];
      try {
        const res = await fetch(`/api/bars/${symbol}?days=${numDays}`);
        const json = await res.json() as { bars: Bar[]; demo?: boolean };
        if (json.bars && json.bars.length > 0) { bars = json.bars; isDemoRef.current = !!json.demo; }
      } catch { /* fall through */ }
      if (bars.length === 0) { bars = generateBars(basePrice, numDays, isUp); isDemoRef.current = true; }
      barsRef.current = bars;
      applyBarsToChart(chart, bars);
      chart.timeScale().fitContent();
      setLoading(false);
    }

    if (externalBars && externalBars.length > 0) {
      barsRef.current = externalBars;
      applyBarsToChart(chart, externalBars);
      chart.timeScale().fitContent();
      setLoading(false);
    } else {
      loadData(loadedDays);
    }

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      volSeriesRef.current = null;
    };
  }, [symbol, basePrice, isUp, type]);

  // When loadedDays increases (scroll left triggered), fetch extended history
  useEffect(() => {
    if (!chartRef.current || loadedDays === days || fetchingRef.current) return;
    fetchingRef.current = true;

    async function extendHistory() {
      let bars: Bar[] = [];
      try {
        const res = await fetch(`/api/bars/${symbol}?days=${loadedDays}`);
        const json = await res.json() as { bars: Bar[]; demo?: boolean };
        if (json.bars && json.bars.length > 0) bars = json.bars;
      } catch { /* keep existing */ }
      if (bars.length === 0) return;
      barsRef.current = bars;
      applyBarsToChart(chartRef.current!, bars);
      fetchingRef.current = false;
    }
    extendHistory();
  }, [loadedDays]);

  // Update chart data when externally provided bars change (simulation playback)
  useEffect(() => {
    if (!externalBars || externalBars.length === 0 || !seriesRef.current || !chartRef.current) return;
    barsRef.current = externalBars;
    const mapped = externalBars.map(b => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close }));
    seriesRef.current.setData(mapped);
    volSeriesRef.current?.setData(externalBars.map(b => ({
      time: b.time as UTCTimestamp, value: b.volume,
      color: b.close >= b.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)',
    })));
    // Keep the latest bar in view
    chartRef.current.timeScale().scrollToPosition(0, false);
  }, [externalBars]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--brand)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Google Finance-style OHLCV + date overlay on crosshair hover */}
      {hoverInfo && (
        <div style={{
          position: 'absolute', top: 8, left: 12, zIndex: 10, pointerEvents: 'none',
          background: 'rgba(11,17,32,0.88)', backdropFilter: 'blur(6px)',
          border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {hoverInfo.date}
          </div>
          {hoverInfo.ohlcv && (
            <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
              {hoverInfo.ohlcv}
            </div>
          )}
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
