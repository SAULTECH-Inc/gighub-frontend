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
const CompanyInfo: React.FC<CompanyInfoProps> = ({jobCurrentlyViewed}) => {
  const [otherJobPosts, setOtherJobPosts] = useState<JobPostResponse[]>();
  const [total, setTotal] = useState(0);
  const [isFollowing, setIsFollowing] = useState(jobCurrentlyViewed?.employer?.isFollowed);
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
    <div className="relative mx-auto flex w-full flex-col bg-white p-6 h-full">
      {/* Company Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm border border-gray-200">
          <img
            src={jobCurrentlyViewed?.employer?.companyLogo || Paystack}
            alt="company logo"
            className="h-10 w-10 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
            {jobCurrentlyViewed?.company}
          </h2>
          <p className="text-gray-600 font-medium">
            {jobCurrentlyViewed?.employer?.industry}
          </p>
        </div>
      </div>

      {/* Company Stats */}
      <div className="space-y-4 mb-6">
        {
          jobCurrentlyViewed?.employer?.city && jobCurrentlyViewed?.employer?.country && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaLocationDot className="text-purple-500 text-lg flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">
            {jobCurrentlyViewed?.employer?.city}, {jobCurrentlyViewed?.employer?.country}
          </span>
            </div>)
        }

        {jobCurrentlyViewed?.employer?.numberOfEmployees &&
          jobCurrentlyViewed?.employer?.numberOfEmployees > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUser className="text-blue-500 text-lg flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">
                {jobCurrentlyViewed?.employer?.numberOfEmployees.toLocaleString()} employees
              </span>
            </div>
          )}

        {
          jobCurrentlyViewed?.employer?.noMutualConnections !== undefined && jobCurrentlyViewed?.employer?.noMutualConnections > 0 ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IoBagSharp className="text-green-500 text-lg flex-shrink-0" />
              <div className="flex-1 flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">
              {jobCurrentlyViewed?.employer?.noMutualConnections} connections work here
            </span>
                <a href="" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  See All
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IoBagSharp className="text-green-500 text-lg flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">
                No mutual connections
              </span>
            </div>
          )
        }
      </div>

      {/* Company Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
        <div
          className="text-gray-600 leading-relaxed text-sm"
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
              ? "bg-gray-100 text-gray-700 border border-gray-300"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow Company"}
        </button>
      </div>

      {/* Other Roles Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Other Open Roles</h3>
          {total > 5 && (
            <a
              href="#"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View All ({total})
            </a>
          )}
        </div>

        <div className="space-y-4">
          {otherJobPosts?.slice(0, 5).map((job, index) => (
            <div
              key={index}
              className="group p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/jobs/${job?.id}/details`}
                    className="text-gray-900 font-medium hover:text-purple-600 transition-colors group-hover:text-purple-600 block mb-2"
                  >
                    {job?.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Posted {moment(job.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                      {job?.employmentType}
                    </span>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">
                      {job?.jobType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!otherJobPosts || otherJobPosts.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No other roles available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
