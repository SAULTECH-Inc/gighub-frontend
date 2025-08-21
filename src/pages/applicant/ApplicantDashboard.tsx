
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
import { Briefcase, TrendingUp } from "lucide-react";
export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md shadow-slate-200/50',
  lg: 'shadow-lg shadow-slate-200/60',
  xl: 'shadow-xl shadow-slate-200/70',
  hover: 'hover:shadow-lg hover:shadow-slate-200/50',
  card: 'shadow-sm border border-slate-200',
  cardHover: 'hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-300'
} as const;

// Consistent spacing and layout
export const LAYOUT = {
  cardPadding: 'p-6',
  cardRadius: 'rounded-2xl',
  containerGap: 'gap-6',
  gridGap: 'gap-6',
  sectionGap: 'space-y-6'
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

    fetchMyApplicationMetrics().then(r=>r);
  }, [setMetrics]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Navigation */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
          <TopNavBar
              navItems={applicantNavItems}
              navItemsMobile={applicantNavItemsMobile}
              navbarItemsMap={applicantNavBarItemMap}
          />
        </div>

        {/* Welcome Section */}
        <div className="relative pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 ${LAYOUT.cardRadius} p-8 text-white ${SHADOWS.xl} relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">
                      Welcome back, Alex! 👋
                    </h1>
                  </div>
                  <p className="text-indigo-100 text-lg max-w-2xl">
                    Ready to take your career to the next level? You have new opportunities waiting for you.
                  </p>
                </div>

                <div className="hidden lg:block">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <TrendingUp className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className={`grid grid-cols-1 xl:grid-cols-[1fr_400px] ${LAYOUT.gridGap}`}>
            {/* Main Column */}
            <div className={LAYOUT.sectionGap}>
              <ApplicationStats />
              <BelowApplicationStats />
              <ApplicantRecentApplications />
            </div>

            {/* Sidebar */}
            <div className={LAYOUT.sectionGap}>
              <ApplicantSchedules />
              <ApplicantMessages />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <div className={`bg-gradient-to-r from-slate-800 to-slate-900 ${LAYOUT.cardRadius} p-8 text-white ${SHADOWS.xl} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="relative flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <h3 className="text-2xl font-bold mb-3">Ready for your next opportunity?</h3>
                  <p className="text-slate-300 text-lg">
                    Discover jobs that match your skills and aspirations
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
                    Browse Jobs
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
                    Update Profile
                  </button>
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