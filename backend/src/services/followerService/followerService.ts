import { ApiError } from "../../errorHandler/error";
import { Database } from "../../db/dbConnect";
import { NotificationService } from "../notificationService/notificationService";

export class FollowerService {
  private database: Database = new Database();
  private followersCollection = this.database.getCollection("followers");
  private notificationService: NotificationService = new NotificationService();

  async followUser(followerId: string, followeeId: string) {
    if (followerId === followeeId) {
      throw new ApiError(
        "InvalidOperation",
        400,
        "Users cannot follow themselves"
      );
    }

    try {
      const existingFollow = await this.followersCollection.findOne({
        followerId,
        followeeId,
      });
      if (existingFollow) {
        throw new ApiError("Conflict", 409, "Already following this user");
      }
      return await this.followersCollection.insertOne({
        followerId,
        followeeId,
      });
    } catch (error: any) {
      throw new ApiError(
        "DatabaseError",
        500,
        "Failed to follow user: " + error.message
      );
    }
  }

  async unfollowUser(followerId: string, followeeId: string) {
    try {
      return await this.followersCollection.deleteOne({
        followerId,
        followeeId,
      });
    } catch (error) {
      throw new ApiError("DatabaseError", 500, "Failed to unfollow user");
    }
  }

  async getFollowers(userId: string) {
    try {
      return await this.followersCollection
        .find({ followeeId: userId })
        .toArray();
    } catch (error) {
      throw new ApiError("DatabaseError", 500, "Failed to retrieve followers");
    }
  }

  async getFollowees(userId: string) {
    try {
      return await this.followersCollection
        .find({ followerId: userId })
        .toArray();
    } catch (error) {
      throw new ApiError("DatabaseError", 500, "Failed to retrieve followees");
    }
  }

  async notifyFollowers(userId: string, postId: string) {
    try {
      const followers = await this.getFollowers(userId);
      const message = `User ${userId} has posted a new post with ID ${postId}.`;

      for (const follower of followers) {
        await this.notificationService.sendNotification(
          follower.followerId,
          message
        );
      }
    } catch (error) {
      console.error("Failed to notify followers", error);
    }
  }
}
