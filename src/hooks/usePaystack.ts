import Paystack from "@paystack/inline-js";
import { NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY } from "../utils/constants.ts";

interface PaystackError {
  type: "setup";
  message: string;
}

interface PaystackOptions {
  email: string;
  amount: number; // in Naira
  onSuccess: (transaction: any) => void;
  onCancel?: () => void;
  onError?: (err: PaystackError) => void;
}

export const usePaystack = () => {
  const pay = ({ email, amount, onSuccess, onCancel, onError }: PaystackOptions) => {
    const popup = new Paystack();

    popup.newTransaction({
      key: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!, // pk_ key only
      email,
      amount: amount * 100, // Paystack requires kobo
      currency: "NGN",
      channels: ["card", "bank_transfer"], // add USSD, QR, Apple Pay if needed
      onSuccess,
      onCancel: onCancel || (() => console.log("Payment cancelled")),
      onError: onError || ((err) => console.error("Payment error:", err.message)),
    });
  };

  return { pay };
};
