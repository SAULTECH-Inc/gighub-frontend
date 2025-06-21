import { Paystack } from "../../../../assets/icons.ts";
import { FaLocationDot } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoBagSharp } from "react-icons/io5";
import { useJobSearchSettings } from "../../../../store/useJobSearchSettings.ts";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { JobPostResponse } from "../../../../utils/types";
import { fetchOtherJobPost } from "../../../../services/api";
import moment from "moment";
import { Link } from "react-router-dom";
const limit = 10;
const page = 1;
const CompanyInfo = () => {
  const { jobCurrentlyViewed } = useJobSearchSettings();
  const [otherJobPosts, setOtherJobPosts] = useState<JobPostResponse[]>();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const doFetchOtherJobPost = async () => {
      return await fetchOtherJobPost(jobCurrentlyViewed?.id || 0, page, limit);
    };
    doFetchOtherJobPost().then((res) => {
      setOtherJobPosts(res?.data);
      setTotal(res?.meta?.total || 0);
    });
  }, [jobCurrentlyViewed?.id]);
  return (
    <div className="relative mx-auto flex w-full flex-col rounded-r-[16px] bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-md bg-[#F7F8FA]">
          <img
            src={jobCurrentlyViewed?.employer?.companyLogo || Paystack}
            alt="paystack"
            className="h-[30px] w-[30px] rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[20px] font-medium text-black">
            {jobCurrentlyViewed?.company}
          </h2>
          <p className="mt-2 text-[18px] text-gray">
            {jobCurrentlyViewed?.employer?.industry}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
          <FaLocationDot className="text-[20px] text-gray" />
          <span className="text-sm font-normal text-gray">
            {jobCurrentlyViewed?.employer?.city},{" "}
            {jobCurrentlyViewed?.employer?.country}
          </span>
        </div>
        {jobCurrentlyViewed?.employer?.numberOfEmployees &&
          jobCurrentlyViewed?.employer?.numberOfEmployees > 0 && (
            <div className="flex items-center gap-x-2">
              <FaUser className="text-[20px] text-gray" />
              <span className="text-sm font-normal text-gray">
                {jobCurrentlyViewed?.employer?.numberOfEmployees} employees
              </span>
            </div>
          )}

        <div className="flex items-center gap-x-2">
          <IoBagSharp className="text-[20px] text-gray" />
          <span className="text-sm font-normal text-gray">
            15 connection work here
          </span>
          <a href="" className="ml-16 text-[#6438C2]">
            See All
          </a>
        </div>
      </div>
      <div className="mt-6">
        <div
          className="leading-6 text-[#8E8E8E]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              jobCurrentlyViewed?.employer?.companyDescription ||
                jobCurrentlyViewed?.employer?.aboutCompany ||
                "",
            ),
          }}
        ></div>
        <div className="mt-10 flex items-center justify-center">
          <button className="w-full rounded-[10px] border-[1px] border-[#6438C2] bg-[#6438C2] px-4 py-2 text-white">
            Follow
          </button>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-5">
          <h5 className="text-base font-semibold text-black">Other Roles</h5>
          {total > 5 && (
            <a
              href="#"
              className="text-primaryPurple text-sm font-medium hover:underline"
            >
              See All
            </a>
          )}
        </div>

        {otherJobPosts?.slice(0, 5).map((job, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-[#E6E6E6] pb-5"
          >
            <div className="flex flex-col">
              <Link
                to={`/jobs/${job?.id}/details`}
                className="text-sm font-medium text-[#111827] hover:underline md:text-base"
              >
                {job?.title}
              </Link>
              <span className="text-gray-500 mt-1 text-xs">
                <span className="text-green-600">●</span> Posted{" "}
                <span className="text-gray-700 font-medium">
                  {moment(job.createdAt).fromNow()}
                </span>
              </span>
            </div>
            <div className="text-gray-600 text-right text-xs font-medium md:text-sm">
              <span className="text-blue-600">{job?.employmentType}</span>
              <br />
              <span className="text-purple-600">{job?.jobType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInfo;
