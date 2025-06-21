import React, { memo, useEffect } from "react";
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
  cardNumber: [string, string, string, string]; // Explicitly define the cardNumber structure
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  password: string;
}

const PaymentModal: React.FC<ModalProps> = ({ modalId }) => {
  const { modals, closeModal, openModal } = useModalStore(); // Access the modals state
  const isOpen = modals[modalId];

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      cardNumber: ["", "", "", ""], // Define default values as a tuple
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      password: "",
    },
  });

  const cardNumber = watch("cardNumber"); // Watch the cardNumber for managing inputs
  const firstDigit = cardNumber[0]?.[0]; // Extract the first digit of the card number

  // Watch for card number changes and set value to trigger re-render
  useEffect(() => {
    setValue("cardNumber", cardNumber);
  }, [cardNumber, setValue]);

  const onSubmit = (data: FormValues) => {
    console.log("Payment Data Submitted", data);
    // Handle form submission logic (e.g., payment API call)
  };
  const handlePaymentSuccess = () => {
    closeModal(modalId);
    openModal("payment-success-modal");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-[600px] w-[492px] bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end">
          <img
            className="cursor-pointer"
            onClick={() => closeModal(modalId)}
            src={cancelMedium}
            alt="cancel"
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <img src={gighubLogo} alt="GigHub Logo" className="mr-2" />
          <button className="w-[142px] rounded-[10px] bg-[#6438C2] px-4 py-2 text-[16px] text-white">
            Card Payment
          </button>
          <button className="w-[100px] rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-[16px] text-[#000000]">
            QR Code
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
          <div className="mx-auto flex flex-col gap-y-2">
            <div className="mx-auto flex h-[31px] w-[410px] items-center justify-between">
              <div className="mb-1 block font-medium text-gray-700">
                Selected Plan
              </div>
              <div className="mb-4 text-right text-lg font-semibold text-purple-700">
                $40
              </div>
            </div>
            <div className="mx-auto flex h-[31px] w-[410px] items-center justify-center rounded-[10px] bg-[#F7F8FA] p-2">
              Quarterly
            </div>
          </div>

          <div className="mx-auto flex w-[412px] flex-col items-baseline gap-y-3">
            <div className="flex w-full flex-col items-baseline justify-start">
              <p className="text-[16px] text-[#000000]">Card number</p>
              <p className="text-[13px] text-[#8E8E8E]">
                Enter the 16-digit card number on the card
              </p>
            </div>
            <div className="mx-auto flex h-[37px] w-full items-center justify-evenly gap-x-5 rounded-[10px] bg-[#E6E6E6] px-3 py-3">
              {/* Conditional logo based on the first digit of the card number */}
              {firstDigit === "4" ? <SiVisa size={24} /> : <MasterCardLogo />}
              <div className="mx-auto flex w-[300px] items-center justify-evenly py-0">
                {cardNumber.map((_value, index) => (
                  <div key={index} className="flex items-center">
                    <Controller
                      name={`cardNumber.${index}` as keyof FormValues} // Type assertion
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="my-0 h-full w-[55px] border-none bg-transparent text-left text-[13px] outline-none focus:border-none focus:ring-0 active:border-none"
                          maxLength={4}
                          placeholder="2412"
                        />
                      )}
                    />
                    {index < cardNumber.length - 1 && (
                      <hr className="w-[12.5px] border-[1px] border-[#8E8E8E]" />
                    )}
                  </div>
                ))}
              </div>
              {/* Digit complete icon */}
              <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#6438C2]">
                <img src={check} alt="digit complete" />
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-[412px] justify-evenly">
            <div className="flex w-full flex-col items-baseline justify-start">
              <p className="text-[16px] text-[#000000]">CVV number</p>
              <p className="text-[13px] text-[#8E8E8E]">
                Enter the 3 or 4-digit number on the card
              </p>
            </div>
            <Controller
              name="cvv"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  maxLength={3}
                  className="h-[33px] w-[142px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-none focus:ring-0 active:border-none"
                  placeholder="345"
                />
              )}
            />
          </div>

          <div className="mx-auto flex w-[412px] justify-evenly">
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
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={2}
                    placeholder="09"
                    className="h-[33px] w-[84px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-none focus:ring-0 active:border-none"
                  />
                )}
              />
              <p className="mx-2">/</p>
              <Controller
                name="expiryYear"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={2}
                    placeholder="09"
                    className="h-[33px] w-[84px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-none focus:ring-0 active:border-none"
                  />
                )}
              />
            </div>
          </div>

          <div className="mx-auto flex w-[412px] justify-evenly">
            <div className="flex w-full flex-col items-baseline justify-start">
              <p className="text-[16px] text-[#000000]">Password</p>
              <p className="text-[13px] text-[#8E8E8E]">
                Enter your dynamic password
              </p>
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  placeholder="345"
                  className="h-[33px] w-[203px] rounded-[10px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 text-center outline-none focus:border-none focus:ring-0 active:border-none"
                />
              )}
            />
          </div>

          <button
            onClick={handlePaymentSuccess}
            type="submit"
            className="mx-auto mt-4 block h-[33px] w-[412px] rounded-[10px] bg-[#6438C2] py-1 text-center text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-700"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(PaymentModal);
