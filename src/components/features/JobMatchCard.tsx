import React, { useEffect, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import checkAutoApplyRocket from "../../assets/icons/checkAutoApplyRocket.svg";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "../ui/PaymentModal.tsx";
import { useFetchJobs } from "../../hooks/useJobQuery.ts";
import { JobPostResponse } from "../../utils/types";
import { calculateDaysLeft } from "../../utils/helpers.ts";
import { BestMatchedJobDetails } from "../../pages/job/BestMatchedJobDetails.tsx";
import {LAYOUT, SHADOWS} from "../../pages/applicant/ApplicantDashboard.tsx";

const JobMatchCard: React.FC = () => {
  const { modals, openModal } = useModalStore();
  const isPaymentModalOpen = modals["payment-modal"];
  const isSubscriptionModalOpen = modals["subscription-modal"];
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const { data } = useFetchJobs(1, 1);

  useEffect(() => {
    if (data?.data) {
      setJobs(data.data);
    }
  }, [data]);

  const handleAutoApplyClick = () => {
    openModal("subscription-modal");
  };

    const updateJobRating = (jobId: number, ratingValue: number) => {
        const updatedJobs = jobs.map((job) =>
            job.id === jobId ? { ...job, rating: { ...job.rating, averageScore: ratingValue } } : job
        ) as JobPostResponse[];

        setJobs(updatedJobs);
    };

  return (
      <>
        <div className={`bg-white ${LAYOUT.cardRadius} ${SHADOWS.card} ${SHADOWS.cardHover} transition-all duration-300 overflow-hidden`}>
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Job Match
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Jobs that match your profile
                  </p>
                </div>
              </div>

              <button
                  onClick={handleAutoApplyClick}
                  className="relative group flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span>Check Auto Apply</span>
                <div className="relative">
                  {checkAutoApplyRocket ? (
                      <img
                          src={checkAutoApplyRocket}
                          alt="Auto apply"
                          className="w-5 h-5"
                      />
                  ) : (
                      <Zap className="w-5 h-5" />
                  )}

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
                </div>
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6">
            {jobs?.length ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
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
                  ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    No Job Matches Yet
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Complete your profile to get personalized job recommendations that match your skills and preferences.
                  </p>
                </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {isSubscriptionModalOpen && (
            <SubscriptionModal modalId="subscription-modal" />
        )}
        {isPaymentModalOpen && (
            <PaymentModal modalId="payment-modal" />
        )}
      </>
  );
};

export default JobMatchCard;