'use client';

import { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MOCK_NEWS = [
  { id: 1, headline: 'Apple Reports Record-Breaking Q3 Earnings, iPhone Demand Surges', summary: 'Apple Inc. crushed analyst expectations for the third quarter, reporting earnings per share of $1.87 against the expected $1.62. iPhone shipments hit a new record, driven by strong demand in emerging markets and the iPhone 16 Pro lineup.', source: 'Bloomberg', datetime: Date.now() - 3600000, related: 'AAPL', sentiment: 'positive' as const, category: 'Earnings' },
  { id: 2, headline: 'Federal Reserve Holds Interest Rates Steady, Signals Potential Cuts Ahead', summary: 'The Federal Open Market Committee voted unanimously to maintain the federal funds rate at 5.25%-5.50%. Chair Jerome Powell indicated that rate cuts could begin "later this year" if inflation continues to cool, sending equity markets higher.', source: 'Reuters', datetime: Date.now() - 7200000, related: 'SPY', sentiment: 'positive' as const, category: 'Macro' },
  { id: 3, headline: 'NVIDIA Stock Surges 8% on AI Chip Demand, Data Center Revenue Triples', summary: 'NVIDIA Corporation posted explosive quarterly results, with data center revenue tripling year-over-year to $22.6 billion. The AI chip maker raised its forward guidance significantly above Wall Street estimates, citing insatiable demand for H100 and Blackwell processors.', source: 'CNBC', datetime: Date.now() - 10800000, related: 'NVDA', sentiment: 'positive' as const, category: 'Earnings' },
  { id: 4, headline: 'Tesla Faces Production Challenges in Shanghai, Cuts Delivery Outlook', summary: "Tesla's Shanghai Gigafactory reported a significant production slowdown due to supply chain disruptions affecting battery components. The company reduced its annual delivery guidance from 1.8 million to 1.6 million vehicles, disappointing investors who had expected continued growth.", source: 'Wall Street Journal', datetime: Date.now() - 14400000, related: 'TSLA', sentiment: 'negative' as const, category: 'Operations' },
  { id: 5, headline: 'Meta Platforms Announces $50B Share Buyback Program, Boosts Dividend', summary: "Meta CEO Mark Zuckerberg unveiled an aggressive capital return program, including a $50 billion share repurchase and a 10% increase to its quarterly dividend. The announcement came alongside strong advertising revenue growth driven by AI-optimized ad targeting across Facebook and Instagram.", source: 'Financial Times', datetime: Date.now() - 18000000, related: 'META', sentiment: 'positive' as const, category: 'Corporate' },
  { id: 6, headline: 'Oil Prices Spike 12% After OPEC+ Announces Extended Production Cuts', summary: 'The OPEC+ alliance shocked energy markets by extending existing production cuts through Q4 while adding an additional 500,000 barrel-per-day reduction. WTI crude oil surged above $100 per barrel for the first time since 2022, raising inflation concerns globally.', source: 'AP', datetime: Date.now() - 21600000, related: 'XOM', sentiment: 'neutral' as const, category: 'Energy' },
  { id: 7, headline: 'Microsoft Azure Revenue Climbs 30% YoY on AI Copilot Adoption', summary: "Microsoft's Azure cloud division posted another quarter of accelerating growth, with revenue climbing 30% year-over-year. The company attributed the outperformance to enterprises rapidly adopting Microsoft Copilot AI tools across Office 365 and Azure AI services.", source: 'TechCrunch', datetime: Date.now() - 25200000, related: 'MSFT', sentiment: 'positive' as const, category: 'Earnings' },
  { id: 8, headline: 'Bitcoin Dips Below $78,000 as Regulatory Uncertainty Spooks Investors', summary: 'Cryptocurrency markets faced renewed pressure after US lawmakers introduced a draft bill that would impose strict reporting requirements on crypto exchanges. Bitcoin fell to $77,800, while Ethereum dropped 8%. Analysts note this is still well above the $20,000 lows seen in 2022.', source: 'CoinDesk', datetime: Date.now() - 28800000, related: 'BTC-USD', sentiment: 'negative' as const, category: 'Crypto' },
  { id: 9, headline: 'Nike Sales Disappoint as Consumer Spending Shifts to Discount Brands', summary: "Nike reported quarterly revenue $400 million below analyst estimates, as cost-conscious consumers increasingly shifted to lower-priced athletic brands. The company announced a restructuring plan targeting $2 billion in savings over three years, including a workforce reduction of 2%.", source: 'Bloomberg', datetime: Date.now() - 32400000, related: 'NKE', sentiment: 'negative' as const, category: 'Earnings' },
  { id: 10, headline: 'S&P 500 Reaches New All-Time High as Inflation Cools to 2-Year Low', summary: "The S&P 500 index closed at a new record high of 5,871 points after the Consumer Price Index showed inflation dropping to 2.9%, its lowest level since 2021. The cooler-than-expected reading raised hopes for Federal Reserve rate cuts, driving broad market gains across all sectors.", source: 'Reuters', datetime: Date.now() - 36000000, related: 'SPY', sentiment: 'positive' as const, category: 'Macro' },
];

const CATEGORIES = ['All', 'Earnings', 'Macro', 'Corporate', 'Energy', 'Crypto', 'Operations'];

export default function NewsPage() {
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filtered = MOCK_NEWS.filter(n => {
    const catOk = category === 'All' || n.category === category;
    const sentOk = filter === 'all' || n.sentiment === filter;
    return catOk && sentOk;
  });

  const SentimentIcon = ({ s }: { s: string }) => {
    if (s === 'positive') return <TrendingUp size={14} color="var(--positive)" />;
    if (s === 'negative') return <TrendingDown size={14} color="var(--negative)" />;
    return <Minus size={14} color="var(--text-muted)" />;
  };

  const sentColor = (s: string) => s === 'positive' ? 'var(--positive)' : s === 'negative' ? 'var(--negative)' : 'var(--text-muted)';

  const timeAgo = (ts: number) => {
    const h = Math.floor((Date.now() - ts) / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Market News</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Stay informed with the latest financial news and market-moving events.</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: category === c ? 'rgba(13,191,118,0.1)' : 'transparent', color: category === c ? 'var(--brand)' : 'var(--text-secondary)', borderColor: category === c ? 'rgba(13,191,118,0.25)' : 'var(--border-light)' }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'positive', 'negative'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: filter === f ? 'var(--bg-hover)' : 'transparent', color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
              {f === 'all' ? 'All' : f === 'positive' ? '▲ Positive' : '▼ Negative'}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(news => (
          <div key={news.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, transition: 'border-color 0.15s', cursor: 'pointer' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>{news.category}</span>
                  <span style={{ fontSize: '0.68rem', background: `${sentColor(news.sentiment)}15`, padding: '2px 7px', borderRadius: 5, fontWeight: 700, color: sentColor(news.sentiment), display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SentimentIcon s={news.sentiment} /> {news.sentiment.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--brand)', fontWeight: 700, background: 'rgba(13,191,118,0.08)', padding: '2px 7px', borderRadius: 5 }}>{news.related}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {news.headline}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {news.summary}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{news.source}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>·</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(news.datetime)}</span>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--brand)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
