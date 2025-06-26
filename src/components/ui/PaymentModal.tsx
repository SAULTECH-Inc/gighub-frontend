import React, { memo, useRef, useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import cancelMedium from "../../assets/icons/cancelMedium.svg";
import check from "../../assets/icons/check.svg";
import { SiVisa } from "react-icons/si";
import MasterCardLogo from "../common/MasterCardLogo.tsx";
import { useForm, Controller } from "react-hook-form";

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

  // Refs for card number inputs
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

  // Check if card number is complete (all 4 segments filled)
  const isCardNumberComplete = cardNumber.every(
    (segment) => segment.length === 4,
  );

  // Auto-focus to next input when current segment is complete
  const handleCardNumberChange = (value: string, index: number) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "");

    const newCardNumber = [...cardNumber];
    newCardNumber[index] = numericValue;
    setValue("cardNumber", newCardNumber as [string, string, string, string]);

    // Auto-focus to next input if current is filled and not the last one
    if (numericValue.length === 4 && index < 3) {
      cardInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleCardNumberKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && cardNumber[index] === "" && index > 0) {
      cardInputRefs.current[index - 1]?.focus();
    }
  };

  // Validate expiry date
  const validateExpiryDate = () => {
    const month = parseInt(watch("expiryMonth"));
    const year = parseInt(watch("expiryYear"));

    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  };

  const onSubmit = (data: FormValues) => {
    console.log("Payment Data Submitted", data);

    // Validate expiry date
    if (!validateExpiryDate()) {
      alert("Please enter a valid expiry date");
      return;
    }

    handlePaymentSuccess();
  };

  const handlePaymentSuccess = () => {
    closeModal(modalId);
    openModal("payment-success-modal");
  };

  // Bank transfer functions
  const handleCopyAccount = () => {
    navigator.clipboard.writeText("1234567890");
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedProof(file);
    }
  };

  const handleBankTransferSubmit = () => {
    if (!uploadedProof) {
      alert("Please upload proof of payment");
      return;
    }
    handlePaymentSuccess();
  };

  // Generate QR code data (you might want to use a proper QR library)
  const qrCodeData =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank%20Transfer%20Payment%20-%20Account:%201234567890%20-%20Amount:%20$40";

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-[650px] w-[96%] overflow-y-auto rounded-[10px] bg-white p-6 shadow-xl md:w-[492px]">
        <div className="absolute top-6 right-6 z-10 mb-6 flex items-center justify-end">
          <img
            className="cursor-pointer hover:opacity-70"
            onClick={() => closeModal(modalId)}
            src={cancelMedium}
            alt="cancel"
          />
        </div>

        <div className="mb-4 flex items-center justify-start">
          <img src={gighubLogo} alt="GigHub Logo" className="mr-2" />
        </div>

        {/* Tab Navigation */}
        <div className="my-6 flex w-full flex-row gap-x-2">
          <button
            onClick={() => setActiveTab("card")}
            className={`w-1/2 rounded-[10px] px-4 py-2 text-[16px] transition-colors ${
              activeTab === "card"
                ? "bg-[#6438C2] text-white"
                : "border border-[#E6E6E6] bg-[#ffffff] text-black hover:bg-gray-50"
            }`}
          >
            Card Payment
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`w-1/2 rounded-[10px] px-4 py-2 text-[16px] transition-colors ${
              activeTab === "bank"
                ? "bg-[#6438C2] text-white"
                : "border border-[#E6E6E6] bg-[#ffffff] text-black hover:bg-gray-50"
            }`}
          >
            Bank Transfer
          </button>
        </div>

        {/* Plan Info */}
        <div className="mx-auto mb-6 flex flex-col gap-y-2">
          <div className="mx-auto flex h-[31px] w-full items-center justify-between">
            <div className="font-medium text-gray-700">Selected Plan</div>
            <div className="text-right text-lg font-semibold text-purple-700">
              $40
            </div>
          </div>
          <div className="flex h-[31px] w-full items-center justify-center rounded-[10px] bg-[#F7F8FA]">
            Quarterly
          </div>
        </div>

        {/* Card Payment Tab */}
        {activeTab === "card" && (
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
            <div className="mx-auto flex w-full flex-col items-baseline gap-y-3">
              <div className="flex w-full flex-col items-baseline justify-start">
                <p className="text-[16px] text-[#000000]">Card number</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Enter the 16-digit card number on the card
                </p>
              </div>
              <div className="mx-auto flex h-[37px] w-full items-center justify-evenly gap-x-5 rounded-[10px] bg-[#E6E6E6] px-3 py-3">
                {/* Conditional logo based on the first digit of the card number */}
                {firstDigit === "4" ? <SiVisa size={24} /> : <MasterCardLogo />}

                <div className="mx-auto flex w-full items-center justify-evenly py-0">
                  {cardNumber.map((_value, index) => (
                    <div key={index} className="flex items-center">
                      <Controller
                        name={`cardNumber.${index}` as keyof FormValues}
                        control={control}
                        rules={{
                          required: "Card number is required",
                          minLength: {
                            value: 4,
                            message: "Each segment must be 4 digits",
                          },
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            ref={(el) => (cardInputRefs.current[index] = el)}
                            onChange={(e) =>
                              handleCardNumberChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleCardNumberKeyDown(e, index)}
                            className="my-0 h-full w-[55px] border-none bg-transparent text-left text-xs outline-none focus:border-none focus:ring-0 active:border-none"
                            maxLength={4}
                            placeholder="2412"
                            type="text"
                            inputMode="numeric"
                          />
                        )}
                      />
                      {index < cardNumber.length - 1 && (
                        <hr className="w-[12px] border-[1px] border-[#8E8E8E]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Digit complete icon - only show when card number is complete */}
                {isCardNumberComplete && (
                  <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#6438C2]">
                    <img src={check} alt="digit complete" />
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto flex w-full justify-evenly">
              <div className="flex w-full flex-col items-baseline justify-start">
                <p className="text-[16px] text-[#000000]">CVV number</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Enter the 3 or 4-digit number on the card
                </p>
              </div>
              <Controller
                name="cvv"
                control={control}
                rules={{
                  required: "CVV is required",
                  minLength: {
                    value: 3,
                    message: "CVV must be at least 3 digits",
                  },
                  maxLength: {
                    value: 4,
                    message: "CVV must be at most 4 digits",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={4}
                    className="h-[33px] w-[100px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-[#6438C2] focus:ring-0"
                    placeholder="345"
                    type="text"
                    inputMode="numeric"
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              />
            </div>

            <div className="mx-auto flex w-full justify-evenly">
              <div className="flex w-full flex-col items-baseline justify-start">
                <p className="text-[16px] text-[#000000]">Expiry Date</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Enter the expiration date of the card
                </p>
              </div>
              <div className="flex items-center justify-evenly">
                <Controller
                  name="expiryMonth"
                  control={control}
                  rules={{
                    required: "Month is required",
                    validate: (value) => {
                      const month = parseInt(value);
                      return (month >= 1 && month <= 12) || "Invalid month";
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      maxLength={2}
                      placeholder="09"
                      className="h-[33px] w-[84px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-[#6438C2] focus:ring-0"
                      type="text"
                      inputMode="numeric"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  )}
                />
                <p className="mx-2">/</p>
                <Controller
                  name="expiryYear"
                  control={control}
                  rules={{
                    required: "Year is required",
                    minLength: { value: 2, message: "Year must be 2 digits" },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      maxLength={2}
                      placeholder="25"
                      className="h-[33px] w-[84px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-[#6438C2] focus:ring-0"
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

            {/* Display validation errors */}
            {Object.keys(errors).length > 0 && (
              <div className="text-center text-sm text-red-500">
                Please fill in all required fields correctly
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || !isCardNumberComplete}
              className="mx-auto mt-4 block h-[33px] w-1/2 rounded-[10px] bg-[#6438C2] py-1 text-center text-white transition-colors hover:bg-purple-800 focus:ring-2 focus:ring-purple-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pay Now
            </button>
          </form>
        )}

        {/* Bank Transfer Tab */}
        {activeTab === "bank" && (
          <div className="mx-auto space-y-6">
            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <p className="mb-2 text-[16px] font-medium text-[#000000]">
                  Scan QR Code to Pay
                </p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Use your banking app to scan this QR code
                </p>
              </div>

              <div className="rounded-[10px] border-2 border-[#E6E6E6] bg-white p-4 shadow-md">
                <img
                  src={qrCodeData}
                  alt="Payment QR Code"
                  className="h-[200px] w-[200px]"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center">
              <hr className="flex-grow border-[#E6E6E6]" />
              <span className="px-4 text-[13px] text-[#8E8E8E]">OR</span>
              <hr className="flex-grow border-[#E6E6E6]" />
            </div>

            {/* Bank Account Details */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="mb-2 text-[16px] font-medium text-[#000000]">
                  Bank Transfer Details
                </p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Transfer to the account below and upload proof of payment
                </p>
              </div>

              <div className="space-y-3 rounded-[10px] bg-[#F7F8FA] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#8E8E8E]">Bank Name:</span>
                  <span className="text-[14px] font-medium">GigHub Bank</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#8E8E8E]">
                    Account Name:
                  </span>
                  <span className="text-[14px] font-medium">
                    GigHub Limited
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#8E8E8E]">
                    Account Number:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[14px] font-medium">1234567890</span>
                    <button
                      onClick={handleCopyAccount}
                      className="text-[12px] text-[#6438C2] hover:underline"
                    >
                      {accountCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#8E8E8E]">Amount:</span>
                  <span className="text-[16px] font-bold text-[#6438C2]">
                    $40.00
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#8E8E8E]">Reference:</span>
                  <span className="text-[14px] font-medium">
                    QUARTERLY-2025
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Proof Section */}
            <div className="space-y-3">
              <div>
                <p className="text-[16px] font-medium text-[#000000]">
                  Upload Proof of Payment
                </p>
                <p className="text-[13px] text-[#8E8E8E]">
                  Upload your payment receipt or screenshot
                </p>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="flex h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#E6E6E6] transition-colors hover:border-[#6438C2] hover:bg-[#F7F8FA]"
                >
                  {uploadedProof ? (
                    <div className="text-center">
                      <div className="text-[14px] font-medium text-[#6438C2]">
                        ✓ {uploadedProof.name}
                      </div>
                      <div className="text-[12px] text-[#8E8E8E]">
                        Click to change file
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-1 text-[24px] text-[#8E8E8E]">📄</div>
                      <div className="text-[14px] text-[#8E8E8E]">
                        Click to upload proof of payment
                      </div>
                      <div className="text-[12px] text-[#8E8E8E]">
                        JPG, PNG, or PDF
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleBankTransferSubmit}
              disabled={!uploadedProof}
              className="mx-auto mt-4 block h-[33px] w-1/2 rounded-[10px] bg-[#6438C2] py-1 text-center text-white transition-colors hover:bg-purple-800 focus:ring-2 focus:ring-purple-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PaymentModal);
