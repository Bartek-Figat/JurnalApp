import {
  Controller,
  Route,
  Post,
  Body,
  Middlewares,
  Tags,
  Security,
  Request,
} from "tsoa";
import rateLimit from "express-rate-limit";
import {
  validateLoginIncomingFields,
  validateRegisterIncomingFields,
} from "../../middleware/validate";
import { AuthService } from "../../services/authService/authService";

@Route("api/auth")
@Tags("Auth")
export class CustomAuthController extends Controller {
  private authService = new AuthService();

  private static rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later.",
  });

  @Post("register")
  @Middlewares([
    CustomAuthController.rateLimiter,
    validateRegisterIncomingFields,
  ])
  async registration(@Body() req: any): Promise<void> {
    return this.authService.registration(req);
  }

  @Post("login")
  @Middlewares([CustomAuthController.rateLimiter, validateLoginIncomingFields])
  async login(@Body() req: any): Promise<{ token: string }> {
    return this.authService.login(req);
  }

  @Post("validate-token")
  async validateToken(@Body() token: any) {
    return this.authService.validateToken(token);
  }

  @Security("jwt")
  @Post("logout")
  async logout(@Request() req: any): Promise<void> {
    return this.authService.logout(req);
  }
}
