import { config } from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { ApiError } from "../../errorHandler/error";

config();
const { JWT_SECRET } = process.env;

export class TokenService {
  generateAccessToken(userId: string): string {
    return sign({ userId }, `${JWT_SECRET}`);
  }

  verifyAccessToken(token: string): any {
    try {
      return verify(token, `${JWT_SECRET}`);
    } catch (error) {
      throw new ApiError("Unauthorized", 401, "Unauthorized");
    }
  }
}
