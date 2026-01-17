import paystack from "../../../../assets/images/paystack.png";
import { useJobSearchSettings } from "../../../../store/useJobSearchSettings.ts";
import numeral from "numeral";
import DOMPurify from "dompurify";
import moment from "moment";
import ApplicationModal from "../../ApplicationModal.tsx";
import { ApplicationMethod, JobPostResponse } from "../../../../utils/types";
import useModalStore from "../../../../store/modalStateStores.ts";
import ReferModal from "../../ReferModal.tsx";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../utils/toastConfig.tsx";
import { useJobActions } from "../../../../store/useJobActions.ts";
import React from "react";
interface JobDescriptionProps {
  jobCurrentlyViewed: JobPostResponse;
}
const JobDescription: React.FC<JobDescriptionProps> = ({
  jobCurrentlyViewed,
}) => {
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const { setJobToApply } = useJobSearchSettings();
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
    <div className="relative mx-auto flex h-screen w-full flex-col overflow-y-auto bg-white p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm sm:h-20 sm:w-20">
          <img
            src={jobCurrentlyViewed?.employer?.companyLogo || paystack}
            alt="company logo"
            className="h-10 w-10 rounded-lg object-cover sm:h-16 sm:w-16"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="hidden sm:block">
            <h1 className="mb-2 text-2xl leading-tight font-bold text-gray-900">
              {jobCurrentlyViewed?.title}
            </h1>
            <div className="mb-3 flex flex-wrap items-center gap-6">
              <span className="font-medium text-gray-600">
                {jobCurrentlyViewed?.company}
              </span>
              <span className="text-sm text-gray-500">
                {jobCurrentlyViewed?.applicantsCount &&
                jobCurrentlyViewed?.applicantsCount > 1
                  ? `${jobCurrentlyViewed?.applicantsCount} people have applied`
                  : "No applicants yet"}
              </span>
            </div>
            {jobCurrentlyViewed?.noMutualConnections &&
            jobCurrentlyViewed.noMutualConnections > 0 ? (
              <p className="text-sm text-gray-600">
                {jobCurrentlyViewed.noMutualConnections} people from your
                network work here,{" "}
                <a
                  href=""
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  see connections
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-600">No mutual connections</p>
            )}
          </div>

          <div className="block sm:hidden">
            <h1 className="mb-1 text-xl font-bold text-gray-900">
              {jobCurrentlyViewed?.title}
            </h1>
            <span className="font-medium text-gray-600">
              {jobCurrentlyViewed?.company}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile network info */}

      {jobCurrentlyViewed?.noMutualConnections &&
      jobCurrentlyViewed.noMutualConnections > 0 ? (
        <p className="mb-6 block text-sm text-gray-600 sm:hidden">
          {jobCurrentlyViewed.noMutualConnections} people from your network work
          here,{" "}
          <a
            href=""
            className="font-medium text-purple-600 hover:text-purple-700"
          >
            see connections
          </a>
        </p>
      ) : (
        <p className="mb-6 block text-sm text-gray-600 sm:hidden">
          No mutual connections
        </p>
      )}

      {/* Job Stats Cards */}
      <div className="mb-8 border-t border-gray-200 pt-6">
        <div
          className={`grid gap-4 ${salaryExist ? "grid-cols-3" : "grid-cols-2"} sm:gap-6`}
        >
          <div className="flex flex-col items-center justify-center rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center sm:p-6">
            <span className="mb-1 text-sm font-medium text-gray-700">
              Job Type
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {jobCurrentlyViewed?.jobType}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center sm:p-6">
            <span className="mb-1 text-sm font-medium text-gray-700">
              Experience
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {jobCurrentlyViewed?.experienceYears}+ years
            </span>
          </div>

          {salaryExist && (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 text-center sm:col-span-1 sm:p-6">
              <span className="mb-1 text-sm font-medium text-gray-700">
                Salary
              </span>
              <span className="text-center text-lg font-semibold text-gray-900">
                {jobCurrentlyViewed?.salaryRange?.currency}
                {numeral(jobCurrentlyViewed?.salaryRange?.minimumAmount).format(
                  "0.[00]a",
                )}
                {" - "}
                {jobCurrentlyViewed.salaryRange.currency}
                {numeral(jobCurrentlyViewed?.salaryRange?.maximumAmount).format(
                  "0.[00]a",
                )}
                <span className="block text-sm text-gray-600">
                  /
                  {jobCurrentlyViewed?.salaryRange?.frequency?.split(" ")[1] ||
                    jobCurrentlyViewed?.salaryRange?.frequency}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
            About the Role
          </h2>
          <div
            className="prose prose-gray max-w-none leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(jobCurrentlyViewed?.description || ""),
            }}
          />
        </section>

        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
            Key Responsibilities
          </h2>
          <div
            className="prose prose-gray max-w-none leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                jobCurrentlyViewed?.responsibility || "",
              ),
            }}
          />
        </section>

        {jobCurrentlyViewed?.requirements && (
          <section>
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
              Requirements
            </h2>
            <div
              className="prose prose-gray max-w-none leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  jobCurrentlyViewed?.requirements || "",
                ),
              }}
            />
          </section>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500">
            Posted {moment(jobCurrentlyViewed?.createdAt as Date).fromNow()}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => openModal("refer-modal")}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 sm:flex-none"
            >
              Refer Someone
            </button>
            <button
              onClick={handleApply}
              disabled={jobCurrentlyViewed?.applied || false}
              className={`flex-1 rounded-xl px-8 py-3 font-medium transition-all duration-200 sm:flex-none ${
                jobCurrentlyViewed?.applied
                  ? "cursor-default bg-green-500 text-white"
                  : "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg"
              }`}
            >
              {!jobCurrentlyViewed?.applied ? "Quick Apply" : "Applied ✓"}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen("application-modal") && (
        <ApplicationModal
          applicationMethod={
            jobCurrentlyViewed?.applicationMethod as ApplicationMethod
          }
          modalId="application-modal"
        />
      )}

      {isModalOpen("refer-modal") && (
        <ReferModal handleRefer={handleRefer} modalId="refer-modal" />
      )}
    </div>
  );
};

export default JobDescription;
