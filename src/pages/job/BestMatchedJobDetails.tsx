import React from "react";
import jobTypeIcon from "../../assets/icons/jobTypeIcon.svg";
import locationIcon from "../../assets/icons/locationIcon.svg";
import peopleApplied from "../../assets/icons/peopleApplied.svg";
import numberOfDaysRemaining from "../../assets/icons/numberOfDaysRemaining.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";
import bookmarkIcon from "../../assets/icons/bookmarkIcon.svg";
import useModalStore from "../../store/modalStateStores.ts";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { ApplicationMethod, JobPostResponse } from "../../utils/types";
import { RateeType } from "../../utils/enums.ts";
import DOMPurify from "dompurify";
import { FRONTEND_BASE_URL } from "../../utils/constants.ts";
import { useJobActions } from "../../store/useJobActions.ts";
import { showErrorToast } from "../../utils/toastConfig.tsx";
import Rating from "../../components/common/Rating.tsx";
import ShareModal from "../../components/ui/ShareModal.tsx";
import ApplicationModal from "../../components/ui/ApplicationModal.tsx";
import ApplicationSuccessModal from "../../components/ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../../components/ui/PaymentSuccessModal.tsx";
import ReferModal from "../../components/ui/ReferModal.tsx";
import JobDetailsMegaModal from "../../components/ui/JobDetailsMegaModal.tsx";

interface JobMatchCardProps {
  updateJobRating: (jobId: number, ratingValue: number) => void;
  job?: JobPostResponse;
  title: string;
  company: string;
  tags: string[];
  description: string;
  location: string;
  type: string;
  applicants: number;
  daysLeft: number;
  companyLogo?: string;
  dashboard?: true;
}
export const BestMatchedJobDetails: React.FC<JobMatchCardProps> = ({
  job = {} as JobPostResponse,
  updateJobRating,
  title,
  company,
  tags,
  description,
  location,
  type,
  applicants,
  daysLeft,
  dashboard = false,
  companyLogo,
}) => {
  const { openModal, isModalOpen } = useModalStore();
  const { rateSomeone } = useJobActions();
  const {
    viewingJob,
    jobCurrentlyViewed,
    setCurrentlyViewed,
    setViewingJob,
    setJobToApply,
    jobToApply,
  } = useJobSearchSettings();
  const rating = job?.rating?.averageScore || 0;

  const handleApplication = () => {
    setJobToApply(job);
    openModal("application");
  };

  const handleRating = async (value: number) => {
    await rateSomeone(value, job?.id, RateeType.JOB, "")
      .then((response) => {
        if (response.statusCode === 201 && response.data) {
          const updatedScore = response.data.score;
          updateJobRating(job?.id, updatedScore);
        }
      })
      .catch((error) => {
        console.error("Rating failed:", error);
        showErrorToast(error.response.data.message);
      });
  };

  const handleRefer = async () => {
    openModal("refer-modal");
  };

  const url = `${FRONTEND_BASE_URL}/jobs/${job?.id}/details`;

  return (
    <div className="min-[480px] relative mx-auto flex w-full flex-col gap-y-8 rounded-[16px] bg-[#F7F8FA] p-4">
      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex w-full items-center space-x-3">
          <img
            src={companyLogo}
            alt={`${company} Logo`}
            className="h-14 w-14 rounded-full md:h-[60px] md:w-[60px]"
          />
          <div className="mt-5 flex w-full flex-col justify-start gap-y-2">
            <div className="flex w-full items-center justify-start gap-2">
              <h3 className="text-left text-[15px] font-bold text-black md:text-[20px]">
                {title}
              </h3>
              <p className="text-left text-[10px] font-semibold text-gray-700 md:text-[13px]">
                {company}
              </p>
            </div>

            <div className="group mt-1 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#6E4AED1F] px-3 py-1 text-[9px] font-medium text-[#6E4AED] md:text-[13px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/*Eye icon*/}
              {
                // On dashboard or on mobile (viewingJob ignored on small screens)
                dashboard || window.innerWidth < 1024 ? (
                  <div
                    className="text-gray cursor-pointer transition-opacity group-hover:text-black"
                    onClick={() => {
                      setCurrentlyViewed(job);
                      setJobToApply(job);
                      openModal("job-mega-modal");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5 text-gray-500 hover:text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="hidden lg:block">
                    {viewingJob ? (
                      <div
                        className="text-gray cursor-pointer transition-opacity group-hover:text-black"
                        onClick={() => {
                          setCurrentlyViewed(job);
                          setJobToApply(job);
                          setViewingJob(false);
                        }}
                      >
                        {/* Hide icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-5 w-5 text-gray-500 hover:text-gray-700"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.957 9.957 0 012.19-3.357m3.287-2.308A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.507 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3l18 18"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="text-gray cursor-pointer transition-opacity group-hover:text-black"
                        onClick={() => {
                          setCurrentlyViewed(job);
                          setJobToApply(job);
                          setViewingJob(true);
                        }}
                      >
                        {/* Eye icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-5 w-5 text-gray-500 hover:text-gray-700"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="absolute -top-1 -right-2 flex items-center space-x-3">
          <Rating rate={handleRating} value={rating} />
          <img
            onClick={() => openModal("share")}
            src={shareIcon}
            alt="Share Icon"
            className="h-4 w-4 cursor-pointer md:h-5 md:w-5"
          />
          <ShareModal url={url} modalId="share" />
          <img
            src={bookmarkIcon}
            alt="Bookmark Icon"
            className="h-4 w-4 cursor-pointer md:h-5 md:w-5"
          />
        </div>
      </div>

      {/* Description */}
      <div className="group relative flex flex-col flex-wrap">
        {/* Description */}
        <p
          className={`font-lato line-clamp-6 w-full max-w-none cursor-pointer text-[12px] leading-5 whitespace-pre-wrap text-gray-700 md:text-[13px]`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description?.trim()),
          }}
        ></p>
      </div>

      {/* Job Info */}
      <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-3 px-4 md:gap-x-7">
        <div className="flex items-center gap-x-2">
          <img src={jobTypeIcon} alt="Job Type Icon" className="h-4 w-4" />
          <p className="text-[11px] text-gray-600 md:text-[13px]">{type}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <img src={locationIcon} alt="Location Icon" className="h-4 w-4" />
          <p className="text-[11px] text-gray-600 md:text-[13px]">{location}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <img
            src={peopleApplied}
            alt="People Applied Icon"
            className="h-4 w-4"
          />
          <p className="text-[11px] text-gray-600 md:text-[13px]">
            {applicants} Applied
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <img
            src={numberOfDaysRemaining}
            alt="Days Remaining Icon"
            className="h-4 w-4"
          />
          <p className="text-[11px] text-gray-600 md:text-[13px]">
            {daysLeft} days left
          </p>
        </div>
        <div className="flex justify-evenly gap-x-2">
          <button
            onClick={() => {
              openModal("refer-modal");
            }}
            className="rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#ffffff] px-4 py-1 text-[11px] font-medium text-[#6E4AED] md:text-[13px]"
          >
            Refer
          </button>
          <button
            disabled={jobToApply?.applied}
            onClick={handleApplication}
            className="rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 py-1 text-[11px] font-medium text-black md:text-[13px]"
          >
            {!jobToApply?.applied ? "Apply" : "Applied"}
          </button>
          {/* Modals */}
          {isModalOpen("application") && (
            <ApplicationModal
              applicationMethod={
                jobToApply?.applicationMethod as ApplicationMethod
              }
              modalId="application"
            />
          )}
          {isModalOpen("application-success") && (
            <ApplicationSuccessModal modalId="application-success" />
          )}
          {isModalOpen("payment-success-modal") && (
            <PaymentSuccessModal modalId="payment-success-modal" />
          )}
          {isModalOpen("refer-modal") && (
            <ReferModal handleRefer={handleRefer} modalId="refer-modal" />
          )}
          {isModalOpen("job-mega-modal") && (
            <JobDetailsMegaModal
              job={jobCurrentlyViewed as JobPostResponse}
              modalId="job-mega-modal"
            />
          )}
        </div>
      </div>
    </div>
  );
};
