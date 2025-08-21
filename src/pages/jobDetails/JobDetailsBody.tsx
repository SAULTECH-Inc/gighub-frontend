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
  Edit3
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
                     children
                   }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode
  }) => (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Job Title Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                {job.jobType}
              </span>
              <span className="text-slate-400">•</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {job.employmentType}
              </span>
              <span className="text-slate-400">•</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                {job.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Job Description */}
          <Section icon={FileText} title="Job Description">
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.description),
              }}
            />
          </Section>

          {/* Key Responsibilities */}
          <Section icon={Target} title="Key Responsibilities">
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.responsibility),
              }}
            />
          </Section>

          {/* Requirements */}
          {job.requirements && (
            <Section icon={CheckCircle} title="Requirements">
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2"
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
                  className="inline-flex items-center px-3 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* Action Buttons Section */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            {USER_TYPE === UserType.APPLICANT ? (
              <>
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <button
                  onClick={() => handleBookmark && handleBookmark()}
                  type="button"
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>

                <button
                  type="button"
                  onClick={() => openModal("refer-modal")}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Refer Someone</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJobToApply(job);
                    openModal("application-modal");
                  }}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleEditJob && handleEditJob()}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Edit3 className="w-4 h-4" />
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