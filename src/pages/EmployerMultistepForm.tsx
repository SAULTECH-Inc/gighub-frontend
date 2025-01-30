import React, {useState} from "react";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import employerSignupStep1 from "../assets/icons/applicantSignupStep1.svg";
import {useFormStore} from "../redux/useFormStore.ts";
import ApplicantSignupStepOne from "../components/ui/ApplicantSignupStepOne.tsx";

const EmployerMultistepForm: React.FC = ()=>{
    const { formData, setFormData, resetFormData } = useFormStore();
    const [step, setStep] = useState(1);

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = () => {
        console.log('Form Data Submitted:', formData);
        alert('Form submitted successfully!');
        resetFormData();
        setStep(1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleOTP = (name: string, value: string)=>{
        setFormData({
           ...formData,
            [name]: value,
        });
        console.log('OTP added:', value);
    }

    return (
        <div className="relative flex justify-center items-center py-2 gap-x-[10px]">
            <img className="absolute top-5 left-[3%]" src={gighubLogo} alt="logo"/>
            {/* Step Indicator */}
            <div className="absolute top-5 right-[50%] flex flex-col items-baseline gap-y-2">
                <span className="block">{step} of 6</span>
                <div className="flex justify-evenly gap-x-2">
                    {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`w-[41px] h-[9px] rounded-[16px] ${
                                stepNumber <= step ? "bg-[#6438C2]" : "bg-[#F9F9F9]"
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
            {/* Left Section */}
            <div className="w-1/2 flex justify-center pt-[100px]">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <ApplicantSignupStepOne handleChange={handleChange} formData={formData} handleNext={handleNext}/>
                )}
            </div>
            {/* Right Section */}
            <img className="h-auto max-h-screen" src={employerSignupStep1} alt="user type selection right side"/>
        </div>
    );
}

export default EmployerMultistepForm;