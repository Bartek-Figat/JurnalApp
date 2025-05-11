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

/** 1. Trust proxy (for secure cookies & rate limiting behind a proxy) */
app.set("trust proxy", 1);

/** 2. Secure HTTP Headers */
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

/** 3. Disable identifying headers */
app.disable("x-powered-by");

/** 4. Compression and logging */
app.use(compression());
app.use(morgan("dev"));

/** 6. CORS Configuration */
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

/** 7. Body Parsing and Payload Limit */
app.use(urlencoded({ extended: true, limit: "1mb" }));
app.use(json({ limit: "1mb" }));

/** 8. Prevent HTTP Parameter Pollution */
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

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
