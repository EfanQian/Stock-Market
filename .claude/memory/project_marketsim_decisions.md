---
name: MarketSim Pro — Product Decisions
description: Confirmed product/feature decisions that differ from or clarify the PRD
type: project
---

**Build order:** Design system → Auth → Market data connection → Stock detail + charts → Trade execution → Portfolio → Dashboard → Watchlist → Simulation Mode → Leaderboard + achievements → News + notifications → Settings + ads

**Simulation Mode (simplified from PRD):**
- 1-month period only (not arbitrary date range)
- Daily prices (not minute-by-minute)
- Steps day-by-day; trade at each day's real open price
- Separate portfolio from live (different cash + positions)
- One simulation at a time per user
- Speeds: 1x, 10x, 100x, and "Jump to End" button
- Final screen: return vs S&P 500 over same month

**Leaderboard:**
- Weekly reset = ranking only; portfolios do NOT reset
- Weekly % return = portfolio value at Monday open vs. now
- Friends = mutual (both must accept)

**Portfolio Reset:**
- XP and achievements: NOT reset
- Transaction history: deleted
- Leaderboard: resets to 0% return ($100k baseline restarts)
- Cooldown: once every 7 days

**Real-Time Data:**
- Portfolio value: WebSocket push → recalculates client-side
- Market closed: show last closing price + "Market Closed" label + time until next open
- GTC limit orders: stay open, execute next trading day when price is hit, max 90 days

**Mobile:** Full parity with desktop. Bottom tab order: Home → Markets → Portfolio → Watchlist → More

**Legal/Geography:** Global launch, optimised for US + Canada. Minimal data storage (GDPR/CCPA). Footer disclaimer: "simulation platform for educational purposes only, not financial advice."
