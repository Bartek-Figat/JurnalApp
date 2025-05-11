export function tradeQueryFilter(filter: {
  tradeType?: string;
  symbol?: string;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  minWinRate?: number;
  maxWinRate?: number;
  minProfitLoss?: number;
  maxProfitLoss?: number;
  tradeOutcome?: string;
}): Record<string, any> {
  const query: Record<string, any> = {};

  if (filter.tradeType) {
    query.tradeType = filter.tradeType;
  }
  if (filter.symbol) query.symbol = filter.symbol;
  if (filter.tradeOutcome) query.tradeOutcome = filter.tradeOutcome;
  if (filter.startDate || filter.endDate) {
    query.createdAt = {};
    if (filter.startDate) query.createdAt.$gte = new Date(filter.startDate);
    if (filter.endDate) query.createdAt.$lte = new Date(filter.endDate);
  }

  const addRangeFilter = (field: string, min?: number, max?: number) => {
    if (min !== undefined || max !== undefined) {
      query[field] = {};
      if (min !== undefined) query[field].$gte = min;
      if (max !== undefined) query[field].$lte = max;
    }
  };

  addRangeFilter("winRate", filter.minWinRate, filter.maxWinRate);
  addRangeFilter("avgProfitLoss", filter.minProfitLoss, filter.maxProfitLoss);

  return query;
}
