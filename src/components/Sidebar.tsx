'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, Briefcase, Clock,
  Trophy, Star, Newspaper, Settings, Zap, HelpCircle,
} from 'lucide-react';
import { TUTORIAL_KEY } from './Tutorial';

const NAV = [
  { href: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/markets',     icon: TrendingUp,      label: 'Markets'   },
  { href: '/portfolio',   icon: Briefcase,       label: 'Portfolio' },
  { href: '/simulation',  icon: Clock,           label: 'Simulation' },
  { href: '/leaderboard', icon: Trophy,          label: 'Leaderboard' },
  { href: '/watchlist',   icon: Star,            label: 'Watchlist' },
  { href: '/news',        icon: Newspaper,       label: 'News'      },
  { href: '/settings',    icon: Settings,        label: 'Settings'  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      padding: '20px 12px',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 4px 24px', marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={20} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              MarketSim
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.1em' }}>
              PRO
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div
                data-nav={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8,
                  color: active ? 'var(--brand)' : 'var(--text-secondary)',
                  background: active ? 'rgba(13,191,118,0.1)' : 'transparent',
                  fontSize: '0.875rem', fontWeight: 500,
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px', borderRadius: 10,
        background: 'rgba(13,191,118,0.06)',
        border: '1px solid rgba(13,191,118,0.15)',
        marginBottom: 8,
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--brand)', fontWeight: 700, marginBottom: 4 }}>
          PAPER TRADING
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          No real money. Pure simulation.
        </div>
      </div>
      <button
        onClick={() => { localStorage.removeItem(TUTORIAL_KEY); window.location.reload(); }}
        style={{
          width: '100%', background: 'transparent',
          border: '1px solid var(--border-light)', borderRadius: 8,
          padding: '7px 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600,
        }}
      >
        <HelpCircle size={14} /> Restart Tutorial
      </button>
    </aside>
  );
}
