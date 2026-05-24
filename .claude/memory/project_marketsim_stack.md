---
name: MarketSim Pro — Tech Stack Decisions
description: Confirmed tech stack and key architectural decisions for MarketSim Pro
type: project
---

**Stack:** Next.js 14 (frontend + API routes), Supabase (PostgreSQL + Auth), Vercel (hosting), TradingView Lightweight Charts, Alpaca (market data)

**Why:** One-repo setup, no separate backend server for MVP. Supabase handles auth (email/password + Google OAuth) and real-time subscriptions.

**How to apply:** All code should target this stack. No separate Express server. Use Next.js API routes for backend logic. Use Supabase client for DB and auth.

---

**Market Data:** Alpaca — user has created an account. Free tier includes real-time US stock data (IEX feed) and WebSocket streaming. Use Alpaca Data API v2 for historical OHLCV. Note: Alpaca free tier uses IEX feed (not SIP), so some illiquid stocks may have gaps. Fundamentals, news, and analyst ratings are NOT included — need a second source (e.g. Finnhub free tier) for those.

**Auth:** Supabase Auth for email/password + Google OAuth. Apple OAuth deferred to Phase 2 (too complex for MVP).

**Ads:** AdSense account exists. Stub ad placements as placeholder divs with correct dimensions during dev; swap in real tags pre-launch.
