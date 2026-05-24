# MarketSim Pro — Full Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Draft  
**Date:** May 2025  
**Author:** Product Team  
**Audience:** Developers, Designers, AI Build Agents  

---

> **Purpose of this document:** This PRD is written to be zero-ambiguity. Every screen, every button, every state, every edge case, every colour, every interaction, and every data field is specified. Any developer or AI agent building this product should be able to do so entirely from this document with no assumptions, no creative decisions, and no open questions left unanswered. If something is not in this document, it does not exist in the product.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Audience & User Personas](#3-target-audience--user-personas)
4. [Scope — MVP vs Future Phases](#4-scope--mvp-vs-future-phases)
5. [Design System & Visual Language](#5-design-system--visual-language)
6. [Global Layout & Navigation](#6-global-layout--navigation)
7. [Advertising System](#7-advertising-system)
8. [Authentication Screens](#8-authentication-screens)
9. [Onboarding & Tutorial](#9-onboarding--tutorial)
10. [Dashboard (Home Screen)](#10-dashboard-home-screen)
11. [Markets Page](#11-markets-page)
12. [Stock Detail Page](#12-stock-detail-page)
13. [Trade Execution Panel](#13-trade-execution-panel)
14. [Portfolio Page](#14-portfolio-page)
15. [Simulation Mode](#15-simulation-mode)
16. [Watchlist Page](#16-watchlist-page)
17. [Leaderboard Page](#17-leaderboard-page)
18. [Achievements & XP System](#18-achievements--xp-system)
19. [News Page](#19-news-page)
20. [Notifications System](#20-notifications-system)
21. [Settings Page](#21-settings-page)
22. [User Profile Page](#22-user-profile-page)
23. [Data & API Architecture](#23-data--api-architecture)
24. [Simulation Engine — Deep Specification](#24-simulation-engine--deep-specification)
25. [Real-Time Price System](#25-real-time-price-system)
26. [Order Execution Engine](#26-order-execution-engine)
27. [Non-Functional Requirements](#27-non-functional-requirements)
28. [Technical Architecture](#28-technical-architecture)
29. [Database Schema Overview](#29-database-schema-overview)
30. [Error States & Edge Cases](#30-error-states--edge-cases)
31. [Open Questions](#31-open-questions)
32. [Glossary](#32-glossary)
33. [AI-Powered Prediction API](#33-ai-powered-prediction-api)

---

## 1. Executive Summary

**Product Name:** MarketSim Pro  
**Tagline:** Trade Like a Pro. Risk Nothing.  
**Type:** Stock market simulator web platform (paper trading with real live market data)  
**Monetization:** Free forever, ad-supported  
**Data:** Live and historical market data via third-party financial API  

MarketSim Pro is a professional-grade, browser-first stock market simulator that gives users the complete experience of a real brokerage platform — real prices, real order types, real portfolio analytics, real financial news — using 100% virtual money. No real trades are ever executed. No real money is ever involved.

The platform is modelled after professional brokerage platforms like Questrade in terms of depth, feature set, and UX quality. It is not a toy or a casual game — it is a serious simulation tool. Every feature that exists in a real brokerage (except real-money execution) exists in MarketSim Pro.

The unique differentiator is the **Simulation Mode**: users can travel back in time to any date in history, trade using real historical prices, and see how their strategy would have performed. This is powered by historical OHLCV data from the market data API.

The platform is free to use. Revenue is generated through display advertising. There is no premium tier at launch.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

> "To be the most realistic, educationally rich, and professionally complete free stock market simulator ever built — giving every person on earth the experience of a professional trader, without risking a single dollar."

### 2.2 Core Product Principles

These principles govern every feature decision:

- **Realism First:** Every feature must mirror what a real brokerage does. No shortcuts, no simplifications that break realism.
- **Zero Ambiguity for Users:** Every piece of data, every number, every term on screen must have a label, a tooltip, or a definition. No user should ever have to guess what a number means.
- **Speed:** The app must feel instant. Data must update in real time. Lag kills trust in a financial product.
- **Education Without Condescension:** The platform teaches users through contextual information, not pop-up lectures. Advanced users are not slowed down by beginner content.
- **Fair & Transparent:** Ads are clearly labelled. The simulation is clearly labelled as simulation. No dark patterns.

### 2.3 Primary Goals

1. Replicate the full brokerage experience (Questrade-level depth) using virtual money
2. Use live market data to make every price, chart, and statistic real
3. Allow users to backtest strategies using historical data through Simulation Mode
4. Build competitive community features (leaderboards, achievements, friends)
5. Monetize sustainably through advertising without degrading user experience
6. Educate users about investing through contextual tooltips, definitions, and analytics

### 2.4 Success Metrics

| Metric | Definition | Year 1 Target |
|--------|-----------|---------------|
| Monthly Active Users (MAU) | Unique users who log in at least once per month | 50,000 |
| Day-1 Retention | % of new users who return the next day | 60% |
| Day-7 Retention | % of new users who return after 7 days | 30% |
| Day-30 Retention | % of new users who return after 30 days | 15% |
| Average Session Duration | Average time per session | 12 minutes |
| Trades per User per Week | Average number of orders placed per active user per week | 5 |
| Ad Revenue per MAU | Monthly ad revenue divided by MAU | $0.50 |
| Simulation Sessions per MAU | Average simulation sessions per active user per month | 2 |

---

## 3. Target Audience & User Personas

### 3.1 Persona 1 — The Curious Beginner

- **Name:** Jordan, 22
- **Background:** University student, never bought a stock, heard about investing through social media
- **Goal:** Understand how the stock market works before risking real money
- **Behaviour:** Logs in a few times per week, makes small trades, reads news articles, checks portfolio obsessively
- **Needs:** Simple onboarding, tooltips on every financial term, no jargon without explanation, clear profit/loss display, encouragement through achievements
- **Frustrations:** Overwhelmed by real brokerage complexity, afraid of making mistakes, doesn't understand order types
- **Device:** Primarily mobile browser, occasionally desktop

### 3.2 Persona 2 — The Finance Student

- **Name:** Priya, 20
- **Background:** Finance or economics major, understands theory, wants to apply it
- **Goal:** Practice what she learns in class in a realistic market environment; prove her strategies work
- **Behaviour:** Logs in daily, uses advanced order types, reads analyst ratings, uses technical indicators on charts, runs simulations to backtest strategies
- **Needs:** Full suite of order types, technical analysis tools (RSI, MACD, Bollinger Bands), historical data, simulation mode, exportable transaction history
- **Frustrations:** Demo accounts on real brokerages expire after 30 days; paper trading on real apps is buried and limited
- **Device:** Primarily desktop

### 3.3 Persona 3 — The Competitive Trader

- **Name:** Marcus, 31
- **Background:** Works in tech, follows markets casually, competitive by nature
- **Goal:** Reach the top of the leaderboard, beat friends, prove investing skill
- **Behaviour:** Logs in daily, makes aggressive concentrated bets, tracks leaderboard obsessively, competes in weekly rankings, shares results
- **Needs:** Leaderboard (global and friends), weekly tournaments, real-time updates, social features, performance analytics, sharing capabilities
- **Frustrations:** Wants recognition for good performance; existing simulators don't have a community aspect
- **Device:** Equal desktop and mobile

### 3.4 Persona 4 — The Casual Explorer

- **Name:** Sam, 35
- **Background:** Has heard about stocks, never really engaged, curious about whether they could have called certain market moves
- **Goal:** Have fun exploring what would have happened if they'd bought Tesla in 2019 or Apple in 2010
- **Behaviour:** Irregular usage, mostly uses Simulation Mode, doesn't care much about leaderboard, likes seeing big numbers
- **Needs:** Easy simulation setup, accessible UI, clear results, shareability of results
- **Frustrations:** Too much complexity before being able to do anything fun
- **Device:** Primarily mobile

---

## 4. Scope — MVP vs Future Phases

### 4.1 MVP (Version 1.0) — In Scope

The following features are required for launch:

**Authentication & Accounts**
- Email + password registration and login
- Google OAuth login
- Apple OAuth login
- Email verification
- Password reset
- Account deletion

**Market Data**
- Live stock prices for all NYSE and NASDAQ listed equities (via API)
- Historical OHLCV data going back 10 years minimum
- Real-time price updates via WebSocket during market hours
- Financial news feed via API
- Company fundamentals (P/E, EPS, market cap, dividend yield, sector, etc.)
- Analyst ratings and price targets
- Major index data (S&P 500, NASDAQ Composite, Dow Jones, TSX) — display only, not tradeable

**Trading (Paper/Simulation)**
- Virtual portfolio starting with $100,000 USD virtual cash
- Market orders
- Limit orders
- Stop-Loss orders
- Stop-Limit orders
- Good For Day (GFD) order duration
- Good Till Cancelled (GTC) order duration
- Order cancellation
- Order history and transaction log
- Portfolio reset

**Portfolio Analytics**
- Total portfolio value (live)
- Cash balance (live)
- Today's gain/loss
- Total return from starting cash
- Allocation breakdown (pie chart)
- Performance chart (line graph over time)
- Realized vs unrealized P&L
- Holdings table with all position details
- Benchmark comparison (vs S&P 500)

**Charts & Technical Analysis**
- Line chart and Candlestick chart
- Time ranges: 1D, 5D, 1W, 1M, 3M, 6M, 1Y, 5Y, ALL
- Moving averages: MA 20, MA 50, MA 200
- Bollinger Bands
- Volume bars
- RSI sub-chart
- MACD sub-chart
- Trend line drawing tool
- Horizontal line drawing tool
- Price alert from chart

**Simulation Mode**
- Select any start date up to 10 years in the past
- Set starting cash ($1,000 to $10,000,000)
- Select replay speed (1x, 5x, 10x, 50x, 100x, 1000x)
- Play/pause/stop controls
- Trade during simulation using historical prices
- Historical news replay
- Final performance summary
- Compare to S&P 500 over same period

**Watchlist**
- Multiple named watchlists
- Add/remove stocks
- Drag-to-reorder
- Price alerts per stock
- Share watchlist (read-only link)

**Leaderboard**
- Global leaderboard (all users, ranked by % return)
- Friends leaderboard
- Weekly leaderboard (resets Monday 00:00 UTC)
- All-time leaderboard
- Friend request system

**Achievements & Gamification**
- XP points system
- 100 levels
- Badge achievement system (full list in Section 18)
- Daily challenges
- Streak tracking (login streaks)

**News**
- Live financial news feed
- Filter by sector and ticker
- Watchlist news filter
- Featured article

**Notifications**
- In-app notification centre
- Price alert notifications
- Trade confirmation notifications
- Order filled/expired notifications
- Achievement notifications
- Friend request notifications

**Settings**
- Profile management
- Notification preferences
- Display preferences (light/dark mode)
- Privacy settings
- Password change
- Account deletion

**Advertising**
- Top leaderboard banner (728x90)
- Medium rectangle sidebar ad (300x250)
- In-feed native ads
- Interstitial ad (once per session)

### 4.2 Phase 2 — Post-Launch (Not in MVP)

- Native iOS and Android apps
- Push notifications (mobile)
- Cryptocurrency markets (BTC, ETH, and top 50 by market cap)
- Canadian market (TSX/TSX-V)
- Social feed (posts, comments, following users)
- AI trading assistant / chatbot
- Tournament mode (structured competitions with prizes)
- Pre-market and after-hours trading simulation
- Options simulator (basic calls and puts)
- Earnings calendar with estimates and actual tracking
- Paper trading leagues / classroom mode for educators

### 4.3 Phase 3 — Long Term

- Real brokerage integration (optional link to real account for seamless transition)
- Advanced options strategies (spreads, straddles, condors)
- Futures simulation
- Margin trading simulation
- Custom index creation
- API access for developers (programmatic trading bots)
- White-label version for financial education institutions

### 4.4 Explicit Out of Scope (MVP)

- Any form of real money handling or real trade execution
- Cryptocurrency of any kind
- Options, futures, or margin
- Tax reporting
- Mobile native apps
- Social feed / posts
- Pre-market or after-hours order execution (prices shown, orders not accepted outside market hours for MVP)

---

## 5. Design System & Visual Language

This section defines every visual decision for the platform. No design decisions are left to the developer. Every component must match these specifications exactly.

### 5.1 Brand Identity

- **Product Name:** MarketSim Pro
- **Tagline:** Trade Like a Pro. Risk Nothing.
- **Personality:** Professional, trustworthy, data-driven, modern — like a high-end fintech app, not a toy

### 5.2 Colour Palette

All colours are defined as CSS custom properties on the `:root` element.

```css
:root {
  /* Primary Brand */
  --color-brand-primary: #0A7C4E;       /* Dark green — primary brand colour */
  --color-brand-secondary: #0DBF76;     /* Bright green — accents, CTAs */
  --color-brand-tertiary: #E8F8F1;      /* Very light green — backgrounds, tints */

  /* Semantic — Financial */
  --color-positive: #00C853;            /* Gain / profit / buy — bright green */
  --color-positive-bg: #E8F5E9;         /* Gain background tint */
  --color-negative: #D32F2F;            /* Loss / sell — red */
  --color-negative-bg: #FFEBEE;         /* Loss background tint */
  --color-neutral: #6B7280;             /* Unchanged / neutral */

  /* Backgrounds */
  --color-bg-primary: #FFFFFF;          /* Main page background */
  --color-bg-secondary: #F8FAFC;        /* Sidebar, cards, panels */
  --color-bg-tertiary: #F1F5F9;         /* Table rows (alternate), input backgrounds */
  --color-bg-overlay: rgba(0,0,0,0.5);  /* Modal overlays */

  /* Text */
  --color-text-primary: #0F172A;        /* Headings, main content */
  --color-text-secondary: #475569;      /* Labels, captions, secondary info */
  --color-text-tertiary: #94A3B8;       /* Placeholders, disabled states */
  --color-text-inverse: #FFFFFF;        /* Text on dark backgrounds */

  /* Borders */
  --color-border-primary: #E2E8F0;      /* Standard borders */
  --color-border-secondary: #CBD5E1;    /* Stronger borders, table lines */
  --color-border-focus: #0A7C4E;        /* Focus rings on inputs */

  /* Status */
  --color-status-open: #00C853;         /* Market OPEN badge */
  --color-status-closed: #6B7280;       /* Market CLOSED badge */
  --color-status-premarket: #F59E0B;    /* PRE-MARKET badge */
  --color-status-afterhours: #8B5CF6;   /* AFTER-HOURS badge */
  --color-status-error: #EF4444;        /* Error messages */
  --color-status-warning: #F59E0B;      /* Warning messages */
  --color-status-success: #10B981;      /* Success messages */
  --color-status-info: #3B82F6;         /* Info messages */

  /* Dark Mode — same property names, different values */
  /* Applied via [data-theme="dark"] on the <html> element */
}

[data-theme="dark"] {
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #334155;
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-tertiary: #475569;
  --color-border-primary: #334155;
  --color-border-secondary: #475569;
  --color-brand-tertiary: #0F2D1F;
  --color-positive-bg: #052E16;
  --color-negative-bg: #450A0A;
}
```

### 5.3 Typography

```css
/* Font imports — must be loaded from Google Fonts or self-hosted */
/* Display/Heading font: "DM Sans" — clean, modern, slightly geometric */
/* Body/Data font: "IBM Plex Sans" — technical, readable at small sizes */
/* Mono font: "JetBrains Mono" — for prices, numbers, tickers */

:root {
  --font-display: 'DM Sans', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Type scale */
  --text-xs:   0.75rem;    /* 12px — labels, captions */
  --text-sm:   0.875rem;   /* 14px — secondary info, table cells */
  --text-base: 1rem;       /* 16px — body text */
  --text-lg:   1.125rem;   /* 18px — slightly larger body */
  --text-xl:   1.25rem;    /* 20px — section labels */
  --text-2xl:  1.5rem;     /* 24px — card headings */
  --text-3xl:  1.875rem;   /* 30px — page headings */
  --text-4xl:  2.25rem;    /* 36px — large prices, hero numbers */
  --text-5xl:  3rem;       /* 48px — portfolio value hero */

  /* Font weights */
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semibold: 600;
  --weight-bold:    700;

  /* Line heights */
  --leading-tight:  1.2;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

**Typography Rules:**
- All stock prices, portfolio values, dollar amounts, and percentages MUST use `--font-mono`
- All ticker symbols MUST use `--font-mono` and `--weight-bold`
- All headings use `--font-display`
- All body text, labels, descriptions use `--font-body`
- Never use system fonts (Arial, Helvetica, etc.) anywhere on the platform

### 5.4 Spacing System

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
}
```

### 5.5 Border Radius

```css
:root {
  --radius-sm:   4px;    /* Buttons, inputs, badges */
  --radius-md:   8px;    /* Cards, panels */
  --radius-lg:   12px;   /* Modals, larger cards */
  --radius-xl:   16px;   /* Bottom sheets, side panels */
  --radius-full: 9999px; /* Pills, avatars, toggles */
}
```

### 5.6 Shadows

```css
:root {
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-focus: 0 0 0 3px rgba(10,124,78,0.3);  /* Focus rings */
}
```

### 5.7 Component Specifications

#### Buttons

All buttons have the following shared properties:
- `font-family: var(--font-body)`
- `font-weight: var(--weight-semibold)`
- `border-radius: var(--radius-sm)`
- `cursor: pointer`
- `transition: all 150ms ease`
- `outline: none`
- On focus: `box-shadow: var(--shadow-focus)`
- On disabled: `opacity: 0.4`, `cursor: not-allowed`

**Primary Button (Buy / CTA)**
- Background: `var(--color-brand-secondary)` (`#0DBF76`)
- Text colour: `#FFFFFF`
- Padding: `10px 20px` (medium), `12px 24px` (large), `8px 16px` (small)
- Font size: `var(--text-base)` (medium), `var(--text-lg)` (large)
- Hover state: background darkens to `#0AA668`
- Active state: background darkens further to `#089158`

**Danger Button (Sell / Delete / Reset)**
- Background: `var(--color-negative)` (`#D32F2F`)
- Text colour: `#FFFFFF`
- Hover: `#B71C1C`
- Active: `#9A1515`

**Secondary Button (Cancel / Back / Edit)**
- Background: `transparent`
- Border: `1px solid var(--color-border-secondary)`
- Text colour: `var(--color-text-primary)`
- Hover: background `var(--color-bg-tertiary)`

**Ghost Button (watchlist star, icon buttons)**
- Background: `transparent`
- Border: none
- Text/icon colour: `var(--color-text-secondary)`
- Hover: background `var(--color-bg-tertiary)`, colour `var(--color-text-primary)`

**Toggle Button Group (Buy/Sell, Chart types)**
- Container: `border-radius: var(--radius-sm)`, `background: var(--color-bg-tertiary)`, `padding: 3px`
- Active option: `background: var(--color-bg-primary)`, `box-shadow: var(--shadow-sm)`, `color: var(--color-text-primary)`
- Inactive option: `background: transparent`, `color: var(--color-text-secondary)`

#### Input Fields

All inputs share:
- `font-family: var(--font-body)`
- `font-size: var(--text-base)`
- `border: 1px solid var(--color-border-primary)`
- `border-radius: var(--radius-sm)`
- `padding: 10px 12px`
- `background: var(--color-bg-primary)`
- `color: var(--color-text-primary)`
- `width: 100%`
- On focus: `border-color: var(--color-border-focus)`, `box-shadow: var(--shadow-focus)`
- On error: `border-color: var(--color-status-error)`
- Placeholder colour: `var(--color-text-tertiary)`

Number inputs for prices and quantities:
- Use `type="number"` with `step="0.01"` for prices, `step="1"` for share quantities
- `font-family: var(--font-mono)` — numbers must always render in mono font
- Minimum value: `0` always (no negative inputs)

#### Cards

- `background: var(--color-bg-primary)`
- `border: 1px solid var(--color-border-primary)`
- `border-radius: var(--radius-md)`
- `padding: var(--space-6)`
- `box-shadow: var(--shadow-sm)`
- On hover (clickable cards): `box-shadow: var(--shadow-md)`, `border-color: var(--color-border-secondary)`

#### Tables

- Header row: `background: var(--color-bg-secondary)`, `font-weight: var(--weight-semibold)`, `font-size: var(--text-sm)`, `color: var(--color-text-secondary)`, `text-transform: uppercase`, `letter-spacing: 0.05em`
- Data rows: alternating `background: var(--color-bg-primary)` and `background: var(--color-bg-secondary)`
- Row hover: `background: var(--color-brand-tertiary)`
- Cell padding: `12px 16px`
- Border: `1px solid var(--color-border-primary)` on bottom of each row only
- Clickable rows: `cursor: pointer`
- Positive values: colour `var(--color-positive)`, font `var(--font-mono)`
- Negative values: colour `var(--color-negative)`, font `var(--font-mono)`
- Neutral values: colour `var(--color-text-primary)`, font `var(--font-mono)`

#### Badges / Pills

- `border-radius: var(--radius-full)`
- `padding: 2px 8px`
- `font-size: var(--text-xs)`
- `font-weight: var(--weight-semibold)`

Variants:
- Positive (green): `background: var(--color-positive-bg)`, `color: var(--color-positive)`
- Negative (red): `background: var(--color-negative-bg)`, `color: var(--color-negative)`
- Neutral (grey): `background: var(--color-bg-tertiary)`, `color: var(--color-text-secondary)`
- Brand (teal): `background: var(--color-brand-tertiary)`, `color: var(--color-brand-primary)`

#### Tooltips

- `background: var(--color-text-primary)` (very dark)
- `color: var(--color-text-inverse)` (white)
- `font-size: var(--text-xs)`
- `padding: 6px 10px`
- `border-radius: var(--radius-sm)`
- `max-width: 240px`
- Appears after 400ms hover delay
- Disappears immediately on mouse leave
- Positioned above the trigger by default, flips to below if not enough space

#### Modals

- Overlay: `background: var(--color-bg-overlay)`, `position: fixed`, `inset: 0`, `z-index: 1000`
- Modal panel: `background: var(--color-bg-primary)`, `border-radius: var(--radius-lg)`, `padding: var(--space-8)`, centred, `max-width: 480px`, `width: 90vw`, `max-height: 90vh`, `overflow-y: auto`
- Always has a close button (X) in the top-right corner
- Clicking outside the modal (on the overlay) closes it, EXCEPT for destructive action confirmations (delete, reset) where clicking outside does NOT close
- Escape key closes all non-destructive modals
- Opening a modal traps focus inside it (accessibility)

#### Toast Notifications

- Position: top-centre of the screen, `z-index: 1100`
- Width: `360px` on desktop, `calc(100vw - 32px)` on mobile
- `border-radius: var(--radius-md)`
- `padding: 14px 16px`
- `box-shadow: var(--shadow-lg)`
- Appears with slide-down animation (150ms ease-out)
- Disappears with fade-out animation after 4000ms (success/info) or 6000ms (warning/error)
- Has a manual close (X) button
- Multiple toasts stack vertically with `8px` gap

Variants:
- Success: `background: var(--color-status-success)`, white text, checkmark icon
- Error: `background: var(--color-status-error)`, white text, X icon
- Warning: `background: var(--color-status-warning)`, white text, exclamation icon
- Info: `background: var(--color-status-info)`, white text, info icon

#### Loading States

- Skeleton screens: use animated gradient shimmer (`background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`, `background-size: 200% 100%`, `animation: shimmer 1.5s infinite`)
- All data-dependent sections show skeleton screens while loading
- Spinners: used only for button loading states (e.g., after clicking "Confirm Order")
- Spinner is a `20px` circle with a `2px` border, brand colour on top segment, `animation: spin 600ms linear infinite`
- Full page loading: logo centred on page background with spinner below it

### 5.8 Icons

- Icon library: **Lucide Icons** (open source, consistent stroke style)
- Default size: `20px` (standard), `16px` (small/inline), `24px` (large/navigation)
- Stroke width: `1.5px` (standard), `2px` (emphasis)
- Colour: inherits from parent text colour unless explicitly set

Key icon mappings:
- Dashboard: `LayoutDashboard`
- Markets: `TrendingUp`
- Portfolio: `Briefcase`
- Watchlist: `Star` / `StarOff`
- Simulation: `History`
- Leaderboard: `Trophy`
- Achievements: `Award`
- News: `Newspaper`
- Settings: `Settings`
- Notifications: `Bell`
- Search: `Search`
- Close/X: `X`
- Buy: `ArrowUpRight`
- Sell: `ArrowDownLeft`
- Up arrow (gain): `TrendingUp`
- Down arrow (loss): `TrendingDown`
- Info tooltip: `Info`
- Alert/bell: `Bell`
- Trade: `Zap`
- Calendar: `Calendar`
- Chart: `BarChart2`
- Candlestick: `CandlestickChart`
- Friend: `Users`
- Profile: `User`
- Lock: `Lock`
- Add: `Plus`
- Delete: `Trash2`
- Edit: `Pencil`
- Drag handle: `GripVertical`
- Share: `Share2`
- Download/Export: `Download`
- External link: `ExternalLink`
- Check: `Check`
- Warning: `AlertTriangle`
- Error: `AlertCircle`
- Success: `CheckCircle`

### 5.9 Animation & Motion

- All transitions default to `150ms ease` for micro-interactions (hover, focus)
- Page transitions: fade in `200ms ease-out`
- Modal open: `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` (slight spring overshoot)
- Modal close: `150ms ease-in`
- Toast enter: `translateY(-10px)` to `translateY(0)`, `opacity: 0` to `1`, `150ms ease-out`
- Toast exit: `opacity: 1` to `0`, `200ms ease-in`
- Chart price updates: value changes animate with a brief colour flash (green flash for up, red flash for down, 500ms)
- Number counters (portfolio value on dashboard): animate from previous value to new value over `300ms` using a number-roll effect
- Sidebar collapse/expand: `250ms ease` on width transition
- Skeleton shimmer: `1500ms infinite`

### 5.10 Responsive Breakpoints

```css
/* Mobile first approach */
/* xs: 0–479px (mobile portrait) */
/* sm: 480–767px (mobile landscape / small tablet) */
/* md: 768–1023px (tablet) */
/* lg: 1024–1279px (small desktop) */
/* xl: 1280–1535px (standard desktop) */
/* 2xl: 1536px+ (large desktop) */

@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

Layout behaviour at each breakpoint:
- **xs/sm (mobile):** Left sidebar is hidden; bottom tab bar is shown with 5 icons only; top nav shows logo + bell + avatar only; search bar is accessible via a search icon that expands to full-screen search overlay
- **md (tablet):** Left sidebar is shown in collapsed (icon-only) mode by default; can be expanded by clicking a toggle; top nav shows logo + abbreviated search + bell + avatar
- **lg+ (desktop):** Left sidebar fully expanded by default with icons and labels; full top nav with search bar visible at all times

---

## 6. Global Layout & Navigation

### 6.1 Page Layout Structure

Every authenticated page uses the following layout:

```
┌──────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION BAR                       │  height: 64px
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│     LEFT     │              MAIN CONTENT AREA               │
│   SIDEBAR    │                                               │
│   240px      │    max-width: 1440px, centered, padding 24px  │
│  (collapsed  │                                               │
│   64px)      │                                               │
│              │                                               │
├──────────────┴───────────────────────────────────────────────┤
│              BOTTOM TAB BAR (mobile only)        height: 64px│
└──────────────────────────────────────────────────────────────┘
```

The top nav and left sidebar are fixed/sticky (do not scroll with content).  
The main content area scrolls independently.  
On mobile, there is no left sidebar — only the bottom tab bar.

### 6.2 Top Navigation Bar

**Height:** `64px`  
**Background:** `var(--color-bg-primary)`  
**Border-bottom:** `1px solid var(--color-border-primary)`  
**Box-shadow:** `var(--shadow-sm)`  
**Z-index:** `500`  
**Position:** `fixed`, `top: 0`, `left: 0`, `right: 0`

**Contents (left to right):**

**1. Sidebar Toggle Button** (desktop only)
- Icon: `Menu` (hamburger) when sidebar expanded, `PanelLeft` when collapsed
- Size: `20px` icon inside a `40px` ghost button
- Clicking toggles sidebar between expanded (`240px`) and collapsed (`64px`) state
- State is persisted in `localStorage` key `sidebar_collapsed`

**2. Logo / Wordmark**
- Text: "MarketSim Pro" in `--font-display`, `--weight-bold`, `--text-xl`, colour `var(--color-brand-primary)`
- On mobile: shows only "MSP" abbreviation
- Clicking navigates to `/dashboard`

**3. Market Status Pill** (desktop only, hidden on mobile)
- Shows current market status: one of `OPEN`, `CLOSED`, `PRE-MARKET`, `AFTER-HOURS`
- Background and colour based on status (see colour definitions in 5.2)
- Includes a live clock showing:
  - If OPEN: "Closes in 2h 34m"
  - If CLOSED: "Opens in 14h 22m" (next trading day)
  - If PRE-MARKET: "Market opens in 45m"
  - If AFTER-HOURS: "Market closed — Pre-market opens in 11h"
- Updates every 60 seconds
- Hovering shows a tooltip: "NYSE/NASDAQ market hours: 9:30 AM – 4:00 PM ET, Monday–Friday"

**4. Global Search Bar** (centre, desktop only)
- Width: `360px` on desktop
- Placeholder: "Search stocks, ETFs, indices..."
- Icon: magnifying glass on the left inside the input
- On focus: border colour changes to `var(--color-border-focus)`, shadow appears
- As user types (debounced 200ms): dropdown appears with live autocomplete results
- Autocomplete dropdown:
  - `background: var(--color-bg-primary)`
  - `border: 1px solid var(--color-border-primary)`
  - `border-radius: var(--radius-md)`
  - `box-shadow: var(--shadow-lg)`
  - `z-index: 600`
  - Maximum 8 results shown
  - Each result row contains:
    - Company logo/icon (24px, fallback to first letter of ticker in a coloured circle)
    - Ticker symbol (bold, mono font)
    - Company name (regular, smaller)
    - Current price (mono font, right-aligned)
    - % change today (colour-coded, mono font, right-aligned)
  - Keyboard navigation: up/down arrow keys move selection, Enter navigates to selected stock
  - Highlighted result: `background: var(--color-brand-tertiary)`
  - "No results for [query]" message if no matches
  - Clicking anywhere outside closes the dropdown

**5. Virtual Cash Display** (desktop only)
- Label: "Cash" in `--text-xs`, `--color-text-secondary`
- Value: formatted dollar amount, `--font-mono`, `--weight-semibold`, `--text-base`, `--color-text-primary`
- Example: `$24,320.55`
- Updates in real time when trades execute
- Clicking navigates to Portfolio page

**6. Notification Bell**
- Icon: `Bell` (Lucide), `24px`
- Unread badge: red circle (`background: #EF4444`), white text, positioned top-right of icon
  - Shows count if 1–9: displays the number
  - Shows "9+" if more than 9 unread
  - Hidden if 0 unread
- Clicking toggles the notification dropdown panel (see Section 20)

**7. User Avatar + Dropdown**
- Circular avatar image, `36px` diameter, `border-radius: var(--radius-full)`
- Fallback if no image: first letter of display name, centred, on a coloured background (colour derived from username hash)
- On hover: slight border `2px solid var(--color-brand-secondary)` appears
- Clicking toggles a dropdown panel:
  - **Panel width:** `240px`
  - **Position:** right-aligned to the avatar, below the nav bar
  - **Contents top to bottom:**
    - User avatar (larger, `48px`) + display name + username (`@handle`) + email
    - XP bar: current XP, level number, progress to next level (thin green bar, full width)
    - Divider line
    - Link: "View Profile" → `/profile`
    - Link: "Portfolio" → `/portfolio`
    - Link: "Settings" → `/settings`
    - Divider line
    - Link: "Help & FAQ" → `/settings#help`
    - Link: "Keyboard Shortcuts" → opens modal listing shortcuts
    - Divider line
    - Button: "Log Out" — logs out and redirects to `/`

### 6.3 Left Sidebar Navigation

**Width (expanded):** `240px`  
**Width (collapsed):** `64px`  
**Background:** `var(--color-bg-secondary)`  
**Border-right:** `1px solid var(--color-border-primary)`  
**Position:** `fixed`, `left: 0`, `top: 64px`, `bottom: 0`  
**Z-index:** `400`  
**Overflow-y:** `auto` (scrollable if content overflows)  
**Transition:** `width 250ms ease`

**Navigation Items (in order):**

Each item has:
- Icon (Lucide, `20px`)
- Label text (hidden when collapsed, shown when expanded)
- Active state: `background: var(--color-brand-tertiary)`, `color: var(--color-brand-primary)`, icon colour `var(--color-brand-primary)`, left border `3px solid var(--color-brand-primary)`
- Inactive state: `color: var(--color-text-secondary)`, no background
- Hover state: `background: var(--color-bg-tertiary)`, `color: var(--color-text-primary)`
- Each item is a link (`<a>` tag) for proper routing
- When collapsed, show tooltip on hover with the label name

| Order | Label | Icon | Route |
|-------|-------|------|-------|
| 1 | Dashboard | `LayoutDashboard` | `/dashboard` |
| 2 | Markets | `TrendingUp` | `/markets` |
| 3 | Portfolio | `Briefcase` | `/portfolio` |
| 4 | Watchlist | `Star` | `/watchlist` |
| 5 | Simulation | `History` | `/simulation` |
| 6 | Leaderboard | `Trophy` | `/leaderboard` |
| 7 | Achievements | `Award` | `/achievements` |
| 8 | News | `Newspaper` | `/news` |

Divider line after item 8.

| 9 | Settings | `Settings` | `/settings` |

**Bottom of sidebar (fixed, not scrollable):**
- Collapsed/expanded toggle button (arrow icon)
- App version number: `v1.0.0` in `--text-xs`, `--color-text-tertiary`

### 6.4 Bottom Tab Bar (Mobile Only, below md breakpoint)

**Height:** `64px`  
**Background:** `var(--color-bg-primary)`  
**Border-top:** `1px solid var(--color-border-primary)`  
**Position:** `fixed`, `bottom: 0`, `left: 0`, `right: 0`  
**Z-index:** `400`

5 tabs (equally spaced):

| Tab | Icon | Route |
|-----|------|-------|
| Home | `LayoutDashboard` | `/dashboard` |
| Markets | `TrendingUp` | `/markets` |
| Portfolio | `Briefcase` | `/portfolio` |
| Watchlist | `Star` | `/watchlist` |
| More | `Grid` | Opens a bottom sheet with remaining nav items |

"More" bottom sheet contains: Simulation, Leaderboard, Achievements, News, Settings, and a close button.

Active tab: icon and label in `var(--color-brand-primary)`.  
Inactive tab: icon and label in `var(--color-text-secondary)`.  
Each tab has an icon (`24px`) and a label below it in `--text-xs`.

### 6.5 Main Content Area

**Margin-left:** `240px` (when sidebar expanded), `64px` (when sidebar collapsed), `0` (mobile)  
**Margin-bottom:** `0` (desktop), `64px` (mobile — to account for bottom tab bar)  
**Margin-top:** `64px` (to account for top nav)  
**Padding:** `var(--space-6)` on all sides  
**Max-width:** `1440px` (content area), `margin: 0 auto` to centre  
**Min-height:** `calc(100vh - 64px)` (fills screen)

### 6.6 Keyboard Shortcuts

The platform supports keyboard shortcuts for power users. A modal listing all shortcuts is accessible from the user dropdown menu.

| Shortcut | Action |
|----------|--------|
| `/` | Focus the global search bar |
| `G` then `D` | Navigate to Dashboard |
| `G` then `M` | Navigate to Markets |
| `G` then `P` | Navigate to Portfolio |
| `G` then `W` | Navigate to Watchlist |
| `G` then `L` | Navigate to Leaderboard |
| `G` then `N` | Navigate to News |
| `B` | Open Buy panel (if on Stock Detail page) |
| `S` | Open Sell panel (if on Stock Detail page and user has position) |
| `Escape` | Close open modal or panel |
| `?` | Open keyboard shortcuts modal |

---

## 7. Advertising System

### 7.1 Revenue Model

MarketSim Pro is free to use. There is no premium tier, no paywall, and no feature gating. All revenue is generated through display advertising.

### 7.2 Ad Placements — Full Specification

#### Placement 1: Top Leaderboard Banner

- **Dimensions:** 728x90px (desktop), 320x50px (mobile)
- **Position:** Directly below the top navigation bar, full-width
- **Pages shown:** Dashboard, Markets, News, Leaderboard, Achievements
- **Pages NOT shown:** Stock Detail, Portfolio, Trade Execution (any panel), Settings, any modal, Simulation Mode active view
- **Implementation:** Google AdSense `<ins>` tag with responsive ad unit
- **Fallback if no ad loads:** The space collapses to `0px` height (no empty white space)
- **Label:** "Advertisement" text in `--text-xs`, `--color-text-tertiary` appears above the banner

#### Placement 2: Right Sidebar Rectangle

- **Dimensions:** 300x250px
- **Position:** Right column on Dashboard and Markets pages (desktop only, hidden below `lg` breakpoint)
- **Pages shown:** Dashboard, Markets, News
- **Implementation:** Standard display unit, sticky within scroll (scrolls with content until it would go off-screen, then sticks)
- **Label:** "Advertisement" text above

#### Placement 3: In-Feed Native Ads

- **Position:** Every 10 items in the News feed and every 25 rows in the Markets stock list
- **Style:** Matches surrounding content style (same card dimensions, background, border) but with a "Sponsored" badge in the top-right corner
- **Content:** Finance-adjacent advertising only (trading platforms, financial software, business tools)
- **Implementation:** A third-party native ad network (e.g., Carbon Ads) or Google AdSense native

#### Placement 4: Interstitial Ad

- **Trigger:** Once per session, shown on first page load after login
- **Frequency cap:** Maximum once per session, maximum twice per 24 hours per user
- **Implementation:** Full-screen overlay with the ad centred
- **Skip button:** "Skip Ad" button appears in the bottom-right after exactly 5 seconds
- **Skip countdown:** "Skip in 5... 4... 3... 2... 1..." countdown timer shown from the moment the interstitial appears
- **Close button:** After "Skip Ad" button appears, clicking it closes the interstitial instantly and navigates to dashboard
- **Background:** Semi-transparent dark overlay (`rgba(0,0,0,0.85)`) behind the ad unit
- **Ad size:** 300x250 or 320x480

### 7.3 Ad Rules (Non-Negotiable)

1. Ads NEVER appear inside: the Trade Execution panel, any confirmation modal, the Simulation active view, password/auth screens, email verification screen
2. All ads are clearly labelled "Advertisement" or "Sponsored"
3. No autoplay audio on any ad unit
4. No ads that mimic UI elements (fake close buttons, fake alerts)
5. If an ad blocker is detected: show a single, polite banner message at the top of the page: "MarketSim Pro is free because of ads. Please consider whitelisting us in your ad blocker." This banner has a dismiss (X) button. The platform functions 100% normally even with an ad blocker — no features are locked.
6. Ad blocker detection must not use aggressive or intrusive methods

### 7.4 Ad Blocker Detection Logic

1. Attempt to load a dummy JavaScript file named `ads.js` from the CDN
2. If the file fails to load: set a flag `adBlockDetected = true`
3. If flag is true: show the polite whitelist-request banner (dismissible) once per session
4. Store dismissal in `sessionStorage` key `adBlockBannerDismissed`
5. Do not re-show after dismissal within the same session

---

## 8. Authentication Screens

### 8.1 Landing Page (Unauthenticated)

**Route:** `/` (root, unauthenticated only — redirects to `/dashboard` if already logged in)  
**Layout:** Full-width, no sidebar, custom top nav (logo + "Log In" + "Sign Up" buttons)

**Top Navigation (landing page only):**
- Logo left-aligned
- Right: "Log In" (secondary button) and "Get Started Free" (primary button)
- Background: white, no border, transparent until user scrolls 100px (then gains border-bottom and shadow)

**Hero Section:**
- Background: gradient from `var(--color-brand-primary)` to `var(--color-bg-primary)` at a diagonal angle
- Headline: "Trade Like a Pro. Risk Nothing." in `--font-display`, `--text-5xl` (desktop), `--text-3xl` (mobile), white, bold
- Subheadline: "MarketSim Pro gives you a real brokerage experience with $100,000 in virtual cash, live market data, and advanced trading tools — completely free." in white, `--text-lg`, `--weight-regular`
- CTA button: "Start Trading Free" — primary button, large size, white background, brand-colour text (inverted primary button for hero)
- Secondary CTA: "See how it works ↓" — ghost button, white text
- Hero image/screenshot: mockup of the dashboard UI on the right side (desktop); hidden on mobile

**Feature Highlights Strip:**
- 4 cards in a horizontal row (2x2 grid on mobile)
- Each card: icon (brand colour), short heading, 1-sentence description
- Content:
  - Icon `Wifi`: heading "Live Market Data", body "Real prices from NYSE and NASDAQ, updated every few seconds."
  - Icon `Shield`: heading "Zero Financial Risk", body "Trade with $100,000 in virtual cash. No real money, ever."
  - Icon `History`: heading "Time-Travel Trading", body "Go back in history and trade with real past prices."
  - Icon `Trophy`: heading "Compete with Others", body "Leaderboards, achievements, and weekly challenges."

**How It Works Section:**
- Heading: "Get started in 3 steps"
- 3 numbered steps:
  - 1: "Create your free account" — takes 30 seconds, no credit card
  - 2: "Get $100,000 in virtual cash" — instantly credited to your account
  - 3: "Start trading" — buy and sell real stocks using live prices
- CTA below: "Create Free Account" (primary button)

**Platform Screenshot Section:**
- Large screenshot of the dashboard with a caption: "A professional-grade simulator — not a toy."

**Footer:**
- Links: About · Privacy Policy · Terms of Service · Contact
- Copyright: "© 2025 MarketSim Pro. All rights reserved. MarketSim Pro is a simulation platform. No real trades are executed. Not financial advice."

### 8.2 Sign Up Screen

**Route:** `/signup`  
**Layout:** Centred card, max-width `480px`, `margin: auto`, `padding: var(--space-8)`  
**Background:** `var(--color-bg-secondary)` page background

**Page Title (above card):** "Create your account" in `--font-display`, `--text-3xl`, `--weight-bold`

**Card Contents (top to bottom):**

**OAuth Buttons (shown first):**
- "Continue with Google" button: full width, secondary style, Google logo icon on left
- "Continue with Apple" button: full width, secondary style, Apple logo icon on left
- Both buttons invoke OAuth flow; on success create account and redirect to onboarding

**Divider:**
- Horizontal line with "or" text centred — `color: var(--color-text-tertiary)`

**Form Fields:**

Field 1 — Full Name
- Label: "Full Name"
- Input: `type="text"`, `autocomplete="name"`, `placeholder="Jane Smith"`
- Validation: required, minimum 2 characters, maximum 100 characters
- Error: "Please enter your full name" (shown below field in `--color-status-error`, `--text-sm`)

Field 2 — Email Address
- Label: "Email Address"
- Input: `type="email"`, `autocomplete="email"`, `placeholder="jane@example.com"`
- Validation: required, valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Error states:
  - Empty: "Email address is required"
  - Invalid format: "Please enter a valid email address"
  - Already registered: "An account with this email already exists. Log in instead?" (with link to `/login`)

Field 3 — Password
- Label: "Password"
- Input: `type="password"`, `autocomplete="new-password"`, `placeholder="Create a password"`
- Show/hide toggle: eye icon on right side of input (`Eye` / `EyeOff` Lucide icon)
- Password strength meter: appears below input after user starts typing
  - Thin horizontal bar, full width
  - 4 segments: Weak (red, 1 segment filled), Fair (orange, 2 segments), Good (yellow, 3 segments), Strong (green, 4 segments)
  - Label below bar: "Weak" / "Fair" / "Good" / "Strong"
  - Strength algorithm: checks length ≥8, uppercase, lowercase, number, special character
- Validation requirements (shown as checklist below strength bar):
  - ✓ or ✗ "At least 8 characters"
  - ✓ or ✗ "At least one uppercase letter"
  - ✓ or ✗ "At least one number"
  - ✓ or ✗ "At least one special character (!@#$%^&*)"
- Cannot submit until all 4 requirements met
- Error: "Password does not meet requirements"

Field 4 — Confirm Password
- Label: "Confirm Password"
- Input: `type="password"`, `autocomplete="new-password"`, `placeholder="Repeat your password"`
- Show/hide toggle
- Validation: must match Field 3 exactly
- Error: "Passwords do not match" (checked on blur, not on every keystroke)

**Terms Checkbox:**
- `type="checkbox"`, required
- Label: "I agree to the [Terms of Service] and [Privacy Policy]" — bracketed words are hyperlinks opening in new tabs
- Error if unchecked on submit: "You must agree to the Terms of Service to create an account"

**Submit Button:**
- Text: "Create Account"
- Full width, primary button, large size
- Disabled state: when any required field is invalid or empty
- Loading state: shows spinner + "Creating account..." text while API call is in progress
- On success: redirects to `/verify-email`
- On failure (server error): shows error toast "Something went wrong. Please try again."

**Footer link:** "Already have an account? [Log in]" — link to `/login`

### 8.3 Log In Screen

**Route:** `/login`  
**Layout:** Same centred card layout as signup

**Page Title:** "Welcome back" in `--font-display`, `--text-3xl`, `--weight-bold`

**OAuth Buttons:**
- "Continue with Google" — same as signup
- "Continue with Apple" — same as signup
- If OAuth account matches existing email, logs in. If new, creates account and goes to onboarding.

**Divider:** "or"

**Form Fields:**

Field 1 — Email Address
- Label: "Email Address"
- Input: `type="email"`, `autocomplete="email"`
- Validation: required, valid format
- Error: "Please enter a valid email address"

Field 2 — Password
- Label: "Password"
- Input: `type="password"`, `autocomplete="current-password"`
- Show/hide toggle
- "Forgot password?" link right-aligned on the same line as the label, routes to `/forgot-password`
- Validation: required
- Error: "Password is required"

**Submit Button:**
- Text: "Log In"
- Full width, primary button, large
- Loading state: spinner + "Logging in..."
- On success: redirects to `/dashboard`
- On failure — incorrect password: "Incorrect email or password. Please try again." (shown as inline error above the form, in an error alert box)
  - Do NOT specify whether email or password was wrong (security)
- On failure — account locked: "Too many failed attempts. Your account is temporarily locked. Try again in [X] minutes." (inline error, no login button until lockout expires)
- Lockout policy: lock account for 15 minutes after 5 consecutive failed login attempts
- Lockout countdown is shown and updates every 60 seconds

**Footer link:** "Don't have an account? [Sign up for free]" — link to `/signup`

### 8.4 Forgot Password Screen

**Route:** `/forgot-password`  
**Layout:** Same centred card layout

**Page Title:** "Reset your password"  
**Subtitle:** "Enter your email address and we'll send you a link to reset your password."

**Field:**
- Label: "Email Address"
- Input: `type="email"`, `autocomplete="email"`
- Validation: required, valid format

**Submit Button:**
- Text: "Send Reset Link"
- Full width, primary, large
- Loading state: spinner + "Sending..."
- On submit (regardless of whether email exists in system): show success state
- Success state replaces the form:
  - Checkmark icon (green, `48px`)
  - Heading: "Check your email"
  - Body: "If an account exists for [email], we sent a password reset link. Check your spam folder if you don't see it."
  - Note: always show this success state regardless of whether the email is registered (prevents email enumeration)
  - "Resend email" link appears after 60 seconds; clicking re-sends if email exists
  - "Back to login" link

**Back link:** "← Back to login" at bottom

### 8.5 Reset Password Screen

**Route:** `/reset-password?token=[token]`  
**Layout:** Centred card

On load: validate the token server-side. If invalid or expired:
- Show error: "This password reset link is invalid or has expired. [Request a new link]" — link to `/forgot-password`
- Do not show the form

If token valid:

**Page Title:** "Create new password"

**Fields:**
- New Password (same specifications as signup Field 3, with strength meter and checklist)
- Confirm New Password (same as signup Field 4)

**Submit Button:**
- Text: "Update Password"
- On success: invalidate the reset token, redirect to `/login` with a success toast: "Password updated successfully. Please log in with your new password."
- On failure: show inline error

### 8.6 Email Verification Screen

**Route:** `/verify-email`  
**Shown:** After signup (before user can access any authenticated route)

**Contents:**
- Email icon (large, `64px`, brand colour)
- Heading: "Verify your email address"
- Body: "We sent a verification link to **[email]**. Click the link in the email to activate your account."
- Note: "Check your spam folder if you don't see the email."
- "Resend verification email" button: secondary style
  - Rate limited: button disabled for 60 seconds after each send
  - Countdown shown: "Resend in 45s"
  - After successful resend: show success toast "Verification email sent!"
  - Maximum 5 resends per 24 hours; after limit: "You've requested too many verification emails. Please contact support."
- "Use a different email address" link → redirects to `/signup` with email field pre-focused
- "Already verified? [Log in]" link → `/login`

**On email link click:**
- Token validated server-side
- If valid: user is logged in automatically, redirected to onboarding flow at `/onboarding`
- If invalid/expired: show error "This verification link is expired. [Resend verification email]"

---

## 9. Onboarding & Tutorial

### 9.1 Trigger Conditions

The onboarding flow triggers:
- After a new user verifies their email (first login ever)
- After OAuth signup (if it's the user's very first login)

The onboarding does NOT trigger:
- On any subsequent login
- After password reset
- If the user has already completed or skipped onboarding

The `onboarding_completed` flag is stored in the user's database record. Once set, onboarding never shows again.

### 9.2 Welcome Modal — Step-by-Step

The onboarding is a modal overlay with a step-based flow. The modal cannot be closed by clicking outside it (to avoid accidental dismissal). It CAN be skipped at any step.

**Modal dimensions:** `560px` wide, auto height, `border-radius: var(--radius-lg)`

**Progress Indicator:** 
- 5 dots at the bottom of the modal
- Active step: filled circle, brand colour
- Completed steps: filled circle, lighter brand colour
- Upcoming steps: empty circle, grey

**Navigation:**
- "Back" button (secondary): goes to previous step; hidden on step 1
- "Next" button (primary): advances to next step; text changes to "Get Started" on step 5
- "Skip Tutorial" link (ghost, grey text): appears on all steps; clicking jumps directly to dashboard and sets `onboarding_completed = true`

---

**Step 1: Welcome**
- Large trophy/celebration icon (brand colour, `64px`)
- Heading: "Welcome to MarketSim Pro!"
- Body: "You've been given **$100,000.00** in virtual cash to start trading. Your goal? Make it grow — without risking a single real dollar."
- Sub-note: "All trading on MarketSim Pro uses virtual money. No real transactions ever take place."

**Step 2: Your Dashboard**
- Heading: "Your command centre"
- Body: "The Dashboard shows your portfolio's real-time value, today's market movers, your open positions, and the latest financial news."
- Screenshot/illustration of the dashboard with arrows pointing to key sections

**Step 3: Buying Your First Stock**
- Heading: "How to buy a stock"
- Body with numbered steps:
  1. "Search for a company using the search bar at the top"
  2. "Click on the stock to see its price chart and details"
  3. "Click 'Buy' and choose how many shares you want"
  4. "Confirm your order — it executes immediately at the current price"
- Note: "You can also use Limit orders to buy at a specific price. We'll explain those soon."

**Step 4: Simulation Mode**
- Heading: "Time-travel trading"
- Body: "Simulation Mode lets you go back in time to any date in history and trade with real historical prices. Test your strategies. See what would have happened if you'd bought Apple in 2010."
- Icon: `History` (large, brand colour)
- "Find Simulation Mode in the left sidebar."

**Step 5: Set Your Username**
- Heading: "One last thing — pick your username"
- Body: "Your username appears on the leaderboard and is how other users find you."
- Username input field:
  - `placeholder="your_username"`
  - Validation: 3–20 characters, letters/numbers/underscores only, no spaces
  - Live availability check as user types (after 500ms debounce):
    - Available: green checkmark + "Username is available"
    - Taken: red X + "Username is already taken"
    - Invalid: inline error message
  - Pre-populated with a suggestion based on their display name (sanitized)
- "Get Started" button: saves username and `onboarding_completed = true`, redirects to `/dashboard`
- "Skip for now" link: skips username selection (username set to a temporary auto-generated value), still sets `onboarding_completed = true`

### 9.3 Contextual Tooltips (First-Use Hints)

For the first time a user interacts with each of the following, a tooltip-style hint appears. Each hint is shown only once and is permanently dismissed after the user clicks "Got it" or clicks elsewhere.

Dismissal state is stored in the database per user in a JSON field `dismissed_hints` (array of hint IDs).

| Hint ID | Trigger | Hint Text |
|---------|---------|-----------|
| `hint_watchlist_star` | First hover on watchlist star icon | "Click the star to add this stock to your Watchlist." |
| `hint_limit_order` | First time selecting Limit Order type | "A limit order only executes when the stock reaches your target price — or better." |
| `hint_chart_crosshair` | First hover over a price chart | "Hover over the chart to see the exact price at any point in time." |
| `hint_portfolio_chart` | First visit to Portfolio page | "This chart shows your total portfolio value over time." |
| `hint_leaderboard_rank` | First visit to Leaderboard page | "Your rank is based on total return percentage, not total value. A smaller account can outrank a bigger one." |
| `hint_simulation_mode` | First click on Simulation in sidebar | "In Simulation Mode, time moves forward and you trade with real historical prices. Your live portfolio is separate." |
| `hint_daily_challenge` | First time Daily Challenge widget is shown | "Complete today's challenge to earn bonus XP!" |
| `hint_price_alert` | First click on the bell icon next to a stock | "Set a price alert to be notified when a stock reaches your target price." |

---

## 10. Dashboard (Home Screen)

**Route:** `/dashboard`  
**Page Title:** "Dashboard"  
**Layout:** Two-column grid on desktop (main content left, right sidebar), single column on mobile

### 10.1 Page Layout

```
Desktop layout (lg and above):

┌──────────────────────────────┬────────────────┐
│ Portfolio Summary Card       │  Ad (300x250)  │
├──────────────────────────────┤                │
│ Performance Chart            │                │
├──────────────────────────────┤────────────────┤
│ Market Overview Ticker       │  Quick Trade   │
├──────────────────────────────┤  Widget        │
│ Top Movers (2 columns)       │                │
├──────────────────────────────┤────────────────┤
│ Your Holdings Preview        │  Upcoming      │
├──────────────────────────────┤  Earnings      │
│ News Feed                    │  Widget        │
└──────────────────────────────┴────────────────┘
```

Main column: `calc(100% - 320px - var(--space-6))`  
Right column: `320px`  
Gap: `var(--space-6)`

On mobile (below lg): single column, right column items reorder to appear below the main content in this order: Quick Trade Widget, Earnings Widget, Ad.

### 10.2 Portfolio Summary Card

**Position:** Top of main column, full width of main column  
**Card style:** Standard card component (Section 5.7)  
**Height:** Auto

**Contents:**

Row 1 — Main Portfolio Value:
- Label: "Total Portfolio Value" in `--text-sm`, `--weight-medium`, `--color-text-secondary`
- Value: current total portfolio value (positions market value + cash) in `--font-mono`, `--text-5xl`, `--weight-bold`, `--color-text-primary`
- Example: `$103,452.88`
- This number updates in real time during market hours (every 5 seconds)
- When the value changes: a brief colour flash animation — green (#00C853 at 30% opacity) or red (#D32F2F at 30% opacity) for 500ms

Row 2 — Stats Grid (4 stats in a row, each with label above and value below):

Stat 1: "Cash Available"
- Value: virtual cash balance in mono font
- Tooltip (? icon): "Your available virtual cash for new trades."

Stat 2: "Today's Gain / Loss"
- Value: dollar amount + percentage in brackets, colour coded
- Example: `+$452.88 (+0.44%)`
- Tooltip: "Change in your total portfolio value since yesterday's market close."

Stat 3: "Total Return"
- Value: dollar amount + percentage vs the $100,000 starting cash
- Example: `+$3,452.88 (+3.45%)`
- Tooltip: "Your total profit or loss since starting with $100,000."

Stat 4: "Invested"
- Value: total market value of all open positions
- Example: `$79,132.00`
- Tooltip: "The current market value of all your open stock positions."

Row 3 — Action Links:
- "View Full Portfolio →" link (brand colour) → `/portfolio`
- "Reset Portfolio" link (red, text-sm) → opens Reset Portfolio confirmation modal (same as in Portfolio page)

### 10.3 Performance Chart

**Position:** Below Portfolio Summary Card  
**Card style:** Standard card

**Chart Type:** Line chart (area chart with gradient fill beneath the line)  
**Line colour:** `var(--color-positive)` (green) when current value ≥ $100,000 starting value, `var(--color-negative)` (red) when below  
**Gradient fill:** Same colour at 20% opacity at the line, fading to 0% opacity at the bottom of the chart  
**Background:** `var(--color-bg-primary)`  
**Chart library:** TradingView Lightweight Charts (preferred) or Recharts

**Time Range Toggle:**
- Buttons displayed as a toggle group (see Section 5.7 Toggle Button Group)
- Options: `1D` | `1W` | `1M` | `3M` | `1Y` | `ALL`
- Default: `1D` on first load; remembered in `localStorage` as `dashboard_chart_range`
- `1D` shows data points every 5 minutes during the trading day
- `1W` shows data points daily
- `1M` and beyond show data points daily

**Benchmark Toggle:**
- "Compare to S&P 500" checkbox/toggle, positioned top-right of the chart card
- When enabled: overlays a second line in grey (`#94A3B8`) showing S&P 500 performance over the same period, normalised to start at the same value as the user's portfolio on the start date
- Legend shows at top of chart: "● Your Portfolio  ● S&P 500"

**Hover Behaviour:**
- Vertical crosshair line appears at the hovered x-position
- Tooltip shows: date/time, portfolio value, S&P value (if benchmark enabled), gain/loss from period start

**Chart Height:** `240px` on desktop, `180px` on mobile

**Data Points:**
- 1D: fetched from portfolio value snapshots stored in DB every 5 minutes during market hours
- 1W+: fetched from daily portfolio value snapshots stored at market close each day
- If insufficient data (e.g., user signed up today for 1W view): chart shows available data with a label "Showing data since account creation"

**Loading State:** Skeleton shimmer covering the chart area

### 10.4 Market Overview Ticker Strip

**Position:** Below Performance Chart  
**Height:** `48px`  
**Background:** `var(--color-bg-secondary)`  
**Border:** `1px solid var(--color-border-primary)` on top and bottom  
**Border-radius:** `var(--radius-md)`  
**Overflow:** hidden

**Content:** Continuously scrolling ticker strip showing major indices and a few top movers  

**Items shown:**
1. S&P 500 (SPX): current value, day change ($), day change (%)
2. NASDAQ Composite (COMP): same
3. Dow Jones (DJI): same
4. TSX Composite (GSPTSE): same
5. VIX (volatility index): value only, with label "VIX"
6. Top 5 most-traded stocks of the day: ticker, price, % change

**Item format (per index):**
`[Name]  [Value]  [+/-$change]  [(+/-%change)]`  
Values in `--font-mono`  
Positive change: `--color-positive`  
Negative change: `--color-negative`

**Scroll behaviour:**
- Items scroll from right to left continuously
- Speed: 40 pixels per second
- Pause on hover (pause animation when mouse is over the strip)
- Seamless loop (items repeat to fill the scroll)

**Data updates:** Refreshed every 30 seconds during market hours. No refresh needed outside market hours (data is static at close values).

### 10.5 Top Movers Section

**Position:** Below ticker strip  
**Heading:** "Today's Top Movers" in `--text-xl`, `--weight-semibold`  
**Sub-tabs:** "Gainers" | "Losers" — toggle buttons  
**Default:** "Gainers" selected

**Layout:** Grid of 5 stock cards in a row on desktop, 2 per row on mobile (10 total if both gainers and losers shown simultaneously — alternatively show just 5 of the selected tab)

**Each Stock Card:**
- Width: flex, equal width
- Card style: standard card, but smaller padding (`var(--space-4)`)
- Clickable: navigates to `/stocks/[TICKER]`

Contents:
- Row 1: Company logo/icon (32px) + Ticker (bold, mono) + Watchlist star icon (right)
- Row 2: Company name in `--text-sm`, `--color-text-secondary`, truncated with ellipsis at 1 line
- Row 3: Current price in `--font-mono`, `--text-xl`, `--weight-semibold`
- Row 4: % change — large badge, green background for gainers, red for losers, bold mono text
- Row 5: Mini sparkline chart (80px wide, 32px tall), colour matches gain/loss

**"View All" link:** "See all gainers →" / "See all losers →" link below the grid, navigates to `/markets?filter=gainers` or `/markets?filter=losers`

### 10.6 Your Holdings Preview

**Position:** Below Top Movers  
**Heading:** "Your Positions" in `--text-xl`, `--weight-semibold`

**Empty State (no positions):**
- Illustration: empty briefcase icon (`64px`, `--color-text-tertiary`)
- Text: "You don't have any open positions yet."
- Sub-text: "Find stocks you're interested in and make your first trade."
- Button: "Browse Markets" (primary) → `/markets`

**When positions exist:**
- Shows up to 5 positions (sorted by market value, highest first)
- Table format with columns:
  - Stock (logo + ticker + name)
  - Shares
  - Avg Cost (mono font)
  - Current Price (mono font, updates live)
  - Value (mono font)
  - Today's P&L ($ and %, coloured)
  - Sparkline (40px wide, 24px tall — last 7 days)

- Below table: "View all [N] positions →" link to `/portfolio` (where N = total number of positions)

### 10.7 Quick Trade Widget

**Position:** Right column, top  
**Card style:** Standard card with slightly more prominent border (`border: 2px solid var(--color-brand-secondary)`)

**Heading:** "Quick Trade" in `--text-lg`, `--weight-semibold`

**Contents:**

Stock Search:
- Input with `placeholder="Search stock (e.g. AAPL)"`, same autocomplete as global search
- After selecting a stock: shows ticker, company name, and live price in a row below the input
- "Clear" (X) button to deselect the stock

Buy/Sell Toggle:
- Toggle group: "Buy" (green when active) / "Sell" (red when active)
- Default: "Buy"

Quantity Input:
- Label: "Shares"
- Number input, mono font, min 1
- "Max" button: fills with max affordable shares (for Buy) or max owned shares (for Sell)

Estimated Cost:
- "Estimated Cost: $0.00" — updates live as quantity changes
- Shows "Estimated Proceeds" text when Sell is selected

Order Type:
- Dropdown: "Market" (default) | "Limit" | "Stop-Loss"
- If Limit selected: shows "Limit Price" input below
- If Stop-Loss selected: shows "Stop Price" input below

Place Order Button:
- Text: "Place Order"
- Full width, primary (buy) or danger (sell) based on Buy/Sell selection
- Disabled if: no stock selected, quantity is 0, required price field empty
- Clicking: validates fields, opens confirmation modal

Available Cash display:
- Below the button: "Available cash: $24,320.55"

### 10.8 News Feed (Dashboard)

**Position:** Bottom of main column  
**Heading:** "Market News" in `--text-xl`, `--weight-semibold`  
**"View All News →" link:** right-aligned on same row as heading, links to `/news`

**Shows:** 5 most recent articles on dashboard

**Each news item:**
- Row layout (not card — tighter):
- Source logo (20px) + source name + timestamp (e.g. "2 hours ago") — all in `--text-xs`, `--color-text-secondary`
- Headline in `--text-base`, `--weight-medium`, `--color-text-primary`, 2 lines max with ellipsis
- Related ticker tag(s): clickable pill badges, navigate to stock detail page
- Separator line between items
- Entire row is clickable (opens article in new tab)

**Loading:** 5 skeleton rows shown while loading

**Native ad unit:** Inserted as a styled item after the 3rd news item, labelled "Sponsored"

### 10.9 Upcoming Earnings Widget

**Position:** Right column, below Quick Trade Widget  
**Card style:** Standard card  
**Heading:** "Upcoming Earnings" in `--text-base`, `--weight-semibold`

**Shows:** Next 5 earnings reports within the next 7 trading days

**Each row:**
- Ticker (bold, mono) + Company name (truncated)
- Date: formatted as "Tomorrow", "Thu May 15", etc.
- Time: "Before Open" or "After Close" or "During Trading"
- Watchlist star: small, toggles watchlist status

**If no upcoming earnings in 7 days:** "No earnings reports scheduled for the next 7 days."

**"View earnings calendar →" link:** below the list

---

## 11. Markets Page

**Route:** `/markets`  
**Page Title:** "Markets"

### 11.1 Page Header

- Heading: "Markets" in `--text-3xl`, `--weight-bold`
- Sub-text: "Live prices from NYSE and NASDAQ. Updated every 5 seconds."
- Market status pill (same as top nav pill — OPEN/CLOSED/etc.)

### 11.2 Search Bar

- Full-width search bar at the top of the page content area
- `placeholder="Search by company name or ticker symbol..."`
- Same autocomplete behaviour as global search (Section 6.2 item 4)
- Clearing the search restores the full stock list with the current filter/sort applied

### 11.3 Category Tabs

Horizontal tab bar below the search bar:

| Tab ID | Label | Description |
|--------|-------|-------------|
| `all` | All Stocks | All tradeable equities, default |
| `gainers` | Gainers | Stocks with the highest % gain today, sorted descending |
| `losers` | Losers | Stocks with the largest % loss today, sorted ascending |
| `active` | Most Active | Sorted by volume descending |
| `52high` | 52W Highs | Stocks within 2% of their 52-week high |
| `52low` | 52W Lows | Stocks within 2% of their 52-week low |
| `watchlist` | My Watchlist | Only shows stocks the user has in any watchlist |

- Active tab: bottom border `3px solid var(--color-brand-primary)`, text `--color-brand-primary`, bold
- Inactive: text `--color-text-secondary`
- Tab state is reflected in URL: `/markets?tab=gainers`

### 11.4 Sector Filter Bar

Horizontally scrollable row of pill buttons below the category tabs:

Pills (in order):
- All Sectors (default, selected on load)
- Technology
- Finance
- Healthcare
- Energy
- Consumer Staples
- Consumer Discretionary
- Industrials
- Materials
- Real Estate
- Utilities
- Communication Services

- Multiple sectors can be selected simultaneously
- Active pill: `background: var(--color-brand-primary)`, white text
- Inactive pill: `background: var(--color-bg-tertiary)`, `color: var(--color-text-secondary)`, border `1px solid var(--color-border-primary)`
- Scrollable on mobile (no wrapping)
- Selecting "All Sectors" deselects all others

### 11.5 Sort & Filter Controls

Shown to the right of or below the sector filter bar:

**Sort By dropdown:**
- Options: "% Change" (default for Gainers/Losers), "Price", "Volume", "Market Cap", "Name (A–Z)", "Name (Z–A)"
- Dropdown style: standard select input

**Sort Direction button:**
- Icon: `ArrowUp` or `ArrowDown`
- Toggles between ascending and descending
- Default: descending for % change, ascending for name

**Advanced Filters button:**
- Icon: `SlidersHorizontal` + "Filters" text + badge showing number of active filters (e.g. "Filters (2)")
- Clicking opens a right-side drawer (on desktop) or bottom sheet (on mobile)
- Filter drawer contents:

  **Price Range:**
  - Dual-handle range slider: $0 to $5,000+
  - Min and max text inputs (editable)

  **Market Cap:**
  - Checkbox group: Nano (<$50M), Micro ($50M–$300M), Small ($300M–$2B), Mid ($2B–$10B), Large ($10B–$200B), Mega ($200B+)
  - Multiple selections allowed

  **Exchange:**
  - Checkboxes: NYSE, NASDAQ
  - Default: both checked

  **P/E Ratio:**
  - Range slider: 0 to 100+ (with "100+" as an overflow label)
  - "Exclude negative P/E" checkbox

  **Dividend Yield:**
  - Range slider: 0% to 15%

  **"Apply Filters" button** (primary, full width)  
  **"Reset All Filters" button** (secondary, full width)  
  **"X" close button** at top right of drawer/sheet

### 11.6 Results Count & Pagination Info

Between the filter controls and the stock list:  
"Showing 1–50 of 4,218 stocks" in `--text-sm`, `--color-text-secondary`

### 11.7 Stock List Table

**Table header columns (fixed, sticky on scroll):**

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Stock | 280px | No | Logo + Ticker + Company Name |
| Sector | 140px | No | Sector badge |
| Price | 120px | Yes | Current price, mono font |
| Change $ | 100px | Yes | Day change in dollars |
| Change % | 100px | Yes | Day change in percent |
| Volume | 110px | Yes | Formatted (e.g. 14.2M) |
| Mkt Cap | 120px | Yes | Formatted (e.g. 2.3T) |
| 7D Chart | 100px | No | Mini sparkline |
| Watchlist | 50px | No | Star icon toggle |
| Action | 90px | No | "Trade" button |

**Each Row:**

Stock column:
- Company logo: `32px` round image; fallback = coloured circle with ticker initial(s)
- Ticker: `--font-mono`, `--weight-bold`, `--text-sm`, `--color-text-primary`
- Company name: `--text-xs`, `--color-text-secondary`, max 1 line, truncated

Price column:
- Value: `--font-mono`, `--weight-semibold`, `--text-sm`
- Updates every 5 seconds during market hours with colour flash

Change $ and % columns:
- Positive: `--color-positive`, bold
- Negative: `--color-negative`, bold
- Zero: `--color-neutral`
- Both use `--font-mono`

Volume column:
- Formatted: 14,230,000 → "14.2M", 1,230,000,000 → "1.2B"

Mkt Cap column:
- Same formatting: T for trillion, B for billion, M for million

7D Chart column:
- 80px wide, 30px tall
- Green line if positive 7-day return, red if negative
- No axes, no labels — just the sparkline

Watchlist Star (column):
- `Star` icon (Lucide)
- Filled gold (`#F59E0B`) if in any watchlist
- Outline grey if not in watchlist
- Clicking: if in watchlist → remove immediately (with undo toast "Removed from Watchlist. Undo"); if not in watchlist → if user has only 1 watchlist, add immediately; if multiple watchlists, open a small popover asking which watchlist to add to

Trade Button:
- Secondary button style, small size: "Trade"
- Clicking opens the Trade Execution Panel (Section 13) for that stock

**Row click:** Clicking anywhere on the row (except the watchlist star and trade button) navigates to `/stocks/[TICKER]`

**Row hover:** `background: var(--color-brand-tertiary)`

**Pagination:**
- 50 rows per page
- Pagination controls at the bottom: "Previous" button, page numbers (up to 5 shown), "Next" button
- "Previous" and "Next" are disabled at first and last page respectively
- Clicking a page number navigates to that page and scrolls to the top of the table

---

## 12. Stock Detail Page

**Route:** `/stocks/[TICKER]` — e.g. `/stocks/AAPL`  
**Page Title:** "[Company Name] ([TICKER]) — MarketSim Pro"  

If the ticker is not found: show a 404-style page: "Stock not found. The ticker '[TICKER]' does not exist or is not available on this platform." with a "Browse Markets" button.

### 12.1 Header Section

**Layout:** Full-width row at the top of the page content area

**Left side:**
- Company logo (48px round image, fallback same as table)
- Company name: `--font-display`, `--text-3xl`, `--weight-bold`, `--color-text-primary`
- Ticker · Exchange: `--font-mono`, `--text-base`, `--color-text-secondary` (e.g. "AAPL · NASDAQ")

**Centre/main:**
- Current Price: `--font-mono`, `--text-5xl`, `--weight-bold`, `--color-text-primary`
  - Updates every 5 seconds during market hours
  - Full colour flash animation on change
- Day Change: `+$2.34 (+1.25%)` — colour coded, mono font, `--text-2xl`
- Market Status badge
- If market is closed: show last close price with label "Last Close:"
- If pre-market data available: show pre-market price with label "Pre-Market:" and pre-market change

**Right side:**
- "★ Add to Watchlist" button (secondary style)
  - Icon: `Star` (outline) when not watchlisted, `Star` (filled gold) when watchlisted
  - Text changes: "★ Add to Watchlist" / "★ In Watchlist"
  - When clicking "In Watchlist": opens small popover showing which watchlist(s) it's in and an option to remove
- "🔔 Set Alert" button (secondary style) — opens Price Alert modal (Section 15.4)

### 12.2 Sticky Action Bar

**When:** Appears after scrolling past the header section (when header goes above the viewport)  
**Position:** Sticky at the top of the viewport, below the top nav  
**Height:** `56px`  
**Background:** `var(--color-bg-primary)` with border-bottom  
**Z-index:** `300`

**Contents:**
- Ticker + Company name (compact)
- Current price + day change
- "Buy" button (primary, green)
- "Sell" button (danger, red) — disabled and grey if user has no position
- Your Position: if user holds shares: "You own [N] shares · Avg $[X] · [+/-]$[Y] ([+/-]Z%)"

### 12.3 Price Chart

**Width:** Full width of the main content area  
**Height:** `420px` on desktop, `260px` on mobile  
**Library:** TradingView Lightweight Charts  
**Background:** `var(--color-bg-primary)`

**Controls bar above chart:**

Left side:
- Time Range buttons (toggle group): `1D` | `5D` | `1W` | `1M` | `3M` | `6M` | `1Y` | `5Y` | `ALL`
- Default: `1D`

Right side:
- Chart Type toggle: "Line" | "Candle" | "OHLC"
- Indicator dropdown button: "Indicators +" — opens a panel with:
  - **Overlays** (drawn on the price chart):
    - [ ] MA 20 — Moving Average 20 days — dashed blue line
    - [ ] MA 50 — Moving Average 50 days — dashed orange line
    - [ ] MA 200 — Moving Average 200 days — dashed red line
    - [ ] Bollinger Bands — 3 lines: upper, middle (MA20), lower — light blue
    - [ ] VWAP — Volume Weighted Average Price — purple dashed line (1D only)
  - **Sub-Charts** (drawn below the price chart):
    - [ ] Volume — bars below the chart, green/red matching price direction
    - [ ] RSI (14) — Relative Strength Index — separate sub-chart panel with 30/70 reference lines
    - [ ] MACD — Moving Average Convergence/Divergence — separate sub-chart with signal line and histogram
  - Each has a checkbox; toggling updates the chart immediately
  - Sub-charts add `120px` height to the chart for each one enabled
- "Compare +" button — opens a search modal to select another ticker to overlay on the chart
  - Overlaid stock shown as a second line, grey dashed, normalised to same start value
  - Can compare up to 3 stocks simultaneously
  - Each added stock shown in the legend with a "×" remove button

**Drawing Tools toolbar (left side of chart, vertical):**
- `MousePointer` — default cursor (select/hover mode)
- `TrendingUp` — trend line tool: click to start, click again to end; drag handles to adjust
- `Minus` — horizontal line tool: click to place at a price level; drag to adjust
- `Square` — rectangle tool: click-drag to draw a box
- `GitBranch` — Fibonacci retracement tool: click start, click end; draws standard Fibonacci levels (23.6%, 38.2%, 50%, 61.8%, 100%)
- `Type` — text annotation: click on chart, type text label
- `Trash2` — erase: click on any drawn object to delete it
- "Clear All" button (below the tools) — removes all drawn objects (with confirmation)

Drawing objects are saved to the database per user per stock and restored on next visit.

**Chart Hover/Crosshair Behaviour:**
- Vertical crosshair line appears at hovered position
- Horizontal price line appears at hovered price
- Tooltip (floating, near cursor): 
  - For line chart: Date/time, Price
  - For candlestick: Date/time, Open, High, Low, Close, Volume
  - Formatted to the right precision (e.g. `$189.22` not `$189.2243`)

**1D Chart specifics:**
- X-axis: time labels at 30-minute intervals
- Only shows trading hours (9:30 AM – 4:00 PM ET); no gaps for non-trading time
- Pre-market and after-hours sections shown in a visually distinct (lighter) area if data is available

**"Chart" empty state:**
- If historical data is not available for the selected range: "Historical data not available for this range" message centred in the chart area

### 12.4 Key Statistics Panel

**Layout:** Two-column grid below the chart, full width  
**Background:** `var(--color-bg-secondary)`, `border-radius: var(--radius-md)`, `padding: var(--space-6)`

Each stat:
- Label: `--text-xs`, `--weight-semibold`, `--color-text-secondary`, uppercase, `letter-spacing: 0.05em`
- Value: `--text-sm`, `--weight-medium`, `--font-mono` (for numbers), `--color-text-primary`
- Tooltip (? icon): explains what the stat means in plain language

| Label | Value format | Tooltip |
|-------|-------------|---------|
| Previous Close | $XXX.XX | The last price at which this stock traded at the previous market close. |
| Open | $XXX.XX | The price at which the stock opened at today's market open (9:30 AM ET). |
| Day's Range | $XX.XX – $XX.XX | The lowest and highest prices at which the stock has traded today. |
| 52-Week Range | $XX.XX – $XX.XX | The lowest and highest prices at which the stock has traded in the past 52 weeks. |
| Volume | XX,XXX,XXX | The number of shares traded today. Higher volume often indicates more market interest. |
| Avg Volume (30D) | XX,XXX,XXX | The average daily volume over the last 30 trading days. Useful for context. |
| Market Cap | $X.XB | Total market value of all outstanding shares. (Price × Shares Outstanding) |
| P/E Ratio (TTM) | XX.X | Price-to-Earnings ratio over the trailing twelve months. Compares stock price to earnings per share. |
| EPS (TTM) | $X.XX | Earnings Per Share over the trailing twelve months. Company's profit divided by shares outstanding. |
| Dividend & Yield | $X.XX (X.X%) | Annual dividend per share and yield as a percentage of current price. |
| Ex-Dividend Date | Mon DD, YYYY | The date by which you must own shares to receive the next dividend. |
| Beta (5Y Monthly) | X.XX | A measure of the stock's volatility relative to the market. Beta > 1 means more volatile. |
| Shares Outstanding | X.XXB | Total number of shares issued by the company. |
| Float | X.XXB | Shares available for public trading (excludes insider and restricted shares). |

**52-Week Range visual:**
- Below the text value, show a horizontal bar:
  - Track: full width, `height: 4px`, `background: var(--color-bg-tertiary)`, `border-radius: var(--radius-full)`
  - Filled portion: from left (52W Low) proportionally to current price position
  - Indicator dot: at current price position
  - Labels: "$XX.XX Low" and "$XX.XX High" at ends

### 12.5 Your Position Panel (Conditional)

**Shown only if:** User currently holds shares of this stock  
**Position:** Right column on desktop, between header and chart on mobile  
**Card style:** Standard card with green border-left `4px solid var(--color-positive)`

**Contents:**
- Heading: "Your Position" in `--text-base`, `--weight-semibold`
- Shares Owned: "[N] shares"
- Average Cost: "$XX.XX per share"
- Current Value: "$X,XXX.XX"
- Unrealized Gain/Loss: "+$XXX.XX (+X.XX%)" — colour coded
- Today's Gain/Loss: "+$XX.XX (+X.XX%)" — colour coded
- "Add More Shares" button (primary, small)
- "Sell Position" button (danger, small)
  - "Sell All" quick option

### 12.6 About the Company

**Heading:** "About [Company Name]" in `--text-xl`, `--weight-semibold`

**Content:**
- Description paragraphs (max 3) — sourced from API fundamentals
- "Read more" / "Show less" toggle if more than 3 paragraphs
- Key facts grid (2-column):
  - Sector: [value]
  - Industry: [value]
  - Sub-Industry: [value]
  - CEO: [name]
  - Founded: [year]
  - Headquarters: [city, state, country]
  - Employees: [formatted number]
  - Website: [link with `ExternalLink` icon]

### 12.7 Financials Tab

**Sub-tab navigation:** Income Statement | Balance Sheet | Cash Flow  
**Sub-tab secondary toggle:** Annual | Quarterly  
**Default:** Income Statement, Annual

**Table:**
- Rows: key financial metrics (e.g. Revenue, Gross Profit, Operating Income, Net Income, EPS)
- Columns: last 4 annual or 4 quarterly periods (most recent on left)
- Values: formatted in millions (e.g. $43,500M) or billions
- Positive values: default text colour
- Negative values: `--color-negative`
- Key highlight rows (Revenue, Net Income, EPS): `background: var(--color-brand-tertiary)`

**Note below table:** "All financial data is sourced from [API Provider]. Figures are in USD millions unless stated otherwise."

### 12.8 Analyst Ratings

**Layout:** Card below the financials

**Consensus Rating:**
- Large badge: "Strong Buy", "Buy", "Hold", "Sell", or "Strong Sell"
- Colour: Strong Buy / Buy = green, Hold = yellow/amber, Sell / Strong Sell = red

**Distribution Bar:**
- 5 segments: Strong Buy | Buy | Hold | Sell | Strong Sell
- Proportional width based on number of analysts rating each
- Each segment labelled with count

**Price Target:**
- "Average Target: $XXX.XX" — bold
- "Upside from current: +XX.X%" or "Downside: -XX.X%" — colour coded
- "High: $XXX.XX  Low: $XXX.XX" — range
- "Based on [N] analyst ratings"

### 12.9 Related News

**Heading:** "News for [TICKER]" in `--text-xl`, `--weight-semibold`  
**Shows:** 10 most recent articles related to this company  
**Same format as dashboard news feed**  
**"View all news for [TICKER] →" link** at the bottom

### 12.10 Similar Stocks

**Heading:** "Similar Stocks" in `--text-xl`, `--weight-semibold`  
**Description:** "In the same sector: [Sector Name]"  
**Shows:** 5 stocks from the same sector, similar market cap range  
**Each card:**
- Logo + Ticker + Name
- Current price
- Day % change (coloured)
- Sparkline (7 days)
- Clicking navigates to that stock's detail page

---

## 13. Trade Execution Panel

**Trigger:** Clicking "Buy" or "Sell" on any stock (from Stock Detail page, Markets table, Dashboard quick trade, Holdings table)  
**Layout on desktop:** Right-side drawer panel, `400px` wide, slides in from the right edge  
**Layout on mobile:** Bottom sheet, slides up from the bottom, `height: 85vh`, with rounded top corners  
**Z-index:** `800`  
**Background:** `var(--color-bg-primary)`  
**Border-left (desktop):** `1px solid var(--color-border-primary)`, `box-shadow: var(--shadow-xl)` on left side  
**Animation:** slide in `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` from right (desktop) or bottom (mobile)

### 13.1 Panel Header

- "X" close button: top-right, `40px` ghost button, closes the panel without any action
- Company logo (32px) + Ticker (mono, bold) + Company name
- Current live price (mono, `--text-2xl`, bold, updates every 5 seconds)
- Day change (% and $, colour coded)
- Market status badge (if market is closed, shows "Orders submitted now will execute at next market open")

### 13.2 Buy / Sell Toggle

- Toggle group (Section 5.7), large size, full width
- "Buy" left, "Sell" right
- "Buy" active: green background, white text
- "Sell" active: red background, white text
- Switching resets quantity field and updates all calculated values
- If Sell is selected and user has no position: show inline message "You don't own any shares of [TICKER]. You cannot sell what you don't own." — Sell option remains technically selectable but "Preview Order" button shows this error

### 13.3 Order Type Selector

- **Label:** "Order Type"
- **Component:** 4 tabs displayed as a scrollable toggle button group
- **Options:** Market | Limit | Stop-Loss | Stop-Limit

**Market Order (selected):**
- Description text (below the tabs): "Executes immediately at the best available market price."
- No additional price input fields

**Limit Order:**
- Description: "Your order only executes if the price reaches your specified limit price or better."
- Additional field appears: "Limit Price" — number input, `type="number"`, `step="0.01"`, `min="0.01"`
- Helper text below: "Current price: $[X]. Set your limit [below current for Buy / above current for Sell] to target a lower/higher price."

**Stop-Loss Order:**
- Description: "Triggers a market sell when the price drops to your stop price. Used to limit losses."
- Available for Sell only. If Buy is selected and Stop-Loss is chosen: show inline note "Stop-loss orders are typically used to sell and protect existing positions."
- Additional field: "Stop Price" — number input
- Helper: "If the price drops to $[Stop], your shares will be sold at market price."

**Stop-Limit Order:**
- Description: "Triggers a limit sell when the price reaches the stop price. More control than stop-loss, but not guaranteed to fill."
- Additional fields: "Stop Price" (trigger) + "Limit Price" (execution minimum)
- Helper: "When price hits $[Stop], a limit order to sell at $[Limit] is placed."

Each order type tab has a small `Info` (?) icon. Clicking it opens a tooltip with a more detailed explanation (100-word explanation plus a simple example).

### 13.4 Quantity & Amount Section

**Label:** "Quantity"  
**Sub-toggle:** "Shares" | "Dollar Amount" — switches input mode

**Shares mode:**
- Number input: `type="number"`, `step="1"`, `min="1"`, `max` = floor(cash / price) for Buy, or shares owned for Sell
- Placeholder: "0"
- "Max" button (right of input): sets to maximum affordable (Buy) or maximum owned (Sell)
- Validation: must be a positive integer; cannot be 0

**Dollar Amount mode:**
- Number input: `type="number"`, `step="0.01"`, `min="0.01"`
- Placeholder: "$0.00"
- Automatically calculates and shows the equivalent number of shares below: "≈ [N] shares at $[price]"
- Note: if the dollar amount doesn't divide evenly into whole shares, rounds down (shows "≈ 14 shares — $0.32 unused")

**Estimated Cost / Proceeds row:**
- Label: "Estimated Cost" (Buy) or "Estimated Proceeds" (Sell)
- Value: quantity × current price, formatted as currency, updates live as quantity or price changes
- Small note: "At market price — actual price may vary slightly for large orders."

**Available Cash row (Buy only):**
- "Available Cash: $[balance]"
- If estimated cost > available cash: this row turns red, shows "Insufficient virtual cash for this order."

**Shares Owned row (Sell only):**
- "You own: [N] shares of [TICKER]"
- "Avg cost: $[X] | Current value: $[Y] | Unrealized P&L: [+/-$Z]"

### 13.5 Order Duration (Limit, Stop-Loss, Stop-Limit only)

**Label:** "Order Duration"  
**Radio buttons:**
- "Good For Day (GFD)" — order expires if not filled by 4:00 PM ET today (or next trading day's close if market is currently closed)
- "Good Till Cancelled (GTC)" — order stays active until filled or manually cancelled; maximum 90 calendar days

Default: GFD

**Note below:** "Market orders do not have a duration — they execute immediately."

### 13.6 Order Summary Section

**Heading:** "Order Summary" in `--text-sm`, `--weight-semibold`, `--color-text-secondary`  
**Separator:** thin line above

4 rows:

| Row | Left label | Right value |
|-----|-----------|-------------|
| Order Type | [type name] | — |
| Side | Buy or Sell | — |
| Quantity | [N] shares | — |
| Estimated Total | Estimated Cost or Proceeds | $[calculated amount] |

**After trade (Buy), one more row:**
- "Cash After Trade: $[balance - cost]"
- If this would be negative: row turns red

### 13.7 Preview Order Button

- Full width, large
- Colour: primary green (Buy) or danger red (Sell)
- Text: "Preview Order"
- Disabled states:
  - No quantity entered (0 or empty)
  - Required price fields empty (Limit, Stop-Loss, Stop-Limit)
  - Insufficient cash (Buy)
  - Selling more shares than owned
- Clicking: validates all fields
  - On validation failure: shows inline error messages next to each invalid field; does NOT open confirmation modal
  - On validation success: opens Order Confirmation modal

### 13.8 Order Confirmation Modal

**Width:** `440px` (desktop), `92vw` (mobile)  
**Heading:** "Confirm Your Order"

**Modal contents:**

Large summary box (styled card inside the modal):
- Order type
- Side (large green "BUY" or red "SELL" badge)
- [N] shares of [TICKER] — [Company Name]
- At: Market price / Limit $X / Stop $X

Summary table:
- Estimated Price: $[current price]
- Shares: [N]
- Estimated Total: $[calculated]
- Available Cash After: $[balance - cost] (Buy only)

**Important disclaimer:** "This is a simulated trade. No real money is involved."

**Two buttons:**
- "Confirm Order" (primary / danger based on buy/sell): submits the order
  - Loading state: spinner + "Placing order..."
  - On success: modal closes, trade executes, toast notification shown, panel closes
  - On failure: modal closes, panel stays open, error toast shown with reason
- "Edit Order" (secondary): closes the modal, returns user to the trade panel with all fields intact

**Note:** Clicking outside the confirmation modal does NOT close it (prevents accidental dismissal)

### 13.9 Post-Trade Feedback

**Success — Market Order:**
Toast: ✓ "Bought 10 shares of AAPL at $189.22" or "Sold 10 shares of AAPL at $189.22"  
Portfolio, cash balance, and positions update immediately

**Success — Limit/Stop Order Submitted:**
Toast: ℹ "Limit order to buy 10 shares of AAPL at $185.00 has been placed. It will fill when AAPL reaches your target price."

**Failure — Insufficient Cash:**
Toast: ✕ "Order failed: Insufficient virtual cash. You need $9,461.00 but have $8,220.33."

**Failure — Server Error:**
Toast: ✕ "Order failed due to a server error. Please try again. If this continues, contact support."

### 13.10 Open Orders Section (within the Trade Panel)

**Shown:** Below the Preview Order button, separated by a divider and heading  
**Heading:** "Your Open Orders for [TICKER]" — only shown if user has pending orders for this stock

Each open order row:
- Order type badge + Side badge
- "[N] shares @ $[price]" for limit/stop
- Duration: "GFD" or "GTC"
- Status: "Pending" or "Partially Filled ([M] of [N] shares)"
- "Cancel" button: red ghost button; clicking opens small confirmation: "Cancel this order?" with "Yes, Cancel" and "Keep Order" buttons
- On cancel: row is removed with animation, success toast "Order cancelled."

---

## 14. Portfolio Page

**Route:** `/portfolio`  
**Page Title:** "Portfolio"

### 14.1 Page Header Summary Bar

Full-width coloured bar at the top of the page content:  
Background: `var(--color-brand-tertiary)`, `border-radius: var(--radius-md)`, `padding: var(--space-6)`

6 stats displayed in a row (wraps to 2 rows on mobile):

| Stat | Tooltip |
|------|---------|
| Total Portfolio Value | Total of all open positions + available cash |
| Cash Available | Virtual cash available for new trades |
| Total Invested | Sum of current market value of all open positions |
| Total Return | Profit or loss vs the $100,000 starting balance ($ and %) |
| Today's P&L | Change in total portfolio value since yesterday's close |
| Best Performer | The position with the highest % gain overall |

### 14.2 Performance Chart

Same chart component as Dashboard (Section 10.3) with the same time range toggles.  
Additional feature: "Compare to S&P 500" toggle.  
The portfolio page chart is larger: `360px` height on desktop.

### 14.3 Allocation Charts Section

**Layout:** Two charts side by side on desktop, stacked on mobile

**Chart 1 — By Stock:**
- Donut chart: each segment = one stock (colour-coded)
- Centre label: "Portfolio Allocation" or "X Positions"
- Legend: each stock with colour swatch, ticker, $ value, and %
- Hovering a segment highlights it and shows tooltip: "[Ticker]: $X,XXX.XX (X.X%)"

**Chart 2 — By Sector:**
- Same donut chart format but grouped by sector
- Colours assigned by sector (consistent across the app)

**Toggle:** "By Stock" / "By Sector" toggle buttons above the charts to switch between them on mobile (desktop shows both)

### 14.4 Holdings Table

**Tab bar above table:** "Holdings" (default) | "Open Orders" | "Transaction History" | "Realized P&L"

---

**Holdings tab:**

**Empty state:** 
- Icon: `Briefcase` (`48px`, `--color-text-tertiary`)
- "You have no open positions. Browse the Markets to find your first stock to buy."
- "Browse Markets" button (primary)

**When positions exist:**

Table columns:

| Column | Description |
|--------|-------------|
| Stock | Logo + Ticker (mono bold) + Company Name |
| Shares | Number of shares held |
| Avg Cost | Average cost per share (mono) |
| Current Price | Live price (mono, updates every 5 seconds) |
| Market Value | shares × current price (mono) |
| Unrealized P&L | (current price - avg cost) × shares — $ and % (coloured) |
| Day P&L | Today's price change × shares — $ and % (coloured) |
| Weight | % of total portfolio this position represents |
| Actions | "Trade" button + "Info" link |

- Table is sortable by any numeric column (click header)
- Sort indicator: `↑` or `↓` next to sorted column header
- Alternating row background colours

Expandable rows: Clicking a row (not the buttons) expands it to show:
- A small inline sparkline chart (7 days)
- Additional details: Date first purchased, Number of separate purchases, Total dividends received (if applicable)
- "View Stock Detail" link

**Total row (table footer):**
- Fixed to the bottom of the table (sticky within the scroll area)
- Shows: "Total" label, blank, blank, blank, total market value, total unrealized P&L ($ and %), today's total P&L
- Bold text, brand-colour background

---

**Open Orders tab:**

Columns: Date Placed | Stock | Order Type | Side | Shares | Target Price | Duration | Status | Action

Each row:
- Date: formatted "May 10, 2025, 9:32 AM"
- Stock: ticker + name
- Order Type: badge
- Side: BUY or SELL badge
- Shares: number
- Target Price: mono font (N/A for market orders)
- Duration: GFD or GTC
- Status: "Pending" or "Partially Filled (X/Y shares)"
- Action: "Cancel" button

Empty state: "You have no pending orders."

---

**Transaction History tab:**

**Filter controls:**
- Date range picker: "From" and "To" date inputs (default: all time)
- Ticker filter: text input (filter by stock)
- Side filter: "All" | "Buys" | "Sells" — radio buttons
- "Apply" button + "Clear" link

**Table columns:** Date & Time | Stock | Order Type | Side | Shares | Price Per Share | Total Value

- Sorted by date descending (most recent first)
- Paginated: 50 per page

**"Export CSV" button:** Top-right of the tab. Downloads a CSV file named `marketsim_transactions_[YYYY-MM-DD].csv` with all transactions (applying current filters).

Empty state: "No transactions found. Start trading to see your history here."

---

**Realized P&L tab:**

Shows all fully closed positions (positions that were completely sold).

**Summary banner at top:**
- "Total Realized Gains: +$X,XXX.XX" (green) and "Total Realized Losses: -$XXX.XX" (red) and "Net Realized P&L: +/-$X,XXX.XX"

**Table columns:** Stock | Date Opened | Date Closed | Shares | Avg Buy Price | Avg Sell Price | Realized P&L ($) | Realized P&L (%)

Empty state: "No closed positions yet. Close a position to see your realized returns here."

### 14.5 Reset Portfolio

**Location:** Below all the tabs and table, in a visually distinct "Danger Zone" section  
**Heading:** "Danger Zone" in `--text-sm`, `--weight-semibold`, `--color-negative`  
**Border:** dashed border `1px dashed var(--color-negative)`, `border-radius: var(--radius-md)`, `padding: var(--space-6)`

**Content:**
- Description: "Resetting your portfolio will permanently delete all your positions, open orders, and transaction history, and restore your cash balance to $100,000.00. This action cannot be undone."
- "Reset Portfolio" button (danger style)

**On click:**
Opens confirmation modal:
- Heading: "Reset your portfolio?"
- Body: "This will permanently delete all your positions, open orders, and transaction history. Your cash will be restored to $100,000.00. This cannot be undone."
- Warning icon (orange exclamation)
- Text input: "Type RESET to confirm" — placeholder "RESET"
- "Confirm Reset" button: disabled until input value exactly equals "RESET" (case-sensitive)
- "Cancel" button: closes modal, no action

**On confirm:**
- All positions deleted from database
- All open orders cancelled and deleted
- All transaction history deleted
- Achievements and XP are NOT reset
- Leaderboard ranking updates to reflect new $100,000 portfolio
- User is shown a success toast: "Portfolio reset. You have been given $100,000 in fresh virtual cash."
- Page reloads to show empty portfolio state

---

## 15. Simulation Mode

**Route:** `/simulation`  
**Page Title:** "Simulation Mode"

### 15.1 Overview

Simulation Mode is a completely separate trading environment from the main live paper-trading portfolio. Users travel back in time to any historical date and trade using real historical price data. The simulation plays forward in time at the user's selected speed. All data (prices, news, fundamentals) reflects the historical date being simulated — not today's data.

**Key rules:**
- Simulation portfolio is completely separate from the main portfolio
- Only one simulation can be active at a time per user
- Simulation trades do NOT affect the main leaderboard
- Simulation results are saved and viewable in Simulation History
- Maximum 5 saved simulation results per user (oldest deleted when limit reached)

### 15.2 Simulation Setup Screen

**Shown when:** No simulation is currently active (first visit, or after stopping a previous simulation)

**Page layout:** Centred card, `600px` wide

**Heading:** "Start a New Simulation"  
**Subheading:** "Go back in time and trade with real historical prices."

**Form fields:**

Field 1 — Simulation Name
- Label: "Simulation Name"
- Input: text, `placeholder="e.g. COVID Crash Recovery"`
- Validation: required, 1–50 characters
- Pre-filled with: "Simulation [N]" where N is the count of past simulations + 1

Field 2 — Start Date
- Label: "Start Date"
- Component: date picker calendar
- Minimum date: today minus 10 years
- Maximum date: today minus 30 trading days (cannot start a simulation too close to today)
- Validation: required, cannot be a weekend or market holiday
- If a weekend or holiday is selected: show a note "Markets are closed on [date]. Start date adjusted to [next trading day]."
- Pre-filled: 2 years ago from today

Field 3 — Starting Cash
- Label: "Starting Virtual Cash"
- Input: number, `type="number"`, `step="1000"`, `min="1000"`, `max="10000000"`
- Currency prefix: "$" shown to the left of the input
- Default: `100000`
- Helper: "Set the amount of virtual cash you start with. Default is $100,000."

Field 4 — Simulation Speed
- Label: "Playback Speed"
- Component: Dropdown
- Options:
  - 1x — Real time (1 second of real time = 1 second of market time)
  - 5x — 1 min real = 5 min market
  - 10x — 1 min real = 10 min market
  - 50x — 1 min real = 50 min market
  - 100x — 1 min real = ~1.5 hrs market
  - 1000x — 1 min real = 1 trading day market
- Default: 100x
- Helper: "At 1000x, you advance through approximately 1 trading day per minute of real time."

**"Start Simulation" button:** Primary, full width, large  
**Preview text:** "You will start trading on [selected start date] with $[amount]. Good luck!"

### 15.3 Active Simulation Screen

**When:** Simulation is in progress

**Top Simulation Banner:**
Full-width banner pinned below the top nav (instead of the ad leaderboard banner):
- Background: `--color-brand-primary`
- Text (white): "SIMULATION MODE"
- Pulsing orange/amber dot indicator
- Current simulated date and time: "📅 March 15, 2020 — 10:32 AM ET"
- "Pause" button (icon + text)
- "Stop Simulation" button (red, icon + text)
- Speed selector dropdown (can change speed on the fly)

**Page content below the banner:**

This page uses the same layout as the Dashboard, but all data reflects the historical simulated date:
- Portfolio Summary Card shows simulation portfolio (not main portfolio)
- Chart shows simulation portfolio performance
- Market ticker strip shows historical prices from simulated date
- Top Movers shows historical movers
- News Feed shows historical news headlines from the simulated date
- Quick Trade Widget allows trades at historical prices

**Important indicators throughout the page:**
- All price displays have a small "SIM" badge in amber colour to distinguish from real/live data
- The page title area shows: "Simulation: [Simulation Name] | Started: [start date] | Current: [simulated date]"

**Pause behaviour:**
- Clicking "Pause" freezes time advancement
- UI shows all data at the paused date/time
- "Pause" button changes to "Resume" button
- User can still place orders while paused

**Jump to Date:**
- Small "Jump to Date" button in the banner
- Opens a date picker to jump to any date between the start date and today
- Confirmation: "Jump to [date]? You will skip all market data between [current] and [target]. Orders placed during the skipped period will execute at their trigger prices if those prices were hit historically."

### 15.4 Simulation Play/Pause/Stop Controls

**Play (Resume):**
- Button shows `Play` icon + "Resume"
- Simulation time advances at the set speed
- Database snapshot of portfolio taken every real-time minute

**Pause:**
- Button shows `Pause` icon + "Pause"
- Time advancement stops immediately
- All UI data remains at the paused timestamp

**Stop Simulation:**
- Button: `Square` icon + "Stop Simulation" in red
- Clicking shows confirmation modal: "Stop simulation? You will be taken to the results screen. You can save or discard the results."
- "Stop & See Results" button
- "Keep Simulating" button (cancel)

### 15.5 Simulation Order Execution

All order types work in simulation mode exactly as in live mode, but:
- Market orders execute at the historical price at the exact simulated moment the order is placed
- Limit/stop orders trigger when the historical price crosses the trigger level during time advancement
- GFD orders expire at simulated market close (4:00 PM ET on the simulated date)
- GTC orders persist across simulated trading days

### 15.6 Simulation Results Screen

**Shown when:** Simulation is stopped by user, or reaches today's date (simulation ends)

**Layout:** Full-page results screen

**Header:**
- "Simulation Complete: [Simulation Name]"
- Sub: "[Start Date] → [End Date] ([N] trading days simulated)"

**Hero Stats Row:**
- Final Portfolio Value: large number
- Net Return: $amount and %
- vs. S&P 500 over same period: [+/-] [%] (coloured comparison)
- "You [beat / underperformed] the S&P 500 by [X]% over this period."

**Performance Chart:**
- Full portfolio value over the simulation period
- S&P 500 benchmark overlay

**Trade Summary:**
- Total trades: [N]
- Winning trades: [N] ([%])
- Losing trades: [N] ([%])
- Best single trade: "[TICKER] +$X (+X%)"
- Worst single trade: "[TICKER] -$X (-X%)"
- Largest position held: "[TICKER]"
- Average hold time: "[X] trading days"

**Full Transaction History Table:**
Same format as Portfolio > Transaction History tab

**Action Buttons:**
- "Save Results" (primary): saves to Simulation History, shown in list at bottom of `/simulation` page
- "Share Results" (secondary): generates a shareable URL with a read-only version of the results; URL is valid for 30 days
- "Start New Simulation" (secondary): redirects to setup screen
- "Discard Results" (ghost, red text): deletes this simulation run without saving; confirmation required

### 15.7 Simulation History

**Shown when:** Setup screen is visible (no active simulation)  
**Below the setup form:**  
**Heading:** "Past Simulations"

Table columns: Name | Start Date | End Date | Starting Cash | Final Value | Return (%) | vs. S&P 500 | Actions

Actions per row:
- "View Results" — reopens the results screen for that simulation
- "Delete" — removes from history (confirmation required)

Maximum 5 saved simulations. If limit reached: "You've reached your 5 simulation limit. Delete a past simulation to save new ones."

---

## 16. Watchlist Page

**Route:** `/watchlist`  
**Page Title:** "Watchlist"

### 16.1 Page Layout

**Top section:** Watchlist tab bar  
**Main section:** Stock list for the active watchlist  
**Right column (desktop):** Quick alert setup panel (compact)

### 16.2 Watchlist Tab Bar

- Horizontal tab bar showing all user-created watchlists
- Each tab shows the watchlist name and stock count in parentheses: "Tech Picks (8)"
- Active tab: underline style (same as Markets tabs)
- "+ New Watchlist" tab at the end (always visible)
  - Clicking: inline input appears in the tab bar with `placeholder="List name"`, auto-focused
  - Pressing Enter or clicking a checkmark icon: creates the watchlist
  - Pressing Escape: cancels
  - Validation: name required, 1–30 characters, cannot be duplicate
  - Maximum 10 watchlists per user; if limit reached: show toast "You've reached the maximum of 10 watchlists."

**Watchlist tab context menu (right-click or "⋮" button on active tab):**
- "Rename" — inline edit of the tab name
- "Share Watchlist" — generates read-only share link
- "Delete Watchlist" — confirmation modal required

### 16.3 Watchlist Header

Shown above the stock list:
- Watchlist name (editable inline — double-click to edit)
- "[N] stocks"
- "Share" button (`Share2` icon) — generates shareable read-only link
- "Clear All" button — removes all stocks from this watchlist (confirmation required)
- "+ Add Stocks" button (primary)

### 16.4 Add Stocks Modal

Triggered by "+ Add Stocks" button:
- Heading: "Add to [Watchlist Name]"
- Search input with live autocomplete (same as global search)
- Results show same row format as autocomplete (logo, ticker, name, price, %)
- Clicking a result adds the stock to the watchlist (does not close the modal)
- Added stocks show a green checkmark next to them in the results
- Clicking them again removes from the watchlist
- "Done" button closes the modal
- Shows current watchlist stock count: "[N]/50 stocks" (maximum 50 per watchlist)

### 16.5 Stock List

Same format as Markets page stock list but without the Mkt Cap and Volume columns. Additional columns:

| Additional Column | Description |
|------------------|-------------|
| Alert | Bell icon — filled amber if alert set, grey outline if not |
| Remove | "×" ghost button — removes from watchlist instantly |
| Drag Handle | `GripVertical` icon on far left for drag-to-reorder |

**Drag-to-reorder:**
- Native HTML5 drag and drop
- While dragging a row: row shows as semi-transparent at original position, a ghost version follows the cursor
- Drop indicator: blue line between rows showing where the item will be dropped
- On drop: order updates immediately and saves to database

**Remove behaviour:**
- Clicking × removes instantly (no confirmation)
- Toast: "Removed [TICKER] from [Watchlist]" with an "Undo" button
- Undo available for 5 seconds
- After 5 seconds: permanently removed

**Empty watchlist state:**
- "This watchlist is empty."
- "Add stocks you want to track here so you can monitor them all in one place."
- "+ Add Stocks" button

### 16.6 Price Alert Setup

**Trigger:** Clicking the bell icon on any stock row

**Popover (small, 280px wide):**
- Heading: "[TICKER] Price Alert"
- Current price shown

**Existing alerts for this stock:**
- Listed above the add-new section
- Each: "Above $XXX.XX" or "Below $XXX.XX" with a trash icon to delete
- Maximum 5 alerts per stock

**Add new alert:**
- Direction: "Price goes above" | "Price goes below" — dropdown or radio
- Price: number input (mono font), pre-filled with current price
- "Add Alert" button (primary, small)
- Validation: price must be a positive number; "above" alert must be above current price (warning if below); "below" alert must be below current price (warning if above)

---

## 17. Leaderboard Page

**Route:** `/leaderboard`  
**Page Title:** "Leaderboard"

### 17.1 Page Header

- Heading: "Leaderboard"
- Sub: "Rankings based on total portfolio return % from $100,000 starting cash."
- Note: "Leaderboard updates every 15 minutes during market hours, and at market close."

### 17.2 Leaderboard Tabs

4 tabs:
- **Global** — all users, all time cumulative return %; no reset (default)
- **Weekly** — resets every Monday at 00:00:00 UTC; shows return % for the current week only
- **Friends** — same ranking metric but restricted to the user's friends list; includes the user themselves always
- **All-Time** — same as Global (all-time return %), but never resets and is a permanent hall of fame

### 17.3 Your Rank Card

Always pinned at the top of the table, above the column headers:  
Background: `var(--color-brand-tertiary)`, `border: 2px solid var(--color-brand-secondary)`, `border-radius: var(--radius-md)`, `padding: var(--space-4)`

Contents:
- "Your Rank" label
- Rank number (large, bold, mono)
- Avatar + Username + "You" badge
- Portfolio Value (mono)
- Return % (coloured)
- Rank change since last refresh: "↑ 3 from last week" or "↓ 1" or "—" (no change)

If user is not yet ranked (brand new account, never made a trade): show "Complete your first trade to appear on the leaderboard!"

### 17.4 Leaderboard Table

**Columns:**

| Column | Description |
|--------|-------------|
| Rank | Number with medal icon for top 3 (🥇 🥈 🥉) |
| Player | Avatar (24px) + Username |
| Portfolio Value | Current total value (mono) |
| Return % | All-time or weekly % return (coloured, mono, bold) |
| Return $ | Dollar amount of return (mono) |
| Week Change | How their rank has changed since last week's data (↑N or ↓N or —) |
| Actions | "View Profile" link |

- 50 rows per page
- Pagination at the bottom
- Clicking a row (or "View Profile") navigates to `/profile/[username]`

**Top 3 rows special styling:**
- Rank 1: gold left border `4px solid #F59E0B`, slightly more prominent row
- Rank 2: silver left border `4px solid #94A3B8`
- Rank 3: bronze left border `4px solid #B45309`

### 17.5 Friends Tab

**If user has no friends:**
- "You haven't added any friends yet."
- "Your leaderboard will show only you until you add friends."
- "Find Friends" button — opens search modal

**Add Friend Flow:**
- "Add Friend" button: top-right of the Friends tab
- Opens modal: "Find a User"
- Search input: search by exact username
- Results show: avatar + username + portfolio value + return % + "Send Friend Request" button
- On send: button changes to "Request Sent", greyed out
- Toast: "Friend request sent to @[username]!"

**Incoming Friend Requests:**
- Badge on "Friends" tab if pending requests
- At top of Friends tab (if requests exist): "Pending Requests" section
  - Each request row: avatar + username + "Accept" button (green) + "Decline" button (red)
  - Accepting: adds to friends list, updates leaderboard view, toast "You and @[username] are now friends!"
  - Declining: removes the request, no notification to sender

### 17.6 Leaderboard Data Policies

- Users with private profiles (Settings > Privacy > Profile Visibility: Private): not shown on global leaderboard; only shown to friends on friends leaderboard
- Users who opt out of leaderboard (Settings > Privacy > Show on Leaderboard: No): removed from all public leaderboards; their own view still shows their rank
- Banned/suspended accounts: not shown on leaderboard

---

## 18. Achievements & XP System

**Route:** `/achievements`  
**Page Title:** "Achievements"

### 18.1 XP Level System

- Total levels: 100
- XP required per level follows a formula: `XP for level N = 100 × N^1.5` (rounded to nearest 50)
- Example: Level 1→2 = 100 XP, Level 2→3 = 283 XP, Level 10→11 = 3,162 XP
- Maximum level: 100 (no more XP accumulation after level 100, but still earns badges)
- Level title names:

| Levels | Title |
|--------|-------|
| 1–5 | Rookie |
| 6–15 | Analyst |
| 16–25 | Trader |
| 26–40 | Senior Trader |
| 41–60 | Portfolio Manager |
| 61–80 | Fund Manager |
| 81–99 | Market Veteran |
| 100 | Market Legend |

### 18.2 Page Layout

**XP Progress Bar (top of page):**
- Avatar (large, 64px) on the left
- Username + Level Title
- Current XP and next level XP: "4,320 / 7,500 XP"
- Progress bar: brand green, full width, shows percentage filled to next level
- Level number prominently shown to the right of the bar
- "Level 23 — Senior Trader"

**Tab bar below:** "All Achievements" | "In Progress" | "Earned" | "Daily Challenges"

### 18.3 Badge Grid

**Default view:** All Achievements tab

**Layout:** CSS grid, 4 columns on desktop, 2 on mobile, auto rows

**Each Badge Card:**
- **Unlocked:** Full-colour badge image, name below (bold), unlock date below that (grey)
- **Locked:** Greyscale badge image with a lock icon overlay (semi-transparent), name below (grey), "Locked" label
- **In Progress:** Full-colour badge image with a progress bar at the bottom of the card showing X/Y; name below

**Clicking any badge card:** Opens Badge Detail Modal

### 18.4 Badge Detail Modal

- Badge image (96px, full colour or grey if locked)
- Badge name: `--text-xl`, `--weight-bold`
- Category badge (e.g. "Trading Milestones")
- Description: 1–2 sentences about what the badge represents
- "How to Unlock:" — specific requirement text
  - Example: "Place 100 total trades on MarketSim Pro."
  - Example: "Achieve a portfolio return of +50% from your starting $100,000."
- Progress bar (if in progress): "[X] / [Y] — [Z%] complete" with the bar
- XP Reward: "+[N] XP" with XP icon
- Date Unlocked: "Unlocked on March 15, 2025" (if earned)
- "Close" (X) button

### 18.5 Complete Badge List

**Category: Trading Milestones**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| First Trade | Place your first trade of any kind | 50 XP |
| Getting Started | Place 10 trades total | 75 XP |
| Active Trader | Place 50 trades total | 150 XP |
| Centurion | Place 100 trades total | 300 XP |
| Trading Machine | Place 500 trades total | 750 XP |
| Market Veteran | Place 1000 trades total | 1500 XP |
| Day Trader | Place 5 trades in a single trading day | 100 XP |
| Order Variety | Use all 4 order types at least once | 125 XP |
| Limit Master | Have 10 limit orders fill successfully | 200 XP |

**Category: Portfolio Performance**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| First Profit | Close a position with any profit | 50 XP |
| In the Green | Have total portfolio return of +1% | 75 XP |
| Growing Strong | Total return of +5% | 150 XP |
| Double Digits | Total return of +10% | 300 XP |
| Quarter Century | Total return of +25% | 500 XP |
| Half Century | Total return of +50% | 750 XP |
| Doubled Up | Total return of +100% (double starting cash) | 1500 XP |
| Triple Threat | Total return of +200% | 3000 XP |
| Beating the Market | Outperform S&P 500 total return by 5%+ | 500 XP |

**Category: Diversification**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| First Sector | Own stocks in at least 1 sector | 25 XP |
| Diversifier | Own stocks in at least 3 sectors simultaneously | 100 XP |
| Well Rounded | Own stocks in at least 6 sectors simultaneously | 200 XP |
| Fully Diversified | Own stocks in all 11 sectors simultaneously | 400 XP |
| Blue Chip Buyer | Buy a stock with market cap over $100B | 75 XP |
| Small Cap Explorer | Buy a stock with market cap under $500M | 75 XP |
| ETF Investor | Buy any ETF | 50 XP |

**Category: Streaks & Consistency**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| Back Again | Log in 2 days in a row | 25 XP |
| Three in a Row | 3-day login streak | 50 XP |
| Week Strong | 7-day login streak | 150 XP |
| Two Week Hustle | 14-day login streak | 250 XP |
| Monthly Dedication | 30-day login streak | 500 XP |
| Three Month Pro | 90-day login streak | 1500 XP |
| Challenge Accepted | Complete 1 daily challenge | 25 XP |
| Challenge Streak | Complete 7 daily challenges in a row | 200 XP |
| Challenge Master | Complete 30 daily challenges (not necessarily consecutive) | 600 XP |

**Category: Research & Learning**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| Researcher | View 10 unique stock detail pages | 50 XP |
| Due Diligence | View 50 unique stock detail pages | 150 XP |
| Market Scholar | View 100 unique stock detail pages | 300 XP |
| News Reader | Read (click) 25 news articles | 100 XP |
| Tutorial Complete | Finish the onboarding tutorial (not skip) | 75 XP |

**Category: Watchlist & Alerts**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| Watching | Add your first stock to a watchlist | 25 XP |
| Watchlist Builder | Add 10 different stocks to any watchlist | 75 XP |
| Watchlist Pro | Add 25 different stocks to any watchlist | 150 XP |
| Alert Setter | Set your first price alert | 25 XP |
| Alert Master | Have 5 price alerts trigger and notify you | 100 XP |

**Category: Social & Community**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| Not Alone | Add your first friend | 50 XP |
| Social Trader | Have 5 friends on the platform | 100 XP |
| Top 1000 | Reach the top 1000 on the global leaderboard | 200 XP |
| Top 100 | Reach the top 100 on the global leaderboard | 500 XP |
| Top 10 | Reach the top 10 on the global leaderboard | 1500 XP |
| Leaderboard King | Reach #1 on the global leaderboard | 3000 XP |
| Share the Win | Share a simulation result | 50 XP |

**Category: Simulation**

| Badge Name | Requirement | XP Reward |
|------------|-------------|-----------|
| Time Traveler | Complete your first simulation | 100 XP |
| History Buff | Complete 5 simulations | 200 XP |
| Simulation Master | Complete 20 simulations | 500 XP |
| Beat the Crash | Run a simulation starting on a major market crash date (Mar 2020, Oct 2008, etc.) and achieve a positive return | 500 XP |
| Better Than Buffett | Outperform the S&P 500 in a simulation by more than 20% over 1+ year | 750 XP |

### 18.6 Daily Challenges

**Tab:** "Daily Challenges" on the Achievements page  
**Also shown:** Widget on Dashboard (Section 10 — add a Daily Challenges widget below Upcoming Earnings)

**Reset:** New challenges generated daily at 00:00:00 UTC  
**Challenges per day:** 3 challenges, one from each difficulty tier

**Challenge Tiers:**

| Tier | XP Reward | Example Challenges |
|------|-----------|-------------------|
| Easy | 25 XP | "Log in today", "View 3 stock detail pages", "Add a stock to your watchlist" |
| Medium | 75 XP | "Place 2 trades today", "Set a price alert", "Read 5 news articles" |
| Hard | 200 XP | "Have your portfolio value increase today", "Place a limit order that fills today", "Trade in 3 different sectors today" |

**Challenge display:**
- Each challenge shown as a card
- Heading: challenge description
- Progress bar: e.g. "2/3 stocks viewed"
- XP reward badge
- Status: "In Progress" (orange) or "Completed ✓" (green)
- When completed: card background changes to light green, checkmark overlay animation plays, XP is awarded instantly
- Completed challenges cannot be "un-completed"

**Bonus:** Completing all 3 challenges in one day awards a "Daily Triple" bonus of 100 XP

---

## 19. News Page

**Route:** `/news`  
**Page Title:** "Market News"

### 19.1 Layout

- Left column (main): news feed (full width on mobile, `calc(100% - 320px)` on desktop)
- Right column (sidebar): sector filter quick-access + trending tickers widget

### 19.2 Featured Article

Top of the main column. A large hero card:
- Full-width, `border-radius: var(--radius-md)`
- Source logo + source name + timestamp
- Headline: `--text-3xl`, `--weight-bold`
- Summary: 2–3 sentence excerpt
- "Read Full Article →" link (opens in new tab)
- Related ticker tags

### 19.3 Market Summary Card

Below the featured article. A card with:
- "Today's Market Summary" heading
- Written summary (2–3 paragraphs) covering: how major indices moved, key drivers, notable movers, sector performance
- Sourced from: either a curated editorial feed or the top-ranked financial news article of the day tagged as "market summary"
- If no summary available: this card is not shown

### 19.4 News Filter Bar

Below the featured article / market summary:
- Keyword search: `placeholder="Search news..."`
- Date range: dropdown — "Today" | "This Week" | "This Month" | "Custom Range"
  - Custom Range: shows two date pickers (From / To)
- Sector filter: pill group (same sectors as Markets page)
- "My Watchlist Only" toggle: when on, only shows articles related to stocks in the user's watchlists
- Article count: "Showing 45 articles"

### 19.5 News Feed

**Each article card:**
- Source logo (20px) + Source name + "·" + Publish time (relative: "3 hours ago", absolute on hover: "May 10, 2025, 9:42 AM ET")
- Headline: `--text-base`, `--weight-semibold`, max 2 lines, ellipsis
- Summary excerpt: `--text-sm`, `--color-text-secondary`, max 3 lines, ellipsis
- Related ticker tags: clickable pills (navigate to stock detail)
- Thumbnail image (if available): 80px × 80px, right-aligned, `border-radius: var(--radius-sm)`
- Separator line between articles
- Entire row clickable → opens article in new tab

**Ad insertion:** Native ad card after every 10 articles, styled identically to news cards but with "Sponsored" badge

**Pagination:** "Load 20 More" button at the bottom

**Empty state (no results for filter):** "No news articles found for your current filters. [Clear Filters]"

### 19.6 Trending Tickers Widget (Sidebar)

- "Trending Now" heading
- List of 10 tickers with the most news coverage today
- Each: ticker (bold) + company name + number of articles today + % change (coloured)
- Clicking navigates to stock detail page for that ticker

---

## 20. Notifications System

**Route:** `/notifications` (full page)  
**Dropdown:** accessible from top nav bell icon

### 20.1 Notification Bell Dropdown

**Trigger:** Click on bell icon in top nav  
**Panel dimensions:** `380px` wide, `480px` max height, scroll if more content  
**Position:** Right-aligned to the bell icon, below the nav  
**Z-index:** `700`

**Panel header:**
- "Notifications" heading
- "Mark all as read" link (right-aligned) — marks all as read instantly; if nothing unread, link is greyed out
- "X" close button

**Notification list:**
- Max 20 shown in the dropdown
- Each notification: icon + message + timestamp (relative)
- Unread notifications: `background: var(--color-brand-tertiary)` (light green tint)
- Read notifications: `background: var(--color-bg-primary)`
- Clicking a notification: marks it as read and navigates to the relevant page:
  - Price alert → stock detail page for that ticker
  - Trade executed → portfolio page
  - Achievement → achievements page
  - Friend request → leaderboard > friends tab
  - Leaderboard change → leaderboard page

**Panel footer:**
- "View all notifications →" link → `/notifications`

### 20.2 Notification Types — Full Specification

| Type ID | Icon | Title | Message Format | On Click |
|---------|------|-------|----------------|----------|
| `price_alert_above` | Bell (amber) | "Price Alert" | "[TICKER] has reached your target of $[X]. Current price: $[Y]." | `/stocks/[TICKER]` |
| `price_alert_below` | Bell (amber) | "Price Alert" | "[TICKER] has fallen to your target of $[X]. Current price: $[Y]." | `/stocks/[TICKER]` |
| `order_market_filled` | CheckCircle (green) | "Order Executed" | "Bought [N] shares of [TICKER] at $[X]." / "Sold [N] shares of [TICKER] at $[X]." | `/portfolio` |
| `order_limit_filled` | CheckCircle (green) | "Limit Order Filled" | "Your limit order to [buy/sell] [N] shares of [TICKER] at $[X] has been filled." | `/portfolio` |
| `order_stop_filled` | CheckCircle (green) | "Stop Order Triggered" | "Your stop order for [TICKER] triggered and sold [N] shares at $[X]." | `/portfolio` |
| `order_expired` | AlertCircle (amber) | "Order Expired" | "Your [GFD/GTC] [limit/stop] order for [N] shares of [TICKER] expired without filling." | `/portfolio#open-orders` |
| `order_partially_filled` | Info (blue) | "Partial Fill" | "Your order for [N] shares of [TICKER] partially filled. [M] of [N] shares executed at $[X]." | `/portfolio#open-orders` |
| `achievement_unlocked` | Award (brand) | "Achievement Unlocked!" | "You earned the **[Badge Name]** badge! +[N] XP" | `/achievements` |
| `level_up` | TrendingUp (brand) | "Level Up!" | "You've reached Level [N] — [Title]! Keep trading to reach Level [N+1]." | `/achievements` |
| `daily_challenge_complete` | Check (green) | "Challenge Complete" | "You completed today's [Easy/Medium/Hard] challenge! +[N] XP" | `/achievements#daily` |
| `friend_request_received` | Users (blue) | "Friend Request" | "@[username] sent you a friend request." | `/leaderboard?tab=friends` |
| `friend_request_accepted` | Users (green) | "New Friend!" | "@[username] accepted your friend request. You can now see each other on the Friends Leaderboard." | `/leaderboard?tab=friends` |
| `leaderboard_rank_up` | Trophy (amber) | "Moving Up!" | "You moved up to rank #[N] on the leaderboard!" (only sent for rank improvements of 10+ places) | `/leaderboard` |
| `daily_summary` | BarChart2 (grey) | "Daily Summary" | "Your portfolio [gained/lost] [+/-$X] ([+/-%]) today. Total value: $[Y]." (sent at market close 4:05 PM ET, if user has opted in) | `/portfolio` |
| `earnings_reminder` | Calendar (grey) | "Earnings Tomorrow" | "[TICKER] reports earnings [before open/after close] tomorrow. Current price: $[X]." (sent 24h before report, only for stocks in user's watchlists) | `/stocks/[TICKER]` |

### 20.3 Full Notifications Page

**Route:** `/notifications`  
**Layout:** Full-width list, no sidebar

**Header:**
- "Notifications" heading
- "Mark all as read" button (secondary)
- "Delete all" button (ghost, red text) — confirmation required

**Filter tabs:** All | Price Alerts | Trades | Achievements | Social | Other

**Notification list:**
- Same format as dropdown but full-width
- Paginated: 50 per page
- Each notification has a "×" delete button on hover (right side) — deletes individually
- Unread badge count next to each tab

**Empty state:** "All caught up! No notifications to show." with a bell illustration

---

## 21. Settings Page

**Route:** `/settings`  
**Page Title:** "Settings"  
**Layout:** Two-column layout — left sidebar navigation (settings categories) + right main content area

### 21.1 Settings Navigation (Left Sidebar)

Tab list, vertical:
- Profile
- Notifications
- Display
- Simulation
- Privacy
- Help & Support

Clicking each tab updates the right content area (no full page reload — section appears via anchor/tab switching).

Active tab: left border brand colour (same as main sidebar nav).

### 21.2 Profile Settings

**Heading:** "Profile"

**Section: Profile Photo**
- Current avatar shown (64px circle)
- "Change Photo" button (secondary, small)
  - Opens file picker: accepts JPEG, PNG, GIF (static only), WEBP; max file size 5MB
  - After selecting: circular crop tool shown
    - Drag to reposition
    - Pinch/scroll to zoom
    - "Save" and "Cancel" buttons on the crop UI
  - On save: avatar updates instantly everywhere (top nav, profile page, leaderboard)
- "Remove Photo" link: removes avatar, falls back to initial-letter avatar

**Section: Personal Information**
- Display Name:
  - Label: "Display Name"
  - Input: text, current value pre-filled, max 50 characters
  - Character counter: shows remaining characters
- Username:
  - Label: "Username"
  - Input: text, current value pre-filled
  - Validation: 3–20 characters, `^[a-zA-Z0-9_]+$` (letters, numbers, underscores only)
  - Live availability check: debounced 500ms; shows "✓ Username available" (green) or "✗ Username taken" (red) or "ℹ That's your current username" (blue)
  - Cannot use a username currently taken by another user (case-insensitive comparison)
- Email Address:
  - Label: "Email Address"
  - Input: email, current value pre-filled
  - Warning below: "Changing your email requires re-verification. You will receive a verification link at your new address."
- "Save Changes" button (primary)
  - Disabled if nothing has changed from current values
  - Loading state on click
  - On success: toast "Profile updated successfully."
  - On email change: logs user out and shows: "Check your new email address for a verification link."

**Section: Change Password**
- Three fields: Current Password, New Password, Confirm New Password
- Same password strength requirements as signup
- "Update Password" button (primary, separate from above Save button)
- On success: toast "Password updated. Please log in again." → logs out → redirects to login

**Section: Connected Accounts**
- Shows: "Google — Connected ✓" or "Google — Not connected [Connect]"
- Shows: "Apple — Connected ✓" or "Apple — Not connected [Connect]"
- Disconnect link next to each connected account
  - If user would be left with no login method (no password set, removing last OAuth): show error "Set a password before disconnecting your [provider] account."

### 21.3 Notifications Settings

**Heading:** "Notifications"

**Master switches:**
- "Email Notifications" — master on/off toggle for ALL email notifications
- "In-App Notifications" — master on/off for in-app notification centre (cannot be disabled — always receives but shows/hides from centre)

**Individual notification toggles:**

Each toggle has:
- Label (notification type name)
- Description (one line explaining when this fires)
- Toggle switch (on/off)
- Some have sub-options

| Setting | Description | Sub-options |
|---------|-------------|-------------|
| Price Alerts | Notify when a stock hits your target price | — |
| Trade Confirmations | Notify when a market order executes | — |
| Order Filled | Notify when a limit or stop order fills | — |
| Order Expired | Notify when a GFD or GTC order expires without filling | — |
| Partial Fills | Notify when an order partially fills | — |
| Daily Portfolio Summary | Receive a daily summary of your portfolio performance | Time picker: "Deliver at: [4:05 PM ET (default)] [timezone selector]" |
| Earnings Reminders | Notify 24h before a company in your watchlist reports earnings | — |
| Achievement Unlocked | Notify when you earn a new achievement badge | — |
| Level Up | Notify when you reach a new XP level | — |
| Daily Challenge Complete | Notify when you complete a daily challenge | — |
| Friend Requests | Notify when someone sends you a friend request | — |
| Friend Accepted | Notify when someone accepts your friend request | — |
| Leaderboard Changes | Notify when your leaderboard rank changes significantly (10+ places) | — |

### 21.4 Display Settings

**Heading:** "Display"

**Theme:**
- Label: "Colour Theme"
- Radio buttons: "Light" | "Dark" | "System Default (follows your device)"
- Default: System Default
- Changing applies instantly (no save required)
- Saved to `localStorage` key `theme_preference` AND to the user's database record (persists across devices)

**Currency Display:**
- Label: "Display Currency"
- Dropdown: USD (default) | CAD | EUR | GBP | JPY | AUD
- Note below: "This changes how prices are displayed. All simulation uses USD internally — prices are converted using the current exchange rate."
- Changing applies to all price displays across the platform

**Number Format:**
- Label: "Number Format"
- Radio buttons: "1,234.56 (US format)" | "1.234,56 (European format)"
- Default: US format

**Chart Default Type:**
- Label: "Default Chart Type"
- Radio: "Line" | "Candlestick" | "OHLC"
- Default: Line

**Chart Default Time Range:**
- Label: "Default Time Range on Stock Pages"
- Radio: "1D" | "1W" | "1M" | "3M"
- Default: 1D

**"Save Display Settings" button** at the bottom of this section

### 21.5 Simulation Settings

**Heading:** "Simulation"

**Default Starting Cash:**
- Label: "Default Starting Cash for New Simulations"
- Number input with $ prefix
- Min: $1,000, Max: $10,000,000
- Default: $100,000

**Default Simulation Speed:**
- Dropdown: same options as simulation setup

**Simulation History:**
- "View Simulation History" link → scrolls to simulation history section on `/simulation`
- Shows count: "You have [N] saved simulation results (maximum 5)."

**Delete All Simulations:**
- "Delete All Simulation Data" button (ghost, red text)
- Confirmation modal: "Delete all simulation data? This will permanently delete all [N] saved simulations and their results. This cannot be undone."

**"Save Simulation Settings" button**

### 21.6 Privacy Settings

**Heading:** "Privacy"

**Profile Visibility:**
- Label: "Who can view your profile"
- Radio: "Public (anyone on the platform)" | "Friends Only" | "Private (only you)"
- Default: Public
- Note: "Private profiles are not shown on the global leaderboard."

**Leaderboard Visibility:**
- Label: "Show me on the leaderboard"
- Toggle: on/off
- Default: On
- Off state: "Your username will be hidden from all public leaderboards. You can still see your own rank."

**Data Usage:**
- Label: "Help improve MarketSim Pro"
- Toggle: on/off
- Default: On
- Description: "Allow us to collect anonymised usage data (page views, feature usage) to improve the platform. No personal information or portfolio data is included."

**Download My Data:**
- "Download My Data" button (secondary)
- Description: "We will prepare a ZIP file of all your data (profile, portfolio, transactions, achievements) and email it to [email]. This may take up to 24 hours."
- On click: confirmation modal → on confirm: shows "We'll email your data to [email] within 24 hours." toast

**Delete Account:**
- "Delete Account" button (ghost, red text)
- Description: "Permanently delete your account and all associated data. This cannot be undone."
- On click: three-step confirmation modal:
  - Step 1: Warning list of what will be deleted (all portfolio data, transaction history, achievements, friend connections)
  - Step 2: Input field "Enter your password to confirm"
  - Step 3: Input field "Type DELETE to confirm"
  - "Permanently Delete Account" button: only enabled when password is correct AND text is "DELETE"
  - "Cancel" button: closes modal

### 21.7 Help & Support

**Heading:** "Help & Support"

**Quick Actions (buttons at top):**
- "Replay Onboarding Tutorial" — triggers the onboarding flow again (resets `onboarding_completed = false` then navigates to `/dashboard` where the modal triggers); confirmation: "This will restart the tutorial from the beginning."
- "Report a Bug" — opens a modal with a form: Subject (text), Description (textarea), and "Submit" button
- "Contact Support" — opens user's email client with `mailto:support@marketsimpro.com` and subject "MarketSim Pro Support"

**FAQ Accordion:**
Heading: "Frequently Asked Questions"

Each FAQ item is an accordion (collapsed by default, clicking expands):

1. **Is MarketSim Pro free?** — Yes, completely free. Revenue comes from advertising.
2. **Is any real money involved?** — No. All trading uses virtual money. No real orders are ever placed.
3. **Where does the price data come from?** — Live prices from NYSE and NASDAQ via [API provider name]. Prices update every 5 seconds during market hours.
4. **How is the leaderboard calculated?** — Rankings are based on total return percentage from the $100,000 starting cash. This means a smaller portfolio can outrank a larger one if it has grown more efficiently.
5. **What is Simulation Mode?** — A time-travel feature letting you go back to any date in history and trade using real historical prices. It's completely separate from your live portfolio.
6. **Can I reset my portfolio?** — Yes. Go to Portfolio > scroll to "Danger Zone" > click "Reset Portfolio". This deletes all positions and restores $100,000 cash. It cannot be undone.
7. **What order types are supported?** — Market, Limit, Stop-Loss, and Stop-Limit orders, each with GFD or GTC duration.
8. **How does the XP system work?** — You earn XP by trading, completing daily challenges, logging in, and unlocking achievements. XP accumulates to advance your level (1–100).
9. **Can I have multiple watchlists?** — Yes, up to 10 named watchlists with up to 50 stocks each.
10. **How do I delete my account?** — Go to Settings > Privacy > Delete Account. This is permanent and cannot be reversed.
11. **How often does the leaderboard update?** — Every 15 minutes during market hours, and once at market close (4:00 PM ET).
12. **What are the market hours?** — NYSE and NASDAQ trade Monday–Friday, 9:30 AM – 4:00 PM Eastern Time, excluding US federal holidays.
13. **Why is my order not filling?** — Limit orders only fill when the stock price reaches your limit price. The market may not have reached your target. GFD orders expire at market close.
14. **What happens to my open orders when market closes?** — GFD orders expire at 4:00 PM ET. GTC orders remain active until they fill or you cancel them (max 90 days).
15. **Can I trade crypto?** — Not in the current version. Crypto support is planned for a future update.

**Links:**
- "Terms of Service" → external link
- "Privacy Policy" → external link
- App version: "MarketSim Pro v1.0.0"

### 21.8 Session Management

**At bottom of settings page (below all tabs):**

"Session" section:
- "Log Out of This Device" — logs out current session; redirects to `/login`
- "Log Out of All Devices" — invalidates all active sessions across all devices; shows confirmation modal: "Log out of all devices? You will need to log in again on each device."
- Active sessions info (optional/future): list of active sessions with device type, location, last active time, and "Log out" button per session

---

## 22. User Profile Page

**Route:** `/profile/[username]`  
**Viewing own profile:** `/profile` or `/profile/[own-username]`

### 22.1 Access Rules

- Public profiles: viewable by anyone logged in
- Friends Only profiles: viewable only by friends of that user and the user themselves
- Private profiles: viewable only by the user themselves; anyone else sees: "This profile is private." with a "← Back" link
- Banned accounts: "This account is no longer available."

### 22.2 Profile Header

- Avatar (80px circle)
- Display Name (large)
- Username ("@handle") in mono, secondary colour
- Level badge: "Level [N] — [Title]" with coloured level icon
- Joined date: "Member since [Month Year]"
- "Add Friend" button (if viewing another user's public/friends profile and not already friends)
  - Changes to "Friend Request Sent" after sending (greyed out)
  - Changes to "Friends ✓" if already friends, with a dropdown to "Remove Friend"
- "Send Message" (placeholder for Phase 2 — shown but disabled with tooltip "Coming soon")

### 22.3 Profile Stats Row

4 stats:
- Total Portfolio Value (hidden if profile is set to private; shows "—" if viewer is not friends)
- Total Return % (same privacy rules)
- Global Rank: "#[N]" or "Unranked" (hidden if opted out of leaderboard)
- Achievements Earned: "[N] / [total]"

### 22.4 Profile Tabs

**Achievements (default tab):**
- Badge grid showing all earned badges (locked ones not shown unless it's the user's own profile)
- Format: same as Achievements page grid

**Performance (shown only if profile is public or friend):**
- Portfolio performance chart (read-only, same chart component)
- Key stats: total return, best day, worst day, longest streak

**Activity Feed:**
- Recent activity: "Earned [Badge]", "Reached Level [N]", "Joined the Top 100!" (no trade details exposed for privacy)

---

## 23. Data & API Architecture

### 23.1 Market Data Provider

**Recommended provider:** Polygon.io (primary) with Finnhub as fallback  
**Alternative:** Alpha Vantage (if cost constraints require it)

**Required data feeds:**

| Data Type | Endpoint Type | Update Frequency |
|-----------|--------------|-----------------|
| Real-time stock quotes | WebSocket (live) | Per-trade (real-time) |
| OHLCV bars (intraday) | REST + WebSocket | 1-minute bars |
| OHLCV bars (daily) | REST | End of day |
| Company fundamentals | REST | Daily (cached) |
| Financial statements | REST | Quarterly (cached) |
| Analyst ratings | REST | Weekly (cached) |
| Financial news | REST | Every 5 minutes |
| Market status | REST | Every 30 seconds |
| Index prices | WebSocket | Real-time |
| Dividends & splits | REST | Daily (cached) |
| Earnings calendar | REST | Daily (cached) |
| Pre/post market prices | REST | 15-minute delay |
| Exchange holidays | REST | Annually (cached) |

### 23.2 Data Caching Strategy

**Redis cache layers:**

| Data | TTL | Notes |
|------|-----|-------|
| Live stock price | 5 seconds | Updated by WebSocket receiver |
| Fundamentals | 24 hours | Refreshed nightly |
| Financial statements | 7 days | Updated after each earnings period |
| Analyst ratings | 24 hours | |
| News feed | 5 minutes | |
| Exchange holidays | 365 days | |
| Market status | 30 seconds | |
| Index prices | 5 seconds | |

**Database (PostgreSQL) stores:**
- Historical OHLCV daily bars: pre-fetched nightly for all supported symbols, last 10 years
- Historical OHLCV 1-minute bars: last 30 days only (storage constraint)
- News articles: last 7 days cached locally, older articles fetched from API on demand
- Company fundamentals snapshot: updated daily

### 23.3 WebSocket Architecture

**Server-side WebSocket process:**
1. Backend maintains a single WebSocket connection to the data provider
2. Subscribes to all active symbols (symbols currently being viewed by any user, plus all symbols in any user's watchlist, plus all symbols in any user's portfolio)
3. On receiving a price update: updates Redis cache, then broadcasts to all connected clients watching that symbol via Socket.io rooms

**Client-side WebSocket:**
1. Client connects to the backend WebSocket server on authenticated page load
2. Client subscribes to symbols based on current page:
   - Dashboard: subscribes to all portfolio symbols + top 20 market movers
   - Markets page: subscribes to the 50 visible symbols on current page
   - Stock Detail: subscribes to the single symbol
   - Trade Panel: subscribes to the symbol being traded
3. Receives: `{ symbol: "AAPL", price: 189.22, change: 2.34, changePercent: 1.25, timestamp: 1715300000 }`
4. Updates UI immediately on receipt (colour flash + number update)

### 23.4 Supported Symbols

- All NYSE-listed common stocks (approximately 2,400 symbols)
- All NASDAQ-listed common stocks (approximately 3,500 symbols)
- Major ETFs (approximately 500 symbols including SPY, QQQ, IWM, GLD, etc.)
- Total: approximately 6,400 tradeable symbols

**Not supported in MVP:**
- OTC/Pink Sheet stocks
- ADRs (American Depositary Receipts)
- REITs (may be added if data provider includes them)
- Preferred shares
- Warrants, rights, units

### 23.5 Handling Market Holidays

- Source market holidays from the Exchange Holidays endpoint (cached annually)
- On holidays: market status shows "CLOSED — Market Holiday: [Holiday Name]"
- No price updates sent on holidays (market data feed goes silent)
- Pending GFD orders placed before a holiday: not expired during the holiday; expire at the close of the next trading day
- The earnings calendar and trading day calculations skip holidays automatically

---

## 24. Simulation Engine — Deep Specification

### 24.1 Data Source for Simulation

Simulation uses historical OHLCV daily bars stored in the database. For intraday simulation (times within a day), the engine uses 1-minute bars for the last 30 days. Beyond 30 days, intraday granularity is simulated from daily bars using a price interpolation model.

**Price interpolation model (for historical days beyond 30 days):**
- Open price: used at 9:30 AM simulated time
- High price: occurs at a random time between 9:30 AM and 4:00 PM (using a seeded random based on date and symbol)
- Low price: occurs at a different random time (also seeded)
- Close price: used at 4:00 PM simulated time
- Prices interpolate linearly between the anchor points
- Volume: distributed proportionally across the simulated trading day using a typical intraday volume curve (high at open, dip at midday, high at close)

This means all users running a simulation for the same date/symbol will see identical price movements (deterministic seeded model).

### 24.2 Time Advancement Model

**Simulation clock:**
- A server-side clock tracks the current simulated timestamp per simulation session
- Clock advances based on real elapsed time × speed multiplier
- Example at 100x speed: 1 real second = 100 seconds of simulated market time

**Market hours handling:**
- Only trading hours advance: 9:30 AM – 4:00 PM ET, Monday–Friday
- Outside trading hours: clock jumps to the next market open automatically (no waiting)
- When the simulation clock reaches 4:00 PM ET: GFD orders expire, daily portfolio snapshot saved, clock advances to 9:30 AM ET next trading day
- Weekends and holidays: skipped automatically (no simulation time advances during non-trading periods)

**Database writes:**
- Portfolio value snapshot: written every simulated trading day at close
- Open orders checked against historical prices: every 1 simulated minute
- Dividends applied: at market close on the ex-dividend date for any held positions

### 24.3 Dividend Handling in Simulation

When a user holds a stock through its historical ex-dividend date during simulation:
- Cash dividend: added to virtual cash balance
- Stock dividend or split: position adjusted appropriately
- Toast notification: "Dividend received: $[amount] from [TICKER] ([N] shares × $[per-share])."

### 24.4 Concurrent Simulation Sessions

- Maximum 1 active simulation per user at a time
- If a user opens the simulation page in multiple tabs: the simulation continues in the server; all tabs receive the same state via WebSocket
- If a user closes the tab without stopping the simulation: the simulation continues server-side
- When the user reopens `/simulation`: they see the simulation still in progress with a "Simulation Running" state
- Simulations are automatically paused if no client is connected for more than 30 minutes
- Auto-pause shows a notification: "Your simulation was paused automatically because you were inactive."

### 24.5 Simulation API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/simulation/start` | Start a new simulation |
| POST | `/api/simulation/pause` | Pause current simulation |
| POST | `/api/simulation/resume` | Resume paused simulation |
| POST | `/api/simulation/stop` | Stop and generate results |
| GET | `/api/simulation/state` | Get current simulation state |
| POST | `/api/simulation/speed` | Change simulation speed |
| POST | `/api/simulation/jump` | Jump to a specific date |
| POST | `/api/simulation/trade` | Place a trade within simulation |
| GET | `/api/simulation/history` | List saved simulations |
| DELETE | `/api/simulation/[id]` | Delete a saved simulation |

---

## 25. Real-Time Price System

### 25.1 Price Update Flow

```
Market Data API (WebSocket)
         ↓
  Backend WebSocket Receiver
         ↓
  Update Redis Cache
         ↓
  Publish to Socket.io Channel (per symbol)
         ↓
  Client WebSocket Listener
         ↓
  React State Update
         ↓
  UI Re-render (price + colour flash)
```

### 25.2 Price Display Formatting

All price values must be formatted according to the following rules:

**Currency formatting:**
- USD: `$` prefix, 2 decimal places always (e.g. `$189.22`, `$0.03`)
- Exception: stocks under $1.00 show 4 decimal places (e.g. `$0.0034`)
- Exception: stocks over $10,000 show 2 decimal places (e.g. `$18,432.50`)
- Use `Intl.NumberFormat` with appropriate options

**Change formatting:**
- Always show sign: `+$2.34` or `-$2.34`
- Percentage: `+1.25%` or `-1.25%`
- Zero change: `$0.00 (0.00%)` in neutral grey
- Combined display: `+$2.34 (+1.25%)`

**Large numbers (volume, market cap):**
- ≥ 1,000,000,000,000: `X.XT` (trillions)
- ≥ 1,000,000,000: `X.XB` (billions)
- ≥ 1,000,000: `X.XM` (millions)
- ≥ 1,000: `X,XXX` (thousands with comma)
- < 1,000: `XXX`
- All use 1 decimal place for abbreviated values

### 25.3 After-Hours / Pre-Market

- After-hours (4:00 PM – 8:00 PM ET): show last after-hours trade price if available from API
- Pre-market (4:00 AM – 9:30 AM ET): show pre-market price if available
- Both are clearly labelled with a badge: "AFTER-HOURS" or "PRE-MARKET"
- The regular market price is shown as "Previous Close: $[X]" below the current display
- No after-hours trading in the simulator (orders submitted during off-hours queue for next open)

---

## 26. Order Execution Engine

### 26.1 Market Order Execution

1. User submits market order
2. Backend validates: sufficient cash (buy), sufficient shares (sell), valid symbol, market is open
3. Execute at current cached price (last WebSocket update, max 5 seconds old)
4. Deduct cash (buy) or shares (sell) from portfolio immediately
5. Create transaction record
6. Send notification: `order_market_filled`
7. Update portfolio value snapshot
8. Check if any achievements are now unlocked → award XP and badges
9. Return success response

**Outside market hours (market closed, pre-market, after-hours):**
- Market orders are NOT accepted during off-hours in MVP
- User sees inline error: "The market is currently closed. Market orders can only be placed when the market is open (Mon–Fri 9:30 AM – 4:00 PM ET). Your order was not submitted. Consider placing a Limit order, which will execute when the market opens and reaches your price."
- Option shown: "Place a Limit Order instead" — pre-fills the limit price with current last-close price

### 26.2 Limit Order Execution

1. User submits limit order with limit price and duration (GFD or GTC)
2. Backend validates: limit price is a positive number; cash held in reserve (buy) — reserved cash cannot be used for other orders
3. Order saved to `orders` table with status `pending`
4. Background job runs every 1 minute during market hours:
   - Fetches all pending limit orders
   - For each order: compares limit price to current price
   - If conditions met (buy: current ≤ limit; sell: current ≥ limit):
     - Execute at the better of the limit price or current price
     - Update order status to `filled`
     - Send `order_limit_filled` notification
     - Release reserved cash; deduct actual cost
     - Create transaction record
5. At market close (4:00 PM ET):
   - GFD orders not filled: status → `expired`; reserved cash released; send `order_expired` notification
   - GTC orders: persist to next trading day (up to 90 calendar days); if 90 days exceeded: expire automatically

**Reserved cash (Buy Limit Orders):**
- When a buy limit order is submitted: `limit_price × shares` is reserved from available cash
- Reserved cash is subtracted from "Available Cash" display but shown as "Cash in Orders: $X.XX"
- If cancelled: reserved cash immediately returned

### 26.3 Stop-Loss Order Execution

1. User submits stop-loss sell order with stop price
2. Validated: user holds at least the specified number of shares
3. Order saved to `orders` table, status `pending`
4. Monitoring job (every 1 minute during market hours):
   - For each pending stop-loss order: compares stop price to current price
   - If current price ≤ stop price: trigger is hit
   - Convert to a market order and execute immediately at current market price (which may be worse than stop price in fast-moving markets — this is explained in the order type tooltip)
   - Update order status to `filled` (or `slippage_filled` if execution was significantly worse than stop price)
   - Send `order_stop_filled` notification
5. GFD and GTC duration rules same as limit orders

### 26.4 Stop-Limit Order Execution

1. User submits stop-limit order with both a stop price and a limit price
2. Order saved, status `pending_trigger`
3. Monitoring job:
   - For stop-limit sell: when current price ≤ stop price → trigger activates
   - Convert to a limit sell order at the specified limit price
   - Status changes to `pending_limit`
   - Now follows limit order execution logic
   - If limit price is never reached before GFD expiry: order expires `limit_not_filled`
   - Notification: `order_limit_filled` or `order_expired`

### 26.5 Order Validation Rules

**Buy validation:**
- `quantity > 0` and is an integer
- `quantity × price ≤ available_cash` (after subtracting existing reserved cash)
- `symbol` exists and is tradeable
- For market orders: `market_status == 'open'`
- For limit orders: `limit_price > 0`
- For stop-limit: `stop_price > limit_price` (stop is above limit for sell orders)

**Sell validation:**
- `quantity > 0` and is an integer
- `quantity ≤ shares_owned` for the specific symbol
- `symbol` exists in user's portfolio
- For market orders: `market_status == 'open'`
- For limit orders: `limit_price > 0`

**Errors returned (with specific codes for frontend to display appropriate messages):**
- `INSUFFICIENT_CASH`: "You don't have enough virtual cash for this order."
- `INSUFFICIENT_SHARES`: "You don't own enough shares of [TICKER] to sell [N] shares."
- `MARKET_CLOSED`: "The market is currently closed."
- `INVALID_QUANTITY`: "Quantity must be a positive whole number."
- `INVALID_PRICE`: "Price must be a positive number."
- `SYMBOL_NOT_FOUND`: "This stock is not available for trading."
- `ORDER_LIMIT_EXCEEDED`: "You can have a maximum of 50 open orders at a time."
- `SERVER_ERROR`: "Something went wrong. Please try again."

### 26.6 Maximum Open Orders

- Maximum 50 pending orders per user at any time (across all symbols, all order types)
- If limit reached: the "Preview Order" button is disabled and shows: "You have reached the maximum of 50 open orders. Cancel some orders before placing new ones."

---

## 27. Non-Functional Requirements

### 27.1 Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Initial page load (LCP) | Under 2.5 seconds on standard broadband |
| Time to interactive | Under 3 seconds |
| API response time (p50) | Under 150ms |
| API response time (p95) | Under 400ms |
| API response time (p99) | Under 1000ms |
| Live price update latency | Under 5 seconds from market trade |
| Chart render time | Under 1 second after page load |
| Search autocomplete response | Under 200ms |
| Order execution response | Under 2 seconds |
| Concurrent users supported | 100,000 (designed for) |

### 27.2 Scalability

- Stateless backend API (any instance can handle any request)
- Horizontal scaling via container orchestration (Kubernetes or AWS ECS)
- Database read replicas for heavy read traffic (leaderboard, market data queries)
- Redis cluster for cache and session storage
- CDN for all static assets (JS, CSS, images, fonts)
- Asset caching: 1 year for versioned static files, 5 minutes for data-dependent pages

### 27.3 Security Requirements

**Authentication:**
- JWT access tokens: 15-minute expiry
- Refresh tokens: 30-day expiry, stored in httpOnly cookies (not localStorage)
- Refresh token rotation: each use issues a new refresh token and invalidates the old one
- OAuth 2.0 for Google and Apple SSO

**Password security:**
- Bcrypt hashing, minimum cost factor 12
- No plaintext passwords stored anywhere
- Password reset tokens: single-use, expire after 1 hour

**API security:**
- Rate limiting on all endpoints (see table below)
- CSRF protection on all state-changing endpoints (POST, PUT, DELETE, PATCH)
- All API responses include `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`
- CORS: strict allowlist of frontend origins only
- Input validation and sanitisation on all inputs server-side (never trust client)
- SQL injection prevention: parameterized queries only (no string interpolation in SQL)
- XSS prevention: output encoding on all dynamic content

**Rate limits:**

| Endpoint | Limit |
|----------|-------|
| POST /auth/login | 10 per minute per IP |
| POST /auth/signup | 5 per minute per IP |
| POST /auth/forgot-password | 3 per 15 minutes per IP |
| POST /api/orders | 20 per minute per user |
| GET /api/prices/* | 120 per minute per user |
| GET /api/search | 60 per minute per user |
| All other GET endpoints | 300 per minute per user |

**Data:**
- Never log passwords, tokens, or sensitive fields
- Database at rest encryption
- Backups encrypted and stored separately from production
- No third-party scripts have access to user portfolio data (ad scripts run in sandboxed iframes)

### 27.4 Accessibility (WCAG 2.1 Level AA)

All of the following must be met:

**Keyboard navigation:**
- Every interactive element reachable by keyboard (Tab key)
- Logical tab order follows visual order
- Focus indicator always visible: `box-shadow: var(--shadow-focus)` (3px green ring)
- Modals trap focus (Tab cycles only within modal while open)
- Skip to main content link (hidden until focused) at the very top of each page

**Screen reader:**
- All images have `alt` text (meaningful for content images, empty string for decorative)
- All icons used as buttons have `aria-label` attributes
- Charts have `role="img"` and `aria-label` describing the chart content
- Data tables have `<th>` headers with `scope` attributes
- Loading states announced via `aria-live="polite"` regions
- Toast notifications announced via `aria-live="assertive"` region
- Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal heading

**Colour and contrast:**
- All body text: contrast ratio ≥ 4.5:1 against background
- Large text (≥18pt or ≥14pt bold): contrast ratio ≥ 3:1
- Positive/negative colour never the ONLY differentiator: always include `+` or `-` sign in addition to colour
- Do not rely solely on colour for charts: also use line styles (solid vs dashed)

**Forms:**
- All form inputs have visible `<label>` elements (not just placeholder text)
- Error messages are programmatically associated with their inputs via `aria-describedby`
- Required fields marked with `aria-required="true"` and a visual asterisk

**Motion:**
- All animations respect `prefers-reduced-motion` media query
- When `prefers-reduced-motion: reduce`: disable price flash animations, number counter animations, chart transition animations; modals appear instantly; toast appears without sliding

### 27.5 Browser & Device Support

| Platform | Minimum Version |
|----------|----------------|
| Chrome (desktop) | 100+ |
| Firefox (desktop) | 100+ |
| Safari (desktop) | 15+ |
| Edge (desktop) | 100+ |
| Chrome (Android) | 100+ |
| Safari (iOS) | 15+ |
| Samsung Internet | 17+ |
| Minimum viewport | 320px wide |
| Recommended viewport | 375px+ mobile, 1280px+ desktop |

**IE11:** Not supported. If detected, show a page: "MarketSim Pro requires a modern browser. Please use Chrome, Firefox, Safari, or Edge."

### 27.6 Uptime & Reliability

- Target uptime: 99.9% (≤ 8.7 hours downtime per year)
- Maintenance windows: Saturdays 2:00 AM – 5:00 AM ET (market closed, minimal user activity)
- Status page: `status.marketsimpro.com` — public-facing, shows current status and incident history
- Automated monitoring: health check ping every 30 seconds; alert fires if 3 consecutive checks fail
- On-call alerting: PagerDuty or similar; P1 incidents (site down) require response within 15 minutes
- Database backups: daily full backup, continuous transaction log shipping; point-in-time recovery to any second within 7 days

### 27.7 Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| User accounts | Until account deleted, then 30-day grace period |
| Transaction history | Indefinitely (for user's own access) |
| Portfolio value snapshots | Indefinitely (needed for all-time chart) |
| Notifications | 90 days |
| Simulation results | Until user deletes or account is deleted |
| News articles (cached) | 7 days |
| Historical price data | 10 years |
| Server logs | 90 days |
| Audit logs (auth events) | 2 years |
| Error logs | 30 days |

---

## 28. Technical Architecture

### 28.1 Frontend Stack

| Technology | Purpose |
|-----------|---------|
| React 18+ | UI framework |
| Next.js 14+ | SSR, routing, API routes |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling (base layer for spacing, responsive only; custom CSS for design tokens) |
| TradingView Lightweight Charts | Price charts |
| Socket.io Client | Real-time WebSocket connection |
| Zustand | Global state management (portfolio data, user data, theme) |
| React Query (TanStack Query) | Server state management, caching, refetching |
| Lucide React | Icon library |
| date-fns | Date formatting and manipulation |
| Recharts | Allocation pie charts, portfolio history chart |

**Build output:** Static assets (JS, CSS) served from CDN. Pages use SSR for SEO-relevant pages (landing page) and CSR for authenticated pages.

**Progressive Web App:**
- `manifest.json` configured with app name, icons, theme colour
- Service worker for offline caching of app shell (not market data)
- Users can "Add to Home Screen" on mobile

### 28.2 Backend Stack

| Technology | Purpose |
|-----------|---------|
| Node.js 20+ | Runtime |
| Express.js or Fastify | HTTP framework |
| TypeScript | Type safety |
| PostgreSQL 15+ | Primary database |
| Redis 7+ | Cache, session store, pub/sub |
| Socket.io | WebSocket server |
| BullMQ | Background job queue (order monitoring, notifications, daily snapshots) |
| Passport.js | Authentication (local + OAuth) |
| jsonwebtoken | JWT generation and verification |
| bcryptjs | Password hashing |
| Zod | Input validation/parsing |
| Prisma | ORM (type-safe database access) |

### 28.3 Infrastructure

| Component | Technology |
|-----------|-----------|
| Frontend hosting | Vercel or AWS CloudFront + S3 |
| Backend hosting | Railway / Render (MVP) or AWS ECS/Fargate (scale) |
| Database | AWS RDS PostgreSQL or Supabase |
| Redis | AWS ElastiCache or Upstash |
| CDN | Cloudflare (DNS + DDoS + asset caching) |
| Media storage | AWS S3 (user avatar uploads) |
| Error monitoring | Sentry |
| Performance monitoring | Datadog or New Relic |
| Logging | Logtail or Datadog Logs |
| CI/CD | GitHub Actions |
| Container registry | AWS ECR or GitHub Container Registry |

### 28.4 Environment Variables Required

All must be set in production environment; never committed to source control:

```
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Market Data API
MARKET_API_KEY=...
MARKET_API_BASE_URL=https://api.polygon.io/v2
MARKET_API_WS_URL=wss://delayed.polygon.io/stocks

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_PRIVATE_KEY=...

# Email
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=noreply@marketsimpro.com

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=marketsim-avatars
AWS_REGION=us-east-1

# App
NEXT_PUBLIC_APP_URL=https://marketsimpro.com
NEXT_PUBLIC_WS_URL=wss://api.marketsimpro.com
NODE_ENV=production

# Ads
GOOGLE_ADSENSE_CLIENT_ID=...
```

---

## 29. Database Schema Overview

This section defines the primary database tables. All tables include `created_at` and `updated_at` timestamps unless otherwise noted.

### 29.1 Users Table

```sql
users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  username        VARCHAR(20) UNIQUE,
  display_name    VARCHAR(50),
  password_hash   VARCHAR(255),           -- null for OAuth-only accounts
  avatar_url      VARCHAR(500),
  level           INTEGER DEFAULT 1,
  xp              INTEGER DEFAULT 0,
  email_verified  BOOLEAN DEFAULT false,
  profile_visibility  ENUM('public', 'friends', 'private') DEFAULT 'public',
  show_on_leaderboard BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  dismissed_hints JSONB DEFAULT '[]',     -- array of hint IDs
  theme_preference    ENUM('light', 'dark', 'system') DEFAULT 'system',
  currency_display    VARCHAR(3) DEFAULT 'USD',
  chart_default_type  ENUM('line', 'candle', 'ohlc') DEFAULT 'line',
  chart_default_range ENUM('1D', '1W', '1M', '3M') DEFAULT '1D',
  login_streak        INTEGER DEFAULT 0,
  last_login_date     DATE,
  failed_login_count  INTEGER DEFAULT 0,
  locked_until        TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

### 29.2 OAuth Accounts Table

```sql
oauth_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  provider        VARCHAR(20) NOT NULL,   -- 'google', 'apple'
  provider_id     VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_id)
)
```

### 29.3 Portfolios Table

```sql
portfolios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  portfolio_type  ENUM('live', 'simulation') DEFAULT 'live',
  simulation_id   UUID REFERENCES simulations(id),  -- null for live
  cash_balance    DECIMAL(15, 2) DEFAULT 100000.00,
  starting_cash   DECIMAL(15, 2) DEFAULT 100000.00,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, portfolio_type) -- one live portfolio per user
)
```

### 29.4 Positions Table

```sql
positions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol          VARCHAR(10) NOT NULL,
  shares          DECIMAL(15, 6) NOT NULL,
  avg_cost        DECIMAL(15, 4) NOT NULL,  -- weighted average cost per share
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, symbol)
)
```

### 29.5 Orders Table

```sql
orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol          VARCHAR(10) NOT NULL,
  order_type      ENUM('market', 'limit', 'stop_loss', 'stop_limit') NOT NULL,
  side            ENUM('buy', 'sell') NOT NULL,
  quantity        INTEGER NOT NULL,
  limit_price     DECIMAL(15, 4),
  stop_price      DECIMAL(15, 4),
  duration        ENUM('gfd', 'gtc') NOT NULL,
  status          ENUM('pending', 'pending_trigger', 'pending_limit', 'filled', 'partially_filled', 'expired', 'cancelled') NOT NULL,
  filled_quantity INTEGER DEFAULT 0,
  filled_price    DECIMAL(15, 4),  -- average fill price
  expires_at      TIMESTAMP,       -- for GFD: market close today; for GTC: 90 days from now
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

### 29.6 Transactions Table

```sql
transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES orders(id),
  symbol          VARCHAR(10) NOT NULL,
  side            ENUM('buy', 'sell') NOT NULL,
  shares          INTEGER NOT NULL,
  price           DECIMAL(15, 4) NOT NULL,    -- execution price per share
  total_value     DECIMAL(15, 2) NOT NULL,    -- shares × price
  created_at      TIMESTAMP DEFAULT NOW()     -- no updated_at (immutable)
)
```

### 29.7 Portfolio Snapshots Table

```sql
portfolio_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  total_value     DECIMAL(15, 2) NOT NULL,
  cash_balance    DECIMAL(15, 2) NOT NULL,
  snapshot_time   TIMESTAMP NOT NULL,
  snapshot_type   ENUM('intraday', 'daily_close') NOT NULL
)
-- Index on (portfolio_id, snapshot_time) for chart queries
```

### 29.8 Watchlists & Watchlist Items

```sql
watchlists (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(30) NOT NULL,
  display_order   INTEGER NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)

watchlist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id    UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol          VARCHAR(10) NOT NULL,
  display_order   INTEGER NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol)
)
```

### 29.9 Price Alerts

```sql
price_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol          VARCHAR(10) NOT NULL,
  direction       ENUM('above', 'below') NOT NULL,
  target_price    DECIMAL(15, 4) NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  triggered_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

### 29.10 Notifications

```sql
notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(50) NOT NULL,
  title           VARCHAR(100) NOT NULL,
  message         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT false,
  metadata        JSONB DEFAULT '{}',   -- {symbol, amount, etc.}
  created_at      TIMESTAMP DEFAULT NOW()
)
-- Index on (user_id, is_read, created_at) for quick inbox queries
```

### 29.11 Achievements & XP

```sql
user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id        VARCHAR(50) NOT NULL,   -- matches badge ID constants in code
  progress        INTEGER DEFAULT 0,      -- current progress toward badge
  target          INTEGER NOT NULL,       -- target value to unlock
  unlocked_at     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
)

xp_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,
  reason          VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

### 29.12 Friends

```sql
friendships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  addressee_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  status          ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
)
```

### 29.13 Simulations

```sql
simulations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(50) NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE,                  -- null if still active
  starting_cash   DECIMAL(15, 2) NOT NULL,
  final_value     DECIMAL(15, 2),        -- null if still active
  speed           INTEGER NOT NULL,      -- multiplier (1, 5, 10, 50, 100, 1000)
  status          ENUM('active', 'paused', 'completed') DEFAULT 'active',
  current_sim_timestamp TIMESTAMP,       -- current simulated time
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

### 29.14 Daily Challenges

```sql
daily_challenges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date  DATE NOT NULL,
  tier            ENUM('easy', 'medium', 'hard') NOT NULL,
  description     TEXT NOT NULL,
  xp_reward       INTEGER NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,  -- e.g. 'login', 'trade_count', 'view_stocks'
  requirement_value INTEGER NOT NULL,
  UNIQUE(challenge_date, tier)
)

user_challenge_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id    UUID REFERENCES daily_challenges(id),
  progress        INTEGER DEFAULT 0,
  completed_at    TIMESTAMP,
  UNIQUE(user_id, challenge_id)
)
```

---

## 30. Error States & Edge Cases

This section specifies how every notable error or edge case is handled. Developers must implement all of these explicitly.

### 30.1 Network & Connectivity Errors

**WebSocket disconnection:**
- Detection: Socket.io `disconnect` event
- UI response: Show a banner at the top of the page (below top nav): "Live prices disconnected. Trying to reconnect..." with an animated spinner
- Banner background: `--color-status-warning` (amber)
- Auto-reconnect: Socket.io handles reconnection automatically (exponential backoff, max 30 seconds between attempts)
- On reconnect: banner changes to "Reconnected ✓" (green) for 3 seconds then disappears
- During disconnection: prices shown with a greyed-out indicator; last known price displayed; chart stops updating

**API request failure:**
- HTTP 500 or network timeout: show generic error toast "Something went wrong. Please try again."
- HTTP 503: show error toast "Service is temporarily unavailable. Please try again in a few minutes."
- HTTP 429 (rate limited): show error toast "Too many requests. Please wait a moment before trying again."
- If critical data fails to load on page load: show an inline error state in the component (not just empty):
  - Error icon
  - "Failed to load [data type]"
  - "Try again" button (retries the request)

### 30.2 Authentication Edge Cases

**Session expires while on the app:**
- API returns HTTP 401
- Store the current URL in `sessionStorage`
- Redirect to `/login` with a toast: "Your session has expired. Please log in again."
- After login: redirect to the previously stored URL

**Concurrent login from another device:**
- If refresh token is invalidated (someone else logged in and rotated it):
- Next API call returns 401
- Same flow as above

**Account deleted while logged in:**
- API returns 403 with code `ACCOUNT_DELETED`
- Log out immediately, redirect to `/` with message "This account has been deleted."

### 30.3 Trade Edge Cases

**Stock price changes significantly between viewing and submitting order:**
- Price is checked at execution time (backend)
- If a market order executes at a price more than 10% different from what was shown in the preview modal: show a post-execution notification: "Your order executed at $[actual price], which was $[difference] different from the estimated price due to market movement."

**Trying to sell shares you no longer have (race condition):**
- Can happen if two tabs have the same stock open
- Backend validates shares at execution time
- Returns `INSUFFICIENT_SHARES` error
- Toast: "Order failed: You no longer own enough shares of [TICKER]. Your portfolio may have been updated in another tab."

**Limit order triggers during simulation speed-up:**
- If the simulated price passes through the limit price but the monitoring job didn't run at that exact moment:
- The job checks the high and low of each 1-minute bar
- If the limit price is within the [low, high] range of any bar: the order is considered triggered at the limit price

**Portfolio reset during an active simulation:**
- The main portfolio reset does not affect the simulation portfolio
- They are completely separate records

**API data for a stock becomes unavailable:**
- Symbol is delisted mid-session (unlikely but possible for small caps)
- If data stops being returned for a symbol in the user's portfolio: show that position with last known price and a warning badge: "⚠ Price data unavailable"
- The position is still shown and can still be sold at last known price

### 30.4 Chart Edge Cases

**No intraday data for selected day (holiday, weekend):**
- Chart shows: "No trading activity on [date]. Select a different time range."
- Time range buttons remain active; selecting another range loads that data

**New account viewing 1Y chart:**
- Not enough portfolio history for the full range
- Chart shows available data from account creation date
- Label below chart: "Showing data since your account was created ([date])"

**Very first day (1D chart for user who just signed up today):**
- Only shows data from account creation time to now
- If less than 5 data points: show a minimal chart with just the starting and current value, and a label "Building your history — check back later for a fuller chart"

**Stock chart for a newly listed company:**
- Some time ranges may have no data (IPO'd recently)
- Same behaviour: show available data and note how far back data goes

### 30.5 Leaderboard Edge Cases

**Tie in return percentage:**
- Ties broken by: (1) higher absolute portfolio value, (2) earlier account creation date
- Same rank number shown for ties (e.g., two users both shown at Rank #47)
- Next user shown at Rank #49 (skips #48)

**User deletes account:**
- All their leaderboard entries removed
- Ranks of users below them move up on next refresh

**User resets portfolio:**
- Their return % immediately becomes 0%
- Rank changes to reflect this on next leaderboard refresh (within 15 minutes)

### 30.6 Achievement Edge Cases

**User earns an achievement while offline:**
- Achievement checking runs on the server; badges awarded regardless of whether client is connected
- On next login: any undelivered achievement notifications appear in the notification centre

**XP overflow at max level (100):**
- XP stops accumulating after level 100 is reached
- XP display shows "MAX LEVEL" instead of XP bar
- Badges continue to be earned and awarded

**Daily challenge resets at midnight UTC:**
- If user is actively using the app at midnight UTC: the challenge widget refreshes automatically via WebSocket event `daily_challenges_reset`
- In-progress challenges that weren't completed are marked as missed (cannot be completed retroactively)
- New challenges load without requiring a page refresh

### 30.7 Input Validation Edge Cases

**Entering a quantity larger than max integer:**
- `input` element has `max` attribute set to max shares affordable
- Backend also validates; returns `INVALID_QUANTITY` error

**Entering a price with too many decimal places:**
- Input accepts `step="0.01"` for prices
- Backend rounds to 4 decimal places for storage
- UI displays 2 decimal places

**Pasting malformed data into inputs:**
- All inputs validate and sanitise on the server regardless of client-side validation
- Client-side shows inline error immediately for better UX

**Simultaneous order submission from two tabs:**
- Backend processes orders atomically using database transactions
- Second conflicting order (insufficient cash or shares): returns `INSUFFICIENT_CASH` or `INSUFFICIENT_SHARES` error

---

## 31. Open Questions

The following items require decisions before or during development. They are documented here so that they are not overlooked.

1. **Which market data API?** The specific provider (Polygon.io, Finnhub, Alpha Vantage) must be selected based on: cost per API call, WebSocket plan tier, historical data depth, and reliability. This choice affects several architecture decisions.

2. **Real-time vs. delayed data:** Live real-time data (under 100ms delay) is more expensive than 15-minute delayed data. Will the simulator use true real-time or 15-minute delayed prices? (This PRD assumes real-time. If delayed: all price displays must show "Prices delayed 15 minutes." disclaimer.)

3. **Pre-market/after-hours data availability:** Some API plans include this, some don't. Confirm whether this will be shown in MVP.

4. **Simulation news replay:** Can the news API provide historical news headlines from a specific date? If not, the simulation news feed shows a message: "Historical news replay not available. Showing current news." This is a significant user experience difference.

5. **Intraday simulation precision:** What is the minimum granularity for simulation prices? 1-minute bars require significant storage. Is the interpolation model for older historical dates acceptable to users?

6. **Currency exchange rates:** If non-USD display currencies are supported, where do exchange rates come from? Same market API or a separate FX rate service?

7. **Dividend handling in live paper trading:** When a real company pays a dividend, should simulation portfolio holders receive virtual cash dividends? (Recommended: yes. But this requires tracking ex-dividend dates and registering dividend events.)

8. **Username uniqueness:** Is username matching case-insensitive? (Recommended: yes — "JohnDoe" and "johndoe" cannot both exist.)

9. **Maximum concurrent simulations:** Currently set at 1 per user. Is this acceptable or should users be able to have multiple active simulations?

10. **Portfolio snapshot frequency:** Currently: every 5 minutes intraday. Is this sufficient for the 1D chart resolution, or should it be every 1 minute?

---

## 32. Glossary

| Term | Definition |
|------|-----------|
| After-Hours Trading | Trading that occurs after the regular market close (4:00 PM ET) until approximately 8:00 PM ET |
| Ask Price | The lowest price a seller is willing to accept for a stock |
| Average Cost (Avg Cost) | The weighted average price paid per share across multiple purchases of the same stock |
| Beta | A measure of a stock's volatility relative to the overall market. Beta of 1 = moves with market, >1 = more volatile, <1 = less volatile |
| Bid Price | The highest price a buyer is willing to pay for a stock |
| Blue Chip | Shares in a large, well-established, and financially sound company with a long track record |
| Bollinger Bands | A technical indicator consisting of a moving average line and two bands (upper and lower) plotted at 2 standard deviations above and below the average |
| Circuit Breaker | An automatic mechanism that halts trading temporarily when the market drops by more than a set percentage |
| Day Range | The range between the lowest and highest price a stock has traded at during the current trading day |
| Dividend | A payment made by a corporation to its shareholders, usually as a distribution of profits |
| EPS (Earnings Per Share) | A company's net profit divided by the number of outstanding shares |
| ETF (Exchange-Traded Fund) | A type of investment fund traded on stock exchanges that typically tracks an index, commodity, or basket of assets |
| Ex-Dividend Date | The cutoff date to be a shareholder of record to receive the next dividend payment |
| Float | The number of shares available for public trading (excludes insider-owned and restricted shares) |
| GFD (Good For Day) | An order duration that expires at the end of the current trading day if not filled |
| GTC (Good Till Cancelled) | An order duration that remains active until filled or manually cancelled (or until the maximum duration expires) |
| Gross Profit | Revenue minus the cost of goods sold; before operating expenses |
| Limit Order | An order to buy or sell a stock only at a specified price or better |
| Liquidity | How easily an asset can be bought or sold without significantly affecting its price |
| MACD | Moving Average Convergence/Divergence — a trend-following momentum indicator showing the relationship between two moving averages |
| Market Cap (Market Capitalisation) | The total market value of a company's outstanding shares (price × shares outstanding) |
| Market Order | An order to buy or sell a stock immediately at the best available current price |
| Moving Average (MA) | An average of a stock's price over a specified number of periods, used to smooth out price fluctuations |
| Net Income | A company's total profit after all expenses, taxes, and costs have been deducted |
| OHLCV | Open, High, Low, Close, Volume — the five standard data points recorded for each trading period |
| Open Orders | Orders that have been submitted but not yet executed or cancelled |
| P&L (Profit and Loss) | The gain or loss on a position or portfolio |
| P/E Ratio (Price-to-Earnings) | A valuation ratio calculated as stock price divided by earnings per share |
| Paper Trading | Simulated trading using virtual money; no real financial transactions occur |
| Position | The amount of a particular stock that an investor owns |
| Pre-Market Trading | Trading that occurs before the regular market open (before 9:30 AM ET), typically from 4:00 AM ET |
| Realised P&L | Profit or loss that has been locked in by selling a position |
| RSI (Relative Strength Index) | A momentum oscillator measuring the speed and magnitude of price changes; values above 70 suggest overbought, below 30 suggest oversold |
| S&P 500 | Standard & Poor's 500 — an index of 500 large publicly traded US companies, often used as a benchmark for the overall US stock market |
| Sector | A group of companies that operate in the same or related area of the economy (e.g., Technology, Healthcare) |
| Short Selling | Selling shares you don't own (borrowed) with the intent to buy them back at a lower price — NOT available in MarketSim Pro |
| Slippage | The difference between the expected execution price and the actual execution price of an order |
| Sparkline | A small, simple chart with no axes that shows the general trend of a price over time |
| Split (Stock Split) | When a company divides its existing shares into multiple shares, proportionally reducing the price per share |
| Stop-Limit Order | An order that becomes a limit order when the stop price is reached |
| Stop-Loss Order | An order that triggers a market sell when the stock price falls to the specified stop price |
| Total Return | The percentage change in portfolio value from the starting cash to the current value |
| Trailing Twelve Months (TTM) | Financial data from the most recent 12-month period |
| Unrealised P&L | Profit or loss on an open position that has not yet been sold |
| Virtual Cash | Fictional money used in MarketSim Pro for paper trading — it has no real monetary value |
| Volume | The number of shares of a stock traded during a given time period |
| VWAP (Volume Weighted Average Price) | The average price a stock has traded at throughout the day, weighted by volume |
| Watchlist | A personalised list of stocks a user wants to monitor |
| 52-Week High/Low | The highest and lowest prices at which a stock has traded in the past 52 weeks |

---

## 33. AI-Powered Prediction API

This section specifies two distinct API systems that extend the core simulation and live-trading experiences with AI-driven market intelligence:

1. **Real-Time Stock Data API** — live price feed powering all live-mode screens.
2. **News-Based Prediction API** — an AI inference layer that analyses news (current and historical) to generate forward-looking price signals used inside Simulation Mode.

---

### 33.1 Real-Time Stock Data API

#### 33.1.1 Purpose

All prices displayed in live mode (Dashboard, Markets page, Stock Detail, Trade Panel, Portfolio, Watchlist) must reflect actual current market prices sourced from a third-party financial data API. No prices may be fabricated, delayed beyond the stated thresholds, or interpolated in live mode.

#### 33.1.2 Data Provider Integration

**Primary provider:** Polygon.io  
**Fallback provider:** Finnhub  
**Authentication:** API key stored as a server-side environment variable (`POLYGON_API_KEY`, `FINNHUB_API_KEY`). Keys are never exposed to the client.

The backend maintains a **single persistent WebSocket connection** to the data provider. All clients receive price updates through the backend's Socket.io relay — no client ever connects directly to the data provider.

#### 33.1.3 Live Quote WebSocket Feed

| Property | Specification |
|----------|--------------|
| Connection type | WebSocket (provider → backend), Socket.io (backend → client) |
| Latency target | < 500 ms from market trade to UI update |
| Reconnection policy | Exponential back-off starting at 1 s, max 30 s, indefinite retries |
| Heartbeat | Ping every 15 s; if no pong within 5 s, reconnect immediately |
| Symbols subscribed | All symbols in any active portfolio, watchlist, or currently-viewed page |

**Incoming message schema (from provider):**

```json
{
  "ev": "T",
  "sym": "AAPL",
  "p": 189.22,
  "s": 150,
  "t": 1715300000000
}
```

**Normalised internal schema (stored in Redis and broadcast to clients):**

```json
{
  "symbol": "AAPL",
  "price": 189.22,
  "change": 2.34,
  "changePercent": 1.25,
  "volume": 42381920,
  "timestamp": 1715300000000,
  "marketStatus": "OPEN"
}
```

#### 33.1.4 REST Endpoints for Snapshot Data

When a user first loads any price-dependent page, the backend fetches a full snapshot from the provider REST API (not the WebSocket) to populate the initial state before the WebSocket stream catches up.

| Endpoint | Provider call | Cache TTL |
|----------|--------------|-----------|
| `GET /api/quote/:symbol` | Polygon `/v2/last/trade/{symbol}` | 5 seconds (Redis) |
| `GET /api/quotes/batch` | Polygon `/v2/snapshot/locale/us/markets/stocks/tickers` | 5 seconds (Redis) |
| `GET /api/market/status` | Polygon `/v1/marketstatus/now` | 30 seconds (Redis) |
| `GET /api/movers/gainers` | Polygon `/v2/snapshot/locale/us/markets/stocks/gainers` | 60 seconds (Redis) |
| `GET /api/movers/losers` | Polygon `/v2/snapshot/locale/us/markets/stocks/losers` | 60 seconds (Redis) |

#### 33.1.5 Provider Outage Handling

If the primary provider (Polygon.io) becomes unreachable:

1. Backend attempts to switch to fallback provider (Finnhub) within 10 seconds.
2. A yellow system banner appears on all pages: "Live data is currently delayed. Prices may not reflect the latest market activity."
3. If both providers are unreachable for more than 2 minutes: banner upgrades to red. Price fields display the last known value with a timestamp suffix: `$189.22 (as of 2:34 PM)`.
4. No trades may be executed in live mode while both providers are unreachable. The trade panel shows: "Trading temporarily unavailable — market data connection lost."
5. When the connection is restored: banner disappears automatically, prices refresh within 5 seconds, trading re-enables.

---

### 33.2 News-Based AI Prediction API

#### 33.2.1 Purpose

When a user runs a simulation, the AI Prediction API analyses news articles — both current headlines and historical news from the simulated time period — to generate a **Prediction Panel** showing anticipated price direction, confidence level, and the reasoning behind the forecast. This feature makes Simulation Mode significantly more educational by connecting real-world events to price movements.

This is not a guarantee of performance. All predictions are clearly labelled as AI-generated estimates and include a disclaimer.

#### 33.2.2 Prediction Modes

The API supports two distinct prediction modes, selectable by the user in the Simulation Panel:

| Mode | Label in UI | Description |
|------|------------|-------------|
| `current_news` | "Current News Mode" | Uses today's real-world news headlines to predict what this stock might do next, as if you were looking at today's market with AI assistance |
| `historical_news` | "Historical Scenario Mode" | Uses news articles from the simulated time period to predict what the stock did historically — useful for understanding how specific past events (earnings beats, geopolitical crises, sector news) drove price movement |

Both modes can be active simultaneously, displayed as two separate prediction cards in the Prediction Panel.

#### 33.2.3 Data Sources

**Current news (for `current_news` mode):**
- Financial news from the market data provider (Polygon.io news endpoint or Finnhub news endpoint)
- Updated every 5 minutes (cached in Redis)
- Filtered to articles mentioning the simulated stock's ticker or company name, published within the last 48 hours
- Maximum 20 articles per prediction call

**Historical news (for `historical_news` mode):**
- News articles timestamped within ±7 days of the simulated current date
- Sourced from the backend database (cached locally, up to 7 days) or fetched from provider on demand for older dates
- Maximum 20 articles per prediction call
- Supplemented by structured historical scenario data (see 33.2.4)

#### 33.2.4 Historical Scenario Library

In addition to raw news articles, the backend maintains a curated **Historical Scenario Library** — a structured dataset of major market events that the prediction model can reference. This library is not user-visible; it is used only as context in AI inference calls.

| Scenario Type | Examples |
|--------------|---------|
| Earnings surprises | Q3 2022 AMZN miss, Q1 2023 META beat |
| Federal Reserve announcements | Rate hikes, rate pauses, emergency cuts |
| Geopolitical events | COVID lockdowns, Ukraine invasion, supply chain crises |
| Sector-wide shocks | SVB collapse, tech sector layoffs, energy crises |
| Company-specific events | CEO resignations, product recalls, mergers/acquisitions |
| Macroeconomic data releases | CPI prints, unemployment reports, GDP revisions |

When the simulated date falls near a known scenario, the prediction model receives the scenario as additional structured context alongside raw news articles.

#### 33.2.5 AI Inference Architecture

The prediction pipeline runs entirely server-side. The client never calls an AI provider directly.

**Pipeline steps:**

```
1. User requests prediction (clicking "Run AI Prediction" button in Simulation Panel)
         ↓
2. Backend fetches relevant news articles (current or historical, per mode)
         ↓
3. Backend fetches OHLCV price data for the stock over the surrounding 30-day window
         ↓
4. Backend checks Historical Scenario Library for matching events near simulated date
         ↓
5. Backend constructs a structured prompt containing:
   - Stock symbol and company name
   - Current simulated date
   - Summary of OHLCV trend (last 30 days)
   - Up to 20 news article headlines + summaries
   - Any matching historical scenario records
   - Prediction horizon requested (1 day / 1 week / 1 month)
         ↓
6. Backend sends prompt to AI language model (Claude claude-sonnet-4-6 via Anthropic API)
         ↓
7. AI returns a structured JSON response (see 33.2.6)
         ↓
8. Backend validates, caches, and returns the prediction to the client
         ↓
9. Client renders the Prediction Panel
```

**AI provider:** Anthropic Claude (claude-sonnet-4-6)  
**Authentication:** `ANTHROPIC_API_KEY` server-side environment variable, never exposed to client  
**Timeout:** 30 seconds. If the AI call exceeds this, the prediction panel shows: "Prediction is taking longer than expected. Please try again."  
**Rate limiting:** Maximum 10 prediction calls per user per hour to control API costs. Remaining calls shown in UI: "7 predictions remaining this hour."

#### 33.2.6 AI Response Schema

The AI model is instructed to return a strictly structured JSON object. The backend validates this schema before passing to the client. If validation fails, the call is retried once; on second failure the error state is shown.

```json
{
  "predictionMode": "current_news",
  "symbol": "AAPL",
  "generatedAt": "2025-05-12T14:32:00Z",
  "horizon": "1_week",
  "direction": "bullish",
  "confidence": 68,
  "priceTarget": {
    "low": 182.00,
    "mid": 191.50,
    "high": 198.00
  },
  "summary": "Recent reports of stronger-than-expected iPhone demand in emerging markets, combined with analyst upgrades following last week's earnings call, suggest upward price pressure over the next week. The broader tech sector also appears to be recovering.",
  "keyFactors": [
    {
      "factor": "iPhone demand beat",
      "sentiment": "positive",
      "weight": "high"
    },
    {
      "factor": "Federal Reserve rate hold",
      "sentiment": "positive",
      "weight": "medium"
    },
    {
      "factor": "Supply chain concerns in Asia",
      "sentiment": "negative",
      "weight": "low"
    }
  ],
  "disclaimer": "This is an AI-generated estimate based on news sentiment and is not financial advice. Actual stock performance may differ significantly."
}
```

**Field definitions:**

| Field | Type | Values |
|-------|------|--------|
| `direction` | string | `"bullish"`, `"bearish"`, `"neutral"` |
| `confidence` | integer | 0–100 (percentage) |
| `horizon` | string | `"1_day"`, `"1_week"`, `"1_month"` |
| `priceTarget.low` | number | Lower bound of predicted range |
| `priceTarget.mid` | number | Central predicted price |
| `priceTarget.high` | number | Upper bound of predicted range |
| `keyFactors[].sentiment` | string | `"positive"`, `"negative"`, `"neutral"` |
| `keyFactors[].weight` | string | `"high"`, `"medium"`, `"low"` |

#### 33.2.7 Prediction Panel UI (within Simulation Mode)

The Prediction Panel is a collapsible drawer that appears at the bottom-right of the Simulation Mode screen. It is collapsed by default and expanded when the user clicks "AI Prediction" in the simulation toolbar.

**Toolbar button:**

```
[ AI Prediction ▾ ]   (icon: brain/sparkle icon, colour: violet #8B5CF6)
```

**Expanded panel layout (per prediction card):**

```
┌─────────────────────────────────────────────────┐
│  AI PREDICTION — CURRENT NEWS MODE              │
│  AAPL · 1-Week Horizon · Generated 2:32 PM      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Direction:  ▲ BULLISH          Confidence: 68% │
│                                                 │
│  Price Target Range:                            │
│  $182.00 ──────────●──────── $198.00            │
│                 $191.50                         │
│                                                 │
│  Key Factors:                                   │
│  ● [+] iPhone demand beat              HIGH     │
│  ● [+] Fed rate hold                   MED      │
│  ● [−] Supply chain concerns           LOW      │
│                                                 │
│  Summary:                                       │
│  Recent reports of stronger-than-expected       │
│  iPhone demand in emerging markets...           │
│  [Show more ▾]                                  │
│                                                 │
│  ⚠ AI estimate only. Not financial advice.      │
│  Sources: 14 articles · Updated 5 min ago       │
│                                                 │
│  [ Refresh Prediction ]   [ Change Horizon ▾ ]  │
└─────────────────────────────────────────────────┘
```

**Direction colours:**
- Bullish: `#22C55E` (green), up-arrow icon
- Bearish: `#EF4444` (red), down-arrow icon
- Neutral: `#94A3B8` (grey), horizontal-line icon

**Confidence display:**
- 0–40%: shown in red with label "Low Confidence"
- 41–69%: shown in amber with label "Moderate Confidence"
- 70–100%: shown in green with label "High Confidence"

**Horizon selector options:** 1 Day / 1 Week / 1 Month. Changing the horizon triggers a new API call. The previous prediction remains visible (dimmed) while the new one loads.

**"Refresh Prediction" button:** Triggers a new API call, consuming one of the user's hourly rate-limit credits. A confirmation tooltip on hover: "This will use 1 of your 7 remaining predictions this hour."

If the Historical Scenario Mode card is also active, it renders below the Current News Mode card in the same panel, with an identical layout but with the header "AI PREDICTION — HISTORICAL SCENARIO MODE."

#### 33.2.8 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/prediction/current-news` | Generate a prediction using current news headlines |
| `POST` | `/api/prediction/historical-news` | Generate a prediction using historical news for the simulated date |
| `GET` | `/api/prediction/rate-limit` | Return remaining prediction credits for the current user this hour |

**Request body (`/api/prediction/current-news`):**

```json
{
  "symbol": "AAPL",
  "horizon": "1_week"
}
```

**Request body (`/api/prediction/historical-news`):**

```json
{
  "symbol": "AAPL",
  "simulatedDate": "2022-10-14",
  "horizon": "1_week"
}
```

Both endpoints return the schema defined in 33.2.6.

#### 33.2.9 Caching

Predictions are cached server-side to avoid redundant AI API calls and control costs.

| Prediction type | Cache key | TTL |
|----------------|-----------|-----|
| Current news | `pred:current:{symbol}:{horizon}` | 5 minutes |
| Historical news | `pred:historical:{symbol}:{date}:{horizon}` | 24 hours (historical news does not change) |

If a cached prediction is returned, the panel shows: "Cached result · Generated [time ago]" in small grey text below the summary.

#### 33.2.10 Disclaimers & Responsible AI

The following disclaimer must appear on every prediction card, in grey text at 12px, and cannot be dismissed or hidden:

> "This prediction is generated by an AI model analysing news sentiment. It is not financial advice and does not guarantee future performance. MarketSim Pro is a simulation platform — no real money is involved."

Additionally, the first time a user opens the Prediction Panel per session, a modal appears:

**Modal title:** "About AI Predictions"  
**Modal body:**  
> "MarketSim Pro uses AI to analyse financial news and generate educational price predictions. These are estimates — not guarantees. The AI does not have access to insider information and cannot predict the market with certainty. Use predictions as one of many learning tools, not as trading signals."  

**Modal button:** "Got it — Show Predictions"  
**Do not show again checkbox:** "Don't show this again this session" (session-scoped only; reappears on next login)

---

*End of MarketSim Pro Product Requirements Document — Version 1.0*

*This document was last updated: May 2025*  
*Total sections: 32*  
*This document is the single source of truth for all product, design, and engineering decisions for MarketSim Pro v1.0.*