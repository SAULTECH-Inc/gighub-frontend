import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignupStore } from "../../hooks/useSignupStore";
import { Upload } from "../../assets/icons";
import { motion } from "motion/react";

interface EmployerData {
  employer: boolean;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  companyWebsite: string;
  companyLogo: File | null;
  companyCoverPage: File | null;
  companyDescription: string;
}

const CompanyDetailsStep = () => {
  const { data, prevStep, updateData } = useSignupStore();
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [uploadedCoverPage, setUploadedCoverPage] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileKey: "companyLogo" | "companyCoverPage",
    setFileState: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileState(file); // Update local state
      updateData(fileKey, file); // Update Zustand state
    }
  };

  const { register, handleSubmit } = useForm({
    defaultValues: {
      companyWebsite: data.companyWebsite,
    },
  });

  const onSubmit = (values: any) => {
    const formData = { ...data, ...values };
    const filteredData: EmployerData = {
      employer: formData.employer,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      companyWebsite: formData.companyWebsite,
      companyLogo: formData.companyLogo,
      companyCoverPage: formData.companyCoverPage,
      companyDescription: formData.companyDescription,
    };
    console.log(filteredData);
    // nextStep(); // Proceed to the next step
  };

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="flex flex-col items-center mt-20 md:mt-[70px]"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="font-lato text-[13px]">Company website</label>
          <br />
          <input
            {...register("companyWebsite")}
            onChange={(e) => updateData("companyWebsite", e.target.value)}
            placeholder="Your Company Website Link"
            className="w-full md:w-[431px] h-[45px] rounded-2xl border-[#d9d9d9]"
          />

          <div className="flex items-center justify-between max-md:gap-4 mt-5 border border-dashed border-[#afafaf] p-5 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="bg-[#eee] rounded-2xl p-5">
                <img src={Upload} alt="upload" className="" />
              </div>
              <span className="text-[#8e8e8e] max-md:text-xs">{`${
                uploadedLogo ? uploadedLogo.name : "Upload company logo"
              }`}</span>
            </div>
            <label
              htmlFor="company-logo"
              className="bg-tertiary cursor-pointer text-sm text-white rounded-[10px] px-3 md:px-5 py-1"
            >
              Browse
            </label>

            <input
              type="file"
              id="company-logo"
              //   placeholder="Upload company logo"
              className="hidden"
              onChange={(e) => handleFileChange(e, "companyLogo", setUploadedLogo)}
            />
          </div>

          <div className="flex items-center justify-between mt-5 border border-dashed border-[#afafaf] p-5 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="bg-[#eee] rounded-2xl p-5">
                <img src={Upload} alt="upload" className="" />
              </div>
              <span className="text-[#8e8e8e] max-md:text-xs">
                {uploadedCoverPage ? uploadedCoverPage.name : "Upload company cover page"}
              </span>
            </div>
            <label
              htmlFor="company-cover-page"
              className="bg-tertiary cursor-pointer text-sm text-white rounded-[10px] px-3 md:px-5 py-1"
            >
              Browse
            </label>

            <input
              type="file"
              id="company-cover-page"
              //   placeholder="Upload company logo"
              className="hidden"
              onChange={(e) => handleFileChange(e, "companyCoverPage", setUploadedCoverPage)}
            />
          </div>

          <div className="flex justify-center gap-10 mt-[30px] md:mt-10">
            <button className="font-lato text-[13px]" onClick={prevStep}>
              Back
            </button>
            <button
              type="submit"
              className="py-[14px] px-14 bg-tertiary text-white md:text-[13px] font-lato rounded-2xl"
            >
              Proceed
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default CompanyDetailsStep;
