import React from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";


const CreateJobStepThree: React.FC = () => {
  const { nextStep, prevStep } = useJobFormStore();
  
      
  return (
    <div className="w-full flex flex-col items-center gap-6 py-6">
      <div className="w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center justify-center rounded-[10px]">
      </div>
      <div className="w-[96%] max-w-[900px] flex justify-end gap-6 mx-2">
        <button
          className="px-10 py-[13px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={nextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepThree;
