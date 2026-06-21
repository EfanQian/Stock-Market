'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { loadPortfolio, savePortfolio, DEFAULT_STATE } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) syncFromCloud(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) syncFromCloud(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function syncFromCloud(userId: string) {
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from('portfolios')
        .select('data')
        .eq('user_id', userId)
        .single();

      if (data?.data) {
        savePortfolio({ ...DEFAULT_STATE, ...data.data });
      } else {
        const local = loadPortfolio();
        await supabase.from('portfolios').upsert({
          user_id: userId,
          data: local,
          updated_at: new Date().toISOString(),
        });
      }
    } catch { /* ignore */ }
  }

  async function signOut() {
    if (!supabase) return;
    localStorage.removeItem('marketsim_guest');
    await supabase.auth.signOut();
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
