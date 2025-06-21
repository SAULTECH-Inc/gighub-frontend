import React, { memo, useEffect, useState } from "react";
import { ApplicationMethod, JobPostResponse } from "../../../../utils/types";
import { fetchJobsByEmployer } from "../../../../services/api";
import { showErrorToast } from "../../../../utils/toastConfig.tsx";
import logger from "../../../../log-config";
import { Link } from "react-router-dom";
import ApplicationModal from "../../ApplicationModal.tsx";
import { useJobSearchSettings } from "../../../../store/useJobSearchSettings.ts";
import useModalStore from "../../../../store/modalStateStores.ts";
interface JobOpeningProp {
  employerId: number;
}
const JobOpening: React.FC<JobOpeningProp> = ({ employerId }) => {
  const [jobs, setJobs] = useState<JobPostResponse[]>();
  const { jobToApply, setJobToApply } = useJobSearchSettings();
  const { openModal } = useModalStore();
  const [pagination] = useState({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const doFetchJobs = async () => {
      return await fetchJobsByEmployer(
        employerId,
        pagination.page,
        pagination.limit,
      );
    };
    doFetchJobs()
      .then((res) => {
        setJobs(res?.data);
      })
      .catch((error) => {
        logger.error(error?.response?.data?.message);
        showErrorToast(error?.response?.data?.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Current Job Opening</h2>
      <div className="flex flex-col gap-y-4 md:flex-row md:flex-wrap md:space-x-4">
        {jobs?.map((job, index) => (
          <div
            key={index}
            className="h-[178px] w-full bg-[#F7F7F7] p-6 shadow-sm md:w-[363px] md:flex-1"
          >
            <div>
              <h3 className="font-lato font-semibold">{job.title}</h3>
              <p className="font-lato text-sm text-[#7F7F7F]">{job.location}</p>
            </div>
            <div className="mt-4 flex space-x-8">
              <button
                type="button"
                onClick={() => {
                  setJobToApply(job);
                  openModal("application-modal");
                }}
                className="h-[41px] w-[100px] rounded-[10px] bg-[#6B5AED] px-6 py-2 text-white transition duration-200 hover:bg-purple-700"
              >
                Apply
              </button>
              <Link
                to={`/jobs/${job?.id}/details`}
                className="h-[41px] w-[140px] rounded-[10px] bg-white px-6 py-2 text-[#000000] transition duration-200"
              >
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
      <ApplicationModal
        modalId="application-modal"
        applicationMethod={jobToApply?.applicationMethod as ApplicationMethod}
      />
    </section>
  );
};

export default memo(JobOpening);
