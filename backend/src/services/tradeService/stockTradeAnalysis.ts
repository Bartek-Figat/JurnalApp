import { ICreateTrade } from "src/interface/interface";
import { Database } from "../../db/dbConnect";
import { tradeQueryFilter } from "./queryFunction";
import { ApiError } from "../../errorHandler/error";

interface StockTradeAnalysis {
  symbol: string;
  sector: string;
  tradeOutcome: string;
  totalTrades: number;
  totalQuantity: number;
  totalProfitLoss: number;
  avgProfitLoss: number;
  avgEntryPrice: number;
  avgExitPrice: number;
  totalFees: number;
  avgRiskRewardRatio: number;
  totalMarginRequired: number;
  totalMarginAvailable: number;
}

interface PriceVolumeAnalysis {
  symbol: string;
  sector: string;
  avgPriceChange: number;
  avgPriceChangePercentage: number;
  totalVolume: number;
  totalValue: number;
  avgTradeSize: number;
}

interface StockMarginAnalysis {
  symbol: string;
  sector: string;
  marginUtilizationPercentage: number;
  totalMarginRequired: number;
  totalMarginAvailable: number;
  totalTrades: number;
  totalProfitLoss: number;
}

interface TimeBasedPerformance {
  symbol: string;
  sector: string;
  timeFrame: string;
  winRate: number;
  totalProfitLoss: number;
  netProfitLoss: number;
  avgProfitLoss: number;
  avgRiskRewardRatio: number;
  totalVolume: number;
}

interface WinLossBySector {
  sector: string;
  totalWins: number;
  totalLosses: number;
  winLossRatio: number;
}

interface AllStockAnalyses {
  stockTrades: StockTradeAnalysis[];
  priceVolume: PriceVolumeAnalysis[];
  marginAnalysis: StockMarginAnalysis[];
  timePerformance: TimeBasedPerformance[];
  winLossBySector: WinLossBySector[];
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
  getAllStockTrades: { trades: ICreateTrade[]; count: number };
}

interface DecodedUser {
  userId: string;
}

interface RequestWithUser {
  user?: {
    decoded?: DecodedUser;
  };
}

export class StockTradeAnalysisClass {
  private readonly trades: string = "trades";
  private readonly tradeType: string = "stock";
  private db = new Database().getCollection(this.trades);
  /**
   * Extracts and returns the authenticated user's ID from the request object.
   * Throws an error if user ID is missing.
   * @param req - The request object containing user information.
   * @returns The user ID as a string.
   */
  private getUserId(req: RequestWithUser): string {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    if (!userId) throw new Error("User ID is required");
    return userId;
  }
  /**
   * Analyzes stock trades grouped by symbol, sector, and trade outcome.
   * Calculates totals and averages for P&L, quantity, fees, prices, and margin usage.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an array of trade analysis results.
   */
  async analyzeStockTrades(
    req: RequestWithUser
  ): Promise<StockTradeAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            sector: "$sector",
            tradeOutcome: "$tradeOutcome",
          },
          totalTrades: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          avgEntryPrice: { $avg: "$entryPrice" },
          avgExitPrice: { $avg: "$exitPrice" },
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
          sector: "$_id.sector",
          tradeOutcome: "$_id.tradeOutcome",
          totalTrades: 1,
          totalQuantity: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgEntryPrice: { $round: ["$avgEntryPrice", 2] },
          avgExitPrice: { $round: ["$avgExitPrice", 2] },
          totalFees: { $round: ["$totalFees", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalMarginRequired: { $round: ["$totalMarginRequired", 2] },
          totalMarginAvailable: { $round: ["$totalMarginAvailable", 2] },
        },
      },
      { $sort: { totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<StockTradeAnalysis>(pipeline).toArray();
  }
  /**
   * Analyzes stock price movements and volume data for each symbol and sector.
   * Computes average price change, volume, trade size, and total value traded.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an array of price and volume analysis results.
   */
  async analyzePriceVolume(
    req: RequestWithUser
  ): Promise<PriceVolumeAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $project: {
          symbol: 1,
          sector: 1,
          quantity: 1,
          priceChange: { $subtract: ["$exitPrice", "$entryPrice"] },
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
          tradeValue: { $multiply: ["$quantity", "$exitPrice"] },
        },
      },
      {
        $group: {
          _id: { symbol: "$symbol", sector: "$sector" },
          avgPriceChange: { $avg: "$priceChange" },
          avgPriceChangePercentage: { $avg: "$priceChangePercentage" },
          totalVolume: { $sum: "$quantity" },
          totalValue: { $sum: "$tradeValue" },
          avgTradeSize: { $avg: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          sector: "$_id.sector",
          avgPriceChange: { $round: ["$avgPriceChange", 2] },
          avgPriceChangePercentage: {
            $round: ["$avgPriceChangePercentage", 2],
          },
          totalVolume: 1,
          totalValue: { $round: ["$totalValue", 2] },
          avgTradeSize: { $round: ["$avgTradeSize", 2] },
        },
      },
    ];

    return await this.db.aggregate<PriceVolumeAnalysis>(pipeline).toArray();
  }
  /**
   * Evaluates margin utilization for stock trades.
   * Computes average margin utilization, totals for required and available margin, and total P&L.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an array of margin utilization analysis results.
   */
  async analyzeMarginUtilization(
    req: RequestWithUser
  ): Promise<StockMarginAnalysis[]> {
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
          _id: { symbol: "$symbol", sector: "$sector" },
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
          sector: "$_id.sector",
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

    return await this.db.aggregate<StockMarginAnalysis>(pipeline).toArray();
  }
  /**
   * Analyzes performance of stock trades over time by symbol and sector.
   * Groups by month and calculates win rate, net P&L, average metrics, and volume.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an array of time-based performance metrics.
   */
  async analyzeTimeBasedPerformance(
    req: RequestWithUser
  ): Promise<TimeBasedPerformance[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $addFields: {
          parsedDate: { $toDate: "$createdAt" },
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            sector: "$sector",
            timeFrame: {
              $dateToString: { format: "%Y-%m", date: "$parsedDate" },
            },
          },
          totalTrades: { $sum: 1 },
          winningTrades: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalProfitLoss: { $sum: "$profitLoss" },
          totalFees: { $sum: "$fees" },
          avgProfitLoss: { $avg: "$profitLoss" },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalVolume: { $sum: { $multiply: ["$quantity", "$exitPrice"] } },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          sector: "$_id.sector",
          timeFrame: "$_id.timeFrame",
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
          netProfitLoss: {
            $round: [{ $subtract: ["$totalProfitLoss", "$totalFees"] }, 2],
          },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalVolume: { $round: ["$totalVolume", 2] },
        },
      },
      { $sort: { timeFrame: -1, totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<TimeBasedPerformance>(pipeline).toArray();
  }

  /**
   * Analyzes the win/loss ratio for trades grouped by sector.
   * Computes the number of winning and losing trades and the win/loss ratio per sector.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an array of win/loss ratios by sector.
   */
  async analyzeWinLossRatioBySector(
    req: RequestWithUser
  ): Promise<WinLossBySector[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.tradeType } },
      {
        $group: {
          _id: "$sector",
          totalWins: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          totalLosses: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sector: "$_id",
          totalWins: 1,
          totalLosses: 1,
          winLossRatio: {
            $cond: [
              { $eq: ["$totalLosses", 0] },
              "$totalWins", // if no losses, ratio is totalWins
              {
                $round: [{ $divide: ["$totalWins", "$totalLosses"] }, 2],
              },
            ],
          },
        },
      },
      { $sort: { winLossRatio: -1 } },
    ];

    return await this.db.aggregate<WinLossBySector>(pipeline).toArray();
  }

  /**
   * Analyzes the best trading day of the week for stock trades.
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
          tradeType: this.tradeType, // "stock"
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
  /**
   * Retrieves all individual stock trades for the authenticated user.
   * @param req - The request object containing user information.
   * @returns A promise resolving to an array of raw stock trade documents.
   */
  async getAllStockTrades(
    req: any
  ): Promise<{ trades: ICreateTrade[]; count: number }> {
    const userId = this.getUserId(req);
    const { page = 1, limit = 10, ...rest } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    try {
      const filters = tradeQueryFilter(rest);
      const query = {
        authorId: userId,
        tradeType: this.tradeType,
        ...filters,
      };

      const documents = await this.db
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray();

      const trades: ICreateTrade[] = documents.map((doc) => {
        const { ...rest } = doc;
        return rest as unknown as ICreateTrade;
      });

      const count = await this.db.countDocuments(query);

      return { trades, count };
    } catch (error) {
      console.error("Error fetching stock trades:", error);
      throw new ApiError("Failed to get stock trades", 500);
    }
  }

  /**
   * Retrieves all types of stock analysis including trade summary,
   * price/volume, margin utilization, and time-based performance.
   * @param req - The request object containing user context.
   * @returns A promise resolving to an object containing all stock analysis results.
   */
  async getAllAnalyses(req: RequestWithUser): Promise<AllStockAnalyses> {
    const [
      stockTrades,
      priceVolume,
      marginAnalysis,
      timePerformance,
      winLossBySector,
      analyzeBestTradingDay,
      getAllStockTrades,
    ] = await Promise.all([
      this.analyzeStockTrades(req),
      this.analyzePriceVolume(req),
      this.analyzeMarginUtilization(req),
      this.analyzeTimeBasedPerformance(req),
      this.analyzeWinLossRatioBySector(req),
      this.analyzeBestTradingDay(req),
      this.getAllStockTrades(req),
    ]);

    return {
      stockTrades,
      priceVolume,
      marginAnalysis,
      timePerformance,
      winLossBySector,
      analyzeBestTradingDay,
      getAllStockTrades,
    };
  }
}
