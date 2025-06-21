import React from "react";
import { JobPostResponse } from "../../utils/types";
import DOMPurify from "dompurify";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import useModalStore from "../../store/modalStateStores.ts";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";

interface JobDetailsBodyProp {
  job: JobPostResponse;
  handleEditJob: () => void;
  handleBookmark?: () => void;
}
const JobDetailsBody: React.FC<JobDetailsBodyProp> = ({
  job,
  handleEditJob,
  handleBookmark,
}) => {
  const { openModal } = useModalStore();
  const { setJobToApply } = useJobSearchSettings();
  return (
    <div className="bg-gray-100 flex h-full w-full flex-col items-center justify-center">
      {/* Top Section */}
      <div className="flex h-fit w-full flex-col items-start justify-center rounded-[16px] bg-white px-6 py-4 shadow-sm md:h-[84px] md:flex-row md:items-center md:justify-between">
        <h2 className="font-lato text-lg font-bold text-black">{job.title}</h2>
        <div className="mt-2 flex flex-wrap space-x-4 text-[14px] font-bold text-[#6438C2] md:mt-0 md:text-[20px]">
          <span>
            {job.jobType} / {job.employmentType}
          </span>
          <span className="">|</span>
          <span>{job.level}</span>
        </div>
      </div>

      {/* Job Details Box */}
      <div className="mt-[20px] min-h-[747px] w-full rounded-[16px] bg-white p-4 shadow-sm md:p-8">
        {/* Job Description Section */}
        <div className="flex flex-col">
          <div className="flex h-[40px] w-full items-center rounded-[16px] bg-[#6438C2] px-4">
            <span className="font-lato text-lg font-bold text-white">
              Job Description
            </span>
          </div>
          <div
            className="prose mt-4 w-full max-w-none whitespace-pre-wrap p-1 font-lato text-[16px] leading-[19.2px] tracking-[0%] text-[#8E8E8E] md:p-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(job.description),
            }}
          ></div>
        </div>

        {/* Key Responsibilities */}
        <div className="flex flex-col">
          <div className="mt-6 flex h-[40px] w-full items-center rounded-[16px] bg-[#6438C2] px-4">
            <span className="font-lato text-lg font-bold text-white">
              Key Responsibility
            </span>
          </div>
          <div
            className="prose mt-4 w-full max-w-none list-inside list-disc space-y-3 whitespace-pre-wrap p-1 font-lato text-[16px] leading-[19.2px] text-[#8E8E8E] marker:text-purple-600 md:p-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(job.responsibility),
            }}
          ></div>
        </div>

        {/* Key Requirements */}
        {job.requirements && (
          <div className="flex flex-col">
            <div className="mt-6 flex h-[40px] w-full items-center rounded-[16px] bg-[#6438C2] px-4">
              <span className="font-lato text-lg font-bold text-white">
                Requirements
              </span>
            </div>
            <div
              className="prose mt-4 w-full max-w-none list-inside list-disc space-y-3 whitespace-pre-wrap p-1 font-lato text-[16px] leading-[19.2px] text-[#8E8E8E] marker:text-purple-600 md:p-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.requirements),
              }}
            />
          </div>
        )}

        {/* Key Skills */}
        <div className="flex flex-col">
          <div className="mt-6 flex h-[40px] w-full items-center rounded-[16px] bg-[#6438C2] px-4">
            <span className="font-lato text-lg font-bold text-white">
              Skills
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 px-4">
            {job?.skillSet?.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full bg-[#E9D8FD] px-3 py-1 font-lato text-sm font-medium text-[#4B0082]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="top-20">
          {/* Horizontal Rule */}
          <hr className="mt-[50px] w-full border border-black" />

          {/* Edit Job Button */}
          <div className="mt-10 flex w-full flex-col-reverse flex-wrap items-center gap-x-2 gap-y-3 md:flex-row md:justify-end">
            {/* Bookmark - soft lavender tone for a non-primary action */}

            {/* Apply - strong purple as primary CTA */}
            {USER_TYPE === UserType.APPLICANT ? (
              <>
                <button
                  onClick={() => handleBookmark && handleBookmark()}
                  type="button"
                  className="text-md block w-full rounded-[15px] bg-[#E9D8FD] px-10 py-3 font-lato font-bold text-[#4B0082] transition hover:bg-[#D8B4FE] md:w-[225px]"
                >
                  Bookmark
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openModal("refer-modal");
                  }}
                  className="text-md block w-full rounded-[15px] bg-[#C026D3] px-10 py-3 font-lato font-bold text-white transition hover:bg-[#A21CAF] md:w-[225px]"
                >
                  Refer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJobToApply(job);
                    openModal("application-modal");
                  }}
                  className="text-md block w-full rounded-[15px] bg-[#6438C2] px-10 py-3 font-lato font-bold text-white transition hover:bg-[#5126a9] md:w-[225px]"
                >
                  Apply
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleEditJob && handleEditJob()}
                className="text-md block w-full rounded-[15px] bg-[#6438C2] px-10 py-3 font-lato font-bold text-white transition hover:bg-[#5126a9] md:w-[225px]"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsBody;
