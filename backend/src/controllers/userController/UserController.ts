import {
  Controller,
  Route,
  Get,
  Post,
  Delete,
  Body,
  Path,
  Security,
  Request,
  Tags,
} from "tsoa";
import { ObjectId } from "mongodb";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";

interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

@Route("profile")
@Tags("User")
export class UserController extends Controller {
  private readonly userDB: string = "user";
  private database: Database = new Database();
  private userCollection = this.database.getCollection(this.userDB);

  private validateObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(
        "Invalid ID format",
        400,
        "The provided ID is not valid"
      );
    }
    return new ObjectId(id);
  }

  @Security("jwt")
  @Get("user-profile-info")
  async getUser(@Request() req: any): Promise<UserProfile> {
    try {
      const { user: { decoded: { userId } = {} } = {} } = req;
      if (!userId) {
        throw new ApiError("Invalid request", 400, "User ID is missing");
      }

      const objectId = this.validateObjectId(userId);
      const user = await this.userCollection.findOne({ _id: objectId });

      if (!user) {
        throw new ApiError("User not found", 404, "User not found");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        // Return other user details as necessary
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "Internal Server Error",
        500,
        "An unexpected error occurred"
      );
    }
  }

  @Security("jwt")
  @Post("update-profile")
  async updateProfile(
    @Request() req: any,
    @Body() request: UpdateProfileRequest
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    const objectId = this.validateObjectId(userId);
    const updateResult = await this.userCollection.updateOne(
      { _id: objectId },
      { $set: request }
    );
    if (updateResult.modifiedCount === 0) {
      throw new ApiError("Update failed", 400, "No changes were made");
    }
    return { message: "Profile updated successfully" };
  }

  @Security("jwt")
  @Get("all-users")
  async getAllUsers(): Promise<UserProfile[]> {
    const users = await this.userCollection.find().toArray();
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      // Map other fields as necessary
    }));
  }

  @Security("jwt")
  @Delete("delete-user/{userId}")
  async deleteUser(@Path() userId: string): Promise<{ message: string }> {
    const objectId = this.validateObjectId(userId);
    const deleteResult = await this.userCollection.deleteOne({ _id: objectId });
    if (deleteResult.deletedCount === 0) {
      throw new ApiError("Delete failed", 404, "User not found");
    }
    return { message: `User with ID ${userId} deleted successfully` };
  }

  @Security("jwt")
  @Get("user/{userId}")
  async getUserById(@Path() userId: string): Promise<UserProfile> {
    const objectId = this.validateObjectId(userId);
    const user = await this.userCollection.findOne({ _id: objectId });
    if (!user) {
      throw new ApiError("User not found", 404, "User not found");
    }
    return {
      id: user._id.toString(),
      name: "Bartek",
      email: user.email,
      // Return other user details as necessary
    };
  }
}
