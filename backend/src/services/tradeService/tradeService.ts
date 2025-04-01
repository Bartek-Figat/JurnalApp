import { ICreateTrade, ITrade } from "../../interface/interface";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";
import { tradeQueryFilter } from "./queryFunction";
import { ObjectId } from "mongodb";
import { TradeValidator } from "./tradeValidator";

// interface Filter {
//   page: number;
//   [key: string]: any;
// }

// interface Trade {
//   entryPrice: number;
//   exitPrice: number;
//   quantity: number;
//   fees: number;
//   [key: string]: any;
// }

// interface TradesResponse {
//   trades: Trade[];
//   count: number;
//   tradesWithProfitLoss: Trade[];
// }

const calculateProfitLoss = (
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  fees: number
) => {
  const profitLoss = (exitPrice - entryPrice) * quantity - fees;
  const gainPercentage = ((profitLoss / (entryPrice * quantity)) * 100).toFixed(
    2
  );
  return { profitLoss: profitLoss.toFixed(2), gainPercentage };
};

export class TradeService {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);
  private tradeValidator: TradeValidator = new TradeValidator();

  async createTrade(req: { user: any }, trade: ICreateTrade) {
    try {
      const { user: { decoded: { userId = null } = {} } = {} } = req;

      if (!userId) {
        throw new ApiError("Invalid request", 400, "User ID is missing");
      }

      const validatedTrade = this.tradeValidator.validate(trade);

      const tradeToInsert = {
        authorId: userId,
        ...validatedTrade,
      };

      const result = await this.db.insertOne(tradeToInsert);

      return result;
    } catch (error) {
      throw new ApiError(
        "Failed to create trade",
        500,
        "An unexpected error occurred"
      );
    }
  }

  async getTradeById(id: string) {
    console.log("id", id);
    try {
      const trade = await this.db.findOne<ITrade>({
        _id: new ObjectId(id),
      });
      console.log("trade", trade);
      if (!trade) {
        throw new ApiError("Trade not found", 404);
      }
      return trade;
    } catch (error) {
      console.error("Error retrieving trade:", error);
      throw new ApiError("Failed to retrieve trade", 500);
    }
  }

  async getTrades(skip: number = 0, limit: number = 10, req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    try {
      const trades = await this.db
        .find({ authorId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const tradesWithProfitLoss = trades.map((trade) => {
        const { profitLoss, gainPercentage } = calculateProfitLoss(
          trade.entryPrice,
          trade.exitPrice,
          trade.quantity,
          trade.fees
        );
        return { ...trade, profitLoss, gainPercentage };
      });

      return tradesWithProfitLoss;
    } catch (error) {
      console.error("Error retrieving trades:", error);
      throw new ApiError("Failed to retrieve trades", 500);
    }
  }

  async updateTrade(id: string, update: Partial<ITrade>): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.db.updateOne({ _id: objectId }, { $set: update });
    } catch (error) {
      console.error("Error updating trade:", error);
      throw new ApiError("Failed to update trade", 500);
    }
  }

  async deleteTrade(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.db.deleteOne({ _id: objectId });
    } catch (error) {
      console.error("Error deleting trade:", error);
      throw new ApiError("Failed to delete trade", 500);
    }
  }

  async filterTrades(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const { page, ...rest } = req.query;
    const limit = 10;
    try {
      const query = tradeQueryFilter(rest);
      const skip = (page - 1) * limit;
      const trades = await this.db
        .find({ authorId: userId, $and: [query] })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      //count all trades by authorId use length of the array
      const tradesCount = await this.db.find({ authorId: userId }).toArray();

      const tradesWithProfitLoss = trades.map((trade) => {
        const { profitLoss, gainPercentage } = calculateProfitLoss(
          trade.entryPrice,
          trade.exitPrice,
          trade.quantity,
          trade.fees
        );
        return { ...trade, profitLoss, gainPercentage };
      });

      return { trades: tradesWithProfitLoss, count: tradesCount.length };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }
}
