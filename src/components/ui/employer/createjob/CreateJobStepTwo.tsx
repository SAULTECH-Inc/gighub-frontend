import React from "react";
import { ArrowDown, Teams } from "../../../../assets/icons";
import { Referrer1 } from "../../../../assets/images";

interface StepTwoProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const CreateJobStepTwo: React.FC<StepTwoProp> = ({
  handleNext,
  handlePrev,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 py-6">
      <div className="w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center rounded-[10px] py-10">
        <div className="w-full sm:w-[95%] flex flex-col gap-6 px-10">
          <label className="text-[#000000]">Department</label>
          <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
            <input type="text" placeholder="Design" className="w-full outline-none" />
            <img src={ArrowDown} alt="ArrowDown" />
          </div>
          <label className="text-[#000000]">Hiring Manager</label>
          <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
            <img src={Referrer1} alt="" width={27} />
            <input type="text" placeholder="Shedrach Adam" className="w-full outline-none" />
            <img src={Teams} alt="ArrowDown" />
          </div>
          <label className="text-[#000000]">Application Period</label>
          <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
            <input type="text" placeholder="Select period" className="w-full outline-none" />
            <img src={ArrowDown} alt="ArrowDown" />
          </div>
          <label className="w-full text-[#000000]">Job Type</label>
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-[4%]">
                            <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                              <input type="text" className="w-full outline-none" />
                              <img src={ArrowDown} alt="ArrowDown" />
                            </div>
                            <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                              <input type="text" className="w-full outline-none" placeholder='$55000 - $4000' />
                              <img src={ArrowDown} alt="ArrowDown" />
                            </div>
                          </div>
        </div>
      </div>
      <div className="w-[96%] max-w-[900px] flex justify-end gap-6 mx-2">
        <button
          className="px-10 py-[13px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end"
          onClick={handlePrev}
        >
          Back
        </button>
        <button
          className="px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={handleNext}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;
