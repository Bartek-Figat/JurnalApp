import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CompleteTransactionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const paymentIntentStatus = searchParams.get("redirect_status");

    if (paymentIntentId && paymentIntentStatus) {
      if (paymentIntentStatus === "succeeded") {
        setMessage("Payment succeeded!");
      } else if (paymentIntentStatus === "processing") {
        setMessage("Your payment is processing.");
      } else if (paymentIntentStatus === "requires_payment_method") {
        setMessage("Your payment was not successful, please try again.");
      } else {
        setMessage("Something went wrong.");
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Transaction Complete
        </h1>
        {message ? (
          <p className="text-center text-lg">{message}</p>
        ) : (
          <p className="text-center text-lg">Checking Payment Status...</p>
        )}
      </div>
    </div>
  );
};

export default CompleteTransactionPage;
