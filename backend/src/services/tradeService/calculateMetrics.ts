import { Database } from "../../db/dbConnect";

export class CalculateTradeMetricsRepository {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);

  async calculateMetrics(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    const pipeline = [
      { $match: { authorId: userId } },
      {
        $group: {
          _id: null,
          totalInvestmentReturn: {
            $sum: {
              $multiply: [
                { $subtract: ["$exitPrice", "$entryPrice"] },
                "$quantity",
              ],
            },
          },
          totalFees: { $sum: "$fees" },
          totalInvestment: {
            $sum: { $multiply: ["$entryPrice", "$quantity"] },
          },
          totalSavings: { $sum: "$profitLoss" },
        },
      },
      {
        $project: {
          _id: 0,
          investmentReturn: {
            $round: ["$totalInvestmentReturn", 2],
          },
          expenseRatio: {
            $round: [{ $divide: ["$totalFees", "$totalInvestment"] }, 2],
          },
          savingsRate: {
            $round: [{ $divide: ["$totalSavings", "$totalInvestment"] }, 2],
          },
        },
      },
    ];

    const result = await this.db.aggregate(pipeline).toArray();
    console.log(result);
    return result[0];
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
          totalWins: {
            $sum: { $cond: [{ $eq: ["$_id.tradeOutcome", "win"] }, 1, 0] },
          },
          totalLosses: {
            $sum: { $cond: [{ $eq: ["$_id.tradeOutcome", "loss"] }, 1, 0] },
          },
          totalTrades: { $sum: 1 },
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
      {
        $project: {
          _id: 0,
          tradeType: "$_id",
          totalWins: 1,
          totalLosses: 1,
          totalTrades: 1,
          winPercentage: {
            $round: [
              { $multiply: [{ $divide: ["$totalWins", "$totalTrades"] }, 100] },
              2,
            ],
          },
          lossPercentage: {
            $round: [
              {
                $multiply: [{ $divide: ["$totalLosses", "$totalTrades"] }, 100],
              },
              2,
            ],
          },
          wins: {
            $filter: {
              input: "$wins",
              as: "win",
              cond: { $eq: ["$$win.outcome", "win"] },
            },
          },
          losses: {
            $filter: {
              input: "$losses",
              as: "loss",
              cond: { $eq: ["$$loss.outcome", "loss"] },
            },
          },
          totalInvestment: 1,
        },
      },
      {
        $project: {
          tradeType: 1,
          wins: { $arrayElemAt: ["$wins", 0] },
          losses: { $arrayElemAt: ["$losses", 0] },
          totalInvestment: 1,
          winPercentage: 1,
          lossPercentage: 1,
        },
      },
    ];

    return await this.db.aggregate(pipeline).toArray();
  }

  async calculateMetricsAdvence(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    const pipeline = [
      { $match: { authorId: userId } },
      {
        $group: {
          _id: null,
          totalInvestmentReturn: {
            $sum: {
              $multiply: [
                { $subtract: ["$exitPrice", "$entryPrice"] },
                "$quantity",
              ],
            },
          },
          totalFees: { $sum: "$fees" },
          totalInvestment: {
            $sum: { $multiply: ["$entryPrice", "$quantity"] },
          },
          totalSavings: { $sum: "$profitLoss" },
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
          winCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          lossCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          investmentReturn: {
            $round: ["$totalInvestmentReturn", 2],
          },
          expenseRatio: {
            $round: [{ $divide: ["$totalFees", "$totalInvestment"] }, 2],
          },
          savingsRate: {
            $round: [{ $divide: ["$totalSavings", "$totalInvestment"] }, 2],
          },
          transactionCosts: "$totalFees",
          ROI: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalInvestmentReturn", "$totalInvestment"] },
                  100,
                ],
              },
              2,
            ],
          },
          breakEvenPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalFees", "$totalInvestment"] },
                  100,
                ],
              },
              2,
            ],
          },
          riskRewardRatio: {
            $round: [
              {
                $divide: ["$totalProfit", "$totalLoss"],
              },
              2,
            ],
          },
          netProfit: {
            $round: [
              {
                $subtract: ["$totalProfit", "$totalLoss"],
              },
              2,
            ],
          },
          winPercentage: {
            $round: [
              {
                $multiply: [{ $divide: ["$winCount", "$totalCount"] }, 100],
              },
              2,
            ],
          },
        },
      },
    ];

    const result = await this.db.aggregate(pipeline).toArray();
    console.log(result);
    return result[0];
  }

  async calculateWinLossPercentage(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    const pipeline = [
      { $match: { authorId: userId } },
      {
        $group: {
          _id: {
            tradeType: "$tradeType",
            tradeOutcome: "$tradeOutcome",
          },
          winCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] },
          },
          lossCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.tradeType",
          wins: { $sum: "$winCount" },
          losses: { $sum: "$lossCount" },
          totalCount: { $sum: "$totalCount" },
        },
      },
      {
        $project: {
          _id: 0,
          tradeType: "$_id",
          winPercentage: {
            $round: [
              { $multiply: [{ $divide: ["$wins", "$totalCount"] }, 100] },
              2,
            ],
          },
          lossPercentage: {
            $round: [
              { $multiply: [{ $divide: ["$losses", "$totalCount"] }, 100] },
              2,
            ],
          },
        },
      },
    ];

    const result = await this.db.aggregate(pipeline).toArray();
    console.log(result);
    return result;
  }
}
