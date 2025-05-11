import {
  Controller,
  Route,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Path,
  Tags,
  Request,
  Security,
  SuccessResponse,
} from "tsoa";

import { TradeService } from "../../services/tradeService/tradeService";
import { CalculateTradeMetricsRepository } from "../../services/tradeService/calculateMetrics";
import { CryptoSpotTradeAnalysis } from "../../services/tradeService/cryptoSpotAnalysis";
import { ForexTradeAnalysis } from "../../services/tradeService/forexPairAnalysis";
import { LeveragedCryptoAnalysisClass } from "../../services/tradeService/leveragedCryptoAnalysis";
import { OptionTradeAnalysisClass } from "../../services/tradeService/optionTradeAnalysis";
import { StockTradeAnalysisClass } from "../../services/tradeService/stockTradeAnalysis";

import { ITrade } from "../../interface/interface";
import { ApiError } from "../../errorHandler/error";
import { CalculateTradeMetricsRepositoryTS } from "../../services/tradeService/calculateMetricsTS";

@Route("api/trades")
@Tags("Trades")
export class TradeController extends Controller {
  private tradeService = new TradeService();
  private metricsService = new CalculateTradeMetricsRepository();
  private cryptoAnalysis = new CryptoSpotTradeAnalysis();
  private forexAnalysis = new ForexTradeAnalysis();
  private leveragedCryptoAnalysis = new LeveragedCryptoAnalysisClass();
  private optionAnalysis = new OptionTradeAnalysisClass();
  private stockAnalysis = new StockTradeAnalysisClass();
  //CalculateTradeMetricsRepositoryTS
  private calculateTradeMetrics = new CalculateTradeMetricsRepositoryTS();

  // Create a new trade
  @Post("create")
  @Security("jwt")
  async createTrade(@Body() trade: any, @Request() req: any): Promise<any> {
    return await this.tradeService.createTrade(req, trade);
  }

  // Get trade by ID
  @Get("get/{id}")
  @Security("jwt")
  async getTradeById(@Path() id: string, @Request() req: any): Promise<any> {
    return await this.tradeService.getTradeById(id, req);
  }

  // Get list of all user trades
  @Get("list")
  @Security("jwt")
  async getTrades(@Request() req: any): Promise<any> {
    return await this.tradeService.getTrades(req);
  }

  // Update an existing trade
  @Put("update/{id}")
  @Security("jwt")
  async updateTrade(
    @Path() id: string,
    @Body() update: Partial<ITrade>
  ): Promise<void> {
    await this.tradeService.updateTrade(id, update);
  }

  // Delete a trade by ID
  @Delete("delete/{id}")
  @Security("jwt")
  async deleteTrade(@Path() id: string): Promise<void> {
    await this.tradeService.deleteTrade(id);
  }

  // Filter trades based on user criteria
  @Get("filter-trades")
  @Security("jwt")
  @SuccessResponse("200", "Successfully filtered trades")
  async filterTrades(@Request() req: any): Promise<any> {
    return await this.tradeService.filterTrades(req);
  }

  //CryptoPagination
  @Get("crypto-pagination")
  @Security("jwt")
  @SuccessResponse("200", "Successfully filtered trades")
  async cryptoPagination(@Request() req: any): Promise<any> {
    return await this.tradeService.cryptoPagination(req);
  }
  //CryptoPagination
  @Get("forex-pagination")
  @Security("jwt")
  @SuccessResponse("200", "Successfully filtered trades")
  async forexPagination(@Request() req: any): Promise<any> {
    return await this.tradeService.forexPagination(req);
  }

  //CryptoPagination
  @Get("stock-pagination")
  @Security("jwt")
  @SuccessResponse("200", "Successfully filtered trades")
  async stockPagination(@Request() req: any): Promise<any> {
    return await this.tradeService.stockPagination(req);
  }

  //CryptoPagination
  @Get("crypto-spot-pagination")
  @Security("jwt")
  @SuccessResponse("200", "Successfully filtered trades")
  async cryptoSpotPagination(@Request() req: any): Promise<any> {
    return await this.tradeService.cryptoSpotPagination(req);
  }

  // Calculate total gains
  @Get("total-gains")
  @Security("jwt")
  async calculateTotalGains(@Request() req: any): Promise<any> {
    return await this.metricsService.calculateTotalGains(req);
  }

  // Get trade metrics
  @Get("metrics")
  @Security("jwt")
  async getMetrics(@Request() req: any): Promise<any> {
    return await this.metricsService.calculateMetrics(req);
  }

  // Get win/loss statistics
  @Get("wins-losses")
  @Security("jwt")
  async getWinsAndLosses(@Request() req: any): Promise<any> {
    return await this.metricsService.calculateWinsAndLosses(req);
  }

  // All Crypto Spot Analysis
  @Get("analysis/all/crypto-spot")
  @Security("jwt")
  async getAllCryptoAnalyses(@Request() req: any): Promise<any> {
    try {
      return await this.cryptoAnalysis.getAllAnalyses(req);
    } catch (error) {
      console.error("Crypto Spot Analysis Error:", error);
      throw new ApiError("Failed to fetch crypto spot analyses", 500);
    }
  }

  // All Forex Pair Analysis
  @Get("analysis/all/forex-pair")
  @Security("jwt")
  async getForexPairAnalysis(@Request() req: any): Promise<any> {
    return await this.forexAnalysis.getAllAnalyses(req);
  }

  // Leveraged Crypto Analysis
  @Get("analysis/all/leveraged-crypto")
  @Security("jwt")
  async getLeveragedCryptoAnalysis(@Request() req: any): Promise<any> {
    return await this.leveragedCryptoAnalysis.getAllAnalyses(req);
  }

  // Options Trade Analysis
  @Get("analysis/all/option-trade")
  @Security("jwt")
  async getOptionTradeAnalysis(@Request() req: any): Promise<any> {
    return await this.optionAnalysis.getAllAnalyses(req);
  }

  // Stock Trade Analysis
  @Get("analysis/all/stock-trade")
  @Security("jwt")
  async getStockTradeAnalysis(@Request() req: any): Promise<any> {
    return await this.stockAnalysis.getAllAnalyses(req);
  }

  //analyzeTradeRisk
  @Get("analyze-trade-risk")
  @Security("jwt")
  async analyzeTradeRisk(@Request() req: any): Promise<any> {
    return await this.calculateTradeMetrics.analyzeTradeRisk(req);
  }
}
