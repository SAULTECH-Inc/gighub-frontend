import React, { useState } from "react";
import CreateJobStepOne from "../../components/ui/employer/createjob/CreateJobStepOne";
import CreateJobStepTwo from "../../components/ui/employer/createjob/CreateJobStepTwo";
import CreateJobStepThree from "../../components/ui/employer/createjob/CreateJobStepThree";
import CreateJobStepFour from "../../components/ui/employer/createjob/CreateJobStepFour";

const EmployerJobMultistepForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F7F7F7]  items-center mt-40 gap-10">
      <h1>EmployerJobMultistepForm</h1>{" "}
      <div className="w-full rounded-[10px] flex flex-col items-center justify-center">
        {step === 1 && <CreateJobStepOne handleNext={handleNext} />}
        {step === 2 && (
          <CreateJobStepTwo handleNext={handleNext} handlePrev={handlePrev} />
        )}
        {step === 3 && (
          <CreateJobStepThree handleNext={handleNext} handlePrev={handlePrev} />
        )}
        {step === 4 && <CreateJobStepFour handlePrev={handlePrev} handleNext={handleNext} />}
      </div>
    </div>
  );
};

export default EmployerJobMultistepForm;
