// EmployerDashboard.tsx - Updated with Analytics Modal and Applications Review Modal

import React, {useMemo, useState} from "react";
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  Download,
  Lightbulb,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {employerNavBarItemMap,} from "../../utils/constants.ts";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "./EmployerJobMultistepForm.tsx";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";
import {useDashboardData} from "../../hooks/useDashboardData";
import {DashboardFilters} from "../../utils/types/dashboard.ts";
import {ErrorDisplay} from "../../components/common/ErrorDisplay.tsx";
import {ModernMetricCard} from "../../components/features/ModernMetricCard.tsx";
import {AnalyticsModal} from "../../components/features/AnalyticsModal.tsx";
import {ApplicationsReviewModal} from "../../components/features/ApplicationsReviewModal.tsx";
import {CandidateCard} from "../../components/features/CandidateCard.tsx";
import {InterviewCard} from "../../components/features/InterviewCard.tsx";
import {JobPostingCard} from "../../components/features/JobPostingCard.tsx";
import {QuickActionButton} from "../../components/features/QuickActionButton.tsx";


// Main Dashboard Component
const EmployerDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const { openModal, isModalOpen } = useModalStore();

  // Dashboard filters
  const dashboardFilters: DashboardFilters = useMemo(
    () => ({
      period: selectedPeriod,
      limit: 10,
    }),
    [selectedPeriod],
  );

  // Use the dashboard hook with single API call approach
  const {
    data,
    transformedMetrics,
    loading,
    errors,
    loadDashboard,
    refreshMetrics,
    refreshCandidates,
    refreshInterviews,
    refreshJobs,
  } = useDashboardData("single", dashboardFilters);

  const handlePeriodChange = (
    newPeriod: "week" | "month" | "quarter" | "year",
  ) => {
    setSelectedPeriod(newPeriod);
  };

  const handleRefresh = () => {
    loadDashboard().then((r) => r);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation */}
      <TopNavBar
        navbarItemsMap={employerNavBarItemMap}
        userType="employer"
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6438C2] to-[#FA4E09]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          <div
            className="absolute inset-0 bg-repeat opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-white/5" />
        <div
          className="absolute top-32 right-20 h-16 w-16 animate-bounce rounded-lg bg-white/5"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-32 h-12 w-12 animate-pulse rounded-full bg-white/5"
          style={{ animationDelay: "2s" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Good morning! 👋
              </h1>
              <p className="mt-2 text-xl text-blue-100">
                {data.upcomingInterviews.length > 0
                  ? `You have ${data.topCandidates.length} new applications and ${data.upcomingInterviews.length} interviews scheduled today`
                  : "Your dashboard is ready with the latest updates"}
              </p>
              <div className="mt-4 flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Real-time analytics</span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <button className="rounded-2xl bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </div>
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading.isLoading}
                className="rounded-2xl bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw
                    className={`h-4 w-4 ${loading.isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Display */}
        {errors.error && (
          <div className="mb-6">
            <ErrorDisplay message={errors.error} onRetry={handleRefresh} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon={Plus}
              label="Post New Job"
              onClick={() => openModal("post-job-modal")}
              description="Create and publish a new position"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <QuickActionButton
              icon={Calendar}
              label="Schedule Interview"
              onClick={() => openModal("schedule-interview-modal")}
              description="Book interviews with candidates"
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <QuickActionButton
              icon={Users}
              label="Review Applications"
              description="Screen and evaluate candidates"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              onClick={() => setIsApplicationsOpen(true)}
            />
            <QuickActionButton
              icon={BarChart3}
              label="View Analytics"
              description="Deep dive into hiring metrics"
              color="bg-gradient-to-r from-orange-500 to-orange-600"
              onClick={() => setIsAnalyticsOpen(true)}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
            <select
              value={selectedPeriod}
              onChange={(e) =>
                handlePeriodChange(
                  e.target.value as "week" | "month" | "quarter" | "year",
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {errors.metricsError && (
            <div className="mb-4">
              <ErrorDisplay
                message={errors.metricsError}
                onRetry={refreshMetrics}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {transformedMetrics.map((metric) => (
              <ModernMetricCard
                key={metric.id}
                metric={metric}
                isLoading={loading.metricsLoading}
              />
            ))}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Top Candidates */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Top Candidates
                    </h3>
                    <p className="text-sm text-gray-600">
                      {data.topCandidates.length > 0
                        ? `${data.topCandidates.length} highest-rated candidates this ${selectedPeriod}`
                        : "Loading candidates..."}
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={refreshCandidates}
                >
                  {loading.candidatesLoading
                    ? "Loading..."
                    : "View All Candidates"}
                </button>
              </div>

              {errors.candidatesError && (
                <ErrorDisplay
                  message={errors.candidatesError}
                  onRetry={refreshCandidates}
                />
              )}

              <div className="space-y-4">
                {loading.candidatesLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-32 rounded-2xl bg-gray-100" />
                    </div>
                  ))
                ) : data.topCandidates.length > 0 ? (
                  data.topCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No candidates available
                  </div>
                )}
              </div>
            </div>

            {/* Hiring Funnel */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Hiring Funnel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Application to hire conversion
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                  View Details
                </button>
              </div>

              {/* Funnel Visualization */}
              {data.hiringFunnel ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="font-medium text-gray-900">Hired</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {data.hiringFunnel.hired.toLocaleString()}
                      </span>
                      <span className="block text-sm text-gray-600">
                        {Math.round(
                          (data.hiringFunnel.hired /
                            data.hiringFunnel.applications) *
                          100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  {loading.funnelLoading
                    ? "Loading funnel data..."
                    : "No funnel data available"}
                </div>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-50 p-2">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600">
                      Latest updates from your team
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  onClick={refreshJobs}
                >
                  View All Activity
                </button>
              </div>

              {errors.activityError && (
                <ErrorDisplay message={errors.activityError} />
              )}

              <div className="space-y-4">
                {loading.activityLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-start gap-4 p-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-gray-200" />
                          <div className="h-3 w-1/2 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : data.recentActivity.length > 0 ? (
                  data.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={`rounded-full p-2 ${
                          activity.type === "hire"
                            ? "bg-green-100"
                            : activity.type === "interview_scheduled"
                              ? "bg-blue-100"
                              : activity.type === "application_received"
                                ? "bg-purple-100"
                                : "bg-yellow-100"
                        }`}
                      >
                        {activity.type === "hire" && (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "interview_scheduled" && (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "application_received" && (
                          <Users className="h-4 w-4 text-purple-600" />
                        )}
                        {activity.type === "job_posted" && (
                          <Briefcase className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Interviews */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Today's Interviews
                    </h3>
                    <p className="text-sm text-gray-600">
                      {data.upcomingInterviews.length} scheduled
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                  onClick={() => openModal("schedule-interview-modal")}
                >
                  Schedule More
                </button>
              </div>

              {errors.interviewsError && (
                <ErrorDisplay
                  message={errors.interviewsError}
                  onRetry={refreshInterviews}
                />
              )}

              <div className="space-y-3">
                {loading.interviewsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-20 rounded-xl bg-gray-100" />
                    </div>
                  ))
                ) : data.upcomingInterviews.length > 0 ? (
                  data.upcomingInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No interviews scheduled
                  </div>
                )}
              </div>
            </div>

            {/* Active Job Postings */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Active Jobs
                    </h3>
                    <p className="text-sm text-gray-600">
                      {data.activeJobs.length} open positions
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={refreshJobs}
                >
                  Manage All
                </button>
              </div>

              {errors.jobsError && (
                <ErrorDisplay
                  message={errors.jobsError}
                  onRetry={refreshJobs}
                />
              )}

              <div className="space-y-4">
                {loading.jobsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-32 rounded-xl bg-gray-100" />
                    </div>
                  ))
                ) : data.activeJobs.length > 0 ? (
                  data.activeJobs.map((job) => (
                    <JobPostingCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No active jobs
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-2">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">This Week's Goals</h3>
              </div>

              {data.weeklyGoals ? (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Interview candidates</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.interviewsCompleted}/
                        {data.weeklyGoals.interviewsTarget}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.interviewsCompleted / data.weeklyGoals.interviewsTarget) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Send job offers</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.offersCompleted}/
                        {data.weeklyGoals.offersTarget}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.offersCompleted / data.weeklyGoals.offersTarget) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Review applications</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.applicationsReviewCompleted}/
                        {data.weeklyGoals.applicationsReviewTarget}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.applicationsReviewCompleted / data.weeklyGoals.applicationsReviewTarget) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-white/70">
                  {loading.goalsLoading
                    ? "Loading goals..."
                    : "No goals set for this week"}
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-2">
                  <Lightbulb className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    AI Insights
                  </h3>
                  <p className="text-sm text-gray-600">
                    Personalized recommendations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {loading.insightsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-20 rounded-xl bg-gray-100 p-4" />
                    </div>
                  ))
                ) : data.aiInsights.length > 0 ? (
                  data.aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`rounded-xl border p-4 ${
                        insight.type === "optimization"
                          ? "border-blue-100 bg-blue-50"
                          : insight.type === "performance"
                            ? "border-green-100 bg-green-50"
                            : insight.type === "alert"
                              ? "border-red-100 bg-red-50"
                              : "border-purple-100 bg-purple-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 rounded-full p-1 ${
                            insight.type === "optimization"
                              ? "bg-blue-500"
                              : insight.type === "performance"
                                ? "bg-green-500"
                                : insight.type === "alert"
                                  ? "bg-red-500"
                                  : "bg-purple-500"
                          }`}
                        >
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p
                            className={`mb-1 font-medium ${
                              insight.type === "optimization"
                                ? "text-blue-900"
                                : insight.type === "performance"
                                  ? "text-green-900"
                                  : insight.type === "alert"
                                    ? "text-red-900"
                                    : "text-purple-900"
                            }`}
                          >
                            {insight.title}
                          </p>
                          <p
                            className={`text-sm ${
                              insight.type === "optimization"
                                ? "text-blue-700"
                                : insight.type === "performance"
                                  ? "text-green-700"
                                  : insight.type === "alert"
                                    ? "text-red-700"
                                    : "text-purple-700"
                            }`}
                          >
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No insights available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen("post-job-modal") && (
        <EmployerJobMultistepForm modalId="post-job-modal" />
      )}
      {isModalOpen("schedule-interview-modal") && (
        <InterviewScheduleMultiStepForm modalId="schedule-interview-modal" />
      )}

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Applications Review Modal */}
      <ApplicationsReviewModal
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
      />
    </div>
  );
};

export default EmployerDashboard;
