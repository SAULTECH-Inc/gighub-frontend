import React, { useState } from "react";
import { motion } from "framer-motion";
import { calculatePasswordStrength } from "../../../../utils/helpers.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {Link} from "react-router-dom";
import {useAuth} from "../../../../store/useAuth.ts";
import {EmployerSignupRequest} from "../../../../utils/types";

// Define the Zod schema
const schema = z.object({
    companyName: z.string().min(1, "Company Name is required"),
    email: z.string().email("Invalid email address"),
    companyPhone: z.string().min(1, "Phone is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    ,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Attach error to the confirmPassword field
});

// Infer the type of the form data from the schema
type FormData = z.infer<typeof schema>;

interface StepOneProp {
    handleNext: () => void;
}

const EmployerSignupStepOne: React.FC<StepOneProp> = ({ handleNext }) => {
    const {employerSignupRequest, setEmployerSignupRequest, verifyAccount} = useAuth();
    const [accountExist, setAccountExist] = useState<boolean>(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyName: employerSignupRequest?.companyName,
            email: employerSignupRequest?.email,
            companyPhone: employerSignupRequest?.companyPhone,
            password: employerSignupRequest?.password,
            confirmPassword: employerSignupRequest?.confirmPassword,
        },
    });

   const password = watch("password");


    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const strength = calculatePasswordStrength(e.target.value);
        setPasswordStrength(strength);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSubmit = async (data: FormData) => {
        const exist = await verifyAccount(data.email);
        if (exist) {
            setAccountExist(exist);
            return;
        }
        setEmployerSignupRequest({
            ...employerSignupRequest,
            companyName: data.companyName,
            email: data.email,
            companyPhone: data.companyPhone,
            password: data.password,
            confirmPassword: data.confirmPassword,
        } as EmployerSignupRequest);

        // Proceed to the next step
        handleNext();
    };

    return (
        <motion.div
            className="relative w-full md:w-[500px] lg:w-[500px] px-[10px] md:px-0"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >

            {/* Form Fields */}
            <motion.div
                className="mx-auto flex flex-col text-center mb-[30px]"
                initial={{y: -50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <h2 className="text-[24px] font-semibold mb-4">Company Profile Setup</h2>
            </motion.div>

            {/* Name Field */}
            <motion.div
                className="w-full flex gap-2"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex flex-col flex-1 mb-4">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Company Name</label>
                    <input
                        type="text"
                        {...register("companyName")}
                        className={`w-full py-2 px-5 rounded-[16px] h-[45px] border-[1px] focus:ring-0 focus:outline-none focus:border-[1px] ${
                            errors.companyName ? "border-red-500" : "border-[#E6E6E6]"
                        }`}
                    />
                </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
                className="w-full flex gap-2"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex flex-col flex-1 mb-4">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        {...register("email")}
                        className={`w-full py-2 px-5 rounded-[16px] h-[45px] border-[1px] focus:ring-0 focus:outline-none focus:border-[1px] ${
                            errors.email ? "border-red-500" : "border-[#E6E6E6]"
                        }`}
                    />
                    {
                        accountExist && (<span
                            className={`text-xs text-red-500 ${
                                errors.email && "block"
                            }`}
                        >Account with this email exists Already</span>)
                    }

                </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
                className="w-full flex gap-2"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex flex-col flex-1 mb-4">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        {...register("companyPhone")}
                        className={`w-full py-2 px-5 rounded-[16px] h-[45px] border-[1px] focus:ring-0 focus:outline-none focus:border-[1px] ${
                            errors.companyPhone ? "border-red-500" : "border-[#E6E6E6]"
                        }`}
                    />
                </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
                className="w-full flex flex-col mb-4"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <label className="block text-[#000000] text-[13px] font-medium mb-2">Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        {...register("password")}
                        onChange={handlePasswordChange}
                        className={`w-full py-2 px-5 rounded-[16px] h-[45px] border-[1px] focus:ring-0 focus:outline-none focus:border-[1px] ${
                            errors.password ? "border-red-500" : "border-[#E6E6E6]"
                        }`}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-[12px] right-[10px] text-[#6E4AED] focus:outline-none"
                    >
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
                className="w-full flex flex-col mb-4"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <label className="block text-[#000000] text-[13px] font-medium mb-2">Confirm Password</label>
                <div className="relative">
                    <input

                        type={passwordVisible ? "text" : "password"}
                        {...register("confirmPassword")}
                        className={`w-full py-2 px-5 rounded-[16px] h-[45px] border-[1px] focus:ring-0 focus:outline-none focus:border-[1px] ${
                            errors.confirmPassword ? "border-red-500" : "border-[#E6E6E6]"
                        }`}
                        disabled={!password}
                        name="confirmPassword"
                    />
                </div>
            </motion.div>

            {/* Password Strength Indicator */}
            <motion.div
                className="mt-[2px] mb-[30px]"
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex justify-evenly gap-x-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div
                            key={index}
                            className={`w-[71px] h-[12px] rounded-[16px] ${
                                index <= passwordStrength ? "bg-[#51FF00]" : "bg-[#E6E6E6]"
                            }`}
                        ></div>
                    ))}
                </div>
                <p className="text-[12px] text-end mt-2">
                    {passwordStrength < 3 ? "Weak" : passwordStrength < 5 ? "Medium" : "Strong"}
                </p>
            </motion.div>

            {/* Proceed Button */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >
                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="w-full py-3 text-white font-[13px] rounded-[16px] bg-[#6E4AED] hover:bg-[#5931A9] focus:outline-none focus:ring-0 focus:border-none"
                >
                    Proceed
                </button>
            </motion.div>

            {/* Sign-in Link */}
            <motion.div
                className="mt-[20px] text-[13px] text-center text-[#737373]"
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                Already have an account? <Link className="font-bold text-[#6E4AEDEE]" to="/login">Sign-in</Link>
            </motion.div>
        </motion.div>
    );
};

export default EmployerSignupStepOne;