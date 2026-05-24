'use client';

export type OrderType = 'market' | 'limit' | 'stop';
export type OrderSide = 'buy' | 'sell';

export interface Position {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector: string;
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  shares: number;
  limitPrice?: number;
  stopPrice?: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: number;
  filledAt?: number;
  filledPrice?: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  shares: number;
  price: number;
  total: number;
  timestamp: number;
}

export interface PortfolioState {
  cash: number;
  positions: Record<string, Position>;
  orders: Order[];
  transactions: Transaction[];
  watchlist: string[];
  xp: number;
  achievements: string[];
}

const DEFAULT_STATE: PortfolioState = {
  cash: 100000,
  positions: {},
  orders: [],
  transactions: [],
  watchlist: ['AAPL', 'NVDA', 'TSLA', 'MSFT'],
  xp: 0,
  achievements: [],
};

const KEY = 'marketsim_portfolio';

export function loadPortfolio(): PortfolioState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function savePortfolio(state: PortfolioState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetPortfolio(): PortfolioState {
  const fresh = { ...DEFAULT_STATE };
  savePortfolio(fresh);
  return fresh;
}

export function getTotalValue(state: PortfolioState): number {
  const positionsValue = Object.values(state.positions).reduce(
    (sum, pos) => sum + pos.shares * pos.currentPrice,
    0
  );
  return state.cash + positionsValue;
}

export function getTotalReturn(state: PortfolioState): number {
  return getTotalValue(state) - 100000;
}

export function getTotalReturnPct(state: PortfolioState): number {
  return (getTotalReturn(state) / 100000) * 100;
}

export function executeBuy(
  state: PortfolioState,
  symbol: string,
  name: string,
  shares: number,
  price: number,
  sector: string
): { success: boolean; state: PortfolioState; error?: string } {
  const total = shares * price;
  if (total > state.cash) {
    return { success: false, state, error: 'Insufficient cash' };
  }

  const existing = state.positions[symbol];
  const newShares = (existing?.shares ?? 0) + shares;
  const newAvgCost = existing
    ? (existing.shares * existing.avgCost + shares * price) / newShares
    : price;

  const newState: PortfolioState = {
    ...state,
    cash: state.cash - total,
    positions: {
      ...state.positions,
      [symbol]: {
        symbol,
        name,
        shares: newShares,
        avgCost: newAvgCost,
        currentPrice: price,
        sector,
      },
    },
    transactions: [
      ...state.transactions,
      {
        id: crypto.randomUUID(),
        symbol,
        name,
        side: 'buy',
        shares,
        price,
        total,
        timestamp: Date.now(),
      },
    ],
    xp: state.xp + 10,
  };

  savePortfolio(newState);
  return { success: true, state: newState };
}

export function executeSell(
  state: PortfolioState,
  symbol: string,
  shares: number,
  price: number
): { success: boolean; state: PortfolioState; error?: string } {
  const pos = state.positions[symbol];
  if (!pos || pos.shares < shares) {
    return { success: false, state, error: 'Insufficient shares' };
  }

  const total = shares * price;
  const newShares = pos.shares - shares;
  const newPositions = { ...state.positions };

  if (newShares === 0) {
    delete newPositions[symbol];
  } else {
    newPositions[symbol] = { ...pos, shares: newShares };
  }

  const newState: PortfolioState = {
    ...state,
    cash: state.cash + total,
    positions: newPositions,
    transactions: [
      ...state.transactions,
      {
        id: crypto.randomUUID(),
        symbol,
        name: pos.name,
        side: 'sell',
        shares,
        price,
        total,
        timestamp: Date.now(),
      },
    ],
    xp: state.xp + 5,
  };

  savePortfolio(newState);
  return { success: true, state: newState };
}
