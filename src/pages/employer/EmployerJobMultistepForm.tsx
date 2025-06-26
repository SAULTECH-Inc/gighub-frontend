import React from "react";
import CreateJobStepOne from "../../components/ui/employer/createjob/CreateJobStepOne";
import CreateJobStepTwo from "../../components/ui/employer/createjob/CreateJobStepTwo";
import CreateJobStepThree from "../../components/ui/employer/createjob/CreateJobStepThree";
import CreateJobStepFour from "../../components/ui/employer/createjob/CreateJobStepFour";
import { useJobFormStore } from "../../store/useJobFormStore";
import { Gighub } from "../../assets/icons";
import cancel from "../../assets/icons/cancelMedium.svg";
import useModalStore from "../../store/modalStateStores";

interface EmployerJobMultistepFormProps {
  modalId: string;
}

const EmployerJobMultistepForm: React.FC<EmployerJobMultistepFormProps> = ({
  modalId,
}) => {
  const { step } = useJobFormStore();
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const handleClose = () => {
    closeModal(modalId);
  };
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black p-2">
      <div className="flex max-h-[95vh] w-full max-w-[900px] flex-col items-center overflow-y-auto rounded-lg bg-[#F7F7F7] shadow-xl">
        <div className="flex w-[92%] max-w-[900px] flex-col gap-4 py-2">
          <div className="flex justify-between">
            <h1 className="font-bold text-[#000000] sm:text-2xl">
              Add new job
            </h1>
            <img
              src={cancel}
              alt="cancel"
              onClick={handleClose}
              className="w-3 sm:w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={Gighub} alt="gighub logo" />
              <p className="fw-900 text-[#FA4E09]">GigHub</p>
            </div>
            <div className="flex flex-wrap gap-4 font-bold sm:items-center">
              <div className="relative flex h-[10px] w-[100px] self-center overflow-hidden rounded-[10px] sm:w-[247px]">
                <div
                  className="absolute top-0 left-0 h-full bg-[#6438C2]"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
                <div
                  className="absolute top-0 right-0 h-full bg-white"
                  style={{
                    width: `${(1 - step / 4) * 100}%`,
                    left: `${(step / 4) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="">{step} / 4</span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center rounded-[10px] px-4">
          {step === 1 && <CreateJobStepOne />}
          {step === 2 && <CreateJobStepTwo />}
          {step === 3 && <CreateJobStepThree />}
          {step === 4 && <CreateJobStepFour />}
        </div>
      </div>
    </div>
  );
};
export default EmployerJobMultistepForm;
