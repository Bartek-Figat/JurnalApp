import { Database } from "../../db/dbConnect";

interface LeveragedCryptoAnalysis {
  asset: string;
  leverage: number;
  positionType: string;
  tradeOutcome: string;
  totalTrades: number;
  totalQuantity: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  totalFees: number;
  avgRiskRewardRatio: number;
  totalMarginRequired: number;
  totalMarginAvailable: number;
}

interface LeverageAnalysis {
  leverageRange: string;
  positionType: string;
  count: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  winRate: number;
  totalVolume: number;
}

interface MarginUtilizationAnalysis {
  asset: string;
  leverage: number;
  marginUtilizationPercentage: number;
  totalMarginRequired: number;
  totalMarginAvailable: number;
  totalTrades: number;
  totalProfitLoss: number;
}

interface RiskMetricsAnalysis {
  asset: string;
  leverage: number;
  winRate: number;
  totalProfitLoss: number;
  maxDrawdown: number;
  avgRiskRewardRatio: number;
  totalVolume: number;
  riskAdjustedReturn: number;
}

interface TimeBasedPerformanceAnalysis {
  month: string;
  totalTrades: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  winRate: number;
  totalVolume: number;
  avgRiskRewardRatio: number;
}

interface AllLeveragedCryptoAnalyses {
  leveragedTrades: LeveragedCryptoAnalysis[];
  leverageDistribution: LeverageAnalysis[];
  marginUtilization: MarginUtilizationAnalysis[];
  riskMetrics: RiskMetricsAnalysis[];
  timePerformance?: TimeBasedPerformanceAnalysis[];
  /** Performance per day of the week, both raw profit and scaled percentage */
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

export class LeveragedCryptoAnalysisClass {
  private readonly trades: string = "trades";
  private readonly crypto: string = "crypto";
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
   * Analyzes leveraged crypto trades by grouping them based on symbol, leverage, position type, and trade outcome.
   * Returns aggregated metrics like total trades, PnL, fees, and margin usage.
   */
  async analyzeLeveragedTrades(
    req: RequestWithUser
  ): Promise<LeveragedCryptoAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      { $match: { authorId: userId, tradeType: this.crypto } },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            leverage: "$leverage",
            positionType: "$positionType",
            tradeOutcome: "$tradeOutcome",
          },
          totalTrades: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          totalFees: { $sum: "$fees" },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalMarginRequired: { $sum: "$marginRequired" },
          totalMarginAvailable: { $sum: "$marginAvailable" },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          leverage: "$_id.leverage",
          positionType: "$_id.positionType",
          tradeOutcome: "$_id.tradeOutcome",
          totalTrades: 1,
          totalQuantity: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          totalFees: { $round: ["$totalFees", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalMarginRequired: { $round: ["$totalMarginRequired", 2] },
          totalMarginAvailable: { $round: ["$totalMarginAvailable", 2] },
        },
      },
      { $sort: { totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<LeveragedCryptoAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes the distribution of leveraged trades by leverage ranges and position types.
   * Calculates total trades, profit/loss, win rate, and volume for each category.
   */
  async analyzeLeverageDistribution(
    req: RequestWithUser
  ): Promise<LeverageAnalysis[]> {
    const userId = this.getUserId(req);
    const pipeline = [
      { $match: { authorId: userId, tradeType: this.crypto } },
      {
        $group: {
          _id: {
            leverageRange: {
              $switch: {
                branches: [
                  { case: { $lte: ["$leverage", 10] }, then: "1-10x" },
                  { case: { $lte: ["$leverage", 25] }, then: "11-25x" },
                  { case: { $lte: ["$leverage", 50] }, then: "26-50x" },
                  { case: { $lte: ["$leverage", 100] }, then: "51-100x" },
                ],
                default: "100x+",
              },
            },
            positionType: "$positionType",
          },
          count: { $sum: 1 },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          winRate: {
            $avg: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalVolume: { $sum: { $multiply: ["$quantity", "$exitPrice"] } },
        },
      },
      {
        $project: {
          _id: 0,
          leverageRange: "$_id.leverageRange",
          positionType: "$_id.positionType",
          count: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          winRate: { $round: [{ $multiply: ["$winRate", 100] }, 2] },
          totalVolume: { $round: ["$totalVolume", 2] },
        },
      },
    ];

    return await this.db.aggregate<LeverageAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes margin utilization by comparing required and available margins.
   * Returns metrics like average utilization %, total trades, and PnL.
   */
  async analyzeMarginUtilization(
    req: RequestWithUser
  ): Promise<MarginUtilizationAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.crypto,
          marginRequired: { $exists: true },
          marginAvailable: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            leverage: "$leverage",
          },
          totalMarginRequired: { $sum: "$marginRequired" },
          totalMarginAvailable: { $sum: "$marginAvailable" },
          avgMarginUtilization: {
            $avg: {
              $cond: [
                { $eq: ["$marginAvailable", 0] },
                0,
                { $divide: ["$marginRequired", "$marginAvailable"] },
              ],
            },
          },
          totalTrades: { $sum: 1 },
          totalProfitLoss: { $sum: "$profitLoss" },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          leverage: "$_id.leverage",
          marginUtilizationPercentage: {
            $round: [{ $multiply: ["$avgMarginUtilization", 100] }, 2],
          },
          totalMarginRequired: { $round: ["$totalMarginRequired", 2] },
          totalMarginAvailable: { $round: ["$totalMarginAvailable", 2] },
          totalTrades: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
        },
      },
    ];

    return await this.db
      .aggregate<MarginUtilizationAnalysis>(pipeline)
      .toArray();
  }

  /**
   * Analyzes risk metrics such as win rate, max drawdown, and risk-adjusted return for each symbol and leverage.
   */
  async analyzeRiskMetrics(
    req: RequestWithUser
  ): Promise<RiskMetricsAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.crypto } },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            leverage: "$leverage",
          },
          totalTrades: { $sum: 1 },
          winningTrades: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalProfitLoss: { $sum: "$profitLoss" },
          maxDrawdown: { $min: "$profitLoss" }, // assuming most negative profit is worst drawdown
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalVolume: { $sum: { $multiply: ["$quantity", "$exitPrice"] } },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          leverage: "$_id.leverage",
          winRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$winningTrades", "$totalTrades"] },
                  100,
                ],
              },
              2,
            ],
          },
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          maxDrawdown: { $round: ["$maxDrawdown", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalVolume: { $round: ["$totalVolume", 2] },
          riskAdjustedReturn: {
            $round: [
              {
                $cond: [
                  { $eq: ["$maxDrawdown", 0] },
                  0,
                  { $divide: ["$totalProfitLoss", { $abs: "$maxDrawdown" }] },
                ],
              },
              2,
            ],
          },
        },
      },
    ];

    return await this.db.aggregate<RiskMetricsAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes performance of leveraged crypto trades over time (grouped by month).
   * Useful for tracking PnL, trade volume, and win rate trends across different time periods.
   */
  async analyzeTimeBasedPerformance(
    req: RequestWithUser
  ): Promise<TimeBasedPerformanceAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.crypto,
          exitDate: { $exists: true, $type: "date" },
        },
      },
      {
        $addFields: {
          month: { $dateToString: { format: "%Y-%m", date: "$exitDate" } },
        },
      },
      {
        $group: {
          _id: "$month",
          totalTrades: { $sum: 1 },
          winningTrades: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          totalVolume: { $sum: { $multiply: ["$quantity", "$exitPrice"] } },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalTrades: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          winRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$winningTrades", "$totalTrades"] },
                  100,
                ],
              },
              2,
            ],
          },
          totalVolume: { $round: ["$totalVolume", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
        },
      },
      { $sort: { month: 1 } },
    ];

    return await this.db
      .aggregate<TimeBasedPerformanceAnalysis>(pipeline)
      .toArray();
  }

  /**
   * Analyzes performance of leveraged crypto trades by day of the week (Sunday to Saturday).
   * Returns profit and performance percentage per day.
   * @param req - The request object with user info
   * @returns A mapping of each day to profit and relative performance
   */
  async analyzeBestTradingDayLeveraged(
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
          tradeType: this.crypto,
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

  async getAllAnalyses(
    req: RequestWithUser
  ): Promise<AllLeveragedCryptoAnalyses> {
    const [
      leveragedTrades,
      leverageDistribution,
      marginUtilization,
      riskMetrics,
      timePerformance,
      bestTradingDayPerformance,
    ] = await Promise.all([
      this.analyzeLeveragedTrades(req),
      this.analyzeLeverageDistribution(req),
      this.analyzeMarginUtilization(req),
      this.analyzeRiskMetrics(req),
      this.analyzeTimeBasedPerformance(req),
      this.analyzeBestTradingDayLeveraged(req),
    ]);

    return {
      leveragedTrades,
      leverageDistribution,
      marginUtilization,
      riskMetrics,
      timePerformance,
      bestTradingDayPerformance,
    };
  }
}
