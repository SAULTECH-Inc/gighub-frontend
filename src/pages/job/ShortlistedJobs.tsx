import paystack from "../../assets/images/paystack-logo.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchShortlistedJobs } from "../../services/api";
import { JobPostResponse } from "../../utils/types";
const ShortlistedJobs = () => {
  const [jobs, setJobs] = useState<JobPostResponse[]>();
  const [pagination] = useState({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const doFetchShortlistedJobs = async () => {
      return await fetchShortlistedJobs(pagination);
    };

    doFetchShortlistedJobs()
      .then((res) => {
        setJobs(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="mx-auto flex w-full justify-center">
        <div className="w-full rounded-[16px] bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between md:px-4">
            <h2 className="text-[20px] font-bold">Shortlisted Jobs</h2>
            <button className="text-sm font-bold text-[#6B5AED]">
              See all
            </button>
          </div>

          <div className="w-full md:pl-10">
            {/*Messages*/}
            {jobs?.map((job) => (
              <div className="flex w-full items-start justify-center">
                <div className="flex w-full items-center space-x-3">
                  <img
                    src={paystack}
                    alt="Dangote Logo"
                    className="h-[57px] w-[57px] rounded-[16px]"
                  />
                  <div className="flex flex-col space-y-1 py-4">
                    <Link
                      to=""
                      className="text-sm font-medium hover:underline md:text-lg"
                    >
                      {job?.company}. {job?.title}
                    </Link>
                    <p className="text-gray-500 text-xs md:text-sm">
                      2 people in your network work here
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortlistedJobs;
