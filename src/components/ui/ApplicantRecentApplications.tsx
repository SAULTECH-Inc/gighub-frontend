import { FC, useEffect, useState } from "react";
import ApplicationCard from "./ApplicationCard.tsx";
import recentApplicationLogo from "../../assets/images/recentApplicationLogo.png";
import { ApplicationResponse, SortBy } from "../../utils/types";
import { getMyApplications, getRecentApplications } from "../../services/api";
import { ApplicationStatus } from "../../utils/dummyApplications.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";

const ApplicantRecentApplications: FC = () => {
  const [myApplications, setMyApplications] = useState<ApplicationResponse[]>();
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [paginationParams] = useState({
    page: 1,
    limit: 5,
    sort: {
      sortDirection: "createdAt",
      orderBy: "desc",
    },
    applicationStatus: null,
  });
  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true);
      //here
      if (USER_TYPE === UserType.EMPLOYER) {
        return await getRecentApplications(
          paginationParams?.applicationStatus,
          paginationParams?.sort as SortBy,
          paginationParams.page,
          paginationParams.limit,
        );
      }
      return await getMyApplications(
        paginationParams?.applicationStatus,
        paginationParams?.sort as SortBy,
        paginationParams.page,
        paginationParams.limit,
      );
    };
    fetchMyApplications()
      .then((response) => {
        setMyApplications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching applications : " + error.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case ApplicationStatus.VIEWED:
        return "#3498db"; // Blue
      case ApplicationStatus.PENDING:
        return "#FFD900"; // Yellow
      case ApplicationStatus.HIRED:
        return "#4CD137"; // Green
      case ApplicationStatus.INTERVIEWED:
        return "#6B5AED"; // Purple
      case ApplicationStatus.REJECTED:
        return "#D32F2F"; // Red
      case ApplicationStatus.SHORTLISTED:
        return "#1abc9c"; // Teal
      case ApplicationStatus.WITHDRAW:
        return "#95a5a6"; // Gray
      default:
        return "#7f8c8d"; // Default gray if unknown
    }
  };
  return (
    <>
      <div className="col-span-8 h-[365px] w-full space-y-4">
        {/* Recent Applications */}
        <div className="rounded-[16px] bg-white p-3 shadow md:p-6">
          <h2 className="mb-6 text-lg font-semibold md:text-xl">
            Recent Application
          </h2>
          {/*Status indicator*/}
          <div className="mb-4 flex items-center space-x-4 md:hidden">
            <div className="flex items-center justify-evenly gap-x-2">
              <span
                className="h-[14px] w-[14px] flex-shrink-0 rounded-full md:h-[16px] md:w-[16px]"
                style={{ backgroundColor: "#D32F2F" }}
              ></span>
              <span className="text-sm text-[#6B5AED]">Pending</span>
            </div>
            <div className="flex items-center justify-evenly gap-x-2">
              <span
                className="h-[14px] w-[14px] flex-shrink-0 rounded-full md:h-[16px] md:w-[16px]"
                style={{ backgroundColor: "#FFD900" }}
              ></span>

              <span className="text-sm text-[#6B5AED]">Scheduled</span>
            </div>
            <div className="flex items-center justify-evenly gap-x-2">
              <span
                className="h-[14px] w-[14px] flex-shrink-0 rounded-full md:h-[16px] md:w-[16px]"
                style={{ backgroundColor: "#4CD137" }}
              ></span>

              <span className="text-sm text-[#6B5AED]">Hired</span>
            </div>
          </div>
          <div className="grid gap-y-4">
            {/* Application 1 */}
            {myApplications?.map((application, index) => {
              return (
                <ApplicationCard
                  key={index}
                  image={
                    application?.applicant?.profilePicture ||
                    recentApplicationLogo
                  }
                  jobTitle={application.job.title}
                  location={application.job.location}
                  companyName={application.job.company}
                  status={application.status}
                  statusColor={getStatusColor(application.status)}
                  buttonText="View Details"
                  application={application}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantRecentApplications;
