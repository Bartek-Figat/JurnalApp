import { Database } from "../../db/dbConnect";

interface ForexPairAnalysis {
  currencyPair: string;
  tradeOutcome: string;
  totalTrades: number;
  totalUnits: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  avgExchangeRate: number;
  totalFees: number;
  avgRiskRewardRatio: number;
  totalMarginRequired: number;
  totalMarginAvailable: number;
}

interface ExchangeRateAnalysis {
  currencyPair: string;
  avgExchangeRate: number;
  avgPriceChange: number;
  avgPriceChangePercentage: number;
  totalVolume: number;
  totalProfitLoss: number;
}

interface TradeDurationAnalysis {
  currencyPair: string;
  avgTradeDurationHours: number;
  totalTrades: number;
  avgProfitLoss: number;
}

interface WinRateAnalysis {
  currencyPair: string;
  totalTrades: number;
  winningTrades: number;
  winRatePercentage: number;
  avgWinProfit: number;
}

interface LossRateAnalysis {
  currencyPair: string;
  totalTrades: number;
  losingTrades: number;
  lossRatePercentage: number;
  avgLossAmount: number | null;
}

interface TradeSizeAnalysis {
  asset: string;
  sizeCategory: "small" | "medium" | "large" | "very large";
  count: number;
  totalValue: number;
  avgProfitLoss: number;
}

interface AllForexAnalyses {
  forexPairAnalysis: ForexPairAnalysis[];
  exchangeRateAnalysis: ExchangeRateAnalysis[];
  tradeDurationAnalysis: TradeDurationAnalysis[];
  winRateAnalysis: WinRateAnalysis[];
  lossRateAnalysis: LossRateAnalysis[];
  analyzeTradeSize: TradeSizeAnalysis[];
  bestTradingDayPerformance: Record<
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday",
    { profit: number; performance: number }
  >;
}

interface DecodedUser {
  userId: string;
}

interface RequestWithUser {
  user?: {
    decoded?: DecodedUser;
  };
}

export class ForexTradeAnalysis {
  private readonly trades: string = "trades";
  private readonly forex: string = "forex";
  private db = new Database().getCollection(this.trades);

  /**
   * Extracts the user ID from the request object.
   * @param req - The request object containing user data.
   * @returns The user ID.
   * @throws Error if the user ID is not found.
   */
  private getUserId(req: RequestWithUser): string {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    if (!userId) throw new Error("User ID is required");
    return userId;
  }

  /**
   * Analyzes forex pairs based on trade data.
   * @param req - The request object containing the user and trade data.
   * @returns A list of forex pair analysis results.
   */
  async analyzeForexPairs(req: RequestWithUser): Promise<ForexPairAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      { $match: { authorId: userId, tradeType: this.forex } },
      {
        $group: {
          _id: {
            currencyPair: "$currencyPair",
            tradeOutcome: "$tradeOutcome",
          },
          totalTrades: { $sum: 1 },
          totalUnits: { $sum: "$units" },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          avgExchangeRate: { $avg: "$usdExchangeRate" },
          totalFees: { $sum: "$fees" },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalMarginRequired: { $sum: "$marginRequired" },
          totalMarginAvailable: { $sum: "$marginAvailable" },
        },
      },
      {
        $project: {
          currencyPair: "$_id.currencyPair",
          tradeOutcome: "$_id.tradeOutcome",
          totalTrades: 1,
          totalUnits: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgExchangeRate: { $round: ["$avgExchangeRate", 2] },
          totalFees: { $round: ["$totalFees", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalMarginRequired: { $round: ["$totalMarginRequired", 2] },
          totalMarginAvailable: { $round: ["$totalMarginAvailable", 2] },
        },
      },
      { $sort: { totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<ForexPairAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes exchange rates based on trade data.
   * @param req - The request object containing the user and trade data.
   * @returns A list of exchange rate analysis results.
   */
  async analyzeExchangeRates(
    req: RequestWithUser
  ): Promise<ExchangeRateAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      { $match: { authorId: userId, tradeType: this.forex } },
      {
        $project: {
          currencyPair: "$symbol", // Change currencyPair to symbol for consistency
          entryPrice: 1,
          exitPrice: 1,
          units: 1,
          usdExchangeRate: 1,
          profitLoss: 1,
          priceChange: { $subtract: ["$exitPrice", "$entryPrice"] }, // Calculate price change
          priceChangePercentage: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$exitPrice", "$entryPrice"] },
                  "$entryPrice",
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$currencyPair", // Group by the currency pair
          avgExchangeRate: { $avg: "$usdExchangeRate" }, // Calculate average USD exchange rate
          avgPriceChange: { $avg: "$priceChange" }, // Calculate average price change
          avgPriceChangePercentage: { $avg: "$priceChangePercentage" }, // Calculate average price change percentage
          totalVolume: { $sum: { $multiply: ["$units", "$exitPrice"] } }, // Total volume
          totalProfitLoss: { $sum: "$profitLoss" }, // Total profit/loss
        },
      },
      {
        $project: {
          currencyPair: "$_id", // Output the currency pair
          avgExchangeRate: { $round: ["$avgExchangeRate", 2] }, // Round to 2 decimal places
          avgPriceChange: { $round: ["$avgPriceChange", 2] }, // Round to 2 decimal places
          avgPriceChangePercentage: {
            $round: ["$avgPriceChangePercentage", 2],
          }, // Round to 2 decimal places
          totalVolume: { $round: ["$totalVolume", 2] }, // Round to 2 decimal places
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] }, // Round to 2 decimal places
        },
      },
    ];

    return await this.db.aggregate<ExchangeRateAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes trade durations based on trade data.
   * @param req - The request object containing the user and trade data.
   * @returns A list of trade duration analysis results.
   */
  async analyzeTradeDuration(
    req: RequestWithUser
  ): Promise<TradeDurationAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      { $match: { authorId: userId, tradeType: this.forex } },
      {
        $project: {
          currencyPair: "$symbol", // Ensure consistency with symbol instead of currencyPair
          profitLoss: 1,
          tradeDurationHours: {
            $divide: [
              {
                $subtract: [
                  { $toDate: "$exitDate" }, // Convert exitDate to Date
                  { $toDate: "$entryDate" }, // Convert entryDate to Date
                ],
              },
              1000 * 60 * 60, // Convert milliseconds to hours
            ],
          },
        },
      },
      {
        $group: {
          _id: "$currencyPair", // Group by currency pair
          avgTradeDurationHours: { $avg: "$tradeDurationHours" }, // Calculate average trade duration
          totalTrades: { $sum: 1 }, // Count the total number of trades
          avgProfitLoss: { $avg: "$profitLoss" }, // Calculate average profit/loss per trade
        },
      },
      {
        $project: {
          currencyPair: "$_id", // Project the currency pair as the output
          avgTradeDurationHours: { $round: ["$avgTradeDurationHours", 2] }, // Round average duration to 2 decimal places
          totalTrades: 1, // Include total trades in the output
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] }, // Round average profit/loss to 2 decimal places
        },
      },
    ];

    return await this.db.aggregate<TradeDurationAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes win rates based on trade data.
   * @param req - The request object containing the user and trade data.
   * @returns A list of win rate analysis results.
   */
  async analyzeWinRate(req: RequestWithUser): Promise<WinRateAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.forex,
          symbol: { $ne: null },
        },
      },
      {
        $project: {
          symbol: 1,
          isWin: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] },
          profitLoss: 1,
        },
      },
      {
        $group: {
          _id: "$symbol",
          totalTrades: { $sum: 1 },
          winningTrades: { $sum: "$isWin" },
          avgWinProfit: {
            $avg: {
              $cond: [{ $gt: ["$profitLoss", 0] }, "$profitLoss", null],
            },
          },
        },
      },
      {
        $addFields: {
          winRatePercentage: {
            $multiply: [{ $divide: ["$winningTrades", "$totalTrades"] }, 100],
          },
        },
      },
      {
        $project: {
          currencyPair: "$_id",
          totalTrades: 1,
          winningTrades: 1,
          winRatePercentage: { $round: ["$winRatePercentage", 2] },
          avgWinProfit: { $round: ["$avgWinProfit", 2] },
        },
      },
    ];

    return this.db.aggregate<WinRateAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes loss rates based on trade data.
   * @param req - The request object containing the user and trade data.
   * @returns A list of loss rate analysis results.
   */
  async analyzeLossRate(req: RequestWithUser): Promise<LossRateAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.forex,
          symbol: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$symbol",
          totalTrades: { $sum: 1 },
          losingTrades: {
            $sum: { $cond: [{ $lt: ["$profitLoss", 0] }, 1, 0] },
          },
          avgLossAmount: {
            $avg: {
              $cond: [{ $lt: ["$profitLoss", 0] }, "$profitLoss", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          currencyPair: "$_id",
          totalTrades: 1,
          losingTrades: 1,
          lossRatePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$losingTrades", "$totalTrades"] },
                  100,
                ],
              },
              2,
            ],
          },
          avgLossAmount: {
            $cond: {
              if: { $eq: ["$avgLossAmount", null] },
              then: null,
              else: { $round: ["$avgLossAmount", 2] },
            },
          },
        },
      },
    ];

    return this.db.aggregate<LossRateAnalysis>(pipeline).toArray();
  }

  async analyzeTradeSize(req: RequestWithUser): Promise<TradeSizeAnalysis[]> {
    const userId = this.getUserId(req);

    // Define the thresholds for trade size categories
    const sizeThresholds = {
      small: 1000,
      medium: 5000,
      large: 10000,
    };

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.forex } },
      {
        $project: {
          currencyPair: "$symbol", // Ensure consistency with the symbol field
          units: 1,
          profitLoss: 1,
          exitPrice: 1,
          sizeCategory: {
            $switch: {
              branches: [
                {
                  case: { $lte: ["$units", sizeThresholds.small] },
                  then: "small",
                },
                {
                  case: { $lte: ["$units", sizeThresholds.medium] },
                  then: "medium",
                },
                {
                  case: { $lte: ["$units", sizeThresholds.large] },
                  then: "large",
                },
              ],
              default: "very large", // Any units greater than large will be considered very large
            },
          },
        },
      },
      {
        $group: {
          _id: "$sizeCategory", // Group by size category
          count: { $sum: 1 }, // Count the number of trades in each category
          totalValue: { $sum: { $multiply: ["$units", "$exitPrice"] } }, // Total value (units * exitPrice)
          avgProfitLoss: { $avg: "$profitLoss" }, // Average profit/loss
        },
      },
      {
        $project: {
          asset: "$_id", // Rename _id to asset (size category)
          sizeCategory: 1,
          count: 1,
          totalValue: { $round: ["$totalValue", 2] }, // Round total value to 2 decimal places
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] }, // Round average profit/loss to 2 decimal places
        },
      },
      { $sort: { count: -1 } }, // Optionally sort by count in descending order
    ];

    // Execute aggregation pipeline and return the result
    return await this.db.aggregate<TradeSizeAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes Forex trading performance per day of the week and returns profit and performance scaled to 100.
   * @param req - The request object containing user information.
   * @returns An object mapping each day to profit and normalized performance.
   */
  async analyzeBestTradingDay(
    req: RequestWithUser
  ): Promise<
    Record<
      | "Sunday"
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday",
      { profit: number; performance: number }
    >
  > {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.forex,
        },
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: { $toDate: "$entryDate" } },
          profitLoss: 1,
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          totalProfitLoss: { $sum: "$profitLoss" },
        },
      },
      {
        $project: {
          _id: 0,
          dayOfWeek: "$_id",
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
        },
      },
    ];

    const results = await this.db.aggregate(pipeline).toArray();

    const defaultResult = {
      Sunday: { profit: 0, performance: 0 },
      Monday: { profit: 0, performance: 0 },
      Tuesday: { profit: 0, performance: 0 },
      Wednesday: { profit: 0, performance: 0 },
      Thursday: { profit: 0, performance: 0 },
      Friday: { profit: 0, performance: 0 },
      Saturday: { profit: 0, performance: 0 },
    };

    const dayMap: Record<number, keyof typeof defaultResult> = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    for (const result of results) {
      const day = dayMap[result.dayOfWeek];
      if (day) {
        defaultResult[day].profit = result.totalProfitLoss;
      }
    }

    const maxProfit = Math.max(
      ...Object.values(defaultResult).map((d) => d.profit)
    );

    for (const day in defaultResult) {
      const profit = defaultResult[day as keyof typeof defaultResult].profit;
      defaultResult[day as keyof typeof defaultResult].performance =
        maxProfit !== 0
          ? parseFloat(((profit / maxProfit) * 100).toFixed(2))
          : 0;
    }

    return defaultResult;
  }

  /**
   * Retrieves all forex analyses including pair analysis, exchange rate analysis, trade duration analysis, win rate analysis, and loss rate analysis.
   * @param req - The request object containing the user and trade data.
   * @returns All forex analyses in a structured format.
   */
  async getAllAnalyses(req: RequestWithUser): Promise<AllForexAnalyses> {
    const [
      forexPairAnalysis,
      exchangeRateAnalysis,
      tradeDurationAnalysis,
      winRateAnalysis,
      lossRateAnalysis,
      analyzeTradeSize,
      bestTradingDayPerformance,
    ] = await Promise.all([
      this.analyzeForexPairs(req),
      this.analyzeExchangeRates(req),
      this.analyzeTradeDuration(req),
      this.analyzeWinRate(req),
      this.analyzeLossRate(req),
      this.analyzeTradeSize(req),
      this.analyzeBestTradingDay(req),
    ]);

    return {
      forexPairAnalysis,
      exchangeRateAnalysis,
      tradeDurationAnalysis,
      winRateAnalysis,
      lossRateAnalysis,
      analyzeTradeSize,
      bestTradingDayPerformance,
    };
  }
}
