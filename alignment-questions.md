1. Tech Stack
Here's what we're using and why:

Frontend: Next.js 14 (React) — industry standard for this type of app, works great with Vercel, handles both the UI and API routes in one project
Backend: Next.js API Routes — no separate backend server needed for MVP; keeps things simple
Database: Supabase (PostgreSQL) — free tier, built-in auth, real-time subscriptions, easy to set up
Auth: Supabase Auth — handles email/password + Google OAuth out of the box, no extra setup
Hosting: Vercel — one-click deploys, free tier, works perfectly with Next.js

2. Market Data API
Using Polygon.io — best balance of price, reliability, and features. The free tier gives delayed data; the Starter plan (~$29/month) gives real-time. For MVP, start on the free tier with 15-minute delayed prices and upgrade when ready.
3. Chart Library
TradingView Lightweight Charts — no contest. It's built specifically for financial data, handles candlesticks natively, supports drawing tools, RSI, MACD, Bollinger Bands out of the box. Recharts is for general business charts, not trading platforms.
4. Build Approach
Building with AI. Recommended order:

Design system + layout shell (nav, sidebar, routing)
Auth (sign up, login, email verify)
Market data connection (live prices, search)
Stock detail page + charts
Trade execution (buy/sell orders)
Portfolio page
Dashboard
Watchlist
Simulation Mode
Leaderboard + achievements
News + notifications
Settings + ads

5. Advertising
AdSense account exists ✓ — stub the ad placements during development (placeholder divs with the right dimensions), then swap in real AdSense tags before launch. AdSense won't serve real ads until the site has real traffic anyway.
6. Simulation Mode
Scope: Shows what your portfolio would have looked like over a selected 1-month period using real historical daily prices. At the start of the simulation you pick a date 1 month in the past, get your $100k virtual cash, and the simulator steps forward day by day. You can trade at each day's real open price. At the end you see your return vs. the S&P 500 over the same month.

Simulation portfolio is completely separate from your live portfolio (different cash, different positions)
One simulation at a time per user
Speeds: 1x (real-time replay), 10x, 100x, and "Jump to End" button that skips straight to results

7. Leaderboard & Weekly Reset

Weekly reset = just the ranking resets, portfolios do NOT reset — the weekly leaderboard shows your % return for that week only, calculated from your portfolio value at Monday open vs. now
Friends = mutual (both users must accept) — same model as most social platforms

8. Portfolio Reset

XP and achievements: NOT reset — you keep your progress
Transaction history: deleted (fresh start)
Leaderboard: resets to 0% return (your $100k baseline restarts)
Cooldown: once every 7 days — prevents leaderboard gaming

9. Real-Time Data

Portfolio value updates: WebSocket push — price changes come in via WebSocket and the portfolio value recalculates client-side instantly
Market closed: show last closing price with a "Market Closed" label and the time until next open
GTC limit orders: yes, stay open and execute the next trading day when the price is hit (up to 90 days max)

10. Mobile
Full parity — the mobile browser experience should feel just as good as desktop. Both Jordan and Sam are mobile-first users and they're core personas. The bottom tab bar order: Home → Markets → Portfolio → Watchlist → More (Simulation, Leaderboard, Achievements, News, Settings).
11. Open Questions

Market data API: Polygon.io ✓ (decided above)
OAuth: Register Google OAuth app at console.developers.google.com — takes 10 minutes; Apple OAuth can wait until Phase 2 (complex to set up)
Ad network: AdSense account exists ✓

12. Legal / Compliance

Add a footer disclaimer: "MarketSim Pro is a simulation platform for educational purposes only. No real trades are executed. Not financial advice."
Target geography: Global launch but optimised for US and Canada
GDPR/CCPA: Store only what's needed (email, username, portfolio data). Add a privacy policy (can generate this). Supabase stores data in US regions by default — fine for MVP.