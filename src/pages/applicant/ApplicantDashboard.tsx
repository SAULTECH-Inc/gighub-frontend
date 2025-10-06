import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import BelowApplicationStats from "../../components/ui/BelowApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
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
import { Briefcase, TrendingUp } from "lucide-react";
import ApplicantDashboardSchedules from "../../components/ui/ApplicantDashboardSchedules.tsx";
import { Link } from "react-router-dom";
export const SHADOWS = {
  sm: "shadow-sm",
  md: "shadow-md shadow-slate-200/50",
  lg: "shadow-lg shadow-slate-200/60",
  xl: "shadow-xl shadow-slate-200/70",
  hover: "hover:shadow-lg hover:shadow-slate-200/50",
  card: "shadow-sm border border-slate-200",
  cardHover: "hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-300",
} as const;

// Consistent spacing and layout
export const LAYOUT = {
  cardPadding: "p-6",
  cardRadius: "rounded-2xl",
  containerGap: "gap-6",
  gridGap: "gap-6",
  sectionGap: "space-y-6",
} as const;

export const ApplicantDashboard = () => {
  const { setMetrics } = useMetrics();

  useEffect(() => {
    const fetchMyApplicationMetrics = async () => {
      try {
        const response = await fetchMetrics();
        const raw = response.data;
        const mapped: ApplicationMetrics = {
          jobsApplied: parseInt(raw.jobsapplied || "0"),
          shortlisted: parseInt(raw.shortlisted || "0"),
          pending: parseInt(raw.pending || "0"),
          clicked: parseInt(raw.clicked || "0"),
          viewed: parseInt(raw.viewed || "0"),
          applied: parseInt(raw.applied || "0"),
          withdrawn: parseInt(raw.withdrawn || "0"),
          interviewed: parseInt(raw.interviewed || "0"),
          hired: parseInt(raw.hired || "0"),
          rejected: parseInt(raw.rejected || "0"),
          remote: parseInt(raw.remote || "0"),
          onsite: parseInt(raw.onsite || "0"),
          hybrid: parseInt(raw.hybrid || "0"),
        };
        setMetrics(mapped);
      } catch (error) {
        console.error("Error fetching application metrics:", error);
      }
    };

    fetchMyApplicationMetrics().then((r) => r);
  }, [setMetrics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <div className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      </div>

      {/* Welcome Section */}
      <div className="relative pt-8 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 ${LAYOUT.cardRadius} p-8 text-white ${SHADOWS.xl} relative overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold">Welcome back, Alex! 👋</h1>
                </div>
                <p className="max-w-2xl text-lg text-indigo-100">
                  Ready to take your career to the next level? You have new
                  opportunities waiting for you.
                </p>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 xl:grid-cols-[1fr_400px] ${LAYOUT.gridGap}`}
        >
          {/* Main Column */}
          <div className={LAYOUT.sectionGap}>
            <ApplicationStats />
            <BelowApplicationStats />
            <ApplicantRecentApplications />
          </div>

          {/* Sidebar */}
          <div className={LAYOUT.sectionGap}>
            <ApplicantDashboardSchedules />
            <ApplicantMessages />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <div
            className={`bg-gradient-to-r from-slate-800 to-slate-900 ${LAYOUT.cardRadius} p-8 text-white ${SHADOWS.xl} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            <div className="relative flex flex-col items-center justify-between lg:flex-row">
              <div className="mb-6 text-center lg:mb-0 lg:text-left">
                <h3 className="mb-3 text-2xl font-bold">
                  Ready for your next opportunity?
                </h3>
                <p className="text-lg text-slate-300">
                  Discover jobs that match your skills and aspirations
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/applicant/find-jobs"
                  className="transform rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/applicant/profile"
                  className="transform rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/20"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  );
};

export default ApplicantDashboard;
