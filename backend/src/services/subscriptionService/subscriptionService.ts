import { config } from "dotenv";
import { ObjectId } from "mongodb";
import { Database } from "../../db/dbConnect";
import { ApiError } from "../../errorHandler/error";
import Stripe from "stripe";

config();
const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;

if (!STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing Stripe secret key (STRIPE_SECRET_KEY) configuration"
  );
}
if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Stripe publishable key (STRIPE_PUBLISHABLE_KEY) configuration"
  );
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export class PaymentService {
  private readonly userDB = "user";
  private readonly paymentDB = "payments";
  private database: Database;
  private userCollection: any;
  private paymentCollection: any;

  constructor() {
    this.database = new Database();
    this.userCollection = this.database.getCollection(this.userDB);
    this.paymentCollection = this.database.getCollection(this.paymentDB);
  }

  /**
   * Creates a one-time payment intent.
   * @param amount - The amount to charge in cents.
   * @returns {clientSecret} - The client secret required for the client-side integration.
   */
  async createOneTimePayment({
    amount,
  }: {
    amount: number;
  }): Promise<{ clientSecret: string }> {
    try {
      const customer = await this.getOrCreateCustomer();

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: customer.id,
        description: "One-time payment",
        automatic_payment_methods: { enabled: true },
      });

      if (!paymentIntent.client_secret) {
        throw new ApiError(
          "Failed to create payment intent: missing client_secret",
          500
        );
      }

      // Save payment intent to database
      await this.savePaymentIntent(paymentIntent);

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error("Error during one-time payment creation:", error);
      throw new ApiError("Failed to create payment", 500);
    }
  }

  /**
   * Retrieves the most recent payment intent for a user.
   * @param userId - The ID of the user.
   * @returns {Stripe.PaymentIntent} - The payment intent object.
   */
  async getPayment(userId: string): Promise<Stripe.PaymentIntent> {
    if (!ObjectId.isValid(userId)) {
      throw new ApiError("Invalid user ID format", 400);
    }

    try {
      const user = await this.userCollection.findOne({
        _id: new ObjectId(userId),
      });

      if (!user || !user.lastPaymentIntentId) {
        throw new ApiError("Payment not found for user", 404);
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        user.lastPaymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      console.error("Error retrieving payment:", error);
      throw new ApiError("Failed to retrieve payment", 500);
    }
  }

  /**
   * Returns the publishable key for Stripe integration.
   * @returns {string} - The Stripe publishable key.
   */
  async sendPublishableKey(): Promise<string> {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new ApiError(
        "Publishable key not found in environment variables",
        500
      );
    }
    return STRIPE_PUBLISHABLE_KEY;
  }

  /**
   * Retrieves or creates a Stripe customer.
   * @returns {Stripe.Customer} - The created or fetched customer.
   */
  private async getOrCreateCustomer(): Promise<Stripe.Customer> {
    // Here, you could create logic to check if the customer already exists in your DB
    // For now, creating a new customer with a hardcoded email as an example
    try {
      return await stripe.customers.create({
        email: "bartek_19_83@hotmail.com", // Replace with dynamic email
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      throw new ApiError("Failed to create or retrieve customer", 500);
    }
  }

  /**
   * Saves the payment intent to the database.
   * @param paymentIntent - The Stripe PaymentIntent object to save.
   */
  private async savePaymentIntent(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
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
    } catch (error) {
      console.error("Error saving payment intent to database:", error);
      throw new ApiError("Failed to save payment intent to database", 500);
    }
  }
}
