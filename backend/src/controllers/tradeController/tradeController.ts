import {
  Controller,
  Route,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Path,
  Tags,
  Request,
  Security,
} from "tsoa";
import { TradeService } from "../../services/tradeService/tradeService";
import { ICreateTrade, ITrade } from "../../interface/interface";
import { ApiError } from "../../errorHandler/error";

@Route("api/trades")
@Tags("Trades")
export class TradeController extends Controller {
  private tradeService = new TradeService();

  @Post("create")
  @Security("jwt")
  async createTrade(
    @Body() trade: ICreateTrade,
    @Request() req: any
  ): Promise<any> {
    try {
      return await this.tradeService.createTrade(req, trade);
    } catch (error) {
      console.log(error);
      throw new ApiError("Failed to create trade", 500);
    }
  }

  @Get("get/{id}")
  async getTradeById(@Path() id: string) {
    try {
      const trade = await this.tradeService.getTradeById(id);
      return trade;
    } catch (error) {
      throw new ApiError("Failed to retrieve trade", 500);
    }
  }

  @Get("list")
  // @Security("jwt")
  async getTrades(
    @Query() skip: number = 0,
    @Query() limit: number = 10
  ): Promise<any> {
    try {
      return await this.tradeService.getTrades(skip, limit);
    } catch (error) {
      throw new ApiError("Failed to retrieve trades", 500);
    }
  }

  @Put("update/{id}")
  @Security("jwt")
  async updateTrade(
    @Path() id: string,
    @Body() update: Partial<ITrade>
  ): Promise<void> {
    try {
      await this.tradeService.updateTrade(id, update);
    } catch (error) {
      throw new ApiError("Failed to update trade", 500);
    }
  }

  @Delete("delete/{id}")
  @Security("jwt")
  async deleteTrade(@Path() id: string): Promise<void> {
    try {
      await this.tradeService.deleteTrade(id);
    } catch (error) {
      throw new ApiError("Failed to delete trade", 500);
    }
  }

  @Get("filter")
  @Security("jwt")
  async filterTrades(
    @Request() req: any,
    @Query() filter: any,
    @Query() limit: number = 10
  ): Promise<any> {
    try {
      return await this.tradeService.filterTrades(req.user, filter, limit);
    } catch (error) {
      throw new ApiError("Failed to filter trades", 500);
    }
  }
}
