import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApplicationMethod, JobPostResponse } from "../utils/types";
import { fetchJobById } from "../services/api";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../utils/constants.ts";
import JobDetailsTop from "./jobDetails/JobDetailsTop.tsx";
import JobDetailsBody from "./jobDetails/JobDetailsBody.tsx";
import JobDetailsSidebar from "./jobDetails/JobDetailsSidebar.tsx";
import { USER_TYPE } from "../utils/helpers.ts";
import { UserType } from "../utils/enums.ts";
import { useJobActions } from "../store/useJobActions.ts";
import useModalStore from "../store/modalStateStores.ts";
import ApplicationModal from "../components/ui/ApplicationModal.tsx";
import ApplicationSuccessModal from "../components/ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../components/ui/PaymentSuccessModal.tsx";
import ReferModal from "../components/ui/ReferModal.tsx";
import { showErrorToast, showSuccessToast } from "../utils/toastConfig.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import MainFooter from "../components/layouts/MainFooter.tsx";

const JobDetailPage: FC = () => {
  const { jobId } = useParams();
  const { isModalOpen, closeModal } = useModalStore();
  const { referSomeoneToAJob } = useJobActions();

  const [job, setJob] = useState<JobPostResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchJobById(Number(jobId));
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleEditJob = async () => {};

  const handleBookmark = async () => {};

  const handleRefer = async (applicantEmails: string[]) => {
    if (applicantEmails.length && applicantEmails.length < 1) return;
    referSomeoneToAJob(Number(jobId), applicantEmails)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {USER_TYPE === UserType.EMPLOYER ? (
          <TopNavBar
            navItems={employerNavItems}
            navItemsMobile={employerNavItemsMobile}
            navbarItemsMap={employerNavBarItemMap}
          />
        ) : (
          <TopNavBar
            navItems={applicantNavItems}
            navItemsMobile={applicantNavItemsMobile}
            navbarItemsMap={applicantNavBarItemMap}
          />
        )}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50">
        {USER_TYPE === UserType.EMPLOYER ? (
          <TopNavBar
            navItems={employerNavItems}
            navItemsMobile={employerNavItemsMobile}
            navbarItemsMap={employerNavBarItemMap}
          />
        ) : (
          <TopNavBar
            navItems={applicantNavItems}
            navItemsMobile={applicantNavItemsMobile}
            navbarItemsMap={applicantNavBarItemMap}
          />
        )}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Job Not Found</h2>
            <p className="text-slate-600 mb-4">{error || "This job may have been removed or the link is invalid."}</p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        {USER_TYPE === UserType.EMPLOYER ? (
          <TopNavBar
            navItems={employerNavItems}
            navItemsMobile={employerNavItemsMobile}
            navbarItemsMap={employerNavBarItemMap}
          />
        ) : (
          <TopNavBar
            navItems={applicantNavItems}
            navItemsMobile={applicantNavItemsMobile}
            navbarItemsMap={applicantNavBarItemMap}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {USER_TYPE === UserType.EMPLOYER && (
          <div className="mb-6">
            <JobDetailsTop />
          </div>
        )}

        {/* Job Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="order-2 lg:order-1">
            <JobDetailsBody
              handleEditJob={handleEditJob}
              handleBookmark={handleBookmark}
              job={job}
            />
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <JobDetailsSidebar
                handleEditJob={handleEditJob}
                handleBookmark={handleBookmark}
                job={job}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16">
        <MainFooter />
      </div>

      {/* Modals */}
      {isModalOpen("application-modal") && (
        <ApplicationModal
          applicationMethod={job?.applicationMethod as ApplicationMethod}
          modalId="application-modal"
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
    </div>
  );
};

export default JobDetailPage;