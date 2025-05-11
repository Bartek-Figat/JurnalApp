import {
  TradeAlgorithm,
  StockTradeAlgorithm,
  ForexTradeAlgorithm,
  CryptoTradeAlgorithm,
  CryptoSpotTradeAlgorithm,
  OptionTradeAlgorithm,
} from "./tradeAlgorithms";
import { ICreateTrade } from "../../interface/interface";
import { ApiError } from "../../errorHandler/error";

export class TradeValidator {
  private tradeAlgorithms: Record<string, TradeAlgorithm> = {
    stock: new StockTradeAlgorithm(),
    forex: new ForexTradeAlgorithm(),
    crypto: new CryptoTradeAlgorithm(),
    "crypto spot": new CryptoSpotTradeAlgorithm(),
    option: new OptionTradeAlgorithm(),
  };

  validate(trade: ICreateTrade): ICreateTrade {
    this.validateCommonFields(trade);

    const algorithm = this.tradeAlgorithms[trade.tradeType];

    if (!algorithm) {
      throw new ApiError(`Trade type "${trade.tradeType}" is not allowed`, 400);
    }

    algorithm.validate(trade);
    // trade.improvementSuggestions = algorithm.computeFullTrade(trade);
    trade.profitLoss = algorithm.calculateProfitLoss(trade);
    trade.tradeOutcome = trade.profitLoss > 0 ? "win" : "loss";

    return trade;
  }

  private validateCommonFields(trade: ICreateTrade): void {
    const requiredFields: (keyof ICreateTrade)[] = [
      "symbol",
      "entryPrice",
      "exitPrice",
      "tags",
    ];

    const missingFields = requiredFields.filter(
      (field) => trade[field] === undefined || trade[field] === null
    );

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    if (!trade.tags?.length) {
      throw new ApiError("Tags cannot be empty", 400);
    }
  }
}
