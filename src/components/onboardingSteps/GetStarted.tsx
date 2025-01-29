import { Avatar1, Gighub } from "../../assets/icons";
import { useSignupStore } from "../../hooks/useSignupStore";

const GetStarted = () => {
  const { data, updateData, nextStep } = useSignupStore();

  // Handle selection of Employer or Job Seeker
  const handleSelection = (role: "employer" | "jobSeeker") => {
    if (role === "employer") {
      updateData("employer", true);
      updateData("jobSeeker", false);
    } else {
      updateData("jobSeeker", true);
      updateData("employer", false);
    }
  };

  // Check if data is valid before proceeding to the next step
  const handleProceed = () => {
    if (data.employer || data.jobSeeker) {
      nextStep(); // Move to next step
    } else {
      console.log("Please select either Employer or Job Seeker.");
    }
  };

  return (
    <>
      <div className="mt-[100px] md:mt-[180px] flex flex-col items-center justify-center mx-auto">
        <div className="flex items-center gap-[10px]">
          <img src={Gighub} alt="gighub" className="w-[35px] h-[35px] md:w-10 md:h-10" />
          <h1 className="text-orange font-black font-lato md:text-[20px]">GigHub</h1>
        </div>
        <h1 className="mt-10 font-lato font-black text-2xl max-md:w-[271px] max-md:text-center">
          How are You Planning to use Gighub
        </h1>
        <p className="font-lato font-black text-[#adb3c2] text-[13px] max-md:mt-5">
          We will streamline your setup experience accordingly
        </p>
        <div className="flex items-center gap-10 md:gap-14 mt-20">
          <div
            className="p-6 border border-[#e6e6e6] rounded-2xl hover:bg-black hover:bg-opacity-5 cursor-pointer"
            onClick={() => handleSelection("jobSeeker")}
          >
            <img src={Avatar1} alt="avatar" className="w-[50px] h-[50px] rounded-full" />
            <h1 className="font-lato font-black text-[13px] mt-10">As a Job Seeker</h1>
          </div>

          <div
            className="p-6 border border-[#e6e6e6] rounded-2xl hover:bg-black hover:bg-opacity-5 cursor-pointer"
            onClick={() => handleSelection("employer")}
          >
            <img src={Avatar1} alt="avatar" className="w-[50px] h-[50px] rounded-full" />
            <h1 className="font-lato font-black text-[13px] mt-10">As an employer</h1>
          </div>
        </div>

        <div className="flex gap-6 mt-14 md:mt-[121px]">
          {/* <button className="font-lato font-black">Back</button> */}
          <button
            className="bg-tertiary text-white py-[13px] px-[36px] rounded-[10px] font-lato font-black"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </div>
      </div>
    </>
  );
};

export default GetStarted;
