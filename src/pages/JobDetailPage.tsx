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
const JobDetailPage: FC = () => {
  const { jobId } = useParams();
  const { isModalOpen, closeModal } = useModalStore();
  const { referSomeoneToAJob } = useJobActions();

  const [job, setJob] = useState<JobPostResponse>();
  useEffect(() => {
    if (!jobId) return; // Prevents fetching if id is undefined

    const fetchJob = async () => {
      try {
        const response = await fetchJobById(Number(jobId)); // Assuming this returns { data: JobPostResponse }
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchJob().then((r) => r);
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

  return (
    <div className="mx-auto">
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
      <div className="mx-auto flex min-h-screen justify-center gap-x-10 bg-[#F7F8FA] px-2 pt-6 lg:px-5">
        {/* Main Content */}
        <div className="flex w-full flex-col gap-y-8 rounded-[16px] p-4 lg:p-8">
          {USER_TYPE === UserType.EMPLOYER && <JobDetailsTop />}
          {/*Form */}
          {job && (
            <form className="mx-auto flex min-h-[600px] w-full flex-col items-start gap-x-4 gap-y-4 md:flex-row">
              <JobDetailsBody
                handleEditJob={handleEditJob}
                handleBookmark={handleBookmark}
                job={job}
              />
              <JobDetailsSidebar
                handleEditJob={handleEditJob}
                handleBookmark={handleBookmark}
                job={job}
              />
            </form>
          )}
        </div>
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
