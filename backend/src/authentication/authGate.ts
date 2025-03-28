import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { Database } from "../db/dbConnect";
import { ApiError } from "../errorHandler/error";

export async function expressAuthentication(
  req: Request,
  securityName: string,
  _scopes?: string[]
): Promise<{ decoded: string | JwtPayload; authHeader: string } | undefined> {
  if (securityName !== "jwt") {
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError("Unauthorized", 401, "Unauthorized");
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new ApiError("Unauthorized", 401, "Unauthorized");
  }

  console.log("token", token);

  const database = new Database();
  const collection = database.getCollection("user");
  const authorizationTokenExists = await collection.findOne(
    { authorizationToken: token },
    { projection: { _id: 0 } }
  );

  if (!authorizationTokenExists) {
    throw new ApiError("Unauthorized", 401, "Unauthorized");
  }

  try {
    const secret: any = process.env.JWT_SECRET;
    const decoded = verify(token, secret) as string | JwtPayload;
    return { decoded, authHeader: token };
  } catch (err) {
    throw new ApiError("Unauthorized", 401, "Unauthorized");
  }
}
