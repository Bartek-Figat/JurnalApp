import { Document, WithId } from "mongodb";
import { Database } from "../../db/dbConnect";
import { TradeMetric } from "./ITradeMetricsResult";
import { FinancialCalculator } from "./tradeService";
import { ICreateTrade } from "../../interface/interface";

interface AggregatedTradeResult {
  tradeType: string;
  totalInvestment: number;
  adjustedTotalInvestment: number;
  wins: number;
  losses: number;
  totalProfit: number;
  totalLoss: number;
  totalTrades: number;
  avgPriceReturn: number;
  winPercentage: number;
  lossPercentage: number;
  totalReturn: number;
  netOutcome: number;
  winLossPercentageSummary: string;
}

interface DayOfWeek {
  dayOfWeek: number;
  dayName: string;
}

interface TurnoverDay {
  dayName: string;
  totalTurnover: number;
  turnoverPercentage: number;
  profitLoss: number;
  gainPercentage: number;
}

interface TurnoverResult {
  days: TurnoverDay[];
}

export class CalculateTradeMetricsRepository {
  private readonly trades: string = "trades";
  private db = new Database().getCollection(this.trades);
  //FinancialCalculator
  private financialCalculator: FinancialCalculator = new FinancialCalculator();
  private readonly DAYS_OF_WEEK: DayOfWeek[] = [
    { dayOfWeek: 1, dayName: "Sunday" },
    { dayOfWeek: 2, dayName: "Monday" },
    { dayOfWeek: 3, dayName: "Tuesday" },
    { dayOfWeek: 4, dayName: "Wednesday" },
    { dayOfWeek: 5, dayName: "Thursday" },
    { dayOfWeek: 6, dayName: "Friday" },
    { dayOfWeek: 7, dayName: "Saturday" },
  ];

  /**
   * Calculates various metrics for the user's trades including investment return,
   * expense ratio, and savings rate.
   * @param req - The request object containing user information.
   * @returns The calculated metrics for the user's trades.
   */
  async calculateMetrics(req: any): Promise<TradeMetric[]> {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const pipeline = [
      // Match documents based on the provided `userId`
      {
        $match: { authorId: userId },
      },

      // Group documents to calculate aggregated values
      {
        $group: {
          _id: null, // Group all documents into a single group
          totalInvestmentReturn: {
            $sum: {
              $multiply: [
                { $subtract: ["$exitPrice", "$entryPrice"] }, // Calculate price difference
                "$quantity", // Multiply by quantity
              ],
            },
          },
          totalFees: { $sum: "$fees" }, // Sum of all fees
          totalInvestment: {
            $sum: { $multiply: ["$entryPrice", "$quantity"] }, // Calculate total investment
          },
          totalSavings: { $sum: "$profitLoss" }, // Sum of the profit/loss
        },
      },

      // Project the desired output fields
      {
        $project: {
          _id: 0, // Exclude `_id` from the result
          investmentReturn: {
            $round: ["$totalInvestmentReturn", 2], // Round investment return to 2 decimal places
          },
          expenseRatio: {
            $round: [
              {
                $cond: {
                  if: { $eq: ["$totalInvestment", 0] }, // Avoid division by zero
                  then: 0,
                  else: { $divide: ["$totalFees", "$totalInvestment"] }, // Calculate expense ratio
                },
              },
              2, // Round to 2 decimal places
            ],
          },
          savingsRate: {
            $round: [
              {
                $cond: {
                  if: { $eq: ["$totalInvestment", 0] }, // Avoid division by zero
                  then: 0,
                  else: { $divide: ["$totalSavings", "$totalInvestment"] }, // Calculate savings rate
                },
              },
              2, // Round to 2 decimal places
            ],
          },
        },
      },
    ];

    try {
      const result = await this.db.aggregate<TradeMetric[]>(pipeline).toArray();

      return result[0];
    } catch (error) {
      console.error("Error calculating metrics:", error);
      throw new Error("Failed to calculate metrics");
    }
  }

  // ==============================================================

  /**
   * Calculates the total wins and losses for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated wins and losses for each trade type.
   */
  async calculateWinsAndLosses(req: any) {
    const userId = req.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const calculateProfitLoss = (trade: any): number => {
      switch (trade.tradeType) {
        case "crypto spot":
          return (
            (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees
          );
        case "crypto":
          return (
            (trade.exitPrice - trade.entryPrice) *
              trade.quantity *
              trade.leverage -
            trade.fees
          );
        case "forex":
          return (
            (trade.exitPrice - trade.entryPrice) *
              trade.units *
              (trade.usdExchangeRate || 1) -
            trade.fees
          );
        case "stock":
          return (
            (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees
          );
        default:
          return 0;
      }
    };

    const calculateGainPercentage = (
      trade: any,
      profitLoss: number
    ): number => {
      const totalInvestment = trade.entryPrice * trade.quantity - trade.fees;
      if (profitLoss === 0 || totalInvestment === 0) return 0;
      return (profitLoss / totalInvestment) * 100;
    };

    const calculateTotalInvestment = (trade: any): number => {
      switch (trade.tradeType) {
        case "crypto":
          return trade.entryPrice * trade.quantity * trade.leverage;
        case "forex":
          return trade.entryPrice * trade.units * (trade.usdExchangeRate || 1);
        case "crypto spot":
        case "stock":
          return trade.entryPrice * trade.quantity;
        default:
          return trade.entryPrice * trade.quantity;
      }
    };

    const calculatePriceReturn = (trade: any): number => {
      if (trade.entryPrice === 0) return 0;
      return ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
    };

    const calculateAdjustedTotalInvestment = (
      totalProfit: number,
      totalLoss: number,
      totalInvestment: number
    ): number => {
      if (totalProfit === 0 || totalLoss === 0) return totalInvestment;
      return totalProfit + totalLoss;
    };

    const aggregateTrades = (trades: any): AggregatedTradeResult[] => {
      const grouped = trades.reduce((acc: any, trade: any) => {
        const profitLoss = calculateProfitLoss(trade);
        const totalInvestment = calculateTotalInvestment(trade);
        const gainPercentage = calculateGainPercentage(trade, profitLoss); // Calculate gain percentage for this trade
        const priceReturn = calculatePriceReturn(trade);
        const adjustedTotalInvestment = calculateAdjustedTotalInvestment(
          0,
          0,
          totalInvestment
        );

        // Initialize group if it doesn't exist
        if (!acc[trade.tradeType]) {
          acc[trade.tradeType] = {
            totalInvestment: 0,
            adjustedTotalInvestment: 0,
            wins: 0,
            losses: 0,
            totalProfit: 0,
            totalLoss: 0,
            totalTrades: 0,
            avgPriceReturn: 0,
            totalGainPercentage: 0, // Add a field for accumulating gain percentages
          };
        }

        // Accumulate data for each trade type
        acc[trade.tradeType].totalInvestment += totalInvestment;
        acc[trade.tradeType].adjustedTotalInvestment += adjustedTotalInvestment;
        acc[trade.tradeType].totalProfit += profitLoss > 0 ? profitLoss : 0;
        acc[trade.tradeType].totalLoss += profitLoss < 0 ? profitLoss : 0;
        acc[trade.tradeType].totalTrades++;
        acc[trade.tradeType].avgPriceReturn += priceReturn;
        acc[trade.tradeType].totalGainPercentage += gainPercentage; // Accumulate the gain percentage

        if (profitLoss > 0) acc[trade.tradeType].wins++;
        if (profitLoss < 0) acc[trade.tradeType].losses++;

        return acc;
      }, {} as Record<string, any>);

      // Now, calculate the result for each trade type, including the average gain percentage
      return Object.keys(grouped).map((tradeType) => {
        const {
          totalInvestment,
          adjustedTotalInvestment,
          wins,
          losses,
          totalProfit,
          totalLoss,
          totalTrades,
          avgPriceReturn,
          totalGainPercentage,
        } = grouped[tradeType];

        const winPercentage =
          totalTrades === 0 ? 0 : (wins / totalTrades) * 100;
        const lossPercentage =
          totalTrades === 0 ? 0 : (losses / totalTrades) * 100;
        const totalReturn =
          totalInvestment === 0 ? 0 : (totalProfit / totalInvestment) * 100;
        const netOutcome = totalProfit + totalLoss;
        const avgGainPercentage =
          totalTrades === 0 ? 0 : totalGainPercentage / totalTrades;

        const winLossPercentageSummary =
          totalTrades === 0
            ? "Wins: 0%, Losses: 0%"
            : `Wins: ${winPercentage.toFixed(
                2
              )}%, Losses: ${lossPercentage.toFixed(2)}%`;

        return {
          tradeType,
          totalInvestment: parseFloat(totalInvestment.toFixed(2)),
          adjustedTotalInvestment: parseFloat(
            adjustedTotalInvestment.toFixed(2)
          ),
          wins,
          losses,
          totalProfit,
          totalLoss,
          totalTrades,
          avgPriceReturn: parseFloat((avgPriceReturn / totalTrades).toFixed(2)),
          avgGainPercentage: parseFloat(avgGainPercentage.toFixed(2)), // Include average gain percentage in result
          winPercentage,
          lossPercentage,
          totalReturn: parseFloat(totalReturn.toFixed(2)),
          netOutcome: parseFloat(netOutcome.toFixed(2)),
          winLossPercentageSummary,
        };
      });
    };

    const trades = await this.db
      .find({ authorId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(aggregateTrades(trades));

    try {
      return {
        result: aggregateTrades(trades),
        calculateAdvancedMetrics: await this.calculateAdvancedMetrics(req),
        pnLCalculator: await this.pnLCalculator(req),
        calculateMetrics: await this.calculateMetrics(req),
        countTransactionsByTime: await this.countTransactionsByTime(req),
        calculateBestTradingTimes: await this.calculateBestTradingTimes(req),
        calculateTurnoverByDays: await this.calculateTurnoverByDays(req),
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
    // Extract the userId from the request
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    // Ensure that a valid userId is provided
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Define the aggregation pipeline for MongoDB
    const pipeline = [
      // Match documents based on the provided `userId`
      {
        $match: { authorId: userId },
      },

      // Add fields for calculations
      {
        $addFields: {
          // Calculate position-specific profit/loss
          calculatedProfitLoss: {
            $cond: {
              if: { $eq: ["$positionType", "short"] },
              then: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$entryPrice", "$exitPrice"] },
                      { $ifNull: ["$quantity", 1] },
                      { $ifNull: ["$multiplier", 1] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
              else: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$exitPrice", "$entryPrice"] },
                      { $ifNull: ["$quantity", 1] },
                      { $ifNull: ["$multiplier", 1] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
            },
          },
          // Calculate total investment per trade
          tradeInvestment: {
            $multiply: [
              "$entryPrice",
              { $ifNull: ["$quantity", 1] },
              { $ifNull: ["$multiplier", 1] },
            ],
          },
        },
      },

      // Group documents and calculate aggregated values
      {
        $group: {
          _id: null,
          totalInvestmentReturn: {
            $sum: "$calculatedProfitLoss",
          },
          totalFees: {
            $sum: { $ifNull: ["$fees", 0] },
          },
          totalInvestment: {
            $sum: "$tradeInvestment",
          },
          totalSavings: {
            $sum: "$calculatedProfitLoss",
          },
          totalProfit: {
            $sum: {
              $cond: [
                { $gt: ["$calculatedProfitLoss", 0] },
                "$calculatedProfitLoss",
                0,
              ],
            },
          },
          totalLoss: {
            $sum: {
              $cond: [
                { $lt: ["$calculatedProfitLoss", 0] },
                { $abs: "$calculatedProfitLoss" },
                0,
              ],
            },
          },
          winCount: {
            $sum: {
              $cond: [{ $gt: ["$calculatedProfitLoss", 0] }, 1, 0],
            },
          },
          lossCount: {
            $sum: {
              $cond: [{ $lt: ["$calculatedProfitLoss", 0] }, 1, 0],
            },
          },
          totalCount: { $sum: 1 },
        },
      },

      // Project and calculate final metrics
      {
        $project: {
          _id: 0,
          investmentReturn: {
            $round: ["$totalInvestmentReturn", 2],
          },
          expenseRatio: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalInvestment", 0] },
                  then: {
                    $multiply: [
                      { $divide: ["$totalFees", "$totalInvestment"] },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
              2,
            ],
          },
          savingsRate: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalInvestment", 0] },
                  then: {
                    $multiply: [
                      { $divide: ["$totalSavings", "$totalInvestment"] },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
              2,
            ],
          },
          transactionCosts: {
            $round: ["$totalFees", 2],
          },
          ROI: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalInvestment", 0] },
                  then: {
                    $multiply: [
                      {
                        $divide: ["$totalInvestmentReturn", "$totalInvestment"],
                      },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
              2,
            ],
          },

          breakEvenPercentage: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalInvestment", 0] },
                  then: {
                    $multiply: [
                      { $divide: ["$totalFees", "$totalInvestment"] },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
              2,
            ],
          },
          riskRewardRatio: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalLoss", 0] },
                  then: { $divide: ["$totalProfit", "$totalLoss"] },
                  else: 0,
                },
              },
              2,
            ],
          },
          netProfit: {
            $round: [{ $subtract: ["$totalProfit", "$totalLoss"] }, 2],
          },
          winPercentage: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$totalCount", 0] },
                  then: {
                    $multiply: [{ $divide: ["$winCount", "$totalCount"] }, 100],
                  },
                  else: 0,
                },
              },
              2,
            ],
          },
          // Additional metrics
          averageProfitPerWin: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$winCount", 0] },
                  then: { $divide: ["$totalProfit", "$winCount"] },
                  else: 0,
                },
              },
              2,
            ],
          },
          averageLossPerLoss: {
            $round: [
              {
                $cond: {
                  if: { $gt: ["$lossCount", 0] },
                  then: { $divide: ["$totalLoss", "$lossCount"] },
                  else: 0,
                },
              },
              2,
            ],
          },
        },
      },
    ];

    // Descriptions of the metrics being calculated
    // const description = {
    //   metrics: [
    //     {
    //       name: "Investment Return",
    //       alias: "investmentReturn",
    //       description: "The total return on investment, calculated as the difference between exit and entry prices multiplied by quantity.",
    //       calculation: "Calculated as (exitPrice - entryPrice) * quantity for each transaction.",
    //       why_its_useful: "Shows how much was gained or lost on investment after all trades, excluding fees.",
    //     },
    //     {
    //       name: "Expense Ratio",
    //       alias: "expenseRatio",
    //       description: "The percentage of total fees in relation to total investment.",
    //       calculation: "Total fees / Total investment * 100.",
    //       why_its_useful: "Indicates how much of your investment is consumed by fees.",
    //     },
    //     {
    //       name: "Savings Rate",
    //       alias: "savingsRate",
    //       description: "The proportion of savings (profit/loss) relative to the total investment.",
    //       calculation: "Total savings / Total investment.",
    //       why_its_useful: "Shows how well your savings perform compared to your initial investment.",
    //     },
    //     {
    //       name: "Transaction Costs",
    //       alias: "transactionCosts",
    //       description: "The total fees paid during the investment process.",
    //       calculation: "Sum of all fees paid across transactions.",
    //       why_its_useful: "Helps understand the cost of performing trades.",
    //     },
    //     {
    //       name: "Return on Investment (ROI)",
    //       alias: "ROI",
    //       description: "The percentage return on investment, showing the relative gain or loss on investment.",
    //       calculation: "Investment return / Total investment * 100.",
    //       why_its_useful: "Measures profitability relative to the amount invested.",
    //     },
    //     {
    //       name: "Break-even Percentage",
    //       alias: "breakEvenPercentage",
    //       description: "The percentage of total investment that is spent on fees before breaking even.",
    //       calculation: "Total fees / Total investment * 100.",
    //       why_its_useful: "Shows what percentage of investment needs to be covered by fees before starting to profit.",
    //     },
    //     {
    //       name: "Risk/Reward Ratio",
    //       alias: "riskRewardRatio",
    //       description: "The ratio of potential reward to potential risk (loss).",
    //       calculation: "Total profit / Total loss.",
    //       why_its_useful: "Helps assess how much reward you're getting for each unit of risk taken.",
    //     },
    //     {
    //       name: "Net Profit",
    //       alias: "netProfit",
    //       description: "The difference between total profit and total loss.",
    //       calculation: "Total profit - Total loss.",
    //       why_its_useful: "Shows the overall profit after all losses have been deducted.",
    //     },
    //     {
    //       name: "Win Percentage",
    //       alias: "winPercentage",
    //       description: "The percentage of winning trades compared to total trades.",
    //       calculation: "Winning trades / Total trades * 100.",
    //       why_its_useful: "Indicates the effectiveness of the trading strategy or decision-making.",
    //     },
    //   ],
    // };

    try {
      // Execute the aggregation pipeline and return the result
      const result = await this.db.aggregate(pipeline).toArray();
      return result;
    } catch (error) {
      // Handle errors
      console.error("Error calculating advanced metrics:", error);
      throw new Error("Failed to calculate advanced metrics");
    }
  }

  /**
   * Calculates the win/loss percentage for the user's trades.
   * @param req - The request object containing user information.
   * @returns An array of calculated win/loss percentages for each trade type.
   */
  async calculateWinLossPercentage(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const pipeline = [
      // Match documents based on the provided `userId`
      {
        $match: { authorId: userId },
      },

      // Group by `tradeType` and `tradeOutcome` to calculate counts for wins and losses
      {
        $group: {
          _id: {
            tradeType: "$tradeType", // Group by tradeType
            tradeOutcome: "$tradeOutcome", // Also group by tradeOutcome
          },
          winCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] }, // Count wins
          },
          lossCount: {
            $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] }, // Count losses
          },
          totalCount: { $sum: 1 }, // Count total trades for this combination
        },
      },

      // Regroup by `tradeType` and calculate aggregate counts
      {
        $group: {
          _id: "$_id.tradeType", // Group by tradeType only
          wins: { $sum: "$winCount" }, // Sum all wins for this tradeType
          losses: { $sum: "$lossCount" }, // Sum all losses for this tradeType
          totalCount: { $sum: "$totalCount" }, // Sum all trades for this tradeType
        },
      },

      // Project final output fields including win/loss percentages
      {
        $project: {
          _id: 0, // Exclude `_id` from the result
          tradeType: "$_id", // Rename `_id` to `tradeType`
          winPercentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$totalCount", 0] }, // Avoid division by zero
                  { $multiply: [{ $divide: ["$wins", "$totalCount"] }, 100] }, // Calculate win percentage
                  0, // Default to 0 if totalCount is 0
                ],
              },
              2, // Round to 2 decimal places
            ],
          },
          lossPercentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$totalCount", 0] }, // Avoid division by zero
                  { $multiply: [{ $divide: ["$losses", "$totalCount"] }, 100] }, // Calculate loss percentage
                  0, // Default to 0 if totalCount is 0
                ],
              },
              2, // Round to 2 decimal places
            ],
          },
        },
      },
    ];

    try {
      const result = await this.db.aggregate(pipeline).toArray();
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
  async pnLCalculator(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const pipeline = [
        // Step 1: Match documents based on the provided `userId`
        {
          $match: { authorId: userId },
        },

        // Step 2: Group by `tradeType` and `tradeOutcome` to calculate win/loss counts and total counts
        {
          $group: {
            _id: {
              tradeType: "$tradeType", // Group by tradeType
              tradeOutcome: "$tradeOutcome", // Also group by tradeOutcome
            },
            winCount: {
              $sum: { $cond: [{ $eq: ["$tradeOutcome", "win"] }, 1, 0] }, // Count wins
            },
            lossCount: {
              $sum: { $cond: [{ $eq: ["$tradeOutcome", "loss"] }, 1, 0] }, // Count losses
            },
            totalCount: { $sum: 1 }, // Count total trades for this combination
          },
        },

        // Step 3: Regroup by `tradeType` and calculate aggregate counts
        {
          $group: {
            _id: "$_id.tradeType", // Group by tradeType only
            wins: { $sum: "$winCount" }, // Sum all wins for this tradeType
            losses: { $sum: "$lossCount" }, // Sum all losses for this tradeType
            totalCount: { $sum: "$totalCount" }, // Sum all trades for this tradeType
          },
        },

        // Step 4: Project final output fields including win/loss percentages
        {
          $project: {
            _id: 0, // Exclude `_id` from the result
            tradeType: "$_id", // Rename `_id` to `tradeType`
            winPercentage: {
              $round: [
                {
                  $cond: [
                    { $gt: ["$totalCount", 0] }, // Avoid division by zero
                    { $multiply: [{ $divide: ["$wins", "$totalCount"] }, 100] }, // Calculate win percentage
                    0, // Default to 0 if totalCount is 0
                  ],
                },
                2, // Round to 2 decimal places
              ],
            },
            lossPercentage: {
              $round: [
                {
                  $cond: [
                    { $gt: ["$totalCount", 0] }, // Avoid division by zero
                    {
                      $multiply: [{ $divide: ["$losses", "$totalCount"] }, 100],
                    }, // Calculate loss percentage
                    0, // Default to 0 if totalCount is 0
                  ],
                },
                2, // Round to 2 decimal places
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
   * Counts all transactions by entryDate and exitDate.
   * @param req - The request object containing user information.
   * @returns The count of transactions grouped by entryDate and exitDate.
   */
  /**
   * Counts all transactions by entryDate and exitDate.
   * @param req - The request object containing user information.
   * @returns The count of transactions grouped by entryDate and exitDate.
   */
  async countTransactionsByTime(req: {
    user: { decoded: { userId: string } };
  }) {
    const userId = req.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const pipeline = [
      // Step 1: Match documents based on the provided `userId`
      {
        $match: { authorId: userId }, // Filter by authorId
      },

      // Step 2: Group by `entryDate`, `exitDate`, and `symbol`, and calculate transaction count
      {
        $group: {
          _id: {
            entryDate: "$entryDate", // Group by entryDate
            exitDate: "$exitDate", // Group by exitDate
            symbol: "$symbol", // Group by symbol
          },
          transactionCount: { $sum: 1 }, // Count the number of transactions
        },
      },

      // Step 3: Project the grouped fields into the final output structure
      {
        $project: {
          _id: 0, // Exclude `_id` from the result
          entryDate: "$_id.entryDate", // Include entryDate in the result
          exitDate: "$_id.exitDate", // Include exitDate in the result
          symbol: "$_id.symbol", // Include symbol in the result
          transactionCount: 1, // Include transactionCount in the result
        },
      },
    ];

    try {
      const result = await this.db.aggregate(pipeline).toArray();
      return result;
    } catch (error) {
      console.error("Error counting transactions by time:", error);
      throw new Error("Failed to count transactions by time");
    }
  }

  async calculateTotalGains(req: any) {
    const { user: { decoded: { userId = null } = {} } = {} } = req;

    if (!userId) {
      throw new Error("User ID is required");
    }
    try {
      const trades = await this.db.find({ authorId: userId }).toArray();

      const tradesWithProfitLoss = trades.map((doc: WithId<Document>) => {
        const trade = doc as unknown as ICreateTrade;

        const { profitLoss, gainPercentage } =
          this.financialCalculator.calculateTradePL(trade);

        return {
          symbol: trade.symbol,
          profitLoss,
          gainPercentage,
        };
      });

      return { result: tradesWithProfitLoss };
    } catch (error) {
      console.error("Error calculating total gains:", error);
      throw new Error("Failed to calculate total gains");
    }
  }

  /**
   * Calculates the best trading days and hours for profitability by trade type.
   * @param req - The request object containing user information.
   * @returns An object containing the best days and hours for trading.
   */
  async calculateBestTradingTimes(req: {
    user: { decoded: { userId: string } };
  }) {
    const userId = req.user?.decoded?.userId;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const pipeline = [
      // Match documents based on the provided `userId`
      {
        $match: { authorId: userId },
      },

      // Add fields for day of the week and hour of the day
      {
        $addFields: {
          entryDate: { $toDate: "$entryDate" }, // Convert entryDate to Date type
          dayOfWeek: {
            $dayOfWeek: { $toDate: "$entryDate" }, // Map entryDate to day of the week
          },
          tradingHour: {
            $hour: { $toDate: "$entryDate" }, // Extract hour from entryDate
          },
        },
      },

      // Group by tradeType, dayOfWeek, and tradingHour to calculate profitability
      {
        $group: {
          _id: {
            tradeType: "$tradeType",
            dayOfWeek: "$dayOfWeek",
            tradingHour: "$tradingHour",
          },
          totalProfit: { $sum: "$profitLoss" }, // Sum up profit/loss
          totalTrades: { $sum: 1 }, // Count total trades
        },
      },

      // Group by tradeType and calculate the best day and hour for profitability
      {
        $group: {
          _id: "$_id.tradeType", // Group by tradeType
          bestDay: {
            $first: {
              dayOfWeek: "$_id.dayOfWeek",
              totalProfit: "$totalProfit",
            },
          },

          totalProfit: { $sum: "$totalProfit" },
        },
      },

      // Sort by profitability for each tradeType
      {
        $sort: {
          "bestDay.totalProfit": -1,
        },
      },

      // Project the final output
      {
        $project: {
          _id: 0,
          tradeType: "$_id",
          bestDay: {
            dayOfWeek: "$bestDay.dayOfWeek",
            totalProfit: "$bestDay.totalProfit",
          },
        },
      },
    ];

    try {
      const result = await this.db.aggregate(pipeline).toArray();
      return result;
    } catch (error) {
      console.error("Error calculating best trading times:", error);
      throw new Error("Failed to calculate best trading times");
    }
  }

  /**
   * Calculates turnover percentages for each day of the week and identifies the best trading days.
   * @param req - The request object containing user information.
   * @returns An object containing turnover percentages for all days (Monday to Saturday).
   */

  async calculateTurnoverByDays(req: any): Promise<TurnoverResult> {
    const userId = req.user?.decoded?.userId;
    const timezone = req._startTime?.Timezone || "UTC";

    if (!userId) {
      throw new Error("User ID is required");
    }

    const pipeline = [
      {
        $match: { authorId: userId },
      },
      {
        $addFields: {
          parsedDate: { $toDate: "$exitDate" },
          // Calculate profit/loss based on trade type
          calculatedProfitLoss: {
            $cond: {
              if: { $eq: ["$positionType", "short"] },
              then: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$entryPrice", "$exitPrice"] },
                      { $ifNull: ["$quantity", 1] },
                      { $ifNull: ["$multiplier", 1] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
              else: {
                $subtract: [
                  {
                    $multiply: [
                      { $subtract: ["$exitPrice", "$entryPrice"] },
                      { $ifNull: ["$quantity", 1] },
                      { $ifNull: ["$multiplier", 1] },
                    ],
                  },
                  { $ifNull: ["$fees", 0] },
                ],
              },
            },
          },
          // Calculate total cost
          totalCost: {
            $multiply: [
              "$entryPrice",
              { $ifNull: ["$quantity", 1] },
              { $ifNull: ["$multiplier", 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          dayOfWeek: {
            $dayOfWeek: {
              date: "$parsedDate",
              timezone: timezone,
            },
          },
          // Calculate gain percentage
          gainPercentage: {
            $cond: {
              if: { $eq: ["$totalCost", 0] },
              then: {
                $cond: {
                  if: { $eq: ["$calculatedProfitLoss", 0] },
                  then: 0,
                  else: {
                    $cond: {
                      if: { $lt: ["$calculatedProfitLoss", 0] },
                      then: -100,
                      else: "N/A",
                    },
                  },
                },
              },
              else: {
                $multiply: [
                  { $divide: ["$calculatedProfitLoss", "$totalCost"] },
                  100,
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          totalTurnover: { $sum: { $abs: "$calculatedProfitLoss" } },
          totalProfitLoss: { $sum: "$calculatedProfitLoss" },
          avgGainPercentage: { $avg: "$gainPercentage" },
        },
      },
      {
        $group: {
          _id: null,
          totalTurnover: { $sum: "$totalTurnover" },
          actualDays: {
            $push: {
              dayOfWeek: "$_id",
              totalTurnover: "$totalTurnover",
              profitLoss: "$totalProfitLoss",
              gainPercentage: "$avgGainPercentage",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          days: {
            $map: {
              input: this.DAYS_OF_WEEK,
              as: "day",
              in: {
                dayName: "$$day.dayName",
                totalTurnover: {
                  $round: [
                    {
                      $ifNull: [
                        {
                          $let: {
                            vars: {
                              match: {
                                $first: {
                                  $filter: {
                                    input: "$actualDays",
                                    as: "a",
                                    cond: {
                                      $eq: ["$$a.dayOfWeek", "$$day.dayOfWeek"],
                                    },
                                  },
                                },
                              },
                            },
                            in: "$$match.totalTurnover",
                          },
                        },
                        0,
                      ],
                    },
                    2,
                  ],
                },
                turnoverPercentage: {
                  $round: [
                    {
                      $cond: [
                        { $gt: ["$totalTurnover", 0] },
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $ifNull: [
                                    {
                                      $let: {
                                        vars: {
                                          match: {
                                            $first: {
                                              $filter: {
                                                input: "$actualDays",
                                                as: "a",
                                                cond: {
                                                  $eq: [
                                                    "$$a.dayOfWeek",
                                                    "$$day.dayOfWeek",
                                                  ],
                                                },
                                              },
                                            },
                                          },
                                        },
                                        in: "$$match.totalTurnover",
                                      },
                                    },
                                    0,
                                  ],
                                },
                                "$totalTurnover",
                              ],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                    2,
                  ],
                },
                profitLoss: {
                  $round: [
                    {
                      $ifNull: [
                        {
                          $let: {
                            vars: {
                              match: {
                                $first: {
                                  $filter: {
                                    input: "$actualDays",
                                    as: "a",
                                    cond: {
                                      $eq: ["$$a.dayOfWeek", "$$day.dayOfWeek"],
                                    },
                                  },
                                },
                              },
                            },
                            in: "$$match.profitLoss",
                          },
                        },
                        0,
                      ],
                    },
                    2,
                  ],
                },
                gainPercentage: {
                  $round: [
                    {
                      $ifNull: [
                        {
                          $let: {
                            vars: {
                              match: {
                                $first: {
                                  $filter: {
                                    input: "$actualDays",
                                    as: "a",
                                    cond: {
                                      $eq: ["$$a.dayOfWeek", "$$day.dayOfWeek"],
                                    },
                                  },
                                },
                              },
                            },
                            in: "$$match.gainPercentage",
                          },
                        },
                        0,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
          },
        },
      },
    ];

    try {
      const result = await this.db.aggregate(pipeline).toArray();

      if (!result || result.length === 0) {
        return {
          days: this.DAYS_OF_WEEK.map((day) => ({
            dayName: day.dayName,
            totalTurnover: 0,
            turnoverPercentage: 0,
            profitLoss: 0,
            gainPercentage: 0,
          })),
        };
      }

      return result[0] as TurnoverResult;
    } catch (error) {
      console.error("Error calculating turnover by days:", error);
      throw new Error("Failed to calculate turnover by days");
    }
  }
}
