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
} from "tsoa";
import { JournalService } from "../../services/jurnalService/jurnalService";
import { ApiError } from "../../errorHandler/error";

@Route("api/journal")
@Tags("Journal")
export class JournalController extends Controller {
  private journalService = new JournalService();

  //================Create Journal===============================
  @Post("create")
  async createJournal(
    @Body() req: { title: string; content: string; authorId: string }
  ): Promise<void> {
    try {
      await this.journalService.createJournal(req);
    } catch (error) {
      throw new ApiError("Failed to create journal", 500);
    }
  }

  //================Read Journal===============================
  @Get("{journalId}")
  async getJournalById(@Path() journalId: string): Promise<any> {
    try {
      return await this.journalService.getJournalById(journalId);
    } catch (error) {
      throw new ApiError("Failed to retrieve journal", 500);
    }
  }

  //================Update Journal===============================
  @Put("{journalId}")
  async updateJournal(
    @Path() journalId: string,
    @Body() req: { title?: string; content?: string }
  ): Promise<void> {
    try {
      await this.journalService.updateJournal(journalId, req);
    } catch (error) {
      throw new ApiError("Failed to update journal", 500);
    }
  }

  //================Delete Journal===============================
  @Delete("{journalId}")
  async deleteJournal(@Path() journalId: string): Promise<void> {
    try {
      await this.journalService.deleteJournal(journalId);
    } catch (error) {
      throw new ApiError("Failed to delete journal", 500);
    }
  }
}
