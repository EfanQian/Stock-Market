# Stock Market Research Notes
> Compiled: May 3, 2026 — For use in stock market simulator project

---

## Part 1 — Core Concepts

### 1. What is a stock? What is a share?
A stock represents partial ownership in a company — when a business wants to raise money, it splits itself into millions of tiny pieces and sells them to the public. Each one of those tiny pieces is called a share. If you own a share of Apple, you literally own a small fraction of that entire company, including a claim on its future profits.

**In my simulator, this concept will appear as:** a "buy" button that lets players purchase shares of a company, with the number of shares they own shown in their portfolio.

---

### 2. How do stock prices change? (Supply and demand basics)
Stock prices are driven by supply and demand — if more people want to buy a stock than sell it, the price goes up; if more want to sell, it falls. Prices shift based on news (good earnings, new products, scandals), the overall economy, or even just investor mood. There's no single formula — it's essentially a giant, real-time auction happening every second.

**In my simulator, this concept will appear as:** randomly generated daily price changes influenced by simulated "news events" (e.g., "Company releases new product" → price up 5%).

---

### 3. What is a portfolio and why does diversification matter?
A portfolio is simply the collection of all investments you own — think of it like a backpack where you keep all your stocks. Diversification means spreading your money across many different companies and industries instead of putting it all in one place. If one company crashes, your whole financial life doesn't crash with it.

**In my simulator, this concept will appear as:** a warning alert when a player puts more than 50% of their balance into one single stock — "You're not diversified! Consider spreading your investments."

---

### 4. How do you calculate gain or loss on an investment?
The formula is simple: **(Current Price − Purchase Price) × Number of Shares = Gain or Loss**. If you bought 10 shares at $100 each and they're now worth $130, you've made $300. You can also express this as a percentage: divide your profit by what you originally paid and multiply by 100.

**In my simulator, this concept will appear as:** a live "+$X" or "−$X" figure shown in green or red next to each stock in the player's portfolio.

---

### 5. What is the difference between a realized and unrealized gain?
An unrealized gain exists only on paper — your stock went up but you still own it, so you haven't actually received that money yet. A realized gain is when you sell the stock and the profit lands in your account for real. This matters because unrealized gains can disappear if the stock falls back down before you sell.

**In my simulator, this concept will appear as:** two separate numbers — "paper gains" (unrealized, shown in gray) and "locked-in gains" (realized, shown in green) — so players can see the difference.

---

### 6. What is risk and how does it relate to reward?
Risk is the chance that your investment could lose value. The general rule of investing is that higher potential reward always comes with higher risk — a startup could 10× your money or go to zero, while a boring government bond barely grows but almost never loses. There's no such thing as high reward with zero risk.

**In my simulator, this concept will appear as:** a "risk meter" on each stock (Low / Medium / High) that also hints at the volatility — high-risk stocks move more wildly each day.

---

### 7. What is compound interest and why is it called "the eighth wonder of the world"?
Compound interest means you earn interest not just on your original money, but on all the interest you've already earned — your gains generate their own gains. This creates a snowball effect over time that seems almost magical: $1,000 invested at 8% annually becomes over $10,000 in 30 years without adding a single dollar. Einstein reportedly called it "the eighth wonder of the world" because of how dramatically it rewards patience.

**In my simulator, this concept will appear as:** a "hold for years" time-skip feature that shows players what their portfolio could look like in 10, 20, or 30 years with compounding returns.

---

### 8. What is a stock market index (like the S&P 500)?
A stock market index is a single number that tracks the average performance of a selected group of stocks — the S&P 500 tracks 500 of the largest U.S. companies. It's like a report card for the whole economy. When people say "the market went up today," they usually mean an index like the S&P 500 or Dow Jones rose.

**In my simulator, this concept will appear as:** a "Market Mood" ticker at the top of the screen showing whether the simulated index is up or down today, affecting all stocks slightly.

---

## Part 2 — Real Stocks (Teen-Familiar Companies)
*Prices as of May 3, 2026*

| Ticker | Company | Price | Exchange | Notes |
|--------|---------|-------|----------|-------|
| AAPL | Apple | ~$280 | NASDAQ | Makes iPhone, Mac, AirPods. Just reported record earnings + $100B buyback. |
| TSLA | Tesla | ~$391 | NASDAQ | Electric cars + robotics. High volatility — great high-risk example. |
| DIS | Disney | ~$103 | NYSE | Parks, Marvel, Star Wars, Disney+. Down from $197 all-time high. |
| NKE | Nike | ~$44 | NYSE | Sneakers, Jordan, Converse. Down ~75% from all-time high. |
| NVDA | NVIDIA | ~$198 | NASDAQ | Makes AI chips. Hugely popular in tech-aware teen circles. |
| AMZN | Amazon | ~$268 | NASDAQ | Shopping, Prime Video, AWS. Used daily by virtually every teen. |

### Teaching moments from current data
- **Apple** recently hit ~$280 after reporting record quarterly results — perfect "good news → price up" example.
- **Nike** has fallen about 75% from its all-time high — a powerful real-world illustration of risk and loss.
- **Disney** peaked around $197 and now trades at ~$103 — shows that even famous brands can lose half their value.

---

## Part 3 — Expanded Asset Universe
*Beyond stocks — commodities, metals, agriculture, water, and crypto*
*Prices as of May 3, 2026*

---

### Energy Commodities

#### Crude Oil (WTI) — ~$101/barrel
WTI (West Texas Intermediate) is the US benchmark for crude oil. Prices have surged ~60% since the Strait of Hormuz closure disrupted global supply in early 2026 — a live lesson in geopolitics moving markets.

**In my simulator, this concept will appear as:** a "Global Event" card (e.g., "Oil supply cut — prices spike") that raises oil-related stocks and transport company prices.

#### Brent Crude — ~$108/barrel
The global benchmark for oil, tracking supply from Europe, Africa, and the Middle East. Usually a few dollars higher than WTI. When you see "oil price" in the news, it's usually Brent being quoted.

**In my simulator, this concept will appear as:** shown alongside WTI as a "world price" stat card, teaching that the same commodity can have multiple benchmarks.

#### Gasoline (Pump Price) — ~$4.50–$6+/gallon
Not directly traded on an exchange, but directly felt by teens every time someone fills a tank. California has crossed $6/gallon. Moves with crude oil but also includes refining costs, taxes, and station markups.

**In my simulator, this concept will appear as:** a daily "gas price ticker" that visually connects crude oil futures to real-world pump prices — showing why commodities matter to everyday life.

---

### Precious Metals

#### Gold (XAU) — ~$4,614/troy oz
Up ~$1,351 from a year ago. Gold hits record highs when people are scared about war, inflation, or economic collapse. It's called a "safe-haven asset" because investors flee to it in a crisis. From 1971–2024, gold averaged 7.9% annual returns vs. the stock market's 10.7%.

**In my simulator, this concept will appear as:** when a "Market Crash" event fires, gold automatically rises 8–12% while stocks fall — showing the flight-to-safety effect.

#### Silver (XAG) — ~$75/troy oz
Up $42 in a year. Silver is both a precious metal (store of value like gold) AND an industrial metal used in solar panels, phones, and medical devices. That dual demand makes it more volatile than gold but also more interesting.

**In my simulator, this concept will appear as:** a "dual demand" tag — its price reacts to both fear events (like gold) and tech boom events (like NVIDIA), teaching mixed-asset behavior.

---

### Agricultural Commodities

#### Wheat (ZW) — ~$6.50/bushel
At an 11-month high due to severe drought across the US Great Plains. About 90% of Nebraska and Oklahoma are drought-affected. Classic supply and demand: less crop → higher price. Up 23% in the past 12 months.

**In my simulator, this concept will appear as:** a "drought" weather event card that pushes wheat and corn prices up 10–15%, while bread and food company stocks rise too.

#### Corn (ZC) — ~$4.80/bushel
Goes into food, animal feed, ethanol fuel, and plastics. When oil prices rise, corn demand for ethanol rises too — showing how different commodities can be surprisingly connected in a chain reaction.

**In my simulator, this concept will appear as:** a "commodity chain" mechanic — rising oil triggers rising corn (ethanol demand), which then raises food company costs. Players see the ripple effect.

---

### Water (Utility Stock)

#### American Water Works (AWK) — ~$133/share
The largest investor-owned water utility in the US, serving 3.6 million customers in 14 states. You can't buy "a gallon of water" on the stock market — but you can own the company that sells it. Steady, boring, and resilient. It IPO'd at $21.50 in 2008.

**In my simulator, this concept will appear as:** the lowest-volatility stock in the game — barely moves day-to-day, teaching players that boring utility stocks are a valid low-risk strategy.

> **Why this is powerful for a simulator:** water is the one resource everyone needs, making it the ultimate "essential commodity" lesson. Players who panic-sell everything else will wish they held AWK.

---

### Crypto (Bonus Asset Class)

#### Bitcoin (BTC) — ~$79,000/coin
The most recognized digital asset. Not a stock or commodity in the traditional sense, but now widely traded. Extremely volatile — can move 10% in a single day. Teens are very aware of it, making it an excellent risk/reward teaching tool.

**In my simulator, this concept will appear as:** the highest-volatility asset, labeled "Extreme Risk" — players who put everything in Bitcoin might triple their money or lose 60% in one simulated week.

---

## Quick Reference — What Moves Each Asset?

| Asset | Main Price Driver | Risk Level |
|-------|------------------|------------|
| Gold | Fear / inflation / crisis | Low–Medium |
| Silver | Fear + industrial demand | Medium |
| Crude Oil | Geopolitics / supply shocks | High |
| Wheat / Corn | Weather / drought / demand | Medium |
| Water utility (AWK) | Interest rates / regulation | Low |
| Tech stocks (AAPL, NVDA) | Earnings / innovation | Medium–High |
| Tesla / crypto | Sentiment / speculation | High–Extreme |
| Bitcoin | Speculation / macro sentiment | Extreme |

---

## Key Formulas

```
Gain/Loss ($) = (Current Price − Purchase Price) × Number of Shares

Gain/Loss (%) = (Profit ÷ Amount Invested) × 100

Compound Interest = Principal × (1 + Rate)^Years
Example: $1,000 × (1.08)^30 = $10,062
```

---

*Research compiled using live market data and AI-assisted research, May 3, 2026.*
*Prices are approximate and for educational/simulator use only — not financial advice.*
# Challenge 2 & 3 — API Research, Evaluation, and Empathy Mapping
> Stock Market Simulator Project · May 3, 2026

---

# Challenge 2: API Research and Evaluation

## API 1 — Alpha Vantage

**URL:** https://www.alphavantage.co

Alpha Vantage is a NASDAQ-licensed financial data provider, originally backed by Y Combinator. It's the most popular free financial API and covers a remarkably wide range of data — stocks, forex, crypto, commodities, and 50+ technical indicators — all in one place.

**Free tier:** Yes — 25 API requests per day (no credit card required). Also limited to 5 requests per minute.

**Data provided:**
- Real-time and historical stock prices (daily, weekly, monthly, intraday)
- 50+ pre-computed technical indicators (SMA, EMA, RSI, MACD, etc.)
- Fundamental data (earnings, balance sheets, income statements)
- Forex and cryptocurrency data
- Commodities and economic indicators
- Company overview data (sector, market cap, P/E ratio, etc.)
- Global market news + AI-powered sentiment scores

**Authentication:** API key required. Sign up at alphavantage.co — key is issued instantly with a valid email. No credit card needed for the free tier.

**Rate limits:**
- Free: 25 requests/day, 5 requests/minute
- Standard ($49.99/mo): 75 requests/minute, no daily cap
- Premium ($99.99/mo): 150 requests/minute
- Enterprise ($249.99/mo): 1,200 requests/minute

**Data format:** JSON (default) or CSV. Clean, well-structured response.

**Sample response — Global Quote (e.g. AAPL):**
```json
{
  "Global Quote": {
    "01. symbol": "AAPL",
    "02. open": "278.50",
    "03. high": "283.10",
    "04. low": "277.20",
    "05. price": "280.07",
    "06. volume": "79920000",
    "07. latest trading day": "2026-05-02",
    "08. previous close": "271.23",
    "09. change": "8.84",
    "10. change percent": "3.2600%"
  }
}
```

**Documentation quality:** Excellent. Clear endpoint descriptions, parameter explanations, and code examples in multiple languages. A huge open-source community has built 1,000+ libraries across 20+ languages. Very beginner-friendly.

**Best for:** Learning, prototyping, and projects that need breadth of data (stocks + crypto + fundamentals + indicators all in one API).

**Main limitation:** 25 requests/day on the free tier is extremely tight for a real app. For a simulator with 10 stocks, you'd burn through your daily quota just fetching prices once.

---

## API 2 — Finnhub

**URL:** https://finnhub.io

Finnhub was built by ex-engineers from Google, Bloomberg, and Tradeweb. It has the most generous free tier in terms of calls-per-minute (60/min) and is one of the only free APIs that includes WebSocket streaming for real-time data. It also offers unique "alternative data" like congressional trading records, ESG scores, and earnings call transcripts.

**Free tier:** Yes — 60 API requests per minute (no daily cap). Includes real-time US stock quotes, basic company fundamentals, news, and SEC filings. Free WebSocket streaming limited to 50 symbols.

**Data provided:**
- Real-time US stock prices (and 60+ global exchanges on paid plans)
- Historical OHLCV candle data (up to 1 year on free tier)
- Company profiles, financial statements, key metrics
- Earnings calendar, earnings surprises
- Market news + company-specific news feed
- Alternative data: insider sentiment, congressional trading, lobbying data, ESG scores
- Cryptocurrency and forex data
- SEC filings (10-K, 10-Q, 8-K)
- WebSocket feed for real-time tick data (free: 50 symbols, paid: unlimited)

**Authentication:** API key required. Sign up at finnhub.io — free key issued instantly. Add `?token=YOUR_KEY` to every request URL.

**Rate limits:**
- Free: 60 requests/minute (most generous free tier in the market)
- Premium: $11.99–$99.99/month depending on data needed

**Data format:** JSON. Clean and consistent.

**Sample response — Real-time Quote:**
```json
{
  "c": 280.07,
  "d": 8.84,
  "dp": 3.26,
  "h": 287.21,
  "l": 271.35,
  "o": 271.88,
  "pc": 271.23,
  "t": 1746316800
}
```
*(c = current price, d = change, dp = change %, h = high, l = low, o = open, pc = previous close, t = timestamp)*

**Sample response — Company Profile:**
```json
{
  "country": "US",
  "currency": "USD",
  "exchange": "NASDAQ NMS - GLOBAL MARKET",
  "finnhubIndustry": "Technology",
  "ipo": "1980-12-12",
  "logo": "https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png",
  "marketCapitalization": 4283000,
  "name": "Apple Inc",
  "phone": "14089961010",
  "shareOutstanding": 15204.14,
  "ticker": "AAPL",
  "weburl": "https://www.apple.com/"
}
```

**Documentation quality:** Very good. Clear endpoint list, code examples in Python, JavaScript, and Go. Python library (`pip install finnhub-python`) makes it especially easy for beginners.

**Best for:** Projects that need real-time data, news feeds, and company fundamentals on the free tier. The 60 requests/minute limit is realistic for a live simulator.

**Main limitation:** Historical data limited to 1 year per call on the free tier. Some international exchanges and deeper fundamentals require a paid plan.

---

## API 3 — Twelve Data

**URL:** https://twelvedata.com

Twelve Data is the newest of the three and was built specifically to be developer-friendly and reliable. It has by far the most generous free tier in terms of daily volume (800 requests/day) and covers 50+ global exchanges with 130+ server-side technical indicators. Students and non-profits get a 20% discount on paid plans.

**Free tier:** Yes — 800 API requests per day, 8 requests per minute. Covers US stocks, forex, and crypto with real-time data (note: some sources report a short delay on free tier). No credit card required.

**Data provided:**
- Real-time and historical stock prices (stocks, ETFs, indices, funds)
- 130+ pre-computed technical indicators
- Earnings data and earnings calendar
- Forex (currency pairs) and cryptocurrency
- Commodities data
- Company fundamentals (on paid plans)
- WebSocket streaming (on paid plans from $79/month)
- Official SDKs for Python, JavaScript, Go, and PHP

**Authentication:** API key required. Free signup at twelvedata.com. Simple — add `apikey=YOUR_KEY` to request URLs.

**Rate limits:**
- Free: 800 requests/day, 8 requests/minute
- Grow ($29/mo): 55+ requests/minute, no daily limit
- Pro ($99/mo): 610+ requests/minute
- Ultra ($329/mo): 2,584+ requests/minute, 99.95% SLA
- Non-profits: free access to all plans
- Students/startups: 20% discount

**Data format:** JSON. Consistent and clean across all endpoints.

**Sample response — Time Series (daily prices):**
```json
{
  "meta": {
    "symbol": "AAPL",
    "interval": "1day",
    "currency": "USD",
    "exchange_timezone": "America/New_York",
    "exchange": "NASDAQ",
    "type": "Common Stock"
  },
  "values": [
    {
      "datetime": "2026-05-02",
      "open": "271.88000",
      "high": "287.21000",
      "low": "271.35000",
      "close": "280.07000",
      "volume": "79920000"
    },
    {
      "datetime": "2026-05-01",
      "open": "268.50000",
      "high": "272.10000",
      "low": "265.30000",
      "close": "271.23000",
      "volume": "58320000"
    }
  ],
  "status": "ok"
}
```

**Documentation quality:** Excellent. Every endpoint shows a sample request URL, a full sample response, and parameter descriptions. The interactive API playground on their site lets you test calls in your browser before writing any code. Official SDKs are well-documented and actively maintained.

**Best for:** Student projects, simulators, and anything that needs a lot of daily requests without paying. Best daily volume on the free tier, excellent documentation, and the most reliable uptime (99.95% SLA on paid plans).

**Main limitation:** 8 requests/minute is the tightest per-minute rate of the three. Historical fundamentals (balance sheets, income statements) are locked behind paid plans.

---

## Comparison Table

| Feature | Alpha Vantage | Finnhub | Twelve Data |
|---|---|---|---|
| **URL** | alphavantage.co | finnhub.io | twelvedata.com |
| **Free tier** | Yes | Yes | Yes |
| **Free daily limit** | 25 req/day | No daily cap | 800 req/day |
| **Free per-minute limit** | 5 req/min | 60 req/min | 8 req/min |
| **Real-time data (free)** | Delayed / limited | Yes (US stocks) | Yes (with short delay) |
| **Historical data (free)** | 20+ years | Up to 1 year | Full history (daily+) |
| **Technical indicators** | 50+ (free) | Limited (free) | 130+ (free) |
| **Company fundamentals** | Yes (free) | Basic (free) | Paid only |
| **News feed** | Yes (AI sentiment) | Yes (free) | No |
| **Crypto & Forex** | Yes | Yes | Yes |
| **WebSocket streaming** | No | Free (50 symbols) | Paid only |
| **Authentication** | API key (instant) | API key (instant) | API key (instant) |
| **Official SDKs** | Community (1000+) | Python official | Python, JS, Go, PHP |
| **Data format** | JSON or CSV | JSON | JSON |
| **Paid plans start at** | $49.99/mo | $11.99/mo | $29/mo |
| **Student discount** | No | No | 20% off |
| **Ease of setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Documentation quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Best for** | Breadth of data, learning | Real-time + news | High free volume + reliability |

---

## Recommendation

**Finnhub is the most promising API for this project.** Its free tier allows 60 requests per minute with no daily cap, meaning a simulator tracking 10–20 stocks in real time can fetch live prices without hitting a wall. The response format is clean and beginner-friendly, real-time US quotes are included at no cost, and the company news feed adds an excellent "why did the price move?" feature that directly supports the educational goals of the simulator.

That said, **Twelve Data should be used as a backup or companion** — its 800 requests/day free tier is the most generous for fetching historical chart data, which is needed to show players a stock's price history. A combined approach (Finnhub for live prices + news, Twelve Data for historical charts) would give the simulator everything it needs without any cost.

---

---

# Challenge 3: Target Users and Empathy Mapping

## Primary Target User

After reviewing the three target user groups, the primary target user for this simulator is:

> **Group 2 — The Curious but Clueless Teen**
> Someone who has heard of the stock market (maybe from a parent, TikTok, or news) and is vaguely curious, but has zero practical knowledge and finds it intimidating.

This group is the largest, most underserved, and most likely to actually learn something — they're not already investing (like Group 3), and they're not totally disengaged (like Group 1 at their most resistant).

---

## Detailed User Profile

**Name:** Jordan M.
**Age:** 16
**Context:** Sophomore at a public high school in suburban New Jersey. Lives with both parents — one works in logistics, one is a nurse. The family isn't poor, but money is talked about cautiously at home. Jordan has a part-time job at a smoothie place on weekends, earns about $80–100/week, and spends most of it on food, clothes, and Spotify.

**Current financial knowledge:**
- Knows that banks exist and that you can save money
- Has heard of Bitcoin and thinks it made some people rich
- Knows Apple and Tesla are "big stocks" but has no idea what a share costs or how to buy one
- Has never heard the terms "portfolio," "diversification," or "realized gain"
- Does not know what a stock market index is
- Thinks you need a lot of money to invest ("like $10,000 minimum, right?")

**Motivation for using the simulator:**
Jordan saw a TikTok about a teenager who made money on stocks and thought "wait, can I actually do that?" There's genuine curiosity, but also skepticism — Jordan assumes it's complicated, probably for rich adults, and probably risky enough to lose everything. A no-risk game format removes the fear barrier entirely.

**Barriers:**
- Thinks investing is for older, wealthier people
- Afraid of looking dumb in front of peers
- Attention span is short — will close the app if it feels like homework
- Doesn't see the connection between investing and their actual life right now
- Slightly intimidated by numbers and financial vocabulary

---

## Empathy Map

```
┌───────────────────────────────────┬───────────────────────────────────┐
│             THINKS                │              FEELS                │
│                                   │                                   │
│ "Investing is for rich adults,    │ Curious but intimidated — like    │
│  not for someone like me."        │ walking into a store where        │
│                                   │ everything has no price tag.      │
│ "You need a lot of money to       │                                   │
│  start — like thousands."         │ Slightly embarrassed that they    │
│                                   │ don't know things that seem like  │
│ "Crypto is probably the way       │ they should be obvious.           │
│  to go — stocks are slow."        │                                   │
│                                   │ Low confidence about money in     │
│ "If I invest, I'll probably       │ general — doesn't feel like a     │
│  just lose it all."               │ "money person."                   │
│                                   │                                   │
│ "The stock market is something    │ Excited by the idea of making     │
│  that crashes and wrecks the      │ money, but scared it's too good   │
│  economy."                        │ to be true.                       │
│                                   │                                   │
│ "Only people who study finance    │ Relieved when something makes     │
│  or math can understand this."    │ sense — "oh wait, that's          │
│                                   │ actually not that hard."          │
├───────────────────────────────────┼───────────────────────────────────┤
│              SAYS                 │               DOES                │
│                                   │                                   │
│ "I heard Bitcoin made people      │ Spends money as soon as they      │
│  millionaires."                   │ earn it — rarely saves.           │
│                                   │                                   │
│ "My parents don't really talk     │ Scrolls TikTok and YouTube for    │
│  about money."                    │ "how to make money" content but   │
│                                   │ doesn't act on any of it.         │
│ "I don't have enough money        │                                   │
│  to invest anyway."               │ Checks phone constantly — average │
│                                   │ attention span on any one app     │
│ "Is this like gambling?"          │ is 3–5 minutes before switching.  │
│                                   │                                   │
│ "My cousin did something with     │ Buys things impulsively (a $7     │
│  stocks and made some money."     │ drink, a $25 shirt) without       │
│                                   │ thinking twice.                   │
│ "I'll think about investing       │                                   │
│  when I'm older and have a        │ Has $200–400 in a savings account │
│  real job."                       │ that they haven't touched in a    │
│                                   │ year, don't know why.             │
└───────────────────────────────────┴───────────────────────────────────┘
```

---

## Three Design Implications

### 1. The simulator must feel like a game, not a class.
Jordan thinks investing is boring and "not for them." If the simulator opens with a wall of text, definitions, or anything that feels like a quiz, they will close it within 30 seconds. **Design implication:** Use game mechanics — fake money, a score, a leaderboard, daily challenges, and satisfying animations when a stock price moves. The word "simulator" should almost be hidden. Call it something like "Market Game" or "Trade Wars." The learning has to happen through play, not instruction.

### 2. The simulator must demolish the "you need a lot of money" myth immediately.
Jordan genuinely believes you can't start investing without thousands of dollars. This is a foundational misconception that, if left uncorrected, makes the whole exercise feel irrelevant. **Design implication:** Start every player with exactly $1,000 in fake money — an amount that feels real but achievable. Show fractional shares (e.g., "You can buy 0.003 shares of Amazon for $1"). On the first screen, make it visible that real investors start small. One small callout like "In real life, you can start investing with $1" changes everything.

### 3. The simulator must show consequences at Jordan's speed, not the market's speed.
The real stock market is slow — it rewards patience over months and years. Jordan has a 3-minute attention span and spends money the moment they earn it. A simulator that plays out in "real time" (weeks of daily price changes) will lose Jordan before any lesson lands. **Design implication:** Compress time — each "day" in the simulator should take 5–10 seconds. Offer a "skip to next week" or "fast forward 1 year" button. Show the contrast between patient long-term holding vs. panic-selling in minutes of play, not months. Jordan needs to *feel* the difference between impulse decisions and patient ones within a single session.

---

*Research and empathy mapping compiled May 3, 2026 for stock market simulator project.*