import paystack from "../../../../assets/images/paystack.png";
import { useJobSearchSettings } from "../../../../store/useJobSearchSettings.ts";
import numeral from "numeral";
import DOMPurify from "dompurify";
import moment from "moment";
import ApplicationModal from "../../ApplicationModal.tsx";
import { ApplicationMethod } from "../../../../utils/types";
import useModalStore from "../../../../store/modalStateStores.ts";
import ReferModal from "../../ReferModal.tsx";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../utils/toastConfig.tsx";
import { useJobActions } from "../../../../store/useJobActions.ts";
const JobDescription = () => {
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const { jobCurrentlyViewed, jobToApply, setJobToApply } =
    useJobSearchSettings();
  const salaryExist =
    jobCurrentlyViewed?.salaryRange?.minimumAmount != null &&
    jobCurrentlyViewed?.salaryRange?.maximumAmount != null &&
    jobCurrentlyViewed.salaryRange.maximumAmount > 0;
  const { referSomeoneToAJob } = useJobActions();

  const handleApply = async () => {
    setJobToApply(jobCurrentlyViewed);
    openModal("application-modal");
  };

  const handleRefer = async (applicantEmails: string[]) => {
    if (applicantEmails.length && applicantEmails.length < 1) return;
    referSomeoneToAJob(jobCurrentlyViewed?.id as number, applicantEmails)
      .then((response) => {
        if (response?.statusCode === 201) {
          showSuccessToast(response?.message || "");
          closeModal("refer-modal");
        }
      })
      .catch((error) => {
        showErrorToast(error?.response?.data?.message);
        closeModal("refer-modal");
      });
  };
  return (
    <div className="border-top relative mx-auto flex w-full flex-col border-[#E6E6E6] bg-white p-2 sm:p-4 md:rounded-l-[16px] md:border-r md:border-r-[#E6E6E6]">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F7F8FA] sm:h-20 sm:w-20">
          <img
            src={jobCurrentlyViewed?.employer?.companyLogo || paystack}
            alt="jumia"
            className="h-10 w-10 object-cover sm:h-16 sm:w-16"
          />
        </div>
        <div className="hidden flex-col sm:flex">
          <h2 className="font-lato text-[20px] font-medium text-black">
            {jobCurrentlyViewed?.title}
          </h2>
          <div className="flex gap-10">
            <span className="text-sm font-bold text-gray">
              {jobCurrentlyViewed?.company}
            </span>
            <span className="text-sm font-bold text-gray">
              {jobCurrentlyViewed?.applicantsCount &&
              jobCurrentlyViewed?.applicantsCount > 1
                ? jobCurrentlyViewed?.applicantsCount +
                  " people have applied to this job"
                : "no applicants yet"}{" "}
            </span>
          </div>
          <p className="mt-3 text-sm font-bold text-gray">
            3 people from your network work in this company, or once worked
            here,{" "}
            <span className="text-[#6438C2]">
              <a href="">see connections</a>
            </span>
          </p>
        </div>
        <div className="block flex-col sm:hidden">
          <h2 className="font-lato text-[18px] font-medium text-black sm:text-[20px]">
            {jobCurrentlyViewed?.title}
          </h2>
          <span className="text-sm font-bold text-gray">
            {jobCurrentlyViewed?.company}
          </span>
        </div>
      </div>
      <p className="mt-3 block text-sm font-bold text-gray sm:hidden">
        3 people from your network work in this company, or once worked here,{" "}
        <span className="text-[#6438C2]">
          <a href="">see connections</a>
        </span>
      </p>
      <hr className="mt-16 h-[1px] w-full text-[#E6E6E6]" />
      <div
        className={`flex items-center ${salaryExist ? "justify-between" : "justify-evenly"} mt-4 gap-4`}
      >
        <div className="flex h-[74px] w-[94px] flex-col items-center justify-center rounded-[10px] bg-[#6438C230] sm:h-[84px] sm:w-[176px]">
          <span className="text-[16px] font-normal text-black">Job Type</span>
          <span className="text-sm font-normal text-black">
            {jobCurrentlyViewed?.jobType}
          </span>
        </div>
        <div className="flex h-[74px] w-[94px] flex-col items-center justify-center rounded-[10px] bg-[#6438C230] sm:h-[84px] sm:w-[176px]">
          <span className="text-[16px] font-normal text-black">Experience</span>
          <span className="text-sm font-normal text-black">
            Min. {jobCurrentlyViewed?.experienceYears} years
          </span>
        </div>
        {salaryExist && (
          <div className="flex h-[74px] w-[150px] flex-col items-center justify-center rounded-[10px] bg-[#6438C230] sm:h-[84px] sm:w-[196px]">
            <span className="text-[16px] font-normal text-black">Salary</span>
            <span className="text-sm font-normal text-black">
              {jobCurrentlyViewed?.salaryRange?.currency}
              {numeral(jobCurrentlyViewed?.salaryRange?.minimumAmount).format(
                "0.[00]a",
              )}
              {" - "}
              {jobCurrentlyViewed.salaryRange.currency}
              {numeral(jobCurrentlyViewed?.salaryRange?.maximumAmount).format(
                "0.[00]a",
              )}
              {"/"}
              {jobCurrentlyViewed?.salaryRange?.frequency?.split(" ")[1] ||
                jobCurrentlyViewed?.salaryRange?.frequency}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex w-full flex-col items-start p-4">
        <h1 className="font-bold text-black">About</h1>
        <div
          className="text-gray-700 prose max-w-none whitespace-pre-wrap text-base leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(jobCurrentlyViewed?.description || ""),
          }}
        ></div>
      </div>
      <div className="w-full p-4">
        <h1 className="font-bold text-black">Responsibilities</h1>
        <div
          className="text-gray-700 prose max-w-none whitespace-pre-wrap text-base leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              jobCurrentlyViewed?.responsibility || "",
            ),
          }}
        ></div>
      </div>

      {jobCurrentlyViewed?.requirements && (
        <div className="w-full p-4">
          <h1 className="font-bold text-black">Requirements</h1>
          <div
            className="text-gray-700 prose max-w-none whitespace-pre-wrap text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                jobCurrentlyViewed?.requirements || "",
              ),
            }}
          ></div>
        </div>
      )}
      <hr className="mt-16 h-[1px] w-full text-[#E6E6E6]" />
      <div className="mt-5 items-center justify-between sm:flex">
        <span className="hidden text-sm text-gray sm:block">
          Posted {moment(jobCurrentlyViewed?.createdAt as Date).fromNow()}
        </span>
        <div className="flex items-center justify-between sm:space-x-4">
          <button
            onClick={() => {
              openModal("refer-modal");
            }}
            className="rounded-[10px] border-[1px] border-[#E6E6E6] px-4 py-2 text-black"
          >
            Refer
          </button>
          <button
            onClick={handleApply}
            disabled={jobToApply?.applied || false}
            className="rounded-[10px] border-[1px] border-[#6438C2] bg-[#6438C2] px-4 py-2 text-white"
          >
            {!jobToApply?.applied ? "Quick Apply" : "Applied"}
          </button>
        </div>
      </div>
      {isModalOpen("application-modal") && (
        <ApplicationModal
          applicationMethod={
            jobCurrentlyViewed?.applicationMethod as ApplicationMethod
          }
          modalId={"application-modal"}
        />
      )}

      {isModalOpen("refer-modal") && (
        <ReferModal handleRefer={handleRefer} modalId="refer-modal" />
      )}
    </div>
  );
};

export default JobDescription;
