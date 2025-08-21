import React, { memo, useRef, useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { SiVisa } from "react-icons/si";
import MasterCardLogo from "../common/MasterCardLogo.tsx";
import { useForm, Controller } from "react-hook-form";
import qrCodeData from "../../assets/images/qrcode.png";
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
  AlertCircle
} from "lucide-react";

interface ModalProps {
  modalId: string;
}

interface FormValues {
  cardNumber: [string, string, string, string];
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  password: string;
}

const PaymentModal: React.FC<ModalProps> = ({ modalId }) => {
  const { modals, closeModal, openModal } = useModalStore();
  const isOpen = modals[modalId];
  const [activeTab, setActiveTab] = useState<"card" | "bank">("card");
  const [accountCopied, setAccountCopied] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cardInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      cardNumber: ["", "", "", ""],
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      password: "",
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

  const validateExpiryDate = () => {
    const month = parseInt(watch("expiryMonth"));
    const year = parseInt(watch("expiryYear"));

    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    return !(year < currentYear || (year === currentYear && month < currentMonth));


  };

  const onSubmit = async () => {
    if (!validateExpiryDate()) {
      alert("Please enter a valid expiry date");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      handlePaymentSuccess();
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    closeModal(modalId);
    openModal("payment-success-modal");
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("1234567890").then(r => r);
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedProof(file);
    }
  };

  const handleBankTransferSubmit = async () => {
    if (!uploadedProof) {
      alert("Please upload proof of payment");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      handlePaymentSuccess();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <img src={gighubLogo} alt="GigHub Logo" className="h-8 w-auto" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Payment
              </h2>
              <p className="text-sm text-slate-600">Secure & Encrypted</p>
            </div>
          </div>
          <button
            onClick={() => closeModal(modalId)}
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
            <span className="text-2xl font-bold text-indigo-600">$40</span>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2">
            <span className="text-sm font-medium text-slate-800">
              Quarterly Subscription
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-100 p-4 pb-4 sm:p-6">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("card")}
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
              onClick={() => setActiveTab("bank")}
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
          {/* Card Payment Tab */}
          {activeTab === "card" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  256-bit SSL Encrypted
                </span>
              </div>

              {/* Card Number */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    Card Number
                  </label>
                  <p className="text-xs text-slate-600">
                    Enter the 16-digit card number
                  </p>
                </div>

                <div className="relative">
                  <div className="flex items-center space-x-3 rounded-xl border border-slate-200 bg-slate-50 p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                    {/* Card Logo */}
                    <div className="flex-shrink-0">
                      {firstDigit === "4" ? (
                        <SiVisa size={24} className="text-blue-600" />
                      ) : (
                        <MasterCardLogo />
                      )}
                    </div>

                    {/* Card Number Inputs */}
                    <div className="flex flex-1 items-center space-x-2">
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
                                className="w-12 border-0 bg-transparent text-center font-mono text-sm focus:ring-0 focus:outline-none sm:w-14"
                                maxLength={4}
                                placeholder="0000"
                                type="text"
                                inputMode="numeric"
                              />
                            )}
                          />
                          {index < 3 && (
                            <div className="h-px w-2 bg-slate-400"></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Validation Check */}
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

              {/* CVV and Expiry */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* CVV */}
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

                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900">
                    Expiry Date
                  </label>
                  <div className="flex items-center space-x-2">
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
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          type="text"
                          inputMode="numeric"
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      )}
                    />
                    <span className="text-slate-400">/</span>
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
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
              </div>

              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">
                    Please fill in all required fields correctly
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || !isCardNumberComplete || isProcessing}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Pay $40 Securely</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bank Transfer Tab */}
          {activeTab === "bank" && (
            <div className="space-y-6">
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
                    { label: "Amount", value: "$40.00", highlight: true },
                    { label: "Reference", value: "QUARTERLY-2025" },
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
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Payment</span>
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