import { Database } from "../../db/dbConnect";

interface OptionTradeAnalysis {
  optionType: string;
  positionType: string;
  tradeOutcome: string;
  totalTrades: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  avgRiskRewardRatio: number;
  totalQuantity: number;
  avgPremium: number;
  avgStrikePrice: number;
}

interface ExpiringOption {
  _id: string;
  optionType: string;
  strikePrice: number;
  expirationDate: Date;
  positionType: string;
  profitLoss: number;
}

interface MarginAnalysis {
  totalMarginRequired: number;
  totalMarginAvailable: number;
  marginUtilization: number;
}

interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  maxProfitLoss: number;
  minProfitLoss: number;
}

interface TimeBasedOptionPerformance {
  month: string;
  totalTrades: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  winRate: number;
  totalVolume: number;
  avgRiskRewardRatio: number;
}

interface AllOptionAnalyses {
  optionTrades: OptionTradeAnalysis[];
  expiringOptions: ExpiringOption[];
  marginAnalysis: MarginAnalysis[];
  performanceMetrics: PerformanceMetrics[];
  timePerformance?: TimeBasedOptionPerformance[];
  /** Performance per day of the week, both raw profit and scaled percentage */
  analyzeBestTradingDay: Record<
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

export class OptionTradeAnalysisClass {
  private readonly trades: string = "trades";
  private readonly tradeType: string = "option";
  private db = new Database().getCollection(this.trades);

  private getUserId(req: RequestWithUser): string {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    if (!userId) throw new Error("User ID is required");
    return userId;
  }

  async analyzeOptionTrades(
    req: RequestWithUser
  ): Promise<OptionTradeAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $group: {
          _id: "$symbol", // Group by symbol instead of optionType/positionType/tradeOutcome
          totalTrades: { $sum: 1 },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalQuantity: { $sum: "$quantity" },
          avgPremium: { $avg: "$optionPremium" },
          avgStrikePrice: { $avg: "$strikePrice" },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id",
          totalTrades: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalQuantity: 1,
          avgPremium: { $round: ["$avgPremium", 2] },
          avgStrikePrice: { $round: ["$avgStrikePrice", 2] },
        },
      },
      { $sort: { totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<OptionTradeAnalysis>(pipeline).toArray();
  }

  async findExpiringOptions(req: RequestWithUser): Promise<ExpiringOption[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.tradeType,
          expirationDate: { $lt: new Date() },
        },
      },
      {
        $project: {
          _id: 1,
          optionType: 1,
          strikePrice: 1,
          expirationDate: 1,
          positionType: 1,
          profitLoss: 1,
        },
      },
    ];

    return await this.db.aggregate<ExpiringOption>(pipeline).toArray();
  }

  async analyzeMarginRequirements(
    req: RequestWithUser
  ): Promise<MarginAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.tradeType,
          marginRequired: { $exists: true },
          marginAvailable: { $exists: true },
        },
      },
      {
        $group: {
          _id: { positionType: "$positionType" },
          totalMarginRequired: { $sum: "$marginRequired" },
          totalMarginAvailable: { $sum: "$marginAvailable" },
          marginUtilization: {
            $avg: {
              $cond: [
                { $eq: ["$marginAvailable", 0] },
                0,
                { $divide: ["$marginRequired", "$marginAvailable"] },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          positionType: "$_id.positionType",
          totalMarginRequired: { $round: ["$totalMarginRequired", 2] },
          totalMarginAvailable: { $round: ["$totalMarginAvailable", 2] },
          marginUtilization: {
            $round: [{ $multiply: ["$marginUtilization", 100] }, 2],
          },
        },
      },
    ];

    return await this.db.aggregate<MarginAnalysis>(pipeline).toArray();
  }

  async analyzePerformanceMetrics(
    req: RequestWithUser
  ): Promise<PerformanceMetrics[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          winningTrades: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          maxProfitLoss: { $max: "$profitLoss" },
          minProfitLoss: { $min: "$profitLoss" },
        },
      },
      {
        $project: {
          _id: 0,
          totalTrades: 1,
          winningTrades: 1,
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
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          maxProfitLoss: { $round: ["$maxProfitLoss", 2] },
          minProfitLoss: { $round: ["$minProfitLoss", 2] },
        },
      },
    ];

    return await this.db.aggregate<PerformanceMetrics>(pipeline).toArray();
  }

  async analyzeTimeBasedPerformance(
    req: RequestWithUser
  ): Promise<TimeBasedOptionPerformance[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      {
        $match: {
          authorId: userId,
          tradeType: this.tradeType,
          exitDate: { $exists: true },
        },
      },
      {
        $addFields: {
          parsedDate: { $toDate: "$exitDate" },
        },
      },
      {
        $addFields: {
          month: { $dateToString: { format: "%Y-%m", date: "$parsedDate" } },
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
      .aggregate<TimeBasedOptionPerformance>(pipeline)
      .toArray();
  }

  /**
   * Analyzes the best trading day of the week for option trades.
   * Returns profit and performance percentage scaled from 0–100.
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
          tradeType: this.tradeType, // "option"
          entryDate: { $exists: true },
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
  ): Promise<AllOptionAnalyses & { bestTradingDays?: Record<string, any> }> {
    const [
      optionTrades,
      expiringOptions,
      marginAnalysis,
      performanceMetrics,
      timePerformance,
      analyzeBestTradingDay,
    ] = await Promise.all([
      this.analyzeOptionTrades(req),
      this.findExpiringOptions(req),
      this.analyzeMarginRequirements(req),
      this.analyzePerformanceMetrics(req),
      this.analyzeTimeBasedPerformance(req),
      this.analyzeBestTradingDay(req),
    ]);

    return {
      optionTrades,
      expiringOptions,
      marginAnalysis,
      performanceMetrics,
      timePerformance,
      analyzeBestTradingDay,
    };
  }
}
