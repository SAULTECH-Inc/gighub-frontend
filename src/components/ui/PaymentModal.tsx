import React, { memo, useState, useRef } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import qrCodeData from "../../assets/images/qrcode.png";
import { SiVisa } from "react-icons/si";
import MasterCardLogo from "../common/MasterCardLogo.tsx";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  CreditCard,
  Building,
  Check,
  Copy,
  Upload,
  Smartphone,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SubscriptionResponse } from "../../utils/types";
import numeral from "numeral";
import { makePaymentForSub } from "../../services/api";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";

interface ModalProps {
  modalId: string;
  selectedPlan: SubscriptionResponse;
  user: any;
}

interface FormValues {
  cardNumber: [string, string, string, string];
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

const PaymentModal: React.FC<ModalProps> = ({
  modalId,
  selectedPlan,
  user,
}) => {
  const { modals, closeModal, openModal } = useModalStore();
  const { subscribe } = useSubscriptionStore();
  const isOpen = modals[modalId];
  const [activeTab, setActiveTab] = useState<"card" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [accountCopied, setAccountCopied] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<File | null>(null);

  const cardInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      cardNumber: ["", "", "", ""],
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
    },
    mode: "onChange",
  });

  const cardNumber = watch("cardNumber");
  const firstDigit = cardNumber[0]?.[0];
  const isCardNumberComplete = cardNumber.every(
    (segment) => segment.length === 4,
  );

  const handleCardNumberChange = (value: string, index: number) => {
    const numericValue = value.replace(/\D/g, "");
    const newCardNumber = [...cardNumber];
    newCardNumber[index] = numericValue;
    setValue("cardNumber", newCardNumber as [string, string, string, string]);

    if (numericValue.length === 4 && index < 3) {
      cardInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCardNumberKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && cardNumber[index] === "" && index > 0) {
      cardInputRefs.current[index - 1]?.focus();
    }
  };

  const validateExpiryDate = (month: string, year: string) => {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    return !(
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    );
  };

  const processEncryptedPayment = async (formData: FormValues) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const fullCardNumber = formData.cardNumber.join("");

      // CHANGED: Send plain card data to backend - no encryption on frontend
      const paymentPayload = {
        amount: selectedPlan.price,
        currency: selectedPlan.currency || "NGN",
        reference: `sub_${Date.now()}_${user.id}`,
        customer: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
        payment_method: {
          type: "card",
          card: {
            card_number: fullCardNumber, // Plain text - backend will encrypt
            cvv: formData.cvv, // Plain text - backend will encrypt
            expiry_month: formData.expiryMonth, // Plain text - backend will encrypt
            expiry_year: `20${formData.expiryYear}`, // Plain text - backend will encrypt
          },
        },
        metadata: {
          userId: user.id,
          subscriptionId: selectedPlan.id,
          planName: selectedPlan.name,
        },
      };

      console.log("Sending payment request to backend...");

      // Make payment request to YOUR backend (not directly to Flutterwave)
      const paymentResponse = await makePaymentForSub(paymentPayload);
      console.log("Payment response:", paymentResponse);

      if (paymentResponse.statusCode !== 200) {
        throw new Error(
          paymentResponse.message ||
            paymentResponse.error ||
            `Payment failed (${paymentResponse.statusCode})`,
        );
      }

      if (!paymentResponse.data) {
        throw new Error("No payment data received from server");
      }

      const result = paymentResponse.data;

      if (result.status === "successful") {
        await handleSuccessfulPayment(result);
      } else if (
        result.status === "pending" &&
        result.authorization?.mode === "pin"
      ) {
        await handlePinRequired(result);
      } else if (
        result.status === "pending" &&
        result.authorization?.mode === "otp"
      ) {
        await handleOtpRequired(result);
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      let errorMessage = "Payment processing failed";

      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("Network")
      ) {
        errorMessage =
          "Network error: Please check your internet connection and try again";
      } else if (error.message?.includes("401")) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error.message?.includes("403")) {
        errorMessage = "Payment not authorized. Please contact support.";
      } else if (error.message?.includes("404")) {
        errorMessage = "Payment service unavailable. Please try again later.";
      } else if (error.message?.includes("429")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message?.includes("500")) {
        errorMessage = "Server error. Please try again in a few minutes.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessfulPayment = async (paymentResult: any) => {
    try {
      const subscriptionResponse = await subscribe(user.id, selectedPlan.id);

      if (subscriptionResponse.statusCode !== 200) {
        const errorText = subscriptionResponse.message;
        console.error(
          "Subscription activation failed:",
          errorText,
          paymentResult,
        );
        throw new Error(
          "Payment successful but subscription activation failed. Please contact support.",
        );
      }

      // Clear form and close modal on success
      reset();
      setPaymentError(null);
      handlePaymentSuccess();
    } catch (error: any) {
      console.error("Subscription activation error:", error);
      setPaymentError(
        error.message ||
          "Payment successful but subscription activation failed",
      );
    }
  };

  const handlePinRequired = async (result: any) => {
    const pin = prompt("Please enter your 4-digit card PIN:");
    if (!pin) {
      setPaymentError("PIN is required to complete this payment");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setPaymentError("PIN must be exactly 4 digits");
      return;
    }

    try {
      const response = await fetch("/api/payments/flutterwave-validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          flw_ref: result.flw_ref,
          otp: pin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Validation failed (${response.status})`);
      }

      const pinResult = await response.json();

      if (pinResult.status === "successful") {
        await handleSuccessfulPayment(pinResult);
      } else {
        throw new Error("Invalid PIN provided");
      }
    } catch (error: any) {
      console.error("PIN validation error:", error);
      setPaymentError(error.message || "PIN validation failed");
    }
  };

  const handleOtpRequired = async (result: any) => {
    const otp = prompt("Please enter the OTP sent to your phone:");
    if (!otp) {
      setPaymentError("OTP is required to complete this payment");
      return;
    }

    if (!/^\d{4,6}$/.test(otp)) {
      setPaymentError("OTP must be 4-6 digits");
      return;
    }

    try {
      const response = await fetch("/api/payments/flutterwave-validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          flw_ref: result.flw_ref,
          otp: otp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Validation failed (${response.status})`);
      }

      const otpResult = await response.json();

      if (otpResult.status === "successful") {
        await handleSuccessfulPayment(otpResult);
      } else {
        throw new Error("Invalid OTP provided");
      }
    } catch (error: any) {
      console.error("OTP validation error:", error);
      setPaymentError(error.message || "OTP validation failed");
    }
  };

  const handlePaymentSuccess = () => {
    closeModal(modalId);
    openModal("payment-success-modal");
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("1234567890");
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setPaymentError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setPaymentError("Please upload a JPG, PNG, or PDF file");
      return;
    }

    setUploadedProof(file);
    setPaymentError(null); // Clear any previous errors
  };

  const handleBankTransferSubmit = async () => {
    if (!uploadedProof) {
      setPaymentError("Please upload proof of payment");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const formData = new FormData();
      formData.append("proof", uploadedProof);
      formData.append("userId", user.id.toString());
      formData.append("subscriptionId", selectedPlan.id.toString());
      formData.append("amount", selectedPlan.price.toString());
      formData.append("reference", `bank_${Date.now()}_${user.id}`);

      const response = await fetch("/api/payments/bank-transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      console.log("Bank transfer response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to submit bank transfer";

        if (response.status === 400) {
          errorMessage = "Invalid payment details. Please check and try again.";
        } else if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (response.status === 404) {
          errorMessage =
            "Bank transfer service unavailable. Please contact support.";
        } else if (response.status === 413) {
          errorMessage = "File too large. Please upload a smaller file.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        throw new Error(errorMessage);
      }

      // Success
      alert(
        "Bank transfer submitted successfully. Your subscription will be activated within 24 hours after verification.",
      );

      // Clear form and close modal
      setUploadedProof(null);
      handlePaymentSuccess();
    } catch (error: any) {
      console.error("Bank transfer error:", error);
      setPaymentError(error.message || "Bank transfer submission failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!validateExpiryDate(data.expiryMonth, data.expiryYear)) {
      setPaymentError("Please enter a valid expiry date");
      return;
    }

    await processEncryptedPayment(data);
  };

  // Clear errors when switching tabs
  const handleTabChange = (tab: "card" | "bank") => {
    setActiveTab(tab);
    setPaymentError(null);
  };

  // Clear errors and form when modal closes
  const handleModalClose = () => {
    closeModal(modalId);
    setPaymentError(null);
    setUploadedProof(null);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs">
      <div className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <img src={gighubLogo} alt="GigHub Logo" className="h-8 w-auto" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Secure Payment
              </h2>
              <p className="text-sm text-slate-600">3DES Encrypted</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Selected Plan
            </span>
            <span className="text-2xl font-bold text-indigo-600">
              {selectedPlan?.currency || "N"}
              {numeral(selectedPlan?.price || "0").format("0,0")}
            </span>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2">
            <span className="text-sm font-medium text-slate-800">
              {selectedPlan?.name} / {selectedPlan?.billingCycle}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-100 p-4 pb-4 sm:p-6">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => handleTabChange("card")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "card"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Card Payment</span>
            </button>
            <button
              onClick={() => handleTabChange("bank")}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "bank"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Bank Transfer</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Error Display */}
          {paymentError && (
            <div className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span className="text-sm text-red-700">{paymentError}</span>
            </div>
          )}

          {/* Card Payment Tab */}
          {activeTab === "card" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Your card details are securely encrypted by our server
                </span>
              </div>

              {/* Card Number */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-900">
                  Card Number
                </label>

                <div className="relative">
                  <div className="flex items-center space-x-3 rounded-xl border border-slate-200 bg-slate-50 p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                    <div className="flex-shrink-0">
                      {firstDigit === "4" ? (
                        <SiVisa size={24} className="text-blue-600" />
                      ) : (
                        <MasterCardLogo />
                      )}
                    </div>

                    <div className="flex flex-1 items-center space-x-1">
                      {cardNumber.map((_value, index) => (
                        <React.Fragment key={index}>
                          <Controller
                            name={`cardNumber.${index}` as keyof FormValues}
                            control={control}
                            rules={{
                              required: "Required",
                              minLength: {
                                value: 4,
                                message: "4 digits required",
                              },
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                ref={(el) =>
                                  (cardInputRefs.current[index] = el)
                                }
                                onChange={(e) =>
                                  handleCardNumberChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                  handleCardNumberKeyDown(e, index)
                                }
                                className="w-14 border-0 bg-transparent text-center font-mono text-sm focus:ring-0 focus:outline-none"
                                maxLength={4}
                                placeholder="0000"
                                type="text"
                                inputMode="numeric"
                              />
                            )}
                          />
                          {index < 3 && (
                            <div className="h-px w-1 bg-slate-400"></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {isCardNumberComplete && (
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CVV, Month, Year */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900">
                    CVV
                  </label>
                  <Controller
                    name="cvv"
                    control={control}
                    rules={{
                      required: "CVV required",
                      minLength: { value: 3, message: "3-4 digits" },
                      maxLength: { value: 4, message: "3-4 digits" },
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <input
                          {...field}
                          maxLength={4}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="123"
                          type="text"
                          inputMode="numeric"
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }
                        />
                        <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900">
                    Month
                  </label>
                  <Controller
                    name="expiryMonth"
                    control={control}
                    rules={{
                      required: "Month required",
                      validate: (value) => {
                        const month = parseInt(value);
                        return (month >= 1 && month <= 12) || "Invalid";
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        maxLength={2}
                        placeholder="MM"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        type="text"
                        inputMode="numeric"
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900">
                    Year
                  </label>
                  <Controller
                    name="expiryYear"
                    control={control}
                    rules={{
                      required: "Year required",
                      minLength: { value: 2, message: "2 digits" },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        maxLength={2}
                        placeholder="YY"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        type="text"
                        inputMode="numeric"
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || !isCardNumberComplete || isProcessing}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>
                      Pay {selectedPlan?.currency || "N"}
                      {numeral(selectedPlan?.price || 0).format("0,0")} Securely
                    </span>
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center text-xs text-slate-500">
                <p>
                  Your card details are securely transmitted and encrypted on
                  our servers.
                </p>
                <p className="mt-1">
                  Your sensitive information never reaches our servers
                  unencrypted.
                </p>
              </div>
            </form>
          )}

          {/* Bank Transfer Tab */}
          {activeTab === "bank" && (
            <div className="space-y-6">
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Secure Bank Transfer
                </span>
              </div>

              {/* QR Code Section */}
              <div className="space-y-4 text-center">
                <div className="mb-4 flex items-center justify-center space-x-2">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Scan to Pay
                  </h3>
                </div>

                <div className="inline-block rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
                  <img
                    src={qrCodeData}
                    alt="Payment QR Code"
                    className="h-40 w-40 sm:h-48 sm:w-48"
                  />
                </div>

                <p className="text-sm text-slate-600">
                  Use your banking app to scan this QR code
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="bg-white px-4 text-sm text-slate-500">OR</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-slate-900">
                  <Building className="h-5 w-5 text-indigo-600" />
                  <span>Bank Transfer Details</span>
                </h3>

                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {[
                    { label: "Bank Name", value: "GigHub Bank" },
                    { label: "Account Name", value: "GigHub Limited" },
                    {
                      label: "Account Number",
                      value: "1234567890",
                      copyable: true,
                    },
                    {
                      label: "Amount",
                      value: `${selectedPlan.currency}${numeral(selectedPlan.price).format("0,0")}`,
                      highlight: true,
                    },
                    {
                      label: "Reference",
                      value: `${selectedPlan.billingCycle.toUpperCase()}-${user.id}-${Date.now()}`,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-600">
                        {item.label}:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            item.highlight
                              ? "text-lg font-bold text-indigo-600"
                              : "text-slate-900"
                          }`}
                        >
                          {item.value}
                        </span>
                        {item.copyable && (
                          <button
                            onClick={handleCopyAccount}
                            className="flex items-center space-x-1 text-xs text-indigo-600 transition-colors hover:text-indigo-700"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{accountCopied ? "Copied!" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Important Instructions:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Use the exact reference number provided above</li>
                        <li>• Upload clear proof of payment after transfer</li>
                        <li>
                          • Subscription will be activated within 24 hours
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Proof */}
              <div className="space-y-3">
                <h4 className="flex items-center space-x-2 text-base font-semibold text-slate-900">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span>Upload Proof of Payment</span>
                </h4>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofUpload}
                  className="hidden"
                  id="proof-upload"
                />

                <label
                  htmlFor="proof-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50"
                >
                  {uploadedProof ? (
                    <div className="text-center">
                      <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
                      <p className="text-sm font-medium text-green-700">
                        {uploadedProof.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">
                        Upload payment receipt
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, or PDF (max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBankTransferSubmit}
                disabled={!uploadedProof || isProcessing}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Payment Proof</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentModal);
