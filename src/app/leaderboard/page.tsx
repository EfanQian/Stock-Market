'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Crown, Star } from 'lucide-react';
import { formatCash, formatPct } from '@/lib/finnhub';
import { loadPortfolio } from '@/lib/store';

const MOCK_LEADERS = [
  { rank: 1, name: 'Alex_Trades', returnPct: 34.2, value: 134200, xp: 2840, streak: 12 },
  { rank: 2, name: 'MarketWizard', returnPct: 28.7, value: 128700, xp: 2310, streak: 8 },
  { rank: 3, name: 'StockSurfer', returnPct: 22.1, value: 122100, xp: 1890, streak: 5 },
  { rank: 4, name: 'BullRunner99', returnPct: 19.8, value: 119800, xp: 1640, streak: 3 },
  { rank: 5, name: 'DiamondHands', returnPct: 17.5, value: 117500, xp: 1420, streak: 7 },
  { rank: 6, name: 'QuietInvestor', returnPct: 14.2, value: 114200, xp: 1180, streak: 2 },
  { rank: 7, name: 'TechBull2025', returnPct: 11.9, value: 111900, xp: 960, streak: 4 },
  { rank: 8, name: 'ValueHunter', returnPct: 9.3, value: 109300, xp: 780, streak: 1 },
  { rank: 9, name: 'RiskManager', returnPct: 7.1, value: 107100, xp: 620, streak: 0 },
  { rank: 10, name: 'DivKing', returnPct: 5.8, value: 105800, xp: 490, streak: 2 },
];

const ACHIEVEMENTS = [
  { id: 'first_trade', icon: '🎯', name: 'First Trade', desc: 'Execute your first buy order', xp: 10 },
  { id: 'diversified', icon: '🌈', name: 'Diversified', desc: 'Hold 5+ different stocks simultaneously', xp: 50 },
  { id: 'profit_100', icon: '💰', name: 'First Profit', desc: 'Make your first $100 profit', xp: 25 },
  { id: 'sim_complete', icon: '⏱️', name: 'Time Traveller', desc: 'Complete your first simulation', xp: 75 },
  { id: 'watchlist_5', icon: '⭐', name: 'Market Watcher', desc: 'Add 5 stocks to your watchlist', xp: 20 },
  { id: 'profit_1000', icon: '🚀', name: 'Rocket Returns', desc: 'Make $1,000+ profit in a simulation', xp: 100 },
  { id: 'news_reader', icon: '📰', name: 'News Junkie', desc: 'Read 10 market news articles', xp: 15 },
  { id: 'limit_order', icon: '🎓', name: 'Pro Trader', desc: 'Place your first limit order', xp: 30 },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [period, setPeriod] = useState<'weekly' | 'alltime'>('alltime');
  const [myXP, setMyXP] = useState(0);
  const [myReturn, setMyReturn] = useState(0);

  useEffect(() => {
    const p = loadPortfolio();
    setMyXP(p.xp);
    // Rough return calculation
    const totalValue = p.cash + Object.values(p.positions).reduce((s, pos) => s + pos.shares * pos.currentPrice, 0);
    setMyReturn(((totalValue - 100000) / 100000) * 100);
  }, []);

  // Insert user into leaderboard
  const myRank = MOCK_LEADERS.filter(l => l.returnPct > myReturn).length + 1;

  const RANK_COLORS: Record<number, string> = { 1: '#F59E0B', 2: '#94A3B8', 3: '#C2773C' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Leaderboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Compete with traders worldwide. Rankings reset weekly.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {(['leaderboard', 'achievements'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', background: tab === t ? 'rgba(13,191,118,0.12)' : 'transparent', color: tab === t ? 'var(--brand)' : 'var(--text-secondary)', transition: 'all 0.15s' }}>
            {t === 'leaderboard' ? '🏆 Leaderboard' : '🎖️ Achievements'}
          </button>
        ))}
      </div>

      {tab === 'leaderboard' && (
        <>
          {/* Period toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {(['weekly', 'alltime'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 16px', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: period === p ? 'var(--bg-hover)' : 'transparent', color: period === p ? 'var(--text-primary)' : 'var(--text-muted)', borderColor: period === p ? 'var(--border-light)' : 'var(--border)' }}>
                {p === 'weekly' ? 'This Week' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Top 3 podium */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]].map((leader, i) => {
              const actualRank = i === 1 ? 1 : i === 0 ? 2 : 3;
              const heightMap = { 1: 140, 2: 110, 3: 90 };
              return (
                <div key={leader.rank} style={{ background: 'var(--bg-card)', border: `1px solid ${actualRank === 1 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: 20, textAlign: 'center', position: 'relative', paddingBottom: 24 }}>
                  {actualRank === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}><Crown size={24} color="#F59E0B" /></div>}
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${RANK_COLORS[actualRank] ?? 'var(--brand)'}, var(--violet))`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: `${actualRank === 1 ? '12px' : '0px'} auto 12px`, fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                    {leader.name.slice(0, 1)}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>{leader.name}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--positive)' }}>+{leader.returnPct}%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{formatCash(leader.value)}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: RANK_COLORS[actualRank] ?? 'var(--brand)', borderRadius: '0 0 12px 12px' }} />
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
              {['Rank', 'Trader', 'Return', 'Portfolio', 'XP'].map(h => (
                <div key={h} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {MOCK_LEADERS.map(leader => (
              <div key={leader.rank} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'monospace', color: RANK_COLORS[leader.rank] ?? 'var(--text-secondary)' }}>
                  {leader.rank <= 3 ? ['🥇', '🥈', '🥉'][leader.rank - 1] : `#${leader.rank}`}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{leader.name}</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--positive)' }}>+{leader.returnPct}%</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{formatCash(leader.value)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--violet)', fontWeight: 700 }}>
                  <Zap size={14} /> {leader.xp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Your rank */}
          <div style={{ background: 'rgba(13,191,118,0.06)', border: '1px solid rgba(13,191,118,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000' }}>U</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>You</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rank #{myRank}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Return</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, color: myReturn >= 0 ? 'var(--positive)' : 'var(--negative)' }}>{myReturn >= 0 ? '+' : ''}{myReturn.toFixed(2)}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>XP</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--violet)' }}>{myXP.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'achievements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {ACHIEVEMENTS.map(ach => {
            const earned = false; // Would check against portfolio.achievements
            return (
              <div key={ach.id} style={{ background: 'var(--bg-card)', border: `1px solid ${earned ? 'rgba(13,191,118,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', opacity: earned ? 1 : 0.65 }}>
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>{ach.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, color: earned ? 'var(--brand)' : 'var(--text-primary)' }}>{ach.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{ach.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--violet)', fontSize: '0.78rem', fontWeight: 700 }}>
                    <Zap size={13} /> +{ach.xp} XP
                  </div>
                </div>
                {earned && <div style={{ color: 'var(--brand)', fontSize: '1.2rem' }}>✓</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
