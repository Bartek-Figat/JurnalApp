import { Database } from "../../db/dbConnect";

interface Trade {
  tradeType: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  units?: number;
  tradeOutcome: string;
  authorId: string;
  fees: number;
  profitLoss: number;
  entryDate: string;
  exitDate: string;
  symbol: string;
}

interface TradeTypeMetrics {
  totalInvestment: number;
  wins: number;
  losses: number;
}

interface TradeTypeStats {
  wins: number;
  losses: number;
  totalCount: number;
}

interface TransactionsByTime {
  entryDate: string;
  exitDate: string;
  symbol: string;
  transactionCount: number;
}

interface TotalGains {
  symbol: string;
  exitPrice: number;
  totalGain: number;
  entryPrice: number;
  quantity: number;
}

export class CalculateTradeMetricsRepositoryTS {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);

  /**
   * Calculates various metrics for the user's trades including investment return,
   * expense ratio, and savings rate.
   * @param req - The request object containing user information.
   * @returns The calculated metrics for the user's trades.
   */
  async calculateMetrics(req: any): Promise<any> {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const totalInvestmentReturn = trades.reduce((sum, trade) => {
        return sum + (trade.exitPrice - trade.entryPrice) * trade.quantity;
      }, 0);

      const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);

      const totalInvestment = trades.reduce((sum, trade) => {
        return sum + trade.entryPrice * trade.quantity;
      }, 0);

      const totalSavings = trades.reduce(
        (sum, trade) => sum + trade.profitLoss,
        0
      );

      const investmentReturn = parseFloat(totalInvestmentReturn.toFixed(2));

      const expenseRatio =
        totalInvestment === 0
          ? 0
          : parseFloat((totalFees / totalInvestment).toFixed(2));

      const savingsRate =
        totalInvestment === 0
          ? 0
          : parseFloat((totalSavings / totalInvestment).toFixed(2));

      return {
        investmentReturn,
        expenseRatio,
        savingsRate,
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      throw new Error("Failed to calculate metrics");
    }
  }

  /**
   * Calculates the total wins and losses for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated wins and losses for each trade type.
   */
  async calculateWinsAndLosses(req: { user: { decoded: { userId: string } } }) {
    const userId = req.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades: Trade[] = await this.db
        .find<Trade>({ authorId: userId })
        .toArray();

      const tradeTypes: { [key: string]: TradeTypeMetrics } = trades.reduce(
        (acc: { [key: string]: TradeTypeMetrics }, trade: Trade) => {
          if (!acc[trade.tradeType]) {
            acc[trade.tradeType] = { totalInvestment: 0, wins: 0, losses: 0 };
          }

          acc[trade.tradeType].totalInvestment +=
            (trade.entryPrice || 0) * (trade.quantity || trade.units || 1);
          if (trade.tradeOutcome === "win") acc[trade.tradeType].wins += 1;
          if (trade.tradeOutcome === "loss") acc[trade.tradeType].losses += 1;

          return acc;
        },
        {}
      );

      const result = Object.keys(tradeTypes).map((tradeType) => {
        const { totalInvestment, wins, losses } = tradeTypes[tradeType];
        const totalTrades = wins + losses;
        const winPercentage =
          totalTrades > 0
            ? parseFloat(((wins / totalTrades) * 100).toFixed(2))
            : 0;
        const lossPercentage =
          totalTrades > 0
            ? parseFloat(((losses / totalTrades) * 100).toFixed(2))
            : 0;

        return {
          tradeType,
          totalInvestment: parseFloat(totalInvestment.toFixed(2)),
          wins,
          losses,
          totalTrades,
          winPercentage,
          lossPercentage,
        };
      });

      return {
        result,
        calculateAdvancedMetrics: await this.calculateAdvancedMetrics(req),
        pnLCalculator: await this.pnLCalculator(req),
        calculateMetrics: await this.calculateMetrics(req),
        countTransactionsByTime: await this.countTransactionsByTime(req),
      };
    } catch (error) {
      console.error("Error calculating wins and losses:", error);
      throw new Error("Failed to calculate wins and losses");
    }
  }

  /**
   * Calculates advanced metrics for the user's trades including ROI,
   * net profit, and risk-reward ratio.
   * @param req - The request object containing user information.
   * @returns The calculated advanced metrics for the user's trades.
   */
  async calculateAdvancedMetrics(req: any) {
    const userId = req?.user?.decoded?.userId;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      let totalInvestmentReturn = 0;
      let totalFees = 0;
      let totalInvestment = 0;
      let totalSavings = 0;
      let totalProfit = 0;
      let totalLoss = 0;
      let winCount = 0;
      let lossCount = 0;

      for (const trade of trades) {
        const investmentReturn =
          (trade.exitPrice - trade.entryPrice) * trade.quantity;
        totalInvestmentReturn += investmentReturn;
        totalFees += trade.fees;
        totalInvestment += trade.entryPrice * trade.quantity;
        totalSavings += trade.profitLoss;

        if (trade.tradeOutcome === "win") {
          totalProfit += trade.profitLoss;
          winCount++;
        } else if (trade.tradeOutcome === "loss") {
          totalLoss += Math.abs(trade.profitLoss);
          lossCount++;
        }
      }

      const totalCount = trades.length;

      const investmentReturn = parseFloat(totalInvestmentReturn.toFixed(2));
      const expenseRatio = totalInvestment
        ? parseFloat((totalFees / totalInvestment).toFixed(2))
        : 0;
      const savingsRate = totalInvestment
        ? parseFloat((totalSavings / totalInvestment).toFixed(2))
        : 0;
      const ROI = totalInvestment
        ? parseFloat(
            ((totalInvestmentReturn / totalInvestment) * 100).toFixed(2)
          )
        : 0;
      const breakEvenPercentage = totalInvestment
        ? parseFloat(((totalFees / totalInvestment) * 100).toFixed(2))
        : 0;
      const riskRewardRatio = totalLoss
        ? parseFloat((totalProfit / totalLoss).toFixed(2))
        : 0;
      const netProfit = parseFloat((totalProfit - totalLoss).toFixed(2));
      const winPercentage = totalCount
        ? parseFloat(((winCount / totalCount) * 100).toFixed(2))
        : 0;

      return {
        investmentReturn,
        expenseRatio,
        savingsRate,
        transactionCosts: totalFees,
        ROI,
        breakEvenPercentage,
        riskRewardRatio,
        netProfit,
        winPercentage,
        winCount,
        lossCount,
      };
    } catch (error) {
      console.error("Error calculating advanced metrics:", error);
      throw new Error("Failed to calculate advanced metrics");
    }
  }

  /**
   * Calculates the win/loss percentage for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated win/loss percentages for each trade type.
   */
  async calculateWinLossPercentage(req: any): Promise<any> {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const tradeTypes: { [key: string]: TradeTypeStats } = trades.reduce(
        (acc, trade) => {
          if (!acc[trade.tradeType]) {
            acc[trade.tradeType] = { wins: 0, losses: 0, totalCount: 0 };
          }

          if (trade.tradeOutcome === "win") acc[trade.tradeType].wins += 1;
          if (trade.tradeOutcome === "loss") acc[trade.tradeType].losses += 1;
          acc[trade.tradeType].totalCount += 1;

          return acc;
        },
        {} as { [key: string]: TradeTypeStats }
      );

      const result = Object.keys(tradeTypes).map((tradeType) => {
        const { wins, losses, totalCount } = tradeTypes[tradeType];
        const winPercentage =
          totalCount > 0
            ? parseFloat(((wins / totalCount) * 100).toFixed(2))
            : 0;
        const lossPercentage =
          totalCount > 0
            ? parseFloat(((losses / totalCount) * 100).toFixed(2))
            : 0;

        return {
          tradeType,
          winPercentage,
          lossPercentage,
        };
      });

      return result;
    } catch (error) {
      console.error("Error calculating win/loss percentage:", error);
      throw new Error("Failed to calculate win/loss percentage");
    }
  }

  /**
   * Calculates the Profit and Loss (PnL) for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated PnL for each trade type.
   */
  async pnLCalculator(req: any): Promise<any> {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const tradeTypes: { [key: string]: TradeTypeStats } = trades.reduce(
        (acc, trade) => {
          if (!acc[trade.tradeType]) {
            acc[trade.tradeType] = { wins: 0, losses: 0, totalCount: 0 };
          }

          if (trade.tradeOutcome === "win") acc[trade.tradeType].wins += 1;
          if (trade.tradeOutcome === "loss") acc[trade.tradeType].losses += 1;
          acc[trade.tradeType].totalCount += 1;

          return acc;
        },
        {} as { [key: string]: TradeTypeStats }
      );

      const result = Object.keys(tradeTypes).map((tradeType) => {
        const { wins, losses, totalCount } = tradeTypes[tradeType];
        const winPercentage =
          totalCount > 0
            ? parseFloat(((wins / totalCount) * 100).toFixed(2))
            : 0;
        const lossPercentage =
          totalCount > 0
            ? parseFloat(((losses / totalCount) * 100).toFixed(2))
            : 0;

        return {
          tradeType,
          winPercentage,
          lossPercentage,
        };
      });

      return result;
    } catch (error) {
      console.error("Error calculating PnL:", error);
      throw new Error("Failed to calculate PnL");
    }
  }

  /**
   * Counts all transactions by entryDate and exitDate.
   * @param req - The request object containing user information.
   * @returns The count of transactions grouped by entryDate and exitDate.
   */
  async countTransactionsByTime(req: {
    user: { decoded: { userId: string } };
  }): Promise<any> {
    const userId = req.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const transactionsByTime: { [key: string]: TransactionsByTime } =
        trades.reduce((acc, trade) => {
          const key = `${trade.entryDate}-${trade.exitDate}-${trade.symbol}`;
          if (!acc[key]) {
            acc[key] = {
              entryDate: trade.entryDate,
              exitDate: trade.exitDate,
              symbol: trade.symbol,
              transactionCount: 0,
            };
          }
          acc[key].transactionCount += 1;

          return acc;
        }, {} as { [key: string]: TransactionsByTime });

      return Object.values(transactionsByTime);
    } catch (error) {
      console.error("Error counting transactions by time:", error);
      throw new Error("Failed to count transactions by time");
    }
  }

  /**
   * Calculates the total gains for the user's trades.
   * @param req - The request object containing user information.
   * @returns The calculated total gains for the user's trades.
   */
  async calculateTotalGains(req: any): Promise<any> {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const totalGains: { [key: string]: TotalGains } = trades.reduce(
        (acc, trade) => {
          const key = `${trade.symbol}-${trade.entryDate}-${trade.exitDate}`;
          if (!acc[key]) {
            acc[key] = {
              symbol: trade.symbol,
              exitPrice: trade.exitPrice,
              totalGain: 0,
              entryPrice: trade.entryPrice,
              quantity: trade.quantity,
            };
          }
          acc[key].totalGain +=
            (trade.exitPrice - trade.entryPrice) * trade.quantity;

          return acc;
        },
        {} as { [key: string]: TotalGains }
      );

      const result = Object.values(totalGains).map((gain) => {
        const { symbol, exitPrice, totalGain, entryPrice, quantity } = gain;
        const gainPercentage =
          exitPrice && quantity
            ? parseFloat(
                ((totalGain / (entryPrice * quantity)) * 100).toFixed(2)
              )
            : 0;

        return {
          symbol,
          exitPrice,
          gainPercentage,
        };
      });

      return result;
    } catch (error) {
      console.error("Error calculating total gains:", error);
      throw new Error("Failed to calculate total gains");
    }
  }

  /**
   * Analyzes risk based on past trades, identifying which trade types are highest and lowest risk.
   * @param req - The request object containing user information.
   * @returns An array showing risk scores per trade type and their classification.
   */
  async analyzeTradeRisk(req: any): Promise<any> {
    const userId = req?.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const pipeline = [
        { $match: { authorId: userId } }, // Match by userId
        {
          $project: {
            dayOfWeek: {
              $mod: [
                {
                  $dayOfWeek: { $toDate: "$exitDate" }, // Convert exitDate to Date first
                },
                7,
              ],
            },
          },
        },
        {
          $project: {
            dayName: {
              $arrayElemAt: [
                [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                { $subtract: ["$dayOfWeek", 1] }, // Adjust to make Monday = 0, Sunday = 6
              ],
            },
            dayOfWeek: 1, // Keep dayOfWeek for reference
          },
        },
        {
          $group: {
            _id: "$dayName", // Group by the day name
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by day name (alphabetically)
        },
      ];

      const trades = await this.db.aggregate(pipeline).toArray();
      return trades;
    } catch (error) {
      console.error("Error analyzing trade risk:", error);
      throw new Error("Failed to analyze trade risk");
    }
  }
}
