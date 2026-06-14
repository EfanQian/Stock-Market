'use client';

import { useState, useEffect } from 'react';
import { Info, Activity, CheckCircle, XCircle, Loader2, Sun, Moon, RotateCcw, AlertTriangle } from 'lucide-react';
import { THEME_KEY, applyTheme } from '@/components/ThemeProvider';
import { resetPortfolio } from '@/lib/store';

type ConnectionStatus = 'checking' | 'connected' | 'demo';

export default function SettingsPage() {
  const [alpacaStatus, setAlpacaStatus] = useState<ConnectionStatus>('checking');
  const [samplePrice, setSamplePrice] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null) ?? 'dark';
    setTheme(saved);
  }, []);

  function handleReset() {
    resetPortfolio();
    window.dispatchEvent(new Event('portfolio-updated'));
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  }

  function toggleTheme(next: 'dark' | 'light') {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  useEffect(() => {
    fetch('/api/snapshot?symbols=AAPL')
      .then(r => r.json() as Promise<Record<string, { price: number; demo?: boolean }>>)
      .then(data => {
        const entry = data['AAPL'];
        if (entry?.demo) {
          setAlpacaStatus('demo');
        } else if (entry?.price) {
          setAlpacaStatus('connected');
          setSamplePrice(`$${entry.price.toFixed(2)}`);
        } else {
          setAlpacaStatus('demo');
        }
      })
      .catch(() => setAlpacaStatus('demo'));
  }, []);

  const statusColor  = alpacaStatus === 'connected' ? 'var(--positive)' : alpacaStatus === 'demo' ? 'var(--warning)' : 'var(--text-muted)';
  const statusBg     = alpacaStatus === 'connected' ? 'rgba(34,197,94,0.08)'  : alpacaStatus === 'demo' ? 'rgba(245,158,11,0.08)' : 'transparent';
  const statusBorder = alpacaStatus === 'connected' ? 'rgba(34,197,94,0.2)'   : alpacaStatus === 'demo' ? 'rgba(245,158,11,0.2)'  : 'var(--border)';
  const statusLabel  = alpacaStatus === 'connected' ? 'Live — connected'       : alpacaStatus === 'demo' ? 'Demo mode'             : 'Checking…';
  const StatusIcon   = alpacaStatus === 'connected' ? CheckCircle             : alpacaStatus === 'demo' ? XCircle                : Loader2;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>MarketSim Pro — app info and data connection</p>
      </div>

      {/* Appearance */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          {theme === 'dark' ? <Moon size={20} color="var(--brand)" /> : <Sun size={20} color="var(--brand)" />}
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Appearance</h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['dark', 'light'] as const).map(t => (
            <button
              key={t}
              onClick={() => toggleTheme(t)}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 10, cursor: 'pointer',
                border: theme === t ? '2px solid var(--brand)' : '1px solid var(--border)',
                background: theme === t ? 'rgba(13,191,118,0.08)' : 'var(--bg-secondary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
            >
              {t === 'dark'
                ? <Moon size={22} color={theme === 'dark' ? 'var(--brand)' : 'var(--text-muted)'} />
                : <Sun size={22} color={theme === 'light' ? 'var(--brand)' : 'var(--text-muted)'} />}
              <span style={{
                fontSize: '0.8rem', fontWeight: 700,
                color: theme === t ? 'var(--brand)' : 'var(--text-secondary)',
              }}>{t === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alpaca Data Connection */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Activity size={20} color="var(--brand)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Alpaca Markets — Data Connection</h2>
        </div>

        {/* Status pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 10, marginBottom: 20 }}>
          <StatusIcon
            size={18}
            color={statusColor}
            style={alpacaStatus === 'checking' ? { animation: 'spin 0.8s linear infinite' } : undefined}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: statusColor }}>{statusLabel}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {alpacaStatus === 'connected' && samplePrice
                ? `Live AAPL price: ${samplePrice}`
                : alpacaStatus === 'demo'
                ? 'API key not configured — using realistic demo prices'
                : 'Fetching live quote…'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Provider',       value: 'Alpaca Markets' },
            { label: 'Data Type',      value: 'Real-time quotes & OHLCV bars' },
            { label: 'Live Prices',    value: 'Stocks, ETFs, Crypto' },
            { label: 'Historical Bars', value: 'Daily bars — full history' },
            { label: 'Refresh Rate',   value: 'Every 30 seconds' },
            { label: 'Fallback',       value: 'Demo prices when offline' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Info size={20} color="var(--brand)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>About MarketSim Pro</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Version',          value: '1.0.0' },
            { label: 'Data Provider',    value: 'Alpaca Markets' },
            { label: 'AI Predictions',   value: 'Claude (Anthropic) via OpenRouter' },
            { label: 'Chart Library',    value: 'TradingView LW Charts' },
            { label: 'Starting Cash',    value: '$100,000 virtual' },
            { label: 'Simulation Speed', value: '1× · 10× · 100×' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Portfolio */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <RotateCcw size={20} color="var(--negative)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Reset Portfolio</h2>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Wipe all positions and trade history, and restore your cash to <strong style={{ color: 'var(--text-primary)' }}>$100,000</strong>. This cannot be undone.
        </p>
        {resetDone ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
            <CheckCircle size={16} color="var(--positive)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--positive)' }}>Portfolio reset — balance restored to $100,000</span>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)', color: 'var(--negative)', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
          >
            Reset to $100,000
          </button>
        )}
      </div>

      {/* Confirm modal */}
      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%', textAlign: 'center' }}>
            <AlertTriangle size={40} color="var(--warning)" style={{ display: 'block', margin: '0 auto 16px' }} />
            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Reset Portfolio?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>This will clear all positions, transactions, and reset your cash to $100,000. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmReset(false)} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleReset} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--negative)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--warning)' }}>Educational Use Only.</strong> MarketSim Pro is a stock market simulator designed for learning purposes. All trades use virtual money — no real financial transactions are ever executed. Price data may be delayed or simulated. This platform does not provide financial advice. Past simulated performance does not guarantee future results.
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
