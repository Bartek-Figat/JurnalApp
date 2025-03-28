import { Controller, Route, Post, Get, Tags, Body, Path } from "tsoa";
import { PaymentService } from "../../services/subscriptionService/subscriptionService";
import { ApiError } from "../../errorHandler/error";

@Route("api/payment")
@Tags("Payment")
export class PaymentController extends Controller {
  private paymentService = new PaymentService();

  @Get("publishable-key")
  async sendPublishableKey(): Promise<{ publishableKey: string }> {
    try {
      const publishableKey = await this.paymentService.sendPublishableKey();
      return { publishableKey };
    } catch (error) {
      throw new ApiError("Failed to send publishable key", 500, `${error}`);
    }
  }
  @Post("create")
  async createOneTimePayment(
    @Body() req: any
  ): Promise<{ clientSecret: string }> {
    try {
      return await this.paymentService.createOneTimePayment(req);
    } catch (error) {
      throw new ApiError("Failed to create payment", 500);
    }
  }

  @Get("{userId}")
  async getPayment(@Path() userId: string): Promise<any> {
    try {
      return await this.paymentService.getPayment(userId);
    } catch (error) {
      throw new ApiError("Failed to retrieve payment", 500);
    }
  }
}
