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
  async login(
    @Body() body: any,
    @Request() req: any
  ): Promise<{ token: string }> {
    return this.authService.login(body, req);
  }

  @Security("jwt")
  @Post("validate-token")
  async validateToken(@Body() token: any, @Request() req: any) {
    return this.authService.validateToken(token, req);
  }

  @Security("jwt")
  @Post("logout")
  async logout(@Request() req: any): Promise<void> {
    return this.authService.logout(req);
  }

  @Post("forgot-password")
  @Middlewares([CustomAuthController.rateLimiter])
  async forgotPassword(@Body() req: any): Promise<void> {
    return this.authService.forgotPassword(req);
  }

  @Post("reset-password")
  @Middlewares([CustomAuthController.rateLimiter])
  async resetPassword(@Body() req: any): Promise<void> {
    return this.authService.resetPassword(req);
  }
}
