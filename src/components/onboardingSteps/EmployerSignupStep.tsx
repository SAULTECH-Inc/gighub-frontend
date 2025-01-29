import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignupStore } from "../../hooks/useSignupStore";
import { motion } from "motion/react";

const EmployerSignupStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignupStore();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    },
  });

  const onSubmit = (values: any) => {
    Object.entries(values).forEach(([key, value]) => updateData(key as any, value));
    nextStep();
  };

  //   watch password field for changes
  const password = watch("password", "");

  //   Password strength calculation
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&#]/.test(password)) strength += 1;

    return strength;
  };

  const strength = calculateStrength(password);

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="mt-16 px-5 md:mt-[120px] flex flex-col items-center"
      >
        <h1 className="text-2xl font-lato font-black">Company Profile Setup</h1>
        {/* Step 1 form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[372px] md:w-[431px] mt-10 flex flex-col space-y-[14px]"
        >
          <label className="text-[13px] font-lato">Company Name</label>

          <input
            {...register("companyName")}
            required
            type="text"
            className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
          />

          <label className="text-[13px] font-lato">Email</label>
          <input
            {...register("email")}
            required
            type="email"
            className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
          />

          <label className="text-[13px] font-lato">Phone</label>
          <input
            {...register("phone")}
            required
            type="text"
            className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
          />

          <label className="text-[13px] font-lato">Password</label>
          <input
            {...register("password")}
            required
            type="password"
            className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
          />
          <br />
          {/* Block Progress Bar */}
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`h-3 w-full rounded-[10px] ${
                  index < strength ? "bg-[#51ff00]" : "bg-[#d9d9d9]"
                }`}
              ></div>
            ))}
          </div>
          <br />
          <div className="flex justify-center gap-10">
            <button className="font-lato text-[13px]" onClick={prevStep}>
              Back
            </button>
            <button
              type="submit"
              className="py-[14px] px-14 bg-tertiary text-white text-[13px] font-lato rounded-2xl"
            >
              Proceed
            </button>
          </div>
        </form>
        {/* Step 1 form end */}

        <div className="flex items-center justify-center gap-4 mt-6">
          <p className="font-lato text-[13px]">Already have an account?</p>
          <Link to="/login" className="text-tertiary font-lato text-[13px]">
            Log in
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default EmployerSignupStep;
