import React, { useEffect } from "react";
import useModalStore from "../../redux/modalStateStores.ts";
import gighubLogo from '../../assets/icons/gighubLogoSmall.svg';
import cancelMedium from '../../assets/icons/cancelMedium.svg';
import check from  '../../assets/icons/check.svg';
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
            password: ""
        }
    });

    const cardNumber = watch('cardNumber'); // Watch the cardNumber for managing inputs
    const firstDigit = cardNumber[0]?.[0]; // Extract the first digit of the card number

    // Watch for card number changes and set value to trigger re-render
    useEffect(() => {
        setValue("cardNumber", cardNumber);
    }, [cardNumber, setValue]);

    const onSubmit = (data: FormValues) => {
        console.log("Payment Data Submitted", data);
        // Handle form submission logic (e.g., payment API call)
    };
    const handlePaymentSuccess = ()=>{
        closeModal(modalId);
        openModal("payment-success-modal");
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-xl p-6 w-[492px] h-[600px]">
                <div className="flex items-center justify-end mb-6">
                    <img className="cursor-pointer" onClick={() => closeModal(modalId)} src={cancelMedium} alt="cancel"/>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <img
                        src={gighubLogo}
                        alt="GigHub Logo"
                        className="mr-2"
                    />
                    <button className="px-4 py-2 text-white text-[16px] bg-[#6438C2] rounded-[10px] w-[142px]">Card Payment</button>
                    <button className="px-4 py-2 text-[#000000] text-[16px] border border-[#E6E6E6] rounded-[10px] w-[100px]">QR Code
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-auto">
                    <div className="flex flex-col mx-auto gap-y-2">
                        <div className="flex justify-between items-center w-[410px] h-[31px] mx-auto">
                            <div className="block text-gray-700 font-medium mb-1">Selected Plan</div>
                            <div className="text-right text-lg text-purple-700 font-semibold mb-4">$40</div>
                        </div>
                        <div
                            className="bg-[#F7F8FA] flex justify-center items-center w-[410px] h-[31px] rounded-[10px] p-2 mx-auto">
                            Quarterly
                        </div>
                    </div>

                    <div className="mx-auto flex flex-col items-baseline gap-y-3 w-[412px]">
                        <div className="flex flex-col items-baseline justify-start w-full">
                            <p className="text-[16px] text-[#000000]">Card number</p>
                            <p className="text-[13px] text-[#8E8E8E]">Enter the 16-digit card number on the card</p>
                        </div>
                        <div
                            className="flex justify-evenly items-center w-full h-[37px] gap-x-5 bg-[#E6E6E6] px-3 py-3 rounded-[10px] mx-auto">
                            {/* Conditional logo based on the first digit of the card number */}
                            {firstDigit === "4" ? <SiVisa size={24} /> : <MasterCardLogo />}
                            <div className="flex justify-evenly items-center py-0 w-[300px] mx-auto">
                                {cardNumber.map((_value, index) => (

                                    <div key={index} className="flex items-center">
                                        <Controller
                                            name={`cardNumber.${index}` as keyof FormValues} // Type assertion
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    className="my-0 h-full w-[55px] text-[13px] bg-transparent text-left border-none outline-none focus:ring-0 focus:border-none active:border-none"
                                                    maxLength={4}
                                                    placeholder="2412"
                                                />
                                            )}
                                        />
                                        {index < cardNumber.length - 1 && (
                                            <hr className="w-[12.5px] border-[#8E8E8E] border-[1px]"/>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* Digit complete icon */}
                            <div
                                className="bg-[#6438C2] flex justify-center items-center w-[15px] h-[15px] rounded-full">
                                <img src={check} alt="digit complete"/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-evenly w-[412px] mx-auto">
                        <div className="flex flex-col items-baseline justify-start w-full">
                            <p className="text-[16px] text-[#000000]">CVV number</p>
                            <p className="text-[13px] text-[#8E8E8E]">Enter the 3 or 4-digit number on the card</p>
                        </div>
                        <Controller
                            name="cvv"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    maxLength={3}
                                    className="w-[142px] h-[33px] px-4 py-2 border-[2px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-center outline-none focus:ring-0 focus:border-none active:border-none"
                                    placeholder="345"
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-evenly w-[412px] mx-auto">
                        <div className="flex flex-col items-baseline justify-start w-full">
                            <p className="text-[16px] text-[#000000]">Expiry Date</p>
                            <p className="text-[13px] text-[#8E8E8E]">Enter the expiration date of the card</p>
                        </div>
                        <div className="flex justify-evenly items-center">
                            <Controller
                                name="expiryMonth"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        maxLength={2}
                                        placeholder="09"
                                        className="w-[84px] h-[33px] px-4 py-2 border-[2px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-center outline-none focus:ring-0 focus:border-none active:border-none"
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
                                        className="w-[84px] h-[33px] px-4 py-2 border-[2px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-center outline-none focus:ring-0 focus:border-none active:border-none"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-evenly w-[412px] mx-auto">
                        <div className="flex flex-col items-baseline justify-start w-full">
                            <p className="text-[16px] text-[#000000]">Password</p>
                            <p className="text-[13px] text-[#8E8E8E]">Enter your dynamic password</p>
                        </div>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="password"
                                    placeholder="345"
                                    className="w-[203px] h-[33px] px-4 py-2 border-[2px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-center outline-none focus:ring-0 focus:border-none active:border-none"
                                />
                            )}
                        />
                    </div>

                    <button
                        onClick={handlePaymentSuccess}
                        type="submit"
                        className="w-[412px] h-[33px] mx-auto text-center block py-1 mt-4 text-white bg-[#6438C2] rounded-[10px] hover:bg-purple-800 focus:ring-2 focus:ring-purple-700 focus:outline-none"
                    >
                        Pay Now
                    </button>
                </form>
            </div>


        </div>
    );
};

export default PaymentModal;
