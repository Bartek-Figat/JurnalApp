import { ObjectId } from "mongodb";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";

export class JournalService {
  private readonly journalDB: string = "journal";
  private database: Database = new Database();
  private journalCollection = this.database.getCollection(this.journalDB);

  //================Create Journal===============================
  async createJournal({
    title,
    content,
    authorId,
  }: {
    title: string;
    content: string;
    authorId: string;
  }): Promise<void> {
    try {
      const newJournal = {
        title,
        content,
        authorId: new ObjectId(authorId),
        dateCreated: new Date(),
        lastUpdated: new Date(),
      };

      await this.journalCollection.insertOne(newJournal);
    } catch (error) {
      throw new ApiError("Failed to create journal", 500, "Creation failed");
    }
  }

  //================Read Journal===============================
  async getJournalById(journalId: string): Promise<any> {
    try {
      const journal = await this.journalCollection.findOne({
        _id: new ObjectId(journalId),
      });
      if (!journal) throw new ApiError("Journal not found", 404);

      return journal;
    } catch (error) {
      throw new ApiError("Failed to retrieve journal", 500, "Retrieval failed");
    }
  }

  //================Update Journal===============================
  async updateJournal(
    journalId: string,
    { title, content }: { title?: string; content?: string }
  ): Promise<void> {
    try {
      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      updateData.lastUpdated = new Date();

      const result = await this.journalCollection.updateOne(
        { _id: new ObjectId(journalId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0)
        throw new ApiError("Journal not found", 404);
    } catch (error) {
      throw new ApiError("Failed to update journal", 500, "Update failed");
    }
  }

  //================Delete Journal===============================
  async deleteJournal(journalId: string): Promise<void> {
    try {
      const result = await this.journalCollection.deleteOne({
        _id: new ObjectId(journalId),
      });
      if (result.deletedCount === 0)
        throw new ApiError("Journal not found", 404);
    } catch (error) {
      throw new ApiError("Failed to delete journal", 500, "Deletion failed");
    }
  }
}
