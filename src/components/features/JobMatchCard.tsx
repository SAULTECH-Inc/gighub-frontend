import React, { useEffect, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import checkAutoApplyRocket from "../../assets/icons/checkAutoApplyRocket.svg";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "../ui/PaymentModal.tsx";
import { JobPostResponse } from "../../utils/types";
import { calculateDaysLeft, USER_TYPE } from "../../utils/helpers.ts";
import { BestMatchedJobDetails } from "../../pages/job/BestMatchedJobDetails.tsx";
import { LAYOUT, SHADOWS } from "../../pages/applicant/ApplicantDashboard.tsx";
import { useFetchTopRecommendedJob } from "../../hooks/useFetchTopRecommendedJob.ts";
import { rateJob } from "../../services/api";
import { RateeType } from "../../utils/enums.ts";

const JobMatchCard: React.FC = () => {
  const { modals, openModal } = useModalStore();
  const isPaymentModalOpen = modals["payment-modal"];
  const isSubscriptionModalOpen = modals["subscription-modal"];

  // Fix 1: Get the complete response from the hook
  const { data, isLoading, error } = useFetchTopRecommendedJob();

  // Fix 2: Initialize state as null, not with data directly
  const [job, setJob] = useState<JobPostResponse | null>(null);

  useEffect(() => {
    // Fix 3: Access the actual job data from the API response
    if (data?.data) {
      setJob(data.data);
    }
  }, [data]);

  const handleAutoApplyClick = () => {
    openModal("subscription-modal");
  };
  // {
  //   score: number;
  //   comment?: string;
  //   rateeId: number;
  //   rateeType: RateeType;
  // }
  const updateJobRating = async (jobId: number, ratingValue: number) => {
    // Fix 4: Add null check before updating
    if (job) {
      const updatedJob = {
        ...job,
        rating: { ...job.rating, averageScore: ratingValue },
      } as JobPostResponse;
      //JobRatingRequest
      await rateJob({
        score: ratingValue,
        rateeId: jobId,
        rateeType: RateeType.JOB,
      });
      setJob(updatedJob);
    }
  };

  return (
    <>
      <div
        className={`bg-white ${LAYOUT.cardRadius} ${SHADOWS.card} ${SHADOWS.cardHover} overflow-hidden transition-all duration-300`}
      >
        {/* Header with gradient background */}
        <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Job Match</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Jobs that match your profile
                </p>
              </div>
            </div>

            <button
              onClick={handleAutoApplyClick}
              className="group relative flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              <span>Check Auto Apply</span>
              <div className="relative">
                {checkAutoApplyRocket ? (
                  <img
                    src={checkAutoApplyRocket}
                    alt="Auto apply"
                    className="h-5 w-5"
                  />
                ) : (
                  <Zap className="h-5 w-5" />
                )}

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-6">
          {/* Fix 5: Handle loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="text-sm text-slate-500">
                Loading recommendations...
              </p>
            </div>
          ) : error ? (
            // Fix 6: Handle error state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Sparkles className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-700">
                Unable to Load Recommendations
              </h3>
              <p className="max-w-sm text-sm text-slate-500">
                There was an error loading your job recommendations. Please try
                again later.
              </p>
            </div>
          ) : job ? (
            <div className="space-y-4">
              <BestMatchedJobDetails
                key={job.id}
                job={job}
                title={job.title}
                company={job.company}
                tags={job.skillSet?.filter(Boolean) || []}
                description={job.description}
                location={job.location}
                type={job.jobType}
                applicants={job.applicantsCount || 0}
                daysLeft={calculateDaysLeft(job.endDate)}
                companyLogo={job.employer?.companyLogo || "#"}
                updateJobRating={updateJobRating}
                dashboard={true}
              />

              {/* Fix 7: Show recommendation-specific data */}
              {job.recommendationScore && (
                <div className="mt-4 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      Match Score
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {job.recommendationScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Sparkles className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-700">
                No Job Matches Yet
              </h3>
              <p className="max-w-sm text-sm text-slate-500">
                Complete your profile to get personalized job recommendations
                that match your skills and preferences.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isSubscriptionModalOpen && (
        <SubscriptionModal modalId="subscription-modal" USER_TYPE={USER_TYPE} />
      )}
      {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
    </>
  );
};

export default JobMatchCard;
