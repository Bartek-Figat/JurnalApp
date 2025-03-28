import { config } from "dotenv";
import { ObjectId } from "mongodb";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";
import Stripe from "stripe";

config();
const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;

if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe configuration variables");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export class PaymentService {
  private readonly userDB = "user";
  private database = new Database();
  private userCollection = this.database.getCollection(this.userDB);
  private paymentCollection = this.database.getCollection("payments");

  async createOneTimePayment({
    amount,
  }: {
    amount: number;
  }): Promise<{ clientSecret: string }> {
    console.log("amount", amount);
    try {
      const customer = await stripe.customers.create({
        email: "bartek_19_83@hotmail.com",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: customer.id,
        description: "One-time payment",
        automatic_payment_methods: { enabled: true },
      });

      if (!paymentIntent.client_secret) {
        throw new ApiError("Failed to create payment intent", 500);
      }

      await this.paymentCollection.insertOne({
        id: paymentIntent.id,
        object: paymentIntent.object,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customer: paymentIntent.customer,
        description: paymentIntent.description,
        status: paymentIntent.status,
        created: paymentIntent.created,
        client_secret: paymentIntent.client_secret,
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error("Payment creation error:", error);
      throw new ApiError("Failed to create payment", 500);
    }
  }
  async getPayment(userId: string): Promise<Stripe.PaymentIntent> {
    if (!ObjectId.isValid(userId)) {
      throw new ApiError("Invalid user ID", 400);
    }
    try {
      const user = await this.userCollection.findOne({
        _id: new ObjectId(userId),
      });
      if (!user || !user.lastPaymentIntentId)
        throw new ApiError("Payment not found", 404);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        user.lastPaymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      console.error("Failed to retrieve payment:", error);
      throw new ApiError("Failed to retrieve payment", 500);
    }
  }

  async sendPublishableKey(): Promise<string> {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new ApiError("Publishable key not found", 500);
    }
    return STRIPE_PUBLISHABLE_KEY;
  }
}
