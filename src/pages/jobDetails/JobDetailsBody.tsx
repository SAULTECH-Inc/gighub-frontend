import React from "react";
import { JobPostResponse } from "../../utils/types";
import DOMPurify from "dompurify";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import useModalStore from "../../store/modalStateStores.ts";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import {
  FileText,
  Target,
  CheckCircle,
  Code,
  Bookmark,
  Share2,
  Send,
  Edit3,
} from "lucide-react";

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

  const Section = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-8">
      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Job Title Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-4 sm:text-base">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                {job.jobType}
              </span>
              <span className="text-slate-400">•</span>
              <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                {job.employmentType}
              </span>
              <span className="text-slate-400">•</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700">
                {job.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Job Description */}
          <Section icon={FileText} title="Job Description">
            <div
              className="prose prose-slate max-w-none leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.description),
              }}
            />
          </Section>

          {/* Key Responsibilities */}
          <Section icon={Target} title="Key Responsibilities">
            <div
              className="prose prose-slate prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 max-w-none leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.responsibility),
              }}
            />
          </Section>

          {/* Requirements */}
          {job.requirements && (
            <Section icon={CheckCircle} title="Requirements">
              <div
                className="prose prose-slate prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 max-w-none leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(job.requirements),
                }}
              />
            </Section>
          )}

          {/* Skills */}
          <Section icon={Code} title="Required Skills">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {job?.skillSet?.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* Action Buttons Section */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
            {USER_TYPE === UserType.APPLICANT ? (
              <>
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <button
                  onClick={() => handleBookmark && handleBookmark()}
                  type="button"
                  disabled={job.isBookmarked}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                  {job.isBookmarked ? (
                    <>
                      <Bookmark className="h-4 w-4 text-indigo-600" />
                      <span className="hidden text-indigo-600 sm:inline">
                        Bookmarked
                      </span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span className="hidden sm:inline">Bookmark</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openModal("refer-modal")}
                  className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Refer Someone</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJobToApply(job);
                    openModal("application-modal");
                  }}
                  disabled={job.applied}
                  className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                  {job.applied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Apply Now</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleEditJob && handleEditJob()}
                className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Job</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsBody;
