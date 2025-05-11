/**
 * Interface for user registration details.
 */
interface IRegister {
  password: string;
  email?: string;
  matchPassword: string;
  agreementToWebsitePolicy?: boolean;
}

/**
 * Interface for user login details.
 */
interface ILogin {
  password: string;
  email: string;
}

/**
 * Interface for forgot password request.
 */
export interface IForgotPassword {
  email: string;
}

/**
 * Interface for resetting user password.
 */ export interface IResetPassword {
  token: string;
  newPassword: string;
}

/**
 * Interface for sending verification email data.
 */
interface ISendVerificationEmailData {
  email?: string;
  password?: string;
  authToken: string;
  isVerified?: boolean;
  dateAdded?: Date;
  lastLoggedIn?: Date | null;
  logOutDate?: Date | null;
  isLogin?: boolean;
  agreementToWebsitePolicy?: boolean;
}

/**
 * Interface for logout request.
 */
interface ILogout {
  user: {
    decoded: { userId: string };
    authHeader: string;
  };
}

/**
 * Interface for a trade, including its details and performance metrics.
 */
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

/**
 * Interface for creating a trade, including optional parameters for additional trade details.
 */ // Enum for different types of trades
export enum TradeType {
  Stock = "stock",
  Forex = "forex",
  Crypto = "crypto",
  Option = "option",
  CryptoSpot = "crypto spot",
}

export interface ICreateTrade {
  tradeType: TradeType;
  tradeOutcome: "win" | "loss";
  riskPercentage?: number;
  positionType?: "long" | "short";
  leverage?: number;
  costBasis?: number;
  profitLoss?: number;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  risk: number;
  reward: number;
  tags: string[];
  createdAt: Date;
  entryDate: Date;
  exitDate: Date;
  quantity?: number;
  optionType?: "call" | "put";
  strikePrice?: number;
  optionPremium?: number;
  units?: number;
  usdExchangeRate?: number;
  fees?: number;
  winRate?: number;
  avgProfitLoss?: number;
  riskRewardRatio?: number;
  maxDrawdown?: number;
  sharpeRatio?: number;
  profitFactor?: number;
  volatility?: number;
  sortinoRatio?: number;
  avgHoldingPeriod?: number;
  improvementSuggestions?: any;
  daysToExpiration?: number;
  dailyTheta?: number;
  marginRequired?: boolean;
  marginAvailable?: number;
  expirationDate?: string;
}

export { IRegister, ILogin, ISendVerificationEmailData, ILogout, ITrade };
