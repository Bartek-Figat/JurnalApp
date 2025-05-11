import { Database } from "../../db/dbConnect";

/**
 * Represents the decoded user information from a request.
 */
interface DecodedUser {
  /** The unique identifier of the user */
  userId: string;
}

/**
 * Represents an HTTP request that optionally contains authenticated user data.
 */
interface RequestWithUser {
  user?: {
    decoded?: DecodedUser;
  };
}

/**
 * Contains aggregated analysis data for individual crypto spot trades grouped by asset and trade outcome.
 */
interface CryptoSpotAnalysis {
  /** The traded crypto asset (e.g., BTC, ETH) */
  asset: string;
  /** The result of the trade (e.g., win, loss) */
  tradeOutcome: string;
  /** The total number of trades for this asset and outcome */
  totalTrades: number;
  /** The total quantity traded */
  totalQuantity: number;
  /** The total profit or loss */
  totalProfitLoss: number;
  /** The average profit or loss per trade */
  avgProfitLoss: number;
  /** The average entry price for trades */
  avgEntryPrice: number;
  /** The average exit price for trades */
  avgExitPrice: number;
  /** The average risk-reward ratio across trades */
  avgRiskRewardRatio: number;
  /** The total trading fees incurred */
  totalFees: number;
}

/**
 * Provides statistics about price changes for each traded asset.
 */
interface PriceMovementAnalysis {
  /** The traded crypto asset */
  asset: string;
  /** Average price change (exit - entry) */
  avgPriceChange: number;
  /** Average percentage change in price */
  avgPriceChangePercentage: number;
  /** Maximum price change observed */
  maxPriceChange: number;
  /** Minimum price change observed */
  minPriceChange: number;
  /** Total trading volume (quantity * price) */
  totalVolume: number;
}

/**
 * Summarizes trading performance across all crypto spot trades for a user.
 */
interface TradingPerformanceMetrics {
  /** Total number of trades made */
  totalTrades: number;
  /** Number of trades that ended in a win */
  winningTrades: number;
  /** Win rate as a percentage */
  winRate: number;
  /** Total profit or loss from all trades */
  totalProfitLoss: number;
  /** Total trading fees paid */
  totalFees: number;
  /** Net profit or loss after deducting fees */
  netProfitLoss: number;
  /** Average profit or loss per trade */
  avgProfitLoss: number;
  /** Average risk-reward ratio across all trades */
  avgRiskRewardRatio: number;
  /** Total volume traded (quantity * price) */
  totalVolume: number;
}

/**
 * Analyzes the distribution of trade sizes and related performance metrics.
 */
interface TradeSizeAnalysis {
  /** The traded crypto asset */
  asset: string;
  /** Category of trade size based on value */
  sizeCategory: "small" | "medium" | "large" | "very large";
  /** Number of trades in this category */
  count: number;
  /** Combined value of all trades in this category */
  totalValue: number;
  /** Average profit or loss for trades in this category */
  avgProfitLoss: number;
}

/**
 * Container for all trade analysis types returned together.
 */
interface AllAnalyses {
  /** Detailed analysis of crypto spot trades grouped by asset and outcome */
  cryptoSpotAnalysis: CryptoSpotAnalysis[];

  /** Summary of the user's trading performance metrics */
  tradingPerformance: TradingPerformanceMetrics[];

  /** Distribution and performance of different trade sizes */
  tradeSizeAnalysis: TradeSizeAnalysis[];

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

/**
 * Analyzes crypto spot trade data for a user and returns various metrics
 * such as total trades, average profit/loss, fees, and more.
 */
export class CryptoSpotTradeAnalysis {
  private readonly trades: string = "trades";
  private readonly cryptoSpot: string = "crypto spot";
  private db = new Database().getCollection(this.trades);
  /**
   * Extracts and returns the userId from the request object.
   * Throws an error if userId is not found.
   * @param req - The request object containing user information
   * @returns The user ID as a string
   */
  private getUserId(req: any): string {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    if (!userId) throw new Error("User ID is required");
    return userId;
  }
  /**
   * Analyzes crypto spot trades and returns trade metrics grouped by asset and outcome.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an array of CryptoSpotAnalysis
   */
  async analyzeCryptoSpotTrades(
    req: RequestWithUser
  ): Promise<CryptoSpotAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.cryptoSpot } },
      {
        $group: {
          _id: {
            asset: "$asset",
            tradeOutcome: "$tradeOutcome",
          },
          totalTrades: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalProfitLoss: { $sum: "$profitLoss" },
          avgProfitLoss: { $avg: "$profitLoss" },
          avgEntryPrice: { $avg: "$entryPrice" },
          avgExitPrice: { $avg: "$exitPrice" },
          avgRiskRewardRatio: { $avg: "$riskRewardRatio" },
          totalFees: { $sum: "$fees" },
        },
      },
      {
        $project: {
          _id: 0,
          asset: "$_id.asset",
          tradeOutcome: "$_id.tradeOutcome",
          totalTrades: 1,
          totalQuantity: 1,
          totalProfitLoss: { $round: ["$totalProfitLoss", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgEntryPrice: { $round: ["$avgEntryPrice", 2] },
          avgExitPrice: { $round: ["$avgExitPrice", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalFees: { $round: ["$totalFees", 2] },
        },
      },
      { $sort: { totalProfitLoss: -1 } },
    ];

    return await this.db.aggregate<CryptoSpotAnalysis>(pipeline).toArray();
  }
  /**
   * Analyzes price movements for crypto spot trades, calculating average, max, and min changes.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an array of PriceMovementAnalysis
   */
  async analyzePriceMovements(
    req: RequestWithUser
  ): Promise<PriceMovementAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.cryptoSpot } },
      {
        $project: {
          asset: 1,
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
          exitPrice: 1,
          quantity: 1,
        },
      },
      {
        $group: {
          _id: "$asset",
          avgPriceChange: { $avg: "$priceChange" },
          avgPriceChangePercentage: { $avg: "$priceChangePercentage" },
          maxPriceChange: { $max: "$priceChange" },
          minPriceChange: { $min: "$priceChange" },
          totalVolume: { $sum: { $multiply: ["$quantity", "$exitPrice"] } },
        },
      },
      {
        $project: {
          _id: 0,
          asset: "$_id",
          avgPriceChange: { $round: ["$avgPriceChange", 2] },
          avgPriceChangePercentage: {
            $round: ["$avgPriceChangePercentage", 2],
          },
          maxPriceChange: { $round: ["$maxPriceChange", 2] },
          minPriceChange: { $round: ["$minPriceChange", 2] },
          totalVolume: { $round: ["$totalVolume", 2] },
        },
      },
    ];

    return await this.db.aggregate<PriceMovementAnalysis>(pipeline).toArray();
  }
  /**
   * Analyzes overall trading performance for crypto spot trades, including win rate, net profit/loss, and volume.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an array of TradingPerformanceMetrics
   */
  async analyzeTradingPerformance(
    req: RequestWithUser
  ): Promise<TradingPerformanceMetrics[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.cryptoSpot } },
      {
        $group: {
          _id: null,
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
          totalFees: { $round: ["$totalFees", 2] },
          netProfitLoss: {
            $round: [{ $subtract: ["$totalProfitLoss", "$totalFees"] }, 2],
          },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
          avgRiskRewardRatio: { $round: ["$avgRiskRewardRatio", 2] },
          totalVolume: { $round: ["$totalVolume", 2] },
        },
      },
    ];

    return await this.db
      .aggregate<TradingPerformanceMetrics>(pipeline)
      .toArray();
  }
  /**
   * Categorizes and analyzes trade sizes based on trade value and calculates profit/loss averages for each category.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an array of TradeSizeAnalysis
   */
  async analyzeTradeSizes(req: RequestWithUser): Promise<TradeSizeAnalysis[]> {
    const userId = this.getUserId(req);

    const pipeline = [
      { $match: { authorId: userId, tradeType: this.cryptoSpot } },
      {
        $project: {
          asset: 1,
          tradeValue: { $multiply: ["$quantity", "$exitPrice"] },
          profitLoss: 1,
        },
      },
      {
        $group: {
          _id: {
            asset: "$asset",
            sizeCategory: {
              $switch: {
                branches: [
                  { case: { $lt: ["$tradeValue", 1000] }, then: "small" },
                  { case: { $lt: ["$tradeValue", 10000] }, then: "medium" },
                  { case: { $lt: ["$tradeValue", 100000] }, then: "large" },
                ],
                default: "very large",
              },
            },
          },
          count: { $sum: 1 },
          totalValue: { $sum: "$tradeValue" },
          avgProfitLoss: { $avg: "$profitLoss" },
        },
      },
      {
        $project: {
          _id: 0,
          asset: "$_id.asset",
          sizeCategory: "$_id.sizeCategory",
          count: 1,
          totalValue: { $round: ["$totalValue", 2] },
          avgProfitLoss: { $round: ["$avgProfitLoss", 2] },
        },
      },
      { $sort: { asset: 1, totalValue: -1 } },
    ];

    return await this.db.aggregate<TradeSizeAnalysis>(pipeline).toArray();
  }

  /**
   * Analyzes trading performance per day of the week (Monday to Saturday) and scales results from 0 to 100%.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an object mapping each day to both raw profit and performance percentage
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
          tradeType: this.cryptoSpot,
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
   * Runs all available trade analyses in parallel and returns a combined result.
   * @param req - The request object containing user information
   * @returns A promise that resolves to an object containing all analysis results
   */
  async getAllAnalyses(req: RequestWithUser): Promise<AllAnalyses> {
    try {
      const [
        cryptoSpotAnalysis,
        tradingPerformance,
        tradeSizeAnalysis,
        bestTradingDayPerformance,
      ] = await Promise.all([
        this.analyzeCryptoSpotTrades(req),
        this.analyzeTradingPerformance(req),
        this.analyzeTradeSizes(req),
        this.analyzeBestTradingDay(req),
      ]);

      return {
        cryptoSpotAnalysis,
        tradingPerformance,
        tradeSizeAnalysis,
        bestTradingDayPerformance,
      };
    } catch (error) {
      console.error("Error while performing trade analysis:", error);
      throw new Error("Failed to retrieve all trade analyses.");
    }
  }
}
