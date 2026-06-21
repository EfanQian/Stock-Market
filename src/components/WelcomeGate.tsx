'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp } from 'lucide-react';

const GUEST_KEY = 'marketsim_guest';

export default function WelcomeGate() {
  const { user, loading } = useAuth();
  const [isGuest, setIsGuest] = useState(true); // default true prevents flash
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // Re-read guest flag whenever auth state changes (catches sign-out)
  useEffect(() => {
    setIsGuest(!!localStorage.getItem(GUEST_KEY));
  }, [user]);

  const show = !loading && !user && !isGuest;

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 40);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  function continueAsGuest() {
    localStorage.setItem(GUEST_KEY, '1');
    setIsGuest(true);
  }

  function goToAuth() {
    localStorage.setItem(GUEST_KEY, '1');
    setIsGuest(true);
    router.push('/auth');
  }

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.25s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 28px' }}>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={19} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            MarketSim Pro
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)',
          margin: '0 0 10px', lineHeight: 1.15, letterSpacing: '-0.03em',
        }}>
          Paper trading.<br />Real market data.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 28px', lineHeight: 1.65 }}>
          Practice with $100,000 in virtual cash. Live prices from Alpaca Markets. No real money.
        </p>

        {/* Feature list */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 28,
          display: 'flex', flexDirection: 'column', gap: 11,
        }}>
          {[
            'Live prices from Alpaca Markets',
            'AI-powered trade predictions',
            'Strategy backtesting with simulation mode',
            'Portfolio analytics and transaction history',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button
            onClick={goToAuth}
            style={{
              width: '100%', height: 46, background: 'var(--brand)',
              border: 'none', borderRadius: 9, color: '#000',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Create a free account
          </button>
          <button
            onClick={continueAsGuest}
            style={{
              width: '100%', height: 46, background: 'transparent',
              border: '1px solid var(--border-light)', borderRadius: 9,
              color: 'var(--text-muted)', fontWeight: 500,
              fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            Continue as guest
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={goToAuth}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--brand)', fontSize: '0.75rem', fontWeight: 600, padding: 0,
            }}
          >
            Sign in →
          </button>
        </p>

      </div>
    </div>
  );
}
