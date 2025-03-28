import { config } from "dotenv";
import sgMail from "@sendgrid/mail";
import { ISendVerificationEmailData } from "../../interface/interface";

config();
const { sendgridApi } = process.env;
sgMail.setApiKey(`${sendgridApi}`);

export class EmailHandler {
  async sendVerificationEmail({
    email,
    authToken,
  }: ISendVerificationEmailData): Promise<void> {
    try {
      const msg = {
        to: email,
        from: "team.tradekeeper@gmail.com",
        subject: "Welcome to TradeKeeper! Activate Your Account",
        text: "Thank you for registering with Team TradeKeeper. Please click the link below to complete your account activation:",
        html: `
            <p>Hello,</p>
            <p>Thank you for registering with Team TradeKeeper. Please click the link below to complete your account activation:</p>
            <p><a href="http://localhost:5173/activate/${authToken}">Activation Link</a></p>
            <p>Best regards,</p>
            <p>The Team TradeKeeper</p>
          `,
      };

      await sgMail.send(msg);
      console.log("Verification email sent successfully.");
    } catch (error: any) {
      console.error("Error sending verification email:", error.message);
    }
  }

  async emailConfirmationHandler({ email }: { email: string }): Promise<void> {
    try {
      const msg = {
        to: email,
        from: "team.tradekeeper@gmail.com",
        subject: "Account Activation Confirmation",
        text: `Dear User,\n\nYour TradeKeeper account has been successfully activated. Welcome aboard!\n\nBest regards,\nThe Team at TradeKeeper`,
        html: `
            <p>Dear User,</p>
            <p>Your TradeKeeper account has been successfully activated. Welcome aboard!</p>
            <p>Best regards,</p>
            <p>The Team at TradeKeeper</p>
          `,
      };

      await sgMail.send(msg);
      console.log("Account activation confirmation email sent successfully.");
    } catch (error: any) {
      console.error(
        "Error sending account activation confirmation email:",
        error.message
      );
    }
  }
}
