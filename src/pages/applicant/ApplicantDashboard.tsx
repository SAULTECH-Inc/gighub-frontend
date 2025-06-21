import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import BelowApplicationStats from "../../components/ui/BelowApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants.ts";
import { useEffect } from "react";
import { ApplicationMetrics } from "../../utils/types";
import { fetchMetrics } from "../../services/api";
import { useMetrics } from "../../store/useMetrics.ts";
import MainFooter from "../../components/layouts/MainFooter.tsx";

export const ApplicantDashboard = () => {
  const { setMetrics } = useMetrics();

  useEffect(() => {
    const fetchMyApplicationMetrics = async () => {
      return await fetchMetrics();
    };

    fetchMyApplicationMetrics()
      .then((response) => {
        const raw = response.data;
        const mapped: ApplicationMetrics = {
          jobsApplied: parseInt(raw.jobsapplied),
          shortlisted: parseInt(raw.shortlisted),
          pending: parseInt(raw.pending),
          clicked: parseInt(raw.clicked || "0"),
          viewed: parseInt(raw.viewed),
          applied: parseInt(raw.applied || "0"),
          withdrawn: parseInt(raw.withdrawn),
          interviewed: parseInt(raw.interviewed),
          hired: parseInt(raw.hired),
          rejected: parseInt(raw.rejected),
          remote: parseInt(raw.remote),
          onsite: parseInt(raw.onsite),
          hybrid: parseInt(raw.hybrid),
        };
        setMetrics(mapped);
      })
      .catch((error) => {
        console.error("Error fetching application metrics:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="flex flex-col bg-[#F7F7F7]">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
        <div className="grid min-h-screen grid-cols-1 items-start justify-center gap-x-4 gap-y-14 bg-gray-100 px-3 py-6 md:mb-10 md:gap-y-0 xl:grid-cols-[65%_30%]">
          {/* First Column */}
          <div className="flex w-full flex-col items-center gap-y-6">
            <ApplicationStats />
            <BelowApplicationStats />
            <ApplicantRecentApplications />
          </div>

          {/* Second Column */}
          <div className="mt-16 flex h-full w-full flex-col items-center gap-x-2 gap-y-6 md:mt-0 md:flex-row lg:flex-col">
            <div className="flex h-full w-full justify-center">
              <ApplicantSchedules />
            </div>
            <div className="flex h-full w-full justify-center">
              <ApplicantMessages />
            </div>
          </div>
        </div>

        <MainFooter />
      </div>
    </>
  );
};
