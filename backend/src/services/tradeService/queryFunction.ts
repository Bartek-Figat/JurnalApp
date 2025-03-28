export function tradeQueryFilter(filter: {
  tradeType: any;
  symbol: any;
  startDate: string | number | Date;
  endDate: string | number | Date;
  minWinRate: undefined;
  maxWinRate: undefined;
  minProfitLoss: undefined;
  maxProfitLoss: undefined;
}): any {
  const query: any = {};

  // if (filter.userId) query.userId = filter.userId;
  if (filter.tradeType) query.tradeType = filter.tradeType;
  if (filter.symbol) query.symbol = filter.symbol; // Ensure symbol is included
  if (filter.startDate || filter.endDate) {
    query.createdAt = {};
    if (filter.startDate) query.createdAt.$gte = new Date(filter.startDate);
    if (filter.endDate) query.createdAt.$lte = new Date(filter.endDate);
  }

  if (filter.minWinRate !== undefined) {
    query.winRate = { $gte: filter.minWinRate };
  }
  if (filter.maxWinRate !== undefined) {
    query.winRate = { ...query.winRate, $lte: filter.maxWinRate };
  }
  if (filter.minProfitLoss !== undefined) {
    query.avgProfitLoss = { $gte: filter.minProfitLoss };
  }
  if (filter.maxProfitLoss !== undefined) {
    query.avgProfitLoss = {
      ...query.avgProfitLoss,
      $lte: filter.maxProfitLoss,
    };
  }

  return query;
}
