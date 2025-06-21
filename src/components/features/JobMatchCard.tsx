import React, { useEffect, useState } from "react";
import checkAutoApplyRocket from "../../assets/icons/checkAutoApplyRocket.svg";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "../ui/PaymentModal.tsx";
import { useFetchJobs } from "../../hooks/useJobQuery.ts";
import { JobPostResponse } from "../../utils/types";
import { calculateDaysLeft } from "../../utils/helpers.ts";
import { BestMatchedJobDetails } from "../../pages/job/BestMatchedJobDetails.tsx";

const JobMatchCard: React.FC = () => {
  const { modals, openModal } = useModalStore();
  const isPaymentModalOpen = modals["payment-modal"];
  const isSubscriptionModalOpen = modals["subscription-modal"];
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const { data } = useFetchJobs(1, 1);

  useEffect(() => {
    if (data) {
      setJobs(data.data);
    }
  }, [data]);

  const handleModalToggle = () => {
    openModal("subscription-modal"); // Close the modal when clicked
  };

  return (
    <div className="flex h-fit w-full flex-col justify-between rounded-[16px] bg-white p-4 shadow md:flex-1 md:p-6">
      {/* Header Section */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-black md:text-[20px]">
            Job Match
          </h3>
          <p className="text-[10px] font-medium text-[#8E8E8E] md:text-[13px]">
            Job that matches your profile
          </p>
        </div>
        <button
          onClick={handleModalToggle} // Open modal on click
          className="flex items-center gap-2 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] px-4 py-2 text-[13px] text-white shadow-sm"
        >
          <span>Check Auto Apply</span>
          <img
            src={checkAutoApplyRocket}
            alt="Rocket Icon"
            className="h-5 w-5"
          />
        </button>
      </div>
      {/* Job Details Section */}
      {jobs?.map((job, index) => (
        <BestMatchedJobDetails
          key={index}
          job={job}
          title={job?.title}
          company={job?.company}
          tags={job?.skillSet?.filter((s) => s !== null).map((s) => s)}
          description={job?.description}
          location={job?.location}
          type={job?.jobType}
          applicants={job?.applicantsCount || 0}
          daysLeft={calculateDaysLeft(job?.endDate)}
          companyLogo={job?.employer?.companyLogo || "#"}
          updateJobRating={(jobId: number, ratingValue: number) => {
            setJobs((prev) =>
              prev.map((job) =>
                job.id === jobId
                  ? ({
                      ...job,
                      rating: { ...job.rating, averageScore: ratingValue },
                    } as JobPostResponse)
                  : job,
              ),
            );
          }}
          dashboard={true}
        />
      ))}
      {/* Subscription Modal */}
      {isSubscriptionModalOpen && (
        <SubscriptionModal modalId={"subscription-modal"} />
      )}{" "}
      {/* Conditionally render the modal */}
      {/* Payment Modal */}
      {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
    </div>
  );
};

export default JobMatchCard;
