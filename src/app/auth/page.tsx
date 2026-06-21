'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  if (!supabase) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 32, maxWidth: 420, width: '100%',
        }}>
          <AlertCircle size={28} color="var(--warning)" style={{ marginBottom: 12 }} />
          <h2 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: '1rem', fontWeight: 700 }}>
            Supabase not configured
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', margin: 0, lineHeight: 1.6 }}>
            Add <code style={{ background: 'var(--bg-secondary)', padding: '1px 5px', borderRadius: 4, fontSize: '0.78rem' }}>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code style={{ background: 'var(--bg-secondary)', padding: '1px 5px', borderRadius: 4, fontSize: '0.78rem' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
            to <code style={{ background: 'var(--bg-secondary)', padding: '1px 5px', borderRadius: 4, fontSize: '0.78rem' }}>.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const { error: signInError } = await supabase!.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push('/');
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 42, padding: '0 14px',
    background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
    borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 4px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={17} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>MarketSim Pro</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', margin: 0 }}>
            {mode === 'signup'
              ? 'Your portfolio syncs across devices when you sign in.'
              : 'Sign in to access your synced portfolio.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 7, padding: '9px 12px',
              color: 'var(--negative)', fontSize: '0.78rem',
            }}>
              <AlertCircle size={13} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, height: 44, background: 'var(--brand)',
              border: 'none', borderRadius: 8, color: '#000',
              fontWeight: 700, fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Mode switch */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.72rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', padding: 0 }}
          >
            ← Back to dashboard
          </button>
        </p>

      </div>
    </div>
  );
}
