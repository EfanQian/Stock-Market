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
}

export default function StockChart({ symbol, basePrice, isUp, type = 'candle', days = 180 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(true);

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

    async function loadData() {
      setLoading(true);
      let bars: Bar[] = [];

      try {
        const res = await fetch(`/api/bars/${symbol}?days=${days}`);
        const json = await res.json() as { bars: Bar[]; demo?: boolean };
        if (json.bars && json.bars.length > 0) bars = json.bars;
      } catch { /* fall through to demo */ }

      if (bars.length === 0) bars = generateBars(basePrice, days, isUp);

      if (type === 'candle') {
        const series = chart.addSeries(CandlestickSeries, {
          upColor: '#22C55E', downColor: '#EF4444',
          borderUpColor: '#22C55E', borderDownColor: '#EF4444',
          wickUpColor: '#22C55E', wickDownColor: '#EF4444',
        });
        series.setData(bars.map(b => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close })));

        const volSeries = chart.addSeries(HistogramSeries, {
          color: '#22C55E', priceFormat: { type: 'volume' }, priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        volSeries.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.volume, color: b.close >= b.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)' })));
      } else {
        const series = chart.addSeries(LineSeries, {
          color: isUp ? '#22C55E' : '#EF4444', lineWidth: 2,
          crosshairMarkerVisible: true, crosshairMarkerRadius: 5,
        });
        series.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.close })));
      }

      chart.timeScale().fitContent();
      setLoading(false);
    }

    loadData();

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
    });
    ro.observe(container);

    return () => { ro.disconnect(); chart.remove(); };
  }, [symbol, basePrice, isUp, type, days]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--brand)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
