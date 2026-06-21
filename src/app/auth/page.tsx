'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  if (!supabase) {
    return (
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
          padding: 32, maxWidth: 480, textAlign: 'center',
        }}>
          <AlertCircle size={40} color="var(--warning)" style={{ marginBottom: 16 }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Supabase Not Configured</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Add <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>.env.local</code> to enable accounts.
          </p>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block', marginTop: 20, padding: '10px 20px',
              background: 'var(--brand)', borderRadius: 8,
              color: '#000', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem',
            }}
          >
            Create a Free Supabase Project →
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase!.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push('/');
        } else {
          setSuccess('Account created! Check your email to confirm your account, then sign in.');
        }
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
    width: '100%', height: 44, paddingLeft: 40, paddingRight: 16,
    background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
    borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, var(--brand), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={28} color="#000" />
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            MarketSim Pro
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0' }}>
            {mode === 'signin' ? 'Sign in to sync your portfolio' : 'Create an account to save your progress'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 18, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-secondary)',
            borderRadius: 10, padding: 4, marginBottom: 28,
          }}>
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                  background: mode === m ? 'var(--brand)' : 'transparent',
                  color: mode === m ? '#000' : 'var(--text-secondary)',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 8, padding: '10px 14px',
                color: 'var(--negative)', fontSize: '0.8rem',
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)',
                borderRadius: 8, padding: '10px 14px',
                color: 'var(--positive)', fontSize: '0.8rem',
              }}>
                <CheckCircle size={14} />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 46, background: 'var(--brand)', border: 'none', borderRadius: 10,
                color: '#000', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s', marginTop: 4,
              }}
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'signup' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
              Your portfolio syncs across all devices when you&apos;re signed in.
            </p>
          )}
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', textDecoration: 'underline' }}
          >
            ← Back to dashboard
          </button>
        </p>
      </div>
    </div>
  );
}
