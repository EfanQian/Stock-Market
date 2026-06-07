'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X, ChevronRight, ChevronLeft,
  LayoutDashboard, TrendingUp, Briefcase, Clock,
  Trophy, Star, Newspaper, Zap, type LucideIcon,
} from 'lucide-react';

interface Step {
  nav: string;
  Icon: LucideIcon;
  color: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  tip?: string;
}

const STEPS: Step[] = [
  {
    nav: '/',
    Icon: Zap,
    color: '#0DBF76',
    label: 'Welcome',
    title: 'Welcome to MarketSim Pro',
    description: 'Practice trading stocks with $100,000 in virtual cash. No real money — just real market data and real skills.',
    features: [
      'Live stock prices powered by Alpaca API',
      'Real historical data for backtesting strategies',
      'AI-powered predictions via OpenRouter',
      'Compete on the global leaderboard',
    ],
    tip: 'This is your Dashboard — your home base for everything.',
  },
  {
    nav: '/markets',
    Icon: TrendingUp,
    color: '#0DBF76',
    label: 'Step 1 of 6',
    title: 'Markets',
    description: 'Browse all available stocks, ETFs, and crypto. Filter by sector, sort by performance, and click any ticker to open its detail page.',
    features: [
      'Live prices refreshed every 30 seconds',
      'Filter by sector and risk level',
      'Click any stock to view charts and trade',
    ],
    tip: 'Click a stock row to open its chart and buy/sell panel.',
  },
  {
    nav: '/portfolio',
    Icon: Briefcase,
    color: '#F59E0B',
    label: 'Step 2 of 6',
    title: 'Portfolio',
    description: 'Track all your open positions, cash balance, and total P&L. See exactly how every holding is performing in real time.',
    features: [
      'Live unrealized & realized P&L per position',
      'Cash balance and total buying power',
      'Full trade history log',
    ],
    tip: 'Your starting balance is $100,000 — grow it!',
  },
  {
    nav: '/simulation',
    Icon: Clock,
    color: '#8B5CF6',
    label: 'Step 3 of 6',
    title: 'Simulation Mode',
    description: 'Pick any date range and trade with real historical prices. The chart draws bar-by-bar as the simulation plays — like watching market history unfold.',
    features: [
      'Real Alpaca historical daily bars',
      'Adjustable playback speed: 1×, 10×, 100×',
      'AI prediction panel for each stock',
      'Full buy/sell trading during playback',
    ],
    tip: 'Set your date range, pick a stock, then hit Start.',
  },
  {
    nav: '/watchlist',
    Icon: Star,
    color: '#F59E0B',
    label: 'Step 4 of 6',
    title: 'Watchlist',
    description: 'Star any stock from its detail page to save it here. Keep an eye on the tickers you care about without searching every time.',
    features: [
      'Add stocks from any stock detail page',
      'Live prices for all watched tickers',
      'Quick one-click access to your favourites',
    ],
    tip: 'Go to any stock page and click the ★ to add it here.',
  },
  {
    nav: '/news',
    Icon: Newspaper,
    color: '#06B6D4',
    label: 'Step 5 of 6',
    title: 'News & Sentiment',
    description: 'Stay up to date with live market news. Sentiment labels highlight bullish and bearish signals in the headlines.',
    features: [
      'Live market and company-specific news',
      'Bullish / bearish / neutral sentiment labels',
      'Links through to full articles',
    ],
    tip: 'Green = bullish signal, Red = bearish signal.',
  },
  {
    nav: '/leaderboard',
    Icon: Trophy,
    color: '#F59E0B',
    label: 'Step 6 of 6',
    title: 'Leaderboard',
    description: "You start with $100,000. Trade well, grow your portfolio, and climb the global rankings. Let's see what you can do.",
    features: [
      'Global rankings by total portfolio return',
      'Your position updated in real time',
      'See the top traders and their returns',
    ],
    tip: 'Your rank updates automatically as your portfolio changes.',
  },
];

export const TUTORIAL_KEY = 'marketsim_tutorial_v1';

export default function Tutorial() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(TUTORIAL_KEY)) setVisible(true);
  }, []);

  // Navigate to the page for this step
  useEffect(() => {
    if (!visible) return;
    router.push(STEPS[step].nav);
  }, [step, visible]);

  // Pulse-highlight the relevant sidebar nav item
  useEffect(() => {
    if (!visible) return;
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('tutorial-highlight'));
    const nav = STEPS[step]?.nav;
    if (nav) document.querySelector(`[data-nav="${nav}"]`)?.classList.add('tutorial-highlight');
    return () => { document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('tutorial-highlight')); };
  }, [step, visible]);

  const finish = () => {
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('tutorial-highlight'));
    localStorage.setItem(TUTORIAL_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const cur = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const isDark = cur.color === '#F59E0B';

  return (
    <>
      {/* Backdrop — only covers left side (not the panel) */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, right: 340,
          zIndex: 9998,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Right-side panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 340,
          zIndex: 9999,
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-24px 0 64px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Progress strip */}
        <div style={{ height: 3, background: 'var(--border)', flexShrink: 0 }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: cur.color,
            transition: 'width 0.4s ease, background 0.3s ease',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${cur.color}12 0%, transparent 100%)`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: `${cur.color}1A`,
              border: `1.5px solid ${cur.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <cur.Icon size={22} color={cur.color} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.6rem', color: cur.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
                {cur.label}
              </div>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {cur.title}
              </h2>
            </div>
            <button
              onClick={finish}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, lineHeight: 0, flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '0.845rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {cur.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {cur.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{
                  width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: `${cur.color}1A`, border: `1px solid ${cur.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 900, color: cur.color,
                }}>✓</div>
                {f}
              </div>
            ))}
          </div>

          {cur.tip && (
            <div style={{
              padding: '10px 12px',
              background: `${cur.color}0D`,
              border: `1px solid ${cur.color}30`,
              borderRadius: 8,
              fontSize: '0.78rem',
              color: cur.color,
              lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 700 }}>Tip: </span>{cur.tip}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                title={s.title}
                style={{
                  height: 4, borderRadius: 2,
                  width: i === step ? 20 : 4,
                  background: i === step ? cur.color : 'var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            <button
              onClick={finish}
              style={{
                background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 8,
                padding: '7px 11px', color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
              }}
            >
              Skip all
            </button>
            <div style={{ flex: 1 }} />
            {!isFirst && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '7px 13px', color: 'var(--text-secondary)', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <ChevronLeft size={13} /> Back
              </button>
            )}
            <button
              onClick={isLast ? finish : () => setStep(s => s + 1)}
              style={{
                background: cur.color, border: 'none', borderRadius: 8,
                padding: '7px 16px',
                color: isDark ? '#000' : '#fff',
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {isLast ? 'Get Started!' : (<>Next <ChevronRight size={13} /></>)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
