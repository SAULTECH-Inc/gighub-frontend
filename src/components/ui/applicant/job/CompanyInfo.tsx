import { Paystack } from "../../../../assets/icons.ts";
import { FaLocationDot } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoBagSharp } from "react-icons/io5";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { JobPostResponse } from "../../../../utils/types";
import { fetchOtherJobPost, followCompany } from "../../../../services/api";
import moment from "moment";
import { Link } from "react-router-dom";

const limit = 10;
const page = 1;
interface CompanyInfoProps {
  jobCurrentlyViewed: JobPostResponse;
}
const CompanyInfo: React.FC<CompanyInfoProps> = ({ jobCurrentlyViewed }) => {
  const [otherJobPosts, setOtherJobPosts] = useState<JobPostResponse[]>();
  const [total, setTotal] = useState(0);
  const [isFollowing, setIsFollowing] = useState(
    jobCurrentlyViewed?.employer?.isFollowed,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const doFetchOtherJobPost = async () => {
      return await fetchOtherJobPost(jobCurrentlyViewed?.id || 0, page, limit);
    };
    doFetchOtherJobPost().then((res) => {
      setOtherJobPosts(res?.data);
      setTotal(res?.meta?.total || 0);
    });
  }, [jobCurrentlyViewed?.id]);

  const handleFollow = async (job: JobPostResponse | null) => {
    if (!job || isLoading) return;

    setIsLoading(true);
    try {
      const response = await followCompany(job.employer.id as number);
      if (response?.statusCode === 200 || response?.statusCode === 201) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Failed to follow company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex h-full w-full flex-col bg-white p-6">
      {/* Company Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
          <img
            src={jobCurrentlyViewed?.employer?.companyLogo || Paystack}
            alt="company logo"
            className="h-10 w-10 rounded-lg object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="mb-1 text-xl leading-tight font-bold text-gray-900">
            {jobCurrentlyViewed?.company}
          </h2>
          <p className="font-medium text-gray-600">
            {jobCurrentlyViewed?.employer?.industry}
          </p>
        </div>
      </div>

      {/* Company Stats */}
      <div className="mb-6 space-y-4">
        {jobCurrentlyViewed?.employer?.city &&
          jobCurrentlyViewed?.employer?.country && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <FaLocationDot className="flex-shrink-0 text-lg text-purple-500" />
              <span className="text-sm font-medium text-gray-700">
                {jobCurrentlyViewed?.employer?.city},{" "}
                {jobCurrentlyViewed?.employer?.country}
              </span>
            </div>
          )}

        {jobCurrentlyViewed?.employer?.numberOfEmployees &&
          jobCurrentlyViewed?.employer?.numberOfEmployees > 0 && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <FaUser className="flex-shrink-0 text-lg text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {jobCurrentlyViewed?.employer?.numberOfEmployees.toLocaleString()}{" "}
                employees
              </span>
            </div>
          )}

        {jobCurrentlyViewed?.employer?.noMutualConnections !== undefined &&
        jobCurrentlyViewed?.employer?.noMutualConnections > 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <IoBagSharp className="flex-shrink-0 text-lg text-green-500" />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {jobCurrentlyViewed?.employer?.noMutualConnections} connections
                work here
              </span>
              <a
                href=""
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                See All
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <IoBagSharp className="flex-shrink-0 text-lg text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              No mutual connections
            </span>
          </div>
        )}
      </div>

      {/* Company Description */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          About the Company
        </h3>
        <div
          className="text-sm leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              jobCurrentlyViewed?.employer?.companyDescription ||
                jobCurrentlyViewed?.employer?.aboutCompany ||
                "No company description available.",
            ),
          }}
        />
      </div>

      {/* Follow Button */}
      <div className="mb-8">
        <button
          onClick={async () => await handleFollow(jobCurrentlyViewed)}
          disabled={isLoading}
          className={`w-full rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
            isFollowing
              ? "border border-gray-300 bg-gray-100 text-gray-700"
              : "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg"
          } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading
            ? "Loading..."
            : isFollowing
              ? "Following"
              : "Follow Company"}
        </button>
      </div>

      {/* Other Roles Section */}
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Other Open Roles
          </h3>
          {total > 5 && (
            <a
              href="#"
              className="text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              View All ({total})
            </a>
          )}
        </div>

        <div className="space-y-4">
          {otherJobPosts?.slice(0, 5).map((job, index) => (
            <div
              key={index}
              className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/jobs/${job?.id}/details`}
                    className="mb-2 block font-medium text-gray-900 transition-colors group-hover:text-purple-600 hover:text-purple-600"
                  >
                    {job?.title}
                  </Link>
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Posted {moment(job.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {job?.employmentType}
                    </span>
                    <span className="inline-block rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                      {job?.jobType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!otherJobPosts || otherJobPosts.length === 0) && (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm">No other roles available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
