import { config } from "dotenv";
import requestIp from "request-ip";
import { hash, genSalt, compare } from "bcrypt";
import { ObjectId } from "mongodb";
import { sign, verify } from "jsonwebtoken";
import { Database } from "../../db/dbConnect";
import {
  IForgotPassword,
  ILogin,
  ILogout,
  IRegister,
  IResetPassword,
  ISendVerificationEmailData,
} from "../../interface/interface";
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
  async login(
    { email, password }: ILogin,
    req: requestIp.Request
  ): Promise<{ token: string }> {
    try {
      const user = await this.userCollection.findOne({ email });
      if (!user) {
        throw new ApiError("Not Found", 404, "Not Found");
      }

      if (!user.isVerified) {
        throw new ApiError("Unauthorized", 401, "User not verified");
      }

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        throw new ApiError("Unauthorized", 401, "Unauthorized");
      }

      const userIdAsString = user._id.toString();
      const token = this.tokenService.generateAccessToken(userIdAsString);

      // Use request-ip to get the client's IP address
      const ipAddress = requestIp.getClientIp(req);

      console.log("IP Address:", ipAddress); // Log the IP address for debugging
      console.log("User ID:", userIdAsString); // Log the user ID for debugging

      await this.userCollection.updateOne(
        { _id: user._id },
        {
          $push: { authorizationToken: token },
          $set: {
            isLogin: true,
            lastLoggedIn: new Date(),
            ipAddress: ipAddress, // Store the IP address
          },
        }
      );

      return { token };
    } catch (error: any) {
      throw new ApiError(
        "Login failed",
        500,
        "An unexpected error occurred during login"
      );
    }
  }

  //================Validate Token===============================
  async validateToken({ token }: any, req: ILogout): Promise<boolean> {
    const {
      user: {
        decoded: { userId },
      },
    } = req;

    console.log("userId", userId);
    try {
      const user = await this.userCollection.findOne(
        { authorizationToken: token, _id: new ObjectId(userId) },
        { projection: { _id: 1, isLogin: 1 } }
      );

      if (!user || !user.isLogin) {
        throw new ApiError("Unauthorized", 401, "Unauthorized");
      }

      return true;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      throw new ApiError(
        "Logout failed",
        500,
        "An error occurred during logout"
      );
    }
  }

  //================Forgot Password===============================
  async forgotPassword({ email }: IForgotPassword): Promise<void> {
    try {
      const user = await this.userCollection.findOne({ email });
      if (!user) throw new ApiError("Email not found", 404, "Not Found");

      const resetToken = sign({ email }, process.env.JWT_SECRET || "", {
        expiresIn: "1h",
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await this.emailHandler.sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      console.error("Forgot Password error:", error);
      throw new ApiError(
        "Forgot Password failed",
        500,
        "An error occurred while processing your request"
      );
    }
  }

  //================Reset Password===============================
  async resetPassword({ token, newPassword }: IResetPassword): Promise<void> {
    try {
      const decoded: any = verify(token, process.env.JWT_SECRET || "");
      const email = decoded.email;

      const user = await this.userCollection.findOne({ email });
      if (!user) throw new ApiError("Invalid token", 400, "Bad Request");

      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);

      await this.userCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
    } catch (error) {
      console.error("Reset Password error:", error);
      throw new ApiError(
        "Reset Password failed",
        500,
        "An error occurred while resetting your password"
      );
    }
  }
}
