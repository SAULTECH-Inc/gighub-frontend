import React, {useRef, useState} from "react";
import useModalStore from "../../redux/modalStateStores.ts";
import gighubLogo from '../../assets/icons/gighubLogoSmall.svg';
import cancelMedium from '../../assets/icons/cancelMedium.svg';
import check from  '../../assets/icons/check.svg';
import { SiVisa } from "react-icons/si";
import MasterCardLogo from "../common/MasterCardLogo.tsx";
interface ModalProps {
    modalId: string;
}

const PaymentModal: React.FC<ModalProps> = ({ modalId }) => {
    const { modals, closeModal } = useModalStore(); // Access the modals state
    const isOpen = modals[modalId];
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [password, setPassword] = useState("");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [values, setValues] = useState<string[]>(["", "", "", ""]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value;
        const updatedValues = [...values];

        // Allow only up to 4 digits and set the value
        if (newValue.length <= 4 && /^[0-9]*$/.test(newValue)) {
            updatedValues[index] = newValue;
            setValues(updatedValues);

            // Move to the next input if 4 digits are entered
            if (newValue.length === 4 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            const updatedValues = [...values];

            // Clear the current input and move focus to the previous input if empty
            if (!values[index] && inputRefs.current[index - 1]) {
                updatedValues[index - 1] = "";
                inputRefs.current[index - 1]?.focus();
            } else {
                updatedValues[index] = "";
            }

            setValues(updatedValues);
        }
    };

    const handleFocus = (index: number) => {
        // Prevent focusing on inputs out of sequence
        if (index > 0 && values[index - 1] === "") {
            inputRefs.current[index - 1]?.focus();
        }
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

                <form className="space-y-4 mx-auto">
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

                    <div>
                        <p></p>
                        <div
                            className="flex justify-evenly items-center w-[412px] h-[37px] gap-x-5 bg-[#E6E6E6] px-3 py-3 rounded-[10px] mx-auto">
                            {/* MasterCard logo */}
                            <MasterCardLogo/>
                            <div className="flex justify-evenly items-center py-0 w-[300px] mx-auto">
                                {values.map((value, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            ref={(el) => (inputRefs.current[index] = el)} // Attach refs
                                            className="my-0 h-full w-[55px] text-[13px] bg-transparent text-left border-none outline-none focus:ring-0 focus:border-none active:border-none"
                                            value={value}
                                            placeholder="2412"
                                            maxLength={4}
                                            onChange={(e) => handleInputChange(e, index)} // Handle input change
                                            onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace clearing
                                            onFocus={() => handleFocus(index)} // Prevent skipping inputs
                                            readOnly={index > 0 && values[index - 1] === ""} // Prevent editing out-of-sequence inputs
                                        />
                                        {index < values.length - 1 && (
                                            <hr className="w-[12.5px] border-[#8E8E8E] border-[1px]"/>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* Digit complete icon */}
                            <div className="bg-[#6438C2] flex justify-center items-center w-[15px] h-[15px] rounded-full">
                                <img src={check} alt="digit complete"/>
                            </div>
                        </div>
                    </div>


                    <div>
                        <label className="block text-gray-700 font-medium mb-1">CVV Number</label>
                        <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="Enter the 3 or 4-digit number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(e.target.value)}
                                placeholder="MM"
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                            <span className="flex items-center justify-center">/</span>
                            <input
                                type="text"
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(e.target.value)}
                                placeholder="YY"
                                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your dynamic password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-2 focus:ring-purple-700 focus:outline-none"
                    >
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
