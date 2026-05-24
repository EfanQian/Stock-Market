'use client';

import { useState } from 'react';
import { Settings, Key, Zap, Info, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [finnhubKey, setFinnhubKey] = useState(typeof window !== 'undefined' ? localStorage.getItem('finnhub_key') ?? '' : '');
  const [saved, setSaved] = useState(false);

  const saveKey = () => {
    localStorage.setItem('finnhub_key', finnhubKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Configure your MarketSim Pro experience</p>
      </div>

      {/* API Keys */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Key size={20} color="var(--brand)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>API Keys</h2>
        </div>

        <div style={{ background: 'rgba(13,191,118,0.06)', border: '1px solid rgba(13,191,118,0.15)', borderRadius: 9, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <Info size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Without an API key, the app uses realistic demo prices. Add a free <strong style={{ color: 'var(--text-primary)' }}>Finnhub</strong> API key to get live real-time prices. Sign up free at finnhub.io — no credit card required, 60 requests/minute.
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Finnhub API Key
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={finnhubKey} onChange={e => setFinnhubKey(e.target.value)} type="password" placeholder="Enter your Finnhub API key…" style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'monospace' }} />
            <button onClick={saveKey} style={{ padding: '10px 18px', background: saved ? 'var(--positive)' : 'var(--brand)', color: '#000', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              {saved ? '✓ Saved' : 'Save Key'}
            </button>
          </div>
        </div>

        <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
          Get a free Finnhub API key <ExternalLink size={12} />
        </a>
      </div>

      {/* About */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Info size={20} color="var(--brand)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>About MarketSim Pro</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Data Provider', value: 'Finnhub.io' },
            { label: 'Chart Library', value: 'TradingView LW Charts' },
            { label: 'Starting Cash', value: '$100,000 virtual' },
            { label: 'Supported Assets', value: 'Stocks, ETFs, Crypto' },
            { label: 'Simulation Speed', value: '1× · 10× · 100×' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--warning)' }}>Educational Use Only.</strong> MarketSim Pro is a stock market simulator designed for learning purposes. All trades use virtual money — no real financial transactions are ever executed. Price data may be delayed or simulated. This platform does not provide financial advice. Past simulated performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
}
