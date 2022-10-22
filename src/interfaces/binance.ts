export interface FuturesBalance {
  accountAlias: string;
  asset: boolean;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export interface FuturesBalanceFiltered {
  short: {
    balance: number;
    pnl: number;
  };
  long: {
    balance: number;
    pnl: number;
  };
}

export interface Positions {
  positions: Position[];
}

interface Position {
  symbol: string;
  initialMargin: string;
  maintMargin: string;
  unrealizedProfit: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  leverage: string;
  isolated: boolean;
  entryPrice: string;
  maxNotional: string;
  positionSide: string;
  positionAmt: string;
  notional: string;
  isolatedWallet: string;
  updateTime: number;
  bidNotional: string;
  askNotional: string;
}

export interface PositionsFiltered {
  short: PositionModified[],
  long: PositionModified[],
}

interface PositionModified {
   symbol: string; pnl: number; qty: number; notional: number;
}
