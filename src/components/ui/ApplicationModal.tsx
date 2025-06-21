import React, { useState } from "react";
import video from "../../assets/icons/video.svg";
import work from "../../assets/icons/work.svg";
import documentValidation from "../../assets/icons/documentValidation.svg";
import applyAvatar from "../../assets/images/applyAvatar.png";
import ApplicationSuccessModal from "./ApplicationSuccessModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationMethod } from "../../utils/types";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { showErrorToast } from "../../utils/toastConfig.tsx";
import { useJobActions } from "../../store/useJobActions.ts";
import { Link } from "react-router-dom";

interface ApplicationModalProps {
  modalId: string;
  applicationMethod: ApplicationMethod;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  modalId,
  applicationMethod,
}) => {
  const { modals, closeModal, openModal } = useModalStore();
  const isOpen = modals[modalId];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { jobToApply } = useJobSearchSettings();
  const { applyToJob } = useJobActions();

  const handleSelection = (option: string) => {
    setSelectedOptions((prevState) =>
      prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option],
    );
  };

  const handleApplyNow = async () => {
    await applyToJob(
      jobToApply?.id as number,
      jobToApply?.applicationMethod as ApplicationMethod,
    )
      .then((response) => {
        if (response.statusCode === 201) {
          closeModal(modalId);
          openModal("application-success");
        }
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
        showErrorToast(err?.response?.data?.message);

        closeModal(modalId);
      });
  };

  const handleCloseApplicationModal = () => {
    closeModal(modalId);
  };

  const iconMapping: Record<string, string> = {
    "Applied with Profile": applyAvatar,
    "Apply with Video": video,
    "Apply with CV": documentValidation,
    "Apply with work sample": work,
  };

  const methodMap: Record<string, keyof ApplicationMethod> = {
    "Applied with Profile": "byProfile",
    "Apply with CV": "byCv",
    "Apply with Video": "byVideo",
    "Apply with work sample": "byPortfolio",
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
        onClick={handleCloseApplicationModal}
      >
        <div
          className="flex h-[664px] w-[455px] flex-col justify-evenly rounded-[14px] bg-white py-[4px] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-0 flex flex-col justify-between px-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold">
                Select Method of Application
              </h2>
              <button
                type="button"
                onClick={handleCloseApplicationModal}
                className="text-gray-500 cursor-pointer text-xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-5 w-[214px] text-justify text-[13px]">
              We will automatically help you figure out the raised
            </p>
          </div>

          <hr className="my-0 w-full border-[#CCCCCC]" />

          {/* Recruiter Requirement buttons */}
          <p className="px-6 text-[13px]">Recruiter Requirements</p>
          <div className="mb-3 flex space-x-2 px-6">
            {[
              { label: "CV", key: "byCv" },
              { label: "Portfolio", key: "byPortfolio" },
              { label: "Profile", key: "byProfile" },
              { label: "Video", key: "byVideo" },
              { label: "Cover Letter", key: "byCoverLetter" },
            ]
              .filter(
                ({ key }) => applicationMethod[key as keyof ApplicationMethod],
              )
              .map(({ label, key }) => {
                const isSelected = selectedOptions.includes(label);
                return (
                  <button
                    type="button"
                    key={key}
                    className={`h-[30px] rounded-[8px] border px-4 py-1 text-[13px] ${
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-purple-200 bg-purple-100 text-purple-600"
                    } cursor-pointer`}
                    onClick={() => handleSelection(label)}
                  >
                    {label}
                  </button>
                );
              })}
          </div>

          <p className="mb-3 px-6 text-[13px] text-[#8E8E8E]">
            Please select your method of application and we will automatically
            send your application to the recruiter.
          </p>

          <div className="mx-auto grid grid-cols-2 gap-x-10 gap-y-3">
            {Object.entries(methodMap).map(([label, key]) => {
              const isEnabled = applicationMethod[key];
              const isSelected = selectedOptions.includes(label);

              return (
                <div
                  key={label}
                  className={`relative flex h-[123px] w-[170px] flex-col items-center justify-center rounded-[12px] border-[2px] p-3 ${isEnabled ? "cursor-pointer hover:outline-[2px] hover:outline-[#6438C2]" : "cursor-not-allowed opacity-50"} ${isSelected ? "border-[#6438C2]" : "border-[#E6E6E6]"} transition-all duration-300 ease-in-out`}
                  onClick={() => isEnabled && handleSelection(label)}
                >
                  <div className="mb-2 flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border-[1px] border-[#E6E6E6]">
                    <img
                      src={iconMapping[label]}
                      alt={`${label} icon`}
                      className="h-[20px] w-[20px]"
                    />
                  </div>
                  <span className="text-center text-[13px] font-medium">
                    {label}
                  </span>

                  <div
                    className={`absolute right-1 top-1 flex h-[24px] w-[24px] items-center justify-center rounded-full ${
                      isSelected
                        ? "border-none bg-[#6438C2]"
                        : "border-[1px] border-[#E6E6E6] bg-white"
                    } ${isEnabled ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[16px] w-[16px]"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end space-x-6 px-6 text-right">
            <Link
              to={`/employers/${jobToApply?.employer?.id}/${jobToApply?.employer?.companyName}/profile`}
              type="button"
              className="text-gray-700 h-[34px] w-[169px] rounded-[8px] border-[1px] border-[#ccc] px-5 py-1 text-[13px]"
            >
              Go to recruiter profile
            </Link>

            <button
              type="button"
              onClick={handleApplyNow}
              className="h-[34px] w-[106px] rounded-[8px] bg-[#6438C2] px-5 py-1 text-[13px] text-white"
            >
              Apply now
            </button>
          </div>
        </div>
      </div>

      <ApplicationSuccessModal modalId="application-success" />
    </>
  );
};

export default ApplicationModal;
