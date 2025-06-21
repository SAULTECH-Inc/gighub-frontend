import React, { useEffect } from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
import BelowJobStats from "../../components/ui/BelowJobStats.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useMetrics } from "../../store/useMetrics.ts";
import { fetchMetrics } from "../../services/api";
import { ApplicationMetrics } from "../../utils/types";

const EmployerDashboard: React.FC = () => {
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
      <div className="min-h-screen bg-[#F7F7F7]">
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
        <div className="bg-gray-100 grid grid-cols-1 items-start justify-center gap-x-6 gap-y-32 overscroll-auto px-3 py-6 xl:grid-cols-[70%_25%]">
          {/* First Column */}
          <div className="flex h-full w-full flex-col items-center gap-y-6">
            <ApplicationStats />
            <BelowJobStats />
            <ApplicantRecentApplications />
          </div>

          {/* Second Column */}
          <div className="flex h-full w-full flex-col items-center gap-4 md:flex-row xl:flex-col">
            <div className="flex w-full justify-center">
              <ApplicantSchedules />
            </div>
            <div className="md: flex w-full justify-center self-start">
              <ApplicantMessages />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
