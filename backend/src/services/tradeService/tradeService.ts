import { ICreateTrade, ITrade } from "../../interface/interface";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";
import { tradeQueryFilter } from "./queryFunction";
import { ObjectId } from "mongodb";
import { TradeValidator } from "./tradeValidator";

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

      const result = await this.db.insertOne({
        authorId: userId,
        ...validatedTrade,
      });

      return result;
    } catch (error) {
      console.error("Error creating trade:", error);

      // If the error is an instance of ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }

      // Otherwise, throw a generic ApiError
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

  async getTrades(skip: number = 0, limit: number = 10) {
    try {
      const trades = await this.db.find().skip(skip).limit(limit).toArray();
      return trades;
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

  async filterTrades(req: { user: any }, filter: any, limit: number = 10) {
    const id = req.user;
    try {
      const { page, ...rest } = filter;
      const query = tradeQueryFilter(rest);
      const skip = (page - 1) * limit;
      const trades = await this.db
        .find({ _id: id, $and: [query] })
        .skip(skip)
        .limit(limit)
        .toArray();

      const count = await this.db.countDocuments({
        _id: id,
        ...query,
      });

      return { trades, count };
    } catch (error) {
      console.error("Error filtering trades:", error);
      throw new ApiError("Failed to filter trades", 500);
    }
  }
}
