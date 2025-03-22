import React, { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./Checkoutform";
import axios from "axios";

function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

const Payment: React.FC = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(
    Promise.resolve(null),
  );
  const [clientSecret, setClientSecret] = useState<string | undefined>();
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("usd");
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);

  useEffect(() => {
    const fetchPublishableKey = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/payment/publishable-key",
        );
        const publishableKey = response.data.publishableKey;
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Failed to fetch publishable key:", error);
      }
    };

    fetchPublishableKey();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (amount > 0) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/payment/create",
            { amount: convertToSubcurrency(amount), currency },
          );
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error("Failed to create payment intent:", error);
        }
      }
    };

    if (isValidAmount) {
      createPaymentIntent();
    }
  }, [amount, currency, isValidAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmount(newAmount);
    setIsValidAmount(newAmount > 0);
  };

  return (
    <div className="container mx-auto grid max-w-md grid-cols-1 items-center justify-center gap-4 p-4">
      <div className="flex flex-col gap-4">
        <label className="text-lg font-semibold">
          Amount:
          <input
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={amount}
            onChange={handleAmountChange}
          />
          {!isValidAmount && (
            <span className="text-sm text-red-500">
              Amount must be greater than 0
            </span>
          )}
        </label>
        <label className="text-lg font-semibold">
          Currency:
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="cad">CAD</option>
            <option value="aud">AUD</option>
          </select>
        </label>
      </div>
      <div className="flex items-center justify-center">
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "stripe" },
              loader: "auto",
            }}
          >
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
