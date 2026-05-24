'use client';

import { useEffect, useRef } from 'react';
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
    const vol = 0.018;
    const change = price * (drift + (Math.random() - 0.5) * vol * 2);
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);
    const volume = Math.floor(50e6 + Math.random() * 80e6);

    bars.push({ time: ts, open, high, low, close, volume });
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

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const chart = createChart(container, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#94A3B8',
      },
      grid: {
        vertLines: { color: '#1E293B' },
        horzLines: { color: '#1E293B' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#475569', labelBackgroundColor: '#0DBF76' },
        horzLine: { color: '#475569', labelBackgroundColor: '#0DBF76' },
      },
      rightPriceScale: { borderColor: '#1E293B', scaleMargins: { top: 0.1, bottom: 0.2 } },
      timeScale: { borderColor: '#1E293B', timeVisible: true, secondsVisible: false },
      handleScroll: true,
      handleScale: true,
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const bars = generateBars(basePrice, days, isUp);

    if (type === 'candle') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22C55E',
        downColor: '#EF4444',
        borderUpColor: '#22C55E',
        borderDownColor: '#EF4444',
        wickUpColor: '#22C55E',
        wickDownColor: '#EF4444',
      });
      series.setData(bars.map(b => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close })));

      const volSeries = chart.addSeries(HistogramSeries, {
        color: '#22C55E',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      volSeries.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.volume, color: b.close >= b.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)' })));
    } else {
      const series = chart.addSeries(LineSeries, {
        color: isUp ? '#22C55E' : '#EF4444',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: isUp ? '#22C55E' : '#EF4444',
        crosshairMarkerBackgroundColor: isUp ? '#22C55E' : '#EF4444',
      });
      series.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: b.close })));
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [symbol, basePrice, isUp, type, days]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
