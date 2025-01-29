import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Google, Linkedin, Microsoft } from "../../assets/icons";
import { useSignupStore } from "../../hooks/useSignupStore";
import { motion } from "motion/react";

const ApplicantSignupStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignupStore();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: data.firstName,
      surname: data.surname,
      middleName: data.middleName,
      email: data.email,
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

  //   const onSubmit = (data: any) => {
  //     updateFormData(data);
  //     setStep(2); // Navigate to next Step
  //   };

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="mt-16 px-5 md:mt-[120px] flex flex-col items-center"
      >
        <h1 className="text-2xl font-lato font-black">Welcome!</h1>
        <p className="font-lato text-[#d9d9d9] text-[13px] text-center w-[332px] md:w-[366px] mt-4">
          Welcome! Let’s start building your career profile. We’ll ask a few quick questions to
          tailor opportunities just for you.
        </p>
        {/* Step 1 form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[372px] md:w-[431px] mt-10 flex flex-col space-y-[14px]"
        >
          <label className="text-[13px] font-lato">First Name</label>

          <input
            {...register("firstName")}
            type="text"
            required
            className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
          />

          <div className="flex gap-5 gap-y-[14px]">
            <div className="">
              <label className="text-[13px] font-lato mb-[14px]">Surame</label>
              <input
                {...register("surname")}
                type="text"
                required
                className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
              />
            </div>

            <div className="">
              <label className="text-[13px] font-lato mb-[14px]">Middle</label>

              <input
                {...register("middleName")}
                type="text"
                className="rounded-2xl border-[#d9d9d9] w-full h-[45px]"
              />
            </div>
          </div>

          <label className="text-[13px] font-lato">Email Address</label>
          <input
            {...register("email")}
            required
            type="email"
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
          <Link to="" className="text-tertiary font-lato text-[13px]">
            Sign-in
          </Link>
        </div>

        <div className="flex items-center justify-center gap-5 mt-8">
          <div className="border border-[#d9d9d9] p-3 rounded-2xl flex items-center gap-3">
            <img src={Google} alt="google" className="w-5 h-5" />
            <p className="font-medium font-lato text-[13px]">Google</p>
          </div>

          <div className="border border-[#d9d9d9] p-3 rounded-2xl flex items-center gap-3">
            <img src={Microsoft} alt="google" className="w-5 h-5" />
            <p className="font-medium font-lato text-[13px]">Microsoft</p>
          </div>

          <div className="border border-[#d9d9d9] p-3 rounded-2xl flex items-center gap-3">
            <img src={Linkedin} alt="google" className="w-5 h-5" />
            <p className="font-medium font-lato text-[13px]">Linkein</p>
          </div>
        </div>
        <p className="text-center w-[384px] font-lato mt-[152px] md:mt-14 text-[#d9d9d9]">
          Signing Up for GigHub means you agree to the{" "}
          <span className="text-tertiary">Privacy Policy</span> and
          <span className="text-tertiary"> Terms</span> of
          <span className="text-tertiary"> Services</span>
        </p>
      </motion.div>
    </>
  );
};

export default ApplicantSignupStep;
