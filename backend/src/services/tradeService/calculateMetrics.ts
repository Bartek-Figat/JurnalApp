import { Database } from "../../db/dbConnect";

export class CalculateTradeMetricsRepository {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);

  /**
   * Calculates various metrics for the user's trades including investment return,
   * expense ratio, and savings rate.
   * @param req - The request object containing user information.
   * @returns The calculated metrics for the user's trades.
   */
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

    const pipeline = [
      {
        $match: { authorId: userId },
      },
      {
        $group: {
          _id: "$tradeType",
          totalInvestment: {
            $sum: {
              $multiply: [
                { $ifNull: ["$entryPrice", 0] },
                { $ifNull: ["$quantity", { $ifNull: ["$units", 1] }] }, // Use quantity or units
              ],
            },
          },
          wins: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] } },
          losses: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          tradeType: "$_id",
          totalInvestment: { $round: ["$totalInvestment", 2] }, // Round to 2 decimal places
          wins: 1,
          losses: 1,
          totalTrades: { $add: ["$wins", "$losses"] },
          winPercentage: {
            $cond: [
              { $gt: [{ $add: ["$wins", "$losses"] }, 0] },
              {
                $multiply: [
                  { $divide: ["$wins", { $add: ["$wins", "$losses"] }] },
                  100,
                ],
              },
              0,
            ],
          },
          lossPercentage: {
            $cond: [
              { $gt: [{ $add: ["$wins", "$losses"] }, 0] },
              {
                $multiply: [
                  { $divide: ["$losses", { $add: ["$wins", "$losses"] }] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ];

    try {
      return {
        result: await this.db.aggregate(pipeline).toArray(),
        calculateAdvancedMetrics: await this.calculateAdvancedMetrics(req),
        pnLCalculator: await this.pnLCalculator(req),
        calculateMetrics: await this.calculateMetrics(req),
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

    return result[0];
  }

  /**
   * Calculates the win/loss percentage for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated win/loss percentages for each trade type.
   */
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

    return result;
  }

  /**
   * Calculates the Profit and Loss (PnL) for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated PnL for each trade type.
   */
  async pnLCalculator(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    try {
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

      return result;
    } catch (error) {
      console.error("Error calculating PnL:", error);
      throw new Error("Failed to calculate PnL");
    }
  }

  /**
   * Calculates advanced metrics for the user's trades, similar to calculateMetricsAdvence.
   * @param req - The request object containing user information.
   * @returns The calculated advanced metrics for the user's trades.
   */
  async calculateAdvancedMetrics(req: any) {
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
    return result[0];
  }
}
