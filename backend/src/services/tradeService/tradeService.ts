import { v4 as uuidv4 } from "uuid";
import { ICreateTrade, ITrade, TradeType } from "../../interface/interface";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";
import { tradeQueryFilter } from "./queryFunction";
import { Document, ObjectId, WithId } from "mongodb";
import { TradeValidator } from "./tradeValidator";

export class FinancialCalculator {
  // Method to calculate Profit/Loss and Gain Percentage based on trade type
  calculateTradePL(trade: ICreateTrade): {
    profitLoss: string;
    gainPercentage: string;
  } {
    let profitLoss: number;
    let gainPercentage: number;

    switch (trade.tradeType) {
      case TradeType.CryptoSpot:
        profitLoss =
          (trade.exitPrice - trade.entryPrice) * (trade.quantity || 0) -
          (trade.fees || 0);
        gainPercentage =
          (profitLoss /
            (trade.entryPrice * (trade.quantity || 0) - (trade.fees || 0))) *
          100;
        break;

      case TradeType.Crypto:
        profitLoss =
          (trade.exitPrice - trade.entryPrice) *
            (trade.quantity || 0) *
            (trade.leverage || 1) -
          (trade.fees || 0);
        gainPercentage =
          (profitLoss /
            (trade.entryPrice * (trade.quantity || 0) * (trade.leverage || 1) -
              (trade.fees || 0))) *
          100;
        break;

      case TradeType.Forex:
        console.log(TradeType.Forex);
        profitLoss =
          (trade.exitPrice - trade.entryPrice) *
            (trade.units || 0) *
            (trade.usdExchangeRate || 1) -
          (trade.fees || 0);
        gainPercentage =
          (profitLoss /
            (trade.entryPrice *
              (trade.units || 0) *
              (trade.usdExchangeRate || 1) -
              (trade.fees || 0))) *
          100;
        break;

      case TradeType.Stock:
        profitLoss =
          (trade.exitPrice - trade.entryPrice) * (trade.quantity || 0) -
          (trade.fees || 0);
        gainPercentage =
          (profitLoss /
            (trade.entryPrice * (trade.quantity || 0) - (trade.fees || 0))) *
          100;
        break;

      default:
        profitLoss = 0;
        gainPercentage = 0;
        break;
    }

    // Return formatted results as strings with 2 decimal places
    return {
      profitLoss: profitLoss.toFixed(2),
      gainPercentage: gainPercentage.toFixed(2),
    };
  }
}

export class TradeService {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);
  private tradeValidator: TradeValidator = new TradeValidator();
  private financialCalculator: FinancialCalculator = new FinancialCalculator();

  /**
   * Creates a new trade for the user.
   * @param req - The request object containing user information.
   * @param trade - The trade data to be created.
   * @returns The result of the trade creation operation.
   */
  async createTrade(req: { user: any }, trade: ICreateTrade) {
    try {
      const { user: { decoded: { userId = null } = {} } = {} } = req;

      if (!userId) {
        throw new ApiError("Invalid request", 400, "User ID is missing");
      }

      const validatedTrade = this.tradeValidator.validate(trade);

      const tradeToInsert = {
        tradeId: `trade_${uuidv4()}`,
        authorId: userId,
        ...validatedTrade,
      };

      return { result: await this.db.insertOne(tradeToInsert) };
    } catch (error) {
      console.error("Error creating trade:", error);
      throw new ApiError(
        "Failed to create trade",
        500,
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
  /**
   * Retrieves a trade by its ID.
   * @param id - The ID of the trade to be retrieved.
   * @returns The trade data.
   */
  async getTradeById(id: string, req: any) {
    const userId = req?.user?.decoded?.userId;
    console.log("userId", userId);
    console.log("tradeId", id);
    try {
      const trade = await this.db.findOne<any>({
        $and: [{ tradeId: id }, { authorId: userId }],
      });

      if (!trade) {
        throw new ApiError("Trade not found", 404);
      }

      const { profitLoss, gainPercentage } =
        this.financialCalculator.calculateTradePL(trade);

      console.log("trade", profitLoss, gainPercentage);

      if (!trade) {
        throw new ApiError("Trade not found", 404);
      }
      return { ...trade, profitLoss, gainPercentage };
    } catch (error) {
      console.error("Error retrieving trade:", error);
      throw new ApiError("Failed to retrieve trade", 500);
    }
  }

  /**
   * Retrieves a list of trades for the user with pagination and calculates profit/loss for each trade.

   * @param req - The request object containing user information.
   * @returns An array of trades with calculated profit/loss.
   */
  async getTrades(req: any): Promise<{ trades: any[] }> {
    const userId = req.user?.decoded?.userId;

    if (!userId) {
      throw new ApiError("User ID is missing", 400);
    }

    try {
      const trades = await this.db
        .find({ authorId: userId })
        .sort({ createdAt: -1 })
        .toArray();

      return { trades };
    } catch (error) {
      console.error("Error retrieving trades:", error);
      throw new ApiError("Failed to retrieve trades", 500);
    }
  }

  /**
   * Updates a trade by its ID.
   * @param id - The ID of the trade to be updated.
   * @param update - The update data for the trade.
   */
  async updateTrade(id: string, update: Partial<ITrade>): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.db.updateOne({ _id: objectId }, { $set: update });
    } catch (error) {
      console.error("Error updating trade:", error);
      throw new ApiError("Failed to update trade", 500);
    }
  }

  /**
   * Deletes a trade by its ID.
   * @param id - The ID of the trade to be deleted.
   */
  async deleteTrade(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.db.deleteOne({ _id: objectId });
    } catch (error) {
      console.error("Error deleting trade:", error);
      throw new ApiError("Failed to delete trade", 500);
    }
  }

  /**
   * Filters trades based on query parameters and calculates profit/loss for each trade.
   * @param req - The request object containing user information and query parameters.
   * @returns An object containing filtered trades and the count of total trades.
   */
  async filterTrades(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page = 1, ...rest } = req.query;
    const limit = 10;

    try {
      const query = tradeQueryFilter(rest);
      const skip = (page - 1) * limit;

      // Fetch trades with pagination
      const trades = await this.db
        .find({ authorId: userId, ...query })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Count all trades by authorId and query
      const tradesCount = await this.db.countDocuments({ authorId: userId });

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          ...trade,
          profitLoss,
          gainPercentage,
        };
      });

      console.log(tradesWithProfitLoss);

      return { trades: tradesWithProfitLoss, count: tradesCount };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }

  async cryptoPagination(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    try {
      const skip = (page - 1) * limit;

      // Fetch trades with pagination
      const trades = await this.db
        .find(
          { authorId: userId, tradeType: "crypto" },
          {
            projection: {
              _id: 0,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const allCryptoSpotTrades = await this.db
        .find(
          { authorId: userId, tradeType: "crypto" },
          {
            projection: {
              exitDate: 1,
              exitPrice: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$exitPrice", "$entryPrice"] },
                      { $ifNull: ["$quantity", 0] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
              _id: 0,
            },
          }
        )
        .sort({ exitDate: 1 })
        .toArray();

      // Count all trades by authorId and query
      const tradesCount = await this.db.countDocuments({ authorId: userId });

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          ...trade,
          profitLoss,
          gainPercentage,
        };
      });

      return {
        trades: tradesWithProfitLoss,
        count: tradesCount,
        allCryptoSpotTrades,
      };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }

  async forexPagination(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    try {
      const skip = (page - 1) * limit;

      // Fetch trades with pagination
      const trades = await this.db
        .find(
          { authorId: userId, tradeType: "forex" },
          {
            projection: {
              _id: 0,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Count all trades by authorId and query
      const tradesCount = await this.db.countDocuments({ authorId: userId });

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          ...trade,
          profitLoss,
          gainPercentage,
        };
      });

      // console.log(tradesWithProfitLoss);

      return {
        trades: tradesWithProfitLoss,
        count: tradesCount,
      };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }
  async stockPagination(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    try {
      const skip = (page - 1) * limit;

      // Fetch trades with pagination
      const trades = await this.db
        .find(
          { authorId: userId, tradeType: "stock" },
          {
            projection: {
              _id: 0,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const allCryptoSpotTrades = await this.db
        .find(
          { authorId: userId, tradeType: "stock" },
          {
            projection: {
              exitDate: 1,
              exitPrice: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$exitPrice", "$entryPrice"] },
                      { $ifNull: ["$quantity", 0] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
              _id: 0,
            },
          }
        )
        .sort({ exitDate: 1 })
        .toArray();

      // Count all trades by authorId and query
      const tradesCount = await this.db.countDocuments({ authorId: userId });

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          ...trade,
          profitLoss,
          gainPercentage,
        };
      });

      return {
        trades: tradesWithProfitLoss,
        count: tradesCount,
        allCryptoSpotTrades,
      };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }

  async cryptoSpotPagination(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    try {
      const skip = (page - 1) * limit;

      // Fetch trades with pagination
      const trades = await this.db
        .find(
          { authorId: userId, tradeType: "crypto spot" },
          {
            projection: {
              _id: 0,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const allCryptoSpotTrades = await this.db
        .find(
          { authorId: userId, tradeType: "crypto spot" },
          {
            projection: {
              exitDate: 1,
              exitPrice: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$exitPrice", "$entryPrice"] },
                      { $ifNull: ["$quantity", 0] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
              _id: 0,
            },
          }
        )
        .sort({ exitDate: 1 })
        .toArray();

      // Count all trades by authorId and query
      const tradesCount = await this.db.countDocuments({ authorId: userId });

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          ...trade,
          profitLoss,
          gainPercentage,
        };
      });

      return {
        trades: tradesWithProfitLoss,
        count: tradesCount,
        allCryptoSpotTrades,
      };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }
}
