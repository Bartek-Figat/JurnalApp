import express, {
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import { RegisterRoutes } from "../build/routes";
import { ApiError } from "./errorHandler/error";

export const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "x-refresh-token",
    ],
    credentials: true,
  })
);

app.use(urlencoded({ extended: true, limit: "50mb" }));
app.use(json({ limit: "50mb" }));

// Security-related HTTP headers
app.set("trust proxy", 1);
app.set("x-powered-by", false);
app.disable("x-powered-by");
app.use(helmet.contentSecurityPolicy());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(hpp());

// Register API routes
RegisterRoutes(app);

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    next(err);
  }
});

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
