interface IRegister {
  password: string;
  email?: string; // Email is optional
  matchPassword: string;
  agreementToWebsitePolicy?: boolean; // Agreement is optional
}

interface ILogin {
  password: string;
  email: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
}

interface ISendVerificationEmailData {
  email?: string; // Email is optional
  password?: string; // Password is optional
  authToken: string;
  isVerified?: boolean; // Verification status is optional
  dateAdded?: Date; // Date added is optional
  lastLoggedIn?: Date | null; // Last logged in can be null
  logOutDate?: Date | null; // Logout date can be null
  isLogin?: boolean; // Login status is optional
  agreementToWebsitePolicy?: boolean; // Agreement is optional
}

interface ILogout {
  user: {
    decoded: { userId: string };
    authHeader: string;
  };
}

interface ITrade {
  tradeType: string;
  entryDate: Date;
  exitDate: Date;
  userId: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  risk: number;
  reward: number;
  tags: string[];
  createdAt: Date;
  winRate?: number; // Optional performance metrics
  avgProfitLoss?: number;
  riskRewardRatio?: number;
  maxDrawdown?: number;
  profitFactor?: number;
  sharpeRatio?: number;
  volatility?: number;
  sortinoRatio?: number;
  avgHoldingPeriod?: number;
  improvementSuggestions?: string[];
  stopLossLevel?: number;
  positionSize?: number;
}

interface ICreateTrade {
  tradeOutcome: string; // Outcome of the trade (e.g., win, loss)
  riskPercentage?: number; // Percentage of risk for the trade
  positionType?: "long" | "short" | "spot"; // Type of position taken
  leverage?: number; // Leverage used for the trade
  costBasis?: number; // Cost basis for the trade
  profitLoss?: number; // Profit or loss from the trade
  symbol: string; // Trading symbol (e.g., AAPL, EUR/USD)
  entryPrice: number; // Price at which the trade is entered
  exitPrice: number; // Price at which the trade is exited
  risk: number; // Amount of risk taken in the trade
  reward: number; // Potential reward from the trade
  tags: string[]; // Tags associated with the trade for categorization
  createdAt: Date; // Date when the trade was created
  stopLossLevel?: number; // Stop loss level for the trade
  positionSize?: number; // Size of the position taken
  tradeType: "stock" | "forex" | "crypto" | "option" | "crypto spot"; // Type of trade
  entryDate: Date; // Date when the trade was entered
  exitDate: Date; // Date when the trade was exited
  quantity?: number; // Quantity for stock and crypto trades
  optionType?: "call" | "put"; // Type of option (if applicable)
  strikePrice?: number; // Strike price for options
  optionPremium?: number; // Premium paid for options
  units?: number; // Number of units for forex trades
  usdExchangeRate?: number; // Exchange rate for forex trades
  fees?: number; // Potential fees associated with the trade
}

export {
  IRegister,
  ILogin,
  ISendVerificationEmailData,
  ILogout,
  ITrade,
  ICreateTrade,
};
