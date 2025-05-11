import { ICreateTrade, TradeType } from "../../interface/interface";

export interface TradeAlgorithm {
  validate(trade: ICreateTrade): void;
  calculateProfitLoss(trade: ICreateTrade): number;
  computeFullTrade(trade: ICreateTrade): ICreateTrade;
}

function applyDefaultMetrics(trade: ICreateTrade): ICreateTrade {
  return {
    winRate: trade.winRate ?? 0,
    avgProfitLoss: trade.avgProfitLoss ?? 0,
    maxDrawdown: trade.maxDrawdown ?? 0,
    sharpeRatio: trade.sharpeRatio ?? 0,
    profitFactor: trade.profitFactor ?? 0,
    volatility: trade.volatility ?? 0,
    sortinoRatio: trade.sortinoRatio ?? 0,
    avgHoldingPeriod: trade.avgHoldingPeriod ?? 0,
    improvementSuggestions: trade.improvementSuggestions ?? [],
    tradeType: TradeType.Stock,
    tradeOutcome: "win",
    symbol: "",
    entryPrice: 0,
    exitPrice: 0,
    risk: 0,
    reward: 0,
    tags: [],
    createdAt: new Date(),
    entryDate: new Date(),
    exitDate: new Date(),
  };
}

function finalizeTrade(
  trade: ICreateTrade,
  algorithm: TradeAlgorithm
): ICreateTrade {
  algorithm.validate(trade);

  return applyDefaultMetrics(trade);
}

// ----------------------------
// Stock Trade Algorithm
// ----------------------------
export class StockTradeAlgorithm implements TradeAlgorithm {
  validate(trade: ICreateTrade): void {
    if (!trade.quantity) throw new Error("Missing required field: quantity");
  }

  calculateProfitLoss(trade: ICreateTrade): number {
    return (trade.exitPrice - trade.entryPrice) * (trade.quantity ?? 0);
  }

  computeFullTrade(trade: ICreateTrade): ICreateTrade {
    const finalizedTrade = finalizeTrade(trade, this);

    // Initialize `profitLoss` and `improvementSuggestions` if undefined
    finalizedTrade.profitLoss = finalizedTrade.profitLoss ?? 0;
    finalizedTrade.improvementSuggestions =
      finalizedTrade.improvementSuggestions ?? [];

    // Apply improvement suggestions based on profit/loss
    if (finalizedTrade.profitLoss <= 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider adjusting your entry/exit points.",
        description:
          "Review historical price data to optimize the timing of your trades.",
        why: "Timing plays a crucial role in stock trading. Improper entry/exit points can reduce profitability.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Evaluate market conditions more closely before entering.",
        description:
          "Consider waiting for a confirmation signal before initiating trades.",
        why: "Market conditions such as trends, volatility, and news can influence the success of your trade.",
      });
    }

    if (finalizedTrade.profitLoss > 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Great trade! Continue to monitor market conditions.",
        description:
          "Maintain your strategy but look for ways to improve position sizing.",
        why: "While your strategy worked well, refining position sizing could optimize future profits.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider using trailing stops to lock in profits.",
        description:
          "This allows you to secure gains while giving the trade room to run.",
        why: "Trailing stops can prevent profits from being lost when the market reverses unexpectedly.",
      });
    }

    return finalizedTrade.improvementSuggestions;
  }
}

// ----------------------------
// Forex Trade Algorithm
// ----------------------------
export class ForexTradeAlgorithm implements TradeAlgorithm {
  validate(trade: ICreateTrade): void {
    if (!trade.units || trade.usdExchangeRate == null) {
      throw new Error("Missing required fields: units, usdExchangeRate");
    }
  }

  calculateProfitLoss(trade: ICreateTrade): number {
    const priceDiff = trade.exitPrice - trade.entryPrice;
    return priceDiff * (trade.units ?? 0) * (trade.usdExchangeRate ?? 1);
  }

  computeFullTrade(trade: ICreateTrade): ICreateTrade {
    const finalizedTrade = finalizeTrade(trade, this);

    // Initialize `profitLoss` and `improvementSuggestions` if undefined
    finalizedTrade.profitLoss = finalizedTrade.profitLoss ?? 0;
    finalizedTrade.improvementSuggestions =
      finalizedTrade.improvementSuggestions ?? [];

    // Apply improvement suggestions based on profit/loss
    if (finalizedTrade.profitLoss <= 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Review your risk management strategy.",
        description:
          "Ensure your stop-loss levels are appropriate based on market volatility.",
        why: "Proper risk management is essential in forex markets to protect capital from unforeseen losses.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Diversify your currency pairs.",
        description:
          "Explore trading multiple pairs to balance risk and maximize opportunities.",
        why: "Diversifying your trades across different pairs reduces exposure to single-market volatility.",
      });
    }

    if (finalizedTrade.profitLoss > 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion:
          "Good trade! Consider scaling your position for larger moves.",
        description:
          "Explore different strategies for increasing your reward-to-risk ratio.",
        why: "Scaling into successful trades can leverage profitable trends and improve overall returns.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Try incorporating fundamental analysis.",
        description:
          "Understanding economic reports and central bank policies can provide insight into currency trends.",
        why: "Fundamental analysis can add depth to your strategy by predicting market movements based on economic data.",
      });
    }

    return finalizedTrade;
  }
}

// ----------------------------
// Crypto Trade Algorithm
// ----------------------------
export class CryptoTradeAlgorithm implements TradeAlgorithm {
  validate(trade: ICreateTrade): void {
    if (!trade.quantity || !trade.leverage || !trade.positionType) {
      throw new Error(
        "Missing required fields: quantity, leverage, positionType"
      );
    }
    if (trade.leverage <= 0)
      throw new Error("Leverage must be greater than 0.");
  }

  calculateProfitLoss(trade: ICreateTrade): number {
    const basePnl =
      trade.positionType === "short"
        ? trade.entryPrice - trade.exitPrice
        : trade.exitPrice - trade.entryPrice;

    return basePnl * (trade.quantity ?? 0) * (trade.leverage ?? 1);
  }

  computeFullTrade(trade: ICreateTrade): ICreateTrade {
    const finalizedTrade = finalizeTrade(trade, this);

    // Initialize `profitLoss` and `improvementSuggestions` if undefined
    finalizedTrade.profitLoss = finalizedTrade.profitLoss ?? 0;
    finalizedTrade.improvementSuggestions =
      finalizedTrade.improvementSuggestions ?? [];

    // Apply improvement suggestions based on profit/loss
    if (finalizedTrade.profitLoss <= 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Review leverage and stop-loss strategy.",
        description:
          "Examine how leverage and stop-loss can impact risk and reward in highly volatile markets.",
        why: "In crypto, excessive leverage can lead to significant losses, especially during high volatility.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider setting a more conservative leverage ratio.",
        description:
          "Excessive leverage can result in significant losses in volatile crypto markets.",
        why: "A lower leverage ratio can protect you from larger losses, ensuring better risk management.",
      });
    }

    if (finalizedTrade.profitLoss > 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Leverage seems optimal for this trade.",
        description:
          "Maintain leverage but ensure risk management is in place for other trades.",
        why: "Your leverage seems suitable, but continue managing risk with stop-losses for each position.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Monitor sentiment and news in the crypto space.",
        description:
          "Cryptos are heavily influenced by news and social media, so stay updated on market-moving events.",
        why: "News and social media sentiment can significantly move crypto markets, making real-time awareness critical.",
      });
    }

    return finalizedTrade;
  }
}

// ----------------------------
// Crypto Spot Trade Algorithm
// ----------------------------
export class CryptoSpotTradeAlgorithm implements TradeAlgorithm {
  validate(trade: ICreateTrade): void {
    if (!trade.quantity) {
      throw new Error("Missing required field: quantity");
    }
  }

  calculateProfitLoss(trade: ICreateTrade): number {
    return (trade.exitPrice - trade.entryPrice) * (trade.quantity ?? 0);
  }

  computeFullTrade(trade: ICreateTrade): ICreateTrade {
    const finalizedTrade = finalizeTrade(trade, this);

    // Initialize `profitLoss` and `improvementSuggestions` if undefined
    finalizedTrade.profitLoss = finalizedTrade.profitLoss ?? 0;
    finalizedTrade.improvementSuggestions =
      finalizedTrade.improvementSuggestions ?? [];

    // Apply improvement suggestions based on profit/loss
    if (finalizedTrade.profitLoss <= 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider revisiting entry points and market conditions.",
        description:
          "Use technical analysis and market sentiment data to time your entry and exit better.",
        why: "Correctly timed entries can make a significant difference in crypto market profitability.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Review the crypto market cycle.",
        description:
          "Crypto markets tend to have cycles. Be mindful of market trends and adjust your trades accordingly.",
        why: "Understanding crypto market cycles can help you avoid trading during unfavorable phases.",
      });
    }

    if (finalizedTrade.profitLoss > 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Great entry point!",
        description:
          "Consider expanding your analysis to include other market factors like news events.",
        why: "Great entries can still benefit from a broader market view, which may reveal hidden opportunities.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Monitor for potential long-term trends.",
        description:
          "If this is a long-term hold, ensure that you're not overreacting to short-term volatility.",
        why: "Crypto markets can be volatile in the short-term, but long-term trends can lead to substantial profits.",
      });
    }

    return finalizedTrade;
  }
}

// ----------------------------
// Option Trade Algorithm
// ----------------------------
export class OptionTradeAlgorithm implements TradeAlgorithm {
  validate(trade: ICreateTrade): void {
    const requiredFields = [
      "quantity",
      "optionType",
      "strikePrice",
      "optionPremium",
      "positionType",
    ];
    for (const field of requiredFields) {
      if (trade[field as keyof ICreateTrade] == null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    if (trade.expirationDate && new Date(trade.expirationDate) < new Date()) {
      throw new Error("Option has expired. Cannot trade after expiration.");
    }
  }

  calculateProfitLoss(trade: ICreateTrade): number {
    const { strikePrice, optionPremium, positionType, optionType } = trade;
    const quantity = trade.quantity ?? 1;

    let intrinsicValue = 0;
    if (optionType === "call") {
      intrinsicValue = Math.max(0, trade.exitPrice - strikePrice!);
    } else if (optionType === "put") {
      intrinsicValue = Math.max(0, strikePrice! - trade.exitPrice);
    }

    const pnl =
      positionType === "long"
        ? (intrinsicValue - optionPremium!) * quantity
        : (optionPremium! - intrinsicValue) * quantity;

    return pnl;
  }

  computeFullTrade(trade: ICreateTrade): ICreateTrade {
    const finalizedTrade = finalizeTrade(trade, this);

    // Initialize `profitLoss` and `improvementSuggestions` if undefined
    finalizedTrade.profitLoss = finalizedTrade.profitLoss ?? 0;
    finalizedTrade.improvementSuggestions =
      finalizedTrade.improvementSuggestions ?? [];

    // Apply improvement suggestions based on profit/loss
    if (finalizedTrade.profitLoss <= 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Review option premium and strike price.",
        description:
          "Ensure your option premium is appropriately priced relative to the underlying asset's volatility.",
        why: "An improperly priced option can diminish profits or increase losses, especially when volatility changes.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider adjusting the expiration date.",
        description:
          "Longer expiration periods might provide more flexibility in capturing profit.",
        why: "A longer expiration allows more time for price movement, potentially leading to better outcomes.",
      });
    }

    if (finalizedTrade.profitLoss > 0) {
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Consider hedging with options to mitigate risk.",
        description:
          "Explore strategies like covered calls to protect long positions or minimize potential losses.",
        why: "Hedging with options can protect you from significant downside risk while preserving potential upside.",
      });
      finalizedTrade.improvementSuggestions.push({
        suggestion: "Review the volatility of the underlying asset.",
        description:
          "Options are sensitive to volatility, so monitor asset volatility to determine potential price swings.",
        why: "Understanding volatility can improve the accuracy of your options trading strategy.",
      });
    }

    return finalizedTrade;
  }
}
