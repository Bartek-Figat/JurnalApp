export interface TradeMetric {
  investmentReturn: number;
  expenseRatio: number;
  savingsRate: number;
  ROI: number;
  breakEvenPercentage: number;
  riskRewardRatio: number;
  netProfit: number;
  winPercentage: number;
  transactionCosts: number;
}

export interface WinLossByTradeType {
  tradeType: string;
  winPercentage: number;
  lossPercentage: number;
  totalTrades: number;
  wins: number;
  losses: number;
}

export interface TotalGain {
  symbol: string;
  exitPrice: number;
  gainPercentage: number;
}

export interface PnLByType {
  tradeType: string;
  winPercentage: number;
  lossPercentage: number;
}

export interface TransactionByTime {
  entryDate: string;
  exitDate: string;
  symbol: string;
  transactionCount: number;
}

export interface FullTradeMetrics {
  metrics: TradeMetric;
  winLossByTradeType: WinLossByTradeType[];
  totalGains: TotalGain[];
  pnl: PnLByType[];
  transactionsByTime: TransactionByTime[];
}
