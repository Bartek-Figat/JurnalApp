import { Database } from "../../db/dbConnect";
import { ObjectId } from "mongodb";

export class NotificationService {
  private database: Database = new Database();
  private notificationsCollection =
    this.database.getCollection("notifications");

  async sendNotification(userId: string, message: string) {
    try {
      return await this.notificationsCollection.insertOne({
        userId,
        message,
        timestamp: new Date(),
        read: false,
      });
    } catch (error) {
      console.error("Failed to send notification", error);
      throw new Error("NotificationError");
    }
  }

  async markNotificationAsRead(notificationId: ObjectId) {
    try {
      return await this.notificationsCollection.updateOne(
        { _id: notificationId },
        { $set: { read: true } }
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      throw new Error("NotificationError");
    }
  }

  async getUnreadNotifications(userId: string) {
    try {
      return await this.notificationsCollection
        .find({ userId, read: false })
        .toArray();
    } catch (error) {
      console.error("Failed to retrieve unread notifications", error);
      throw new Error("NotificationError");
    }
  }
}
