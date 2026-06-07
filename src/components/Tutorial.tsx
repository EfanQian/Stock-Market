'use client';

import { useState, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft,
  LayoutDashboard, TrendingUp, Briefcase, Clock,
  Trophy, Star, Newspaper, Zap, type LucideIcon,
} from 'lucide-react';

interface Step {
  nav: string | null;
  Icon: LucideIcon;
  color: string;
  label: string;
  title: string;
  description: string;
  features: string[];
}

const STEPS: Step[] = [
  {
    nav: null,
    Icon: Zap,
    color: '#0DBF76',
    label: 'Getting Started',
    title: 'Welcome to MarketSim Pro',
    description: 'Practice trading stocks with $100,000 in virtual cash. No real money — just real market data and real skills.',
    features: [
      'Live stock prices powered by Alpaca API',
      'Real historical data for backtesting strategies',
      'AI-powered predictions via OpenRouter',
      'Compete on the global leaderboard',
    ],
  },
  {
    nav: '/',
    Icon: LayoutDashboard,
    color: '#6366F1',
    label: 'Step 1 of 7',
    title: 'Dashboard',
    description: 'Your home base. Get a quick overview of your portfolio performance, top market movers, and recent activity all in one place.',
    features: [
      'Live portfolio value and daily P&L',
      'Top gainers and losers today',
      'Quick snapshot of open positions',
    ],
  },
  {
    nav: '/markets',
    Icon: TrendingUp,
    color: '#0DBF76',
    label: 'Step 2 of 7',
    title: 'Markets',
    description: 'Browse all available stocks, ETFs, and crypto. Filter by sector, sort by performance, and click any ticker to open its detail page.',
    features: [
      'Live prices refreshed every 30 seconds',
      'Filter by sector and risk level',
      'Click any stock to view charts and trade',
    ],
  },
  {
    nav: '/portfolio',
    Icon: Briefcase,
    color: '#F59E0B',
    label: 'Step 3 of 7',
    title: 'Portfolio',
    description: 'Track all your open positions, cash balance, and total P&L. See exactly how every holding is performing in real time.',
    features: [
      'Live unrealized & realized P&L per position',
      'Cash balance and total buying power',
      'Full trade history log',
    ],
  },
  {
    nav: '/simulation',
    Icon: Clock,
    color: '#8B5CF6',
    label: 'Step 4 of 7',
    title: 'Simulation Mode',
    description: 'Pick any date range and trade with real historical prices. The chart draws bar-by-bar as the simulation plays — like watching market history unfold.',
    features: [
      'Real Alpaca historical daily bars',
      'Adjustable playback speed: 1×, 10×, 100×',
      'AI prediction panel for each stock',
      'Full buy/sell trading during playback',
    ],
  },
  {
    nav: '/watchlist',
    Icon: Star,
    color: '#F59E0B',
    label: 'Step 5 of 7',
    title: 'Watchlist',
    description: 'Star any stock from its detail page to save it here. Keep an eye on the tickers you care about without having to search every time.',
    features: [
      'Add stocks from any stock detail page',
      'Live prices for all watched tickers',
      'Quick one-click access to your favourites',
    ],
  },
  {
    nav: '/news',
    Icon: Newspaper,
    color: '#06B6D4',
    label: 'Step 6 of 7',
    title: 'News & Sentiment',
    description: 'Stay up to date with live market news. Sentiment labels highlight bullish and bearish signals in the headlines.',
    features: [
      'Live market and company-specific news',
      'Bullish / bearish / neutral sentiment labels',
      'Links through to full articles',
    ],
  },
  {
    nav: '/leaderboard',
    Icon: Trophy,
    color: '#F59E0B',
    label: 'Step 7 of 7',
    title: 'Leaderboard',
    description: "You start with $100,000. Trade well, grow your portfolio, and climb the global rankings. Let's see what you can do.",
    features: [
      'Global rankings by total portfolio return',
      'Your position updated in real time',
      'See the top traders and their returns',
    ],
  },
];

export const TUTORIAL_KEY = 'marketsim_tutorial_v1';

export default function Tutorial() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(TUTORIAL_KEY)) setVisible(true);
  }, []);

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
  const isDark = cur.color === '#F59E0B'; // amber needs dark text

  return (
    <>
      {/* Backdrop — click to close */}
      <div onClick={finish} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(3px)' }} />

      {/* Card — centred in the content area (right of 220px sidebar) */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', zIndex: 9999,
          top: '50%',
          left: '50%',
          transform: 'translate(calc(-50% + 110px), -50%)',
          width: 480,
          maxWidth: 'calc(100vw - 260px)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Progress strip */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', width: `${((step + 1) / STEPS.length) * 100}%`, background: cur.color, transition: 'width 0.4s ease, background 0.3s ease' }} />
        </div>

        {/* Header row */}
        <div style={{
          padding: '24px 24px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${cur.color}12 0%, transparent 100%)`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: `${cur.color}1A`,
            border: `1.5px solid ${cur.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <cur.Icon size={26} color={cur.color} strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.63rem', color: cur.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{cur.label}</div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{cur.title}</h2>
          </div>
          <button onClick={finish} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, lineHeight: 0, flexShrink: 0 }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px 8px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '0.865rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{cur.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {cur.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.81rem', color: 'var(--text-secondary)' }}>
                <div style={{
                  width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                  background: `${cur.color}1A`, border: `1px solid ${cur.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 900, color: cur.color,
                }}>✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 24px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                title={s.title}
                style={{
                  width: i === step ? 18 : 5, height: 5, borderRadius: 3,
                  background: i === step ? cur.color : 'var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            <button onClick={finish} style={{ background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 8, padding: '7px 13px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.77rem', fontWeight: 600 }}>
              Skip all
            </button>
            {!isFirst && (
              <button onClick={() => setStep(s => s - 1)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 13px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ChevronLeft size={13} /> Back
              </button>
            )}
            <button
              onClick={isLast ? finish : () => setStep(s => s + 1)}
              style={{ background: cur.color, border: 'none', borderRadius: 8, padding: '7px 17px', color: isDark ? '#000' : '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {isLast ? 'Get Started!' : (<>Next <ChevronRight size={13} /></>)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
