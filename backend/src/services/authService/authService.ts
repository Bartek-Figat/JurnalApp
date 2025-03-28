import { config } from "dotenv";
import { hash, genSalt, compare } from "bcrypt";
import { ObjectId } from "mongodb";
import { sign } from "jsonwebtoken";
import { Database } from "../../db/dbConnect";
import {
  ILogin,
  ILogout,
  IRegister,
  ISendVerificationEmailData,
} from "src/interface/interface";
import { ApiError } from "../../errorHandler/error";
import { EmailHandler } from "../emailService/EmailHandler";
import { TokenService } from "../tokenService/token";

config();

export class AuthService {
  private readonly userDB: string = "user";
  private database: Database = new Database();
  private emailHandler: EmailHandler = new EmailHandler();
  private tokenService: TokenService = new TokenService();
  private userCollection = this.database.getCollection(this.userDB);

  //================Registration===============================
  async registration({
    email,
    password,
    agreementToWebsitePolicy,
  }: IRegister): Promise<void> {
    try {
      const userExists = await this.userCollection.findOne({ email });
      if (userExists) {
        throw new ApiError("Email already exists", 400, "Bad Request");
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const authToken = sign({ data: email }, process.env.JWT_SECRET || "");

      const newUser: ISendVerificationEmailData = {
        email,
        password: hashedPassword,
        authToken,
        isVerified: false,
        dateAdded: new Date(),
        lastLoggedIn: null,
        logOutDate: null,
        isLogin: false,
        agreementToWebsitePolicy,
      };

      await this.userCollection.insertOne(newUser);
      await this.emailHandler.sendVerificationEmail(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw new ApiError(
        "Registration failed",
        500,
        "An error occurred during registration"
      );
    }
  }

  //================Login===============================
  async login({ email, password }: ILogin): Promise<{ token: string }> {
    try {
      const user = await this.userCollection.findOne({ email });
      if (!user) throw new ApiError("Not Found", 404, "Not Found");

      const isMatch = await compare(password, user.password);
      if (!isMatch) throw new ApiError("Unauthorized", 401, "Unauthorized");

      const userIdAsString = user._id.toString();
      const token = this.tokenService.generateAccessToken(userIdAsString);

      await this.userCollection.updateOne(
        { _id: user._id },
        {
          $push: { authorizationToken: token },
          $set: {
            isLogin: true,
            lastLoggedIn: new Date(),
          },
        }
      );

      return { token };
    } catch (error: any) {
      throw new ApiError(
        "Login failed",
        500,
        error.message || "An error occurred during login"
      );
    }
  }

  //================Validate Token===============================
  async validateToken({ token }: any): Promise<boolean> {
    try {
      const decoded = this.tokenService.verifyAccessToken(token);
      const user = await this.userCollection.findOne(
        { authorizationToken: token, _id: new ObjectId(decoded.userId) },
        { projection: { _id: 1, isLogin: 1 } }
      );

      if (!user || !user.isLogin) {
        throw new ApiError("Unauthorized", 401, "Unauthorized");
      }

      return true;
    } catch (error: any) {
      console.error("Error validating token:", error);
      throw new ApiError("Unauthorized", 500, "Unauthorized");
    }
  }

  //================Logout===============================
  async logout(logout: ILogout): Promise<void> {
    try {
      const {
        user: {
          decoded: { userId },
        },
      } = logout;

      await this.userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            isLogin: false,
            logOutDate: new Date(),
            authorizationToken: [],
          },
        }
      );
    } catch (error: any) {
      throw new ApiError(
        "Logout failed",
        500,
        "An error occurred during logout"
      );
    }
  }
}
