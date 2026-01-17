import { usePaystack } from "../../hooks/usePaystack.ts";

const PaymentButton = () => {
  const { pay } = usePaystack();

  const handlePayment = () => {
    pay({
      email: "customer@example.com",
      amount: 5000, // ₦5000
      onSuccess: (trx) => {
        console.log("Transaction successful:", trx);
        // 🔒 send trx.reference to your backend for verification
        fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: trx.reference }),
        });
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="rounded-lg bg-purple-600 px-4 py-2 text-white"
    >
      Pay ₦5000
    </button>
  );
};

export default PaymentButton;
