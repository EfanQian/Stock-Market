'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Zap, Users } from 'lucide-react';

const KEY = 'marketsim_seen_welcome';

export default function WelcomeGate() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      setShow(true);
      setTimeout(() => setVisible(true), 30);
    }
  }, []);

  function dismiss(goto?: string) {
    localStorage.setItem(KEY, '1');
    setVisible(false);
    setTimeout(() => {
      setShow(false);
      if (goto) router.push(goto);
    }, 280);
  }

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.28s ease',
    }}>
      {/* Glow background */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(13,191,118,0.07) 0%, transparent 65%)',
      }} />

      <div style={{ textAlign: 'center', maxWidth: 560, padding: '0 24px', position: 'relative' }}>
        {/* Logo */}
        <div style={{
          width: 76, height: 76, borderRadius: 22, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, var(--brand), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 48px rgba(13,191,118,0.28)',
        }}>
          <TrendingUp size={38} color="#000" />
        </div>

        <h1 style={{
          fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-primary)',
          margin: '0 0 6px', letterSpacing: '-0.03em',
        }}>
          MarketSim Pro
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0 0 44px' }}>
          Trade like a pro. Risk nothing.
        </p>

        {/* Choice cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Guest */}
          <button
            onClick={() => dismiss()}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 18, padding: '26px 22px', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12, marginBottom: 14,
              background: 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={20} color="var(--brand)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              Guest Mode
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Jump in instantly with $100k. Progress saved on this device.
            </div>
          </button>

          {/* Create Account */}
          <button
            onClick={() => dismiss('/auth')}
            style={{
              background: 'linear-gradient(135deg, rgba(13,191,118,0.1), rgba(124,58,237,0.1))',
              border: '1px solid var(--brand)', borderRadius: 18, padding: '26px 22px',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(13,191,118,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12, marginBottom: 14,
              background: 'linear-gradient(135deg, var(--brand), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={20} color="#000" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              Create Account
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Sync your portfolio across devices. Never lose progress.
            </div>
          </button>
        </div>

        <p style={{ marginTop: 22, fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={() => dismiss('/auth')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', fontSize: '0.73rem', fontWeight: 600, padding: 0 }}
          >
            Sign in →
          </button>
        </p>
      </div>
    </div>
  );
}
