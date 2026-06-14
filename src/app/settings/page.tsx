'use client';

import { Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>MarketSim Pro — app info and details</p>
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
