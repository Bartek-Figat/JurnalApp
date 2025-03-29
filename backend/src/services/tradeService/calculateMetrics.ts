import { Database } from "../../db/dbConnect";

export class CalculateTradeMetricsRepository {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);

  async calculateMetrics(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const userTrades = await this.db.find({ authorId: userId }).toArray();
    function roundToTwoDecimals(num: number): number {
      return Math.round(num * 100) / 100;
    }

    const investmentReturn = userTrades.reduce((total, trade) => {
      return total + (trade.exitPrice - trade.entryPrice) * trade.quantity;
    }, 0);

    const totalFees = userTrades.reduce(
      (total, trade) => total + trade.fees,
      0
    );
    const totalInvestment = userTrades.reduce(
      (total, trade) => total + trade.entryPrice * trade.quantity,
      0
    );
    const expenseRatio = totalFees / totalInvestment;

    const totalSavings = userTrades.reduce(
      (total, trade) => total + trade.profitLoss,
      0
    );
    const savingsRate = totalSavings / totalInvestment;

    return {
      investmentReturn: roundToTwoDecimals(investmentReturn),
      expenseRatio: roundToTwoDecimals(expenseRatio),
      savingsRate: roundToTwoDecimals(savingsRate),
    };
  }

  // ==============================================================

  async calculateWinsAndLosses(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;
    const pipeline = [
      { $match: { authorId: userId } },
      {
        $group: {
          _id: {
            tradeType: "$tradeType",
            tradeOutcome: "$tradeOutcome",
          },
          totalProfit: {
            $sum: {
              $cond: [{ $eq: ["$tradeOutcome", "win"] }, "$profitLoss", 0],
            },
          },
          totalLoss: {
            $sum: {
              $cond: [
                { $eq: ["$tradeOutcome", "loss"] },
                { $abs: "$profitLoss" },
                0,
              ],
            },
          },
          totalInvestment: { $sum: { $ifNull: ["$investment", 0] } },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.tradeType",
          wins: {
            $push: {
              outcome: "$_id.tradeOutcome",
              totalProfit: "$totalProfit",
              count: "$count",
            },
          },
          losses: {
            $push: {
              outcome: "$_id.tradeOutcome",
              totalLoss: "$totalLoss",
              count: "$count",
            },
          },
          totalInvestment: { $first: "$totalInvestment" },
        },
      },
    ];

    const results = await this.db.aggregate(pipeline).toArray();

    console.log(...results);

    const tradeMetrics = {
      totalInvestment: 0,
      totalWins: 0,
      totalLosses: 0,
      totalTrades: 0,
      gainPercentage: 0,
      wins: {
        stock: { count: 0, totalProfit: 0, avgProfit: 0 },
        forex: { count: 0, totalProfit: 0, avgProfit: 0 },
        crypto: { count: 0, totalProfit: 0, avgProfit: 0 },
        "crypto spot": { count: 0, totalProfit: 0, avgProfit: 0 },
        option: { count: 0, totalProfit: 0, avgProfit: 0 },
      },
      losses: {
        stock: { count: 0, totalLoss: 0, avgLoss: 0 },
        forex: { count: 0, totalLoss: 0, avgLoss: 0 },
        crypto: { count: 0, totalLoss: 0, avgLoss: 0 },
        "crypto spot": { count: 0, totalLoss: 0, avgLoss: 0 },
        option: { count: 0, totalLoss: 0, avgLoss: 0 },
      },
    };

    results.forEach((result) => {
      const type = result._id.tradeType as keyof typeof tradeMetrics.wins;

      const winData = result.wins.find(
        (w: { outcome: string }) => w.outcome === "win"
      ) || { totalProfit: 0, count: 0 };
      const lossData = result.losses.find(
        (l: { outcome: string }) => l.outcome === "loss"
      ) || { totalLoss: 0, count: 0 };

      tradeMetrics.wins[type].count += winData.count;
      tradeMetrics.wins[type].totalProfit += winData.totalProfit;
      tradeMetrics.losses[type].count += lossData.count;
      tradeMetrics.losses[type].totalLoss += lossData.totalLoss;

      tradeMetrics.totalInvestment += result.totalInvestment;
      tradeMetrics.totalTrades += winData.count + lossData.count;
      tradeMetrics.totalWins += winData.totalProfit;
      tradeMetrics.totalLosses += lossData.totalLoss;
    });

    for (const type of Object.keys(tradeMetrics.wins) as Array<
      keyof typeof tradeMetrics.wins
    >) {
      if (tradeMetrics.wins[type].count > 0) {
        tradeMetrics.wins[type].avgProfit =
          tradeMetrics.wins[type].totalProfit / tradeMetrics.wins[type].count;
      }
      if (tradeMetrics.losses[type].count > 0) {
        tradeMetrics.losses[type].avgLoss =
          tradeMetrics.losses[type].totalLoss / tradeMetrics.losses[type].count;
      }
    }

    // Calculate gain percentage
    if (tradeMetrics.totalInvestment > 0) {
      tradeMetrics.gainPercentage =
        ((tradeMetrics.totalWins - tradeMetrics.totalLosses) /
          tradeMetrics.totalInvestment) *
        100;
    }

    return results;
  }
}
