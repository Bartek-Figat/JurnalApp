import { ICreateTrade } from "../../interface/interface";
import { ApiError } from "../../errorHandler/error";

export class TradeValidator {
  validate(trade: ICreateTrade) {
    this.validateCommonFields(trade);

    switch (trade.tradeType) {
      case "stock":
        this.validateStockTrade(trade);
        trade.profitLoss = this.calculateStockProfitLoss(trade);
        break;
      case "forex":
        this.validateForexTrade(trade);
        trade.profitLoss = this.calculateForexProfitLoss(trade);
        break;
      case "crypto":
        this.validateCryptoTrade(trade);
        trade.profitLoss = this.calculateCryptoProfitLoss(trade);
        break;
      case "crypto spot":
        this.validateCryptoSpotTrade(trade);
        trade.profitLoss = this.calculateCryptoSpotProfitLoss(trade);
        break;
      case "option":
        this.validateOptionTrade(trade);
        trade.profitLoss = this.calculateOptionProfitLoss(trade);
        break;
      default:
        throw new ApiError(`Trade type ${trade.tradeType} is not allowed`, 400);
    }

    trade.tradeOutcome = trade.profitLoss > 0 ? "win" : "loss";

    return trade;
  }

  private validateCommonFields(trade: ICreateTrade) {
    const missingFields = [];
    if (!trade.symbol) missingFields.push("symbol");
    if (trade.entryPrice === undefined) missingFields.push("entryPrice");
    if (trade.exitPrice === undefined) missingFields.push("exitPrice");
    if (trade.risk === undefined) missingFields.push("risk");
    if (trade.reward === undefined) missingFields.push("reward");
    if (!trade.tags || trade.tags.length === 0) missingFields.push("tags");

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }
  }

  private validateStockTrade(trade: ICreateTrade) {
    if (trade.quantity === undefined) {
      throw new ApiError(
        "Missing required field: quantity for stock trade",
        400
      );
    }
  }

  private calculateStockProfitLoss(trade: ICreateTrade): number {
    return (trade.exitPrice - trade.entryPrice) * (trade.quantity || 0);
  }

  private validateForexTrade(trade: ICreateTrade) {
    const missingFields = [];
    if (trade.units === undefined) missingFields.push("units");
    if (trade.usdExchangeRate === undefined)
      missingFields.push("usdExchangeRate");

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields for forex trade: ${missingFields.join(", ")}`,
        400
      );
    }
  }

  private calculateForexProfitLoss(trade: ICreateTrade): number {
    return (
      (trade.exitPrice - trade.entryPrice) *
      (trade.units || 0) *
      (trade.usdExchangeRate || 1) // Default to 1 to avoid multiplication by undefined
    );
  }

  private validateCryptoTrade(trade: ICreateTrade) {
    const missingFields = [];
    if (trade.quantity === undefined) missingFields.push("quantity");
    if (trade.leverage === undefined) missingFields.push("leverage");
    if (!trade.positionType) missingFields.push("positionType");

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields for crypto trade: ${missingFields.join(", ")}`,
        400
      );
    }
  }

  private calculateCryptoProfitLoss(trade: ICreateTrade): number {
    return (
      (trade.exitPrice - trade.entryPrice) *
      (trade.quantity || 0) *
      (trade.leverage || 1) // Default to 1
    );
  }

  private validateCryptoSpotTrade(trade: ICreateTrade) {
    if (trade.quantity === undefined) {
      throw new ApiError(
        "Missing required field: quantity for crypto spot trade",
        400
      );
    }
  }

  private calculateCryptoSpotProfitLoss(trade: ICreateTrade): number {
    return (trade.exitPrice - trade.entryPrice) * (trade.quantity || 0);
  }

  private validateOptionTrade(trade: ICreateTrade) {
    const missingFields = [];
    if (trade.quantity === undefined) missingFields.push("quantity");
    if (!trade.optionType) missingFields.push("optionType");
    if (trade.strikePrice === undefined) missingFields.push("strikePrice");
    if (trade.optionPremium === undefined) missingFields.push("optionPremium");

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields for option trade: ${missingFields.join(", ")}`,
        400
      );
    }
  }

  private calculateOptionProfitLoss(trade: ICreateTrade): number {
    return (
      (trade.exitPrice -
        (trade.strikePrice || 0) -
        (trade.optionPremium || 0)) *
      (trade.quantity || 0)
    );
  }
}
