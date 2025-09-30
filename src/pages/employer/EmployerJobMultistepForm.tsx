import React from "react";
import CreateJobStepOne from "../../components/ui/employer/createjob/CreateJobStepOne";
import CreateJobStepTwo from "../../components/ui/employer/createjob/CreateJobStepTwo";
import CreateJobStepThree from "../../components/ui/employer/createjob/CreateJobStepThree";
import CreateJobStepFour from "../../components/ui/employer/createjob/CreateJobStepFour";
import CreateJobStepFive from "../../components/ui/employer/createjob/CreateJobStepFive";
import { useJobFormStore } from "../../store/useJobFormStore";
import { Gighub } from "../../assets/icons";
import useModalStore from "../../store/modalStateStores";
import { RiCloseLine, RiBriefcase4Line, RiRobotLine } from "react-icons/ri";

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

  const progressPercentage = (step / 5) * 100;

  const stepTitles = {
    1: "Job Content",
    2: "Job Details",
    3: "Skills & Preferences",
    4: "Final Preferences",
    5: "AI & Screening"
  };

  const stepIcons = {
    1: RiBriefcase4Line,
    2: RiBriefcase4Line,
    3: RiBriefcase4Line,
    4: RiBriefcase4Line,
    5: RiRobotLine
  };

  const CurrentIcon = stepIcons[step as keyof typeof stepIcons] || RiBriefcase4Line;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-2">
      <div className="flex max-h-[95vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <CurrentIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Create New Job</h1>
                <div className="flex items-center gap-2">
                  <p className="text-purple-100 text-sm">Step {step} of 5</p>
                  <span className="text-purple-200 text-xs">•</span>
                  <p className="text-purple-100 text-sm">{stepTitles[step as keyof typeof stepTitles]}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <RiCloseLine className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Progress Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={Gighub} alt="gighub logo" className="h-6 w-6" />
              <span className="font-bold text-orange-300">GigHub</span>
            </div>

            {/* Modern Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="relative h-2 w-48 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white/90 min-w-[3rem]">
                {step}/5
              </span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  stepNumber <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {step === 1 && <CreateJobStepOne />}
          {step === 2 && <CreateJobStepTwo />}
          {step === 3 && <CreateJobStepThree />}
          {step === 4 && <CreateJobStepFour />}
          {step === 5 && <CreateJobStepFive />}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobMultistepForm;
