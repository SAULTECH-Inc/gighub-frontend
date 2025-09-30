// EmployerDashboard.tsx - Updated with API Integration

import React, { useState, useMemo } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Clock,
  Briefcase,
  Star,
  Download,
  RefreshCw,
  Plus,
  Target,
  Activity,
  MapPin,
  Zap,
  Timer,
  Globe,
  BarChart3,
  Phone,
  Video,
  Calendar as CalendarIcon,
  Clock3,
  Sparkles,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "./EmployerJobMultistepForm.tsx";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";
import { useDashboardData } from "../../hooks/useDashboardData";

import { DashboardFilters } from "../../utils/types/dashboard.ts";

// Icon mapping for dynamic icon rendering
const iconMap = {
  Users,
  Briefcase,
  Calendar,
  UserCheck,
  Target,
  Timer,
};

// Types for the dashboard components
interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

// Error Display Component
const ErrorDisplay: React.FC<{ message: string; onRetry?: () => void }> = ({
                                                                             message,
                                                                             onRetry
                                                                           }) => (
  <div className="rounded-xl bg-red-50 border border-red-200 p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">Error Loading Data</p>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 font-medium mt-2"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Updated Modern Metric Card Component
const ModernMetricCard: React.FC<{ metric: MetricCard; isLoading?: boolean }> = ({
                                                                                   metric,
                                                                                   isLoading = false
                                                                                 }) => {
  const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Users;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded-full bg-gray-200" />
              <div className="h-8 w-20 rounded-full bg-gray-200" />
              <div className="h-3 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
          <div className="flex items-center gap-2">
            {metric.trend === 'up' && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">+{metric.change}%</span>
              </div>
            )}
            {metric.trend === 'down' && (
              <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs font-semibold text-red-600">-{metric.change}%</span>
              </div>
            )}
            {metric.trend === 'neutral' && (
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                <span className="text-xs font-semibold text-gray-600">{metric.change}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
        </div>

        <div className={`rounded-2xl p-4 ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`h-6 w-6 ${metric.color}`} />
        </div>
      </div>
    </div>
  );
};

// Updated Candidate Card Component
const CandidateCard: React.FC<{ candidate: any }> = ({ candidate }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      reviewing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      interviewing: 'bg-purple-100 text-purple-700 border-purple-200',
      hired: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-200">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`}
            alt={candidate.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {candidate.name}
              </h4>
              <p className="text-sm text-gray-600">{candidate.position}</p>
            </div>
            <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(candidate.status)}`}>
              {candidate.status}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{candidate.experience}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">{candidate.matchScore}% match</span>
            </div>
            <span className="text-sm font-semibold text-green-600">{candidate.salary}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {candidate.skills?.slice(0, 3).map((skill: string, index: number) => (
              <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {skill}
              </span>
            ))}
            {candidate.skills?.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                +{candidate.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Interview Card Component
const InterviewCard: React.FC<{ interview: any }> = ({ interview }) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      video: Video,
      phone: Phone,
      'in-person': Users,
    };
    return icons[type as keyof typeof icons] || Video;
  };

  const TypeIcon = getTypeIcon(interview.type);

  return (
    <div className="rounded-xl bg-white p-4 border border-gray-100 hover:border-blue-200 transition-colors">
      <div className="flex items-start gap-3">
        <img
          src={interview.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidateName)}&background=random`}
          alt={interview.candidateName}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
              <p className="text-sm text-gray-600">{interview.position}</p>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <TypeIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{interview.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              <span>{interview.time}</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Interviewer: {interview.interviewer}
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Job Posting Card Component
const JobPostingCard: React.FC<{ job: any }> = ({ job }) => {
  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[urgency as keyof typeof colors];
  };

  return (
    <div className="rounded-xl bg-white p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{job.title}</h4>
          <p className="text-sm text-gray-600">{job.department}</p>
        </div>
        <div className="flex items-center gap-2">
          {job.remote && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              <Globe className="h-3 w-3 mr-1" />
              Remote
            </span>
          )}
          <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
            {job.urgency}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-lg font-bold text-gray-900">{job.applications}</p>
          <p className="text-xs text-gray-600">Applications</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-lg font-bold text-gray-900">{job.views}</p>
          <p className="text-xs text-gray-600">Views</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Posted {job.posted}</span>
        <span className="capitalize">{job.type}</span>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  color: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, description, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${color}`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white/20 p-3 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{label}</h3>
          <p className="text-sm text-white/80 mt-1">{description}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-20 w-20 transform translate-x-10 -translate-y-10 rounded-full bg-white/10" />
    </button>
  );
};

// Main Dashboard Component
const EmployerDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { openModal, isModalOpen } = useModalStore();

  // Dashboard filters
  const dashboardFilters: DashboardFilters = useMemo(() => ({
    period: selectedPeriod,
    limit: 10,
  }), [selectedPeriod]);

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
  } = useDashboardData('single', dashboardFilters);

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedPeriod(newPeriod);
  };

  const handleRefresh = () => {
    loadDashboard().then(r=>r);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation */}
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          <div
            className="absolute inset-0 bg-repeat opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white/5 animate-pulse" />
        <div className="absolute top-32 right-20 h-16 w-16 rounded-lg bg-white/5 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-32 h-12 w-12 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Good morning! 👋
              </h1>
              <p className="mt-2 text-xl text-blue-100">
                {data.upcomingInterviews.length > 0
                  ? `You have ${data.topCandidates.length} new applications and ${data.upcomingInterviews.length} interviews scheduled today`
                  : 'Your dashboard is ready with the latest updates'
                }
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

            <div className="hidden lg:flex items-center gap-4">
              <button className="rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-3 text-white transition-colors hover:bg-white/20">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </div>
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading.isLoading}
                className="rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-3 text-white transition-colors hover:bg-white/30 disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 ${loading.isLoading ? 'animate-spin' : ''}`} />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
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
            />
            <QuickActionButton
              icon={BarChart3}
              label="View Analytics"
              description="Deep dive into hiring metrics"
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {errors.metricsError && (
            <div className="mb-4">
              <ErrorDisplay message={errors.metricsError} onRetry={refreshMetrics} />
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
          <div className="lg:col-span-2 space-y-8">
            {/* Top Candidates */}
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top Candidates</h3>
                    <p className="text-sm text-gray-600">
                      {data.topCandidates.length > 0
                        ? `${data.topCandidates.length} highest-rated candidates this ${selectedPeriod}`
                        : 'Loading candidates...'
                      }
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={refreshCandidates}
                >
                  {loading.candidatesLoading ? 'Loading...' : 'View All Candidates'}
                </button>
              </div>

              {errors.candidatesError && (
                <ErrorDisplay message={errors.candidatesError} onRetry={refreshCandidates} />
              )}

              <div className="space-y-4">
                {loading.candidatesLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="rounded-2xl bg-gray-100 h-32" />
                    </div>
                  ))
                ) : data.topCandidates.length > 0 ? (
                  data.topCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No candidates available
                  </div>
                )}
              </div>
            </div>

            {/* Hiring Funnel */}
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hiring Funnel</h3>
                    <p className="text-sm text-gray-600">Application to hire conversion</p>
                  </div>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View Details
                </button>
              </div>

              {/* Funnel Visualization */}
              {data.hiringFunnel ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="font-medium text-gray-900">Hired</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">{data.hiringFunnel.hired.toLocaleString()}</span>
                      <span className="block text-sm text-gray-600">
                        {Math.round((data.hiringFunnel.hired / data.hiringFunnel.applications) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {loading.funnelLoading ? 'Loading funnel data...' : 'No funnel data available'}
                </div>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-50 p-2">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-600">Latest updates from your team</p>
                  </div>
                </div>
                <button
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
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
                        <div className="rounded-full bg-gray-200 h-8 w-8" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : data.recentActivity.length > 0 ? (
                  data.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`rounded-full p-2 ${
                        activity.type === 'hire' ? 'bg-green-100' :
                          activity.type === 'interview_scheduled' ? 'bg-blue-100' :
                            activity.type === 'application_received' ? 'bg-purple-100' :
                              'bg-yellow-100'
                      }`}>
                        {activity.type === 'hire' && <UserCheck className="h-4 w-4 text-green-600" />}
                        {activity.type === 'interview_scheduled' && <Calendar className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'application_received' && <Users className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'job_posted' && <Briefcase className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Interviews */}
            <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Today's Interviews</h3>
                    <p className="text-sm text-gray-600">
                      {data.upcomingInterviews.length} scheduled
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                  onClick={() => openModal("schedule-interview-modal")}
                >
                  Schedule More
                </button>
              </div>

              {errors.interviewsError && (
                <ErrorDisplay message={errors.interviewsError} onRetry={refreshInterviews} />
              )}

              <div className="space-y-3">
                {loading.interviewsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="rounded-xl bg-gray-100 h-20" />
                    </div>
                  ))
                ) : data.upcomingInterviews.length > 0 ? (
                  data.upcomingInterviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No interviews scheduled
                  </div>
                )}
              </div>
            </div>

            {/* Active Job Postings */}
            <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Active Jobs</h3>
                    <p className="text-sm text-gray-600">
                      {data.activeJobs.length} open positions
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={refreshJobs}
                >
                  Manage All
                </button>
              </div>

              {errors.jobsError && (
                <ErrorDisplay message={errors.jobsError} onRetry={refreshJobs} />
              )}

              <div className="space-y-4">
                {loading.jobsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="rounded-xl bg-gray-100 h-32" />
                    </div>
                  ))
                ) : data.activeJobs.length > 0 ? (
                  data.activeJobs.map((job) => (
                    <JobPostingCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active jobs
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">This Week's Goals</h3>
              </div>

              {data.weeklyGoals ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Interview candidates</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.interviewsCompleted}/{data.weeklyGoals.interviewsTarget}
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.interviewsCompleted / data.weeklyGoals.interviewsTarget) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Send job offers</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.offersCompleted}/{data.weeklyGoals.offersTarget}
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.offersCompleted / data.weeklyGoals.offersTarget) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Review applications</span>
                      <span className="text-sm font-medium">
                        {data.weeklyGoals.applicationsReviewCompleted}/{data.weeklyGoals.applicationsReviewTarget}
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (data.weeklyGoals.applicationsReviewCompleted / data.weeklyGoals.applicationsReviewTarget) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-white/70">
                  {loading.goalsLoading ? 'Loading goals...' : 'No goals set for this week'}
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-teal-50 p-2">
                  <Lightbulb className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI Insights</h3>
                  <p className="text-sm text-gray-600">Personalized recommendations</p>
                </div>
              </div>

              <div className="space-y-4">
                {loading.insightsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="p-4 rounded-xl bg-gray-100 h-20" />
                    </div>
                  ))
                ) : data.aiInsights.length > 0 ? (
                  data.aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-xl border ${
                        insight.type === 'optimization' ? 'bg-blue-50 border-blue-100' :
                          insight.type === 'performance' ? 'bg-green-50 border-green-100' :
                            insight.type === 'alert' ? 'bg-red-50 border-red-100' :
                              'bg-purple-50 border-purple-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-1 mt-1 ${
                          insight.type === 'optimization' ? 'bg-blue-500' :
                            insight.type === 'performance' ? 'bg-green-500' :
                              insight.type === 'alert' ? 'bg-red-500' :
                                'bg-purple-500'
                        }`}>
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className={`font-medium mb-1 ${
                            insight.type === 'optimization' ? 'text-blue-900' :
                              insight.type === 'performance' ? 'text-green-900' :
                                insight.type === 'alert' ? 'text-red-900' :
                                  'text-purple-900'
                          }`}>
                            {insight.title}
                          </p>
                          <p className={`text-sm ${
                            insight.type === 'optimization' ? 'text-blue-700' :
                              insight.type === 'performance' ? 'text-green-700' :
                                insight.type === 'alert' ? 'text-red-700' :
                                  'text-purple-700'
                          }`}>
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No insights available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen("post-job-modal") && <EmployerJobMultistepForm modalId="post-job-modal" />}
      {isModalOpen("schedule-interview-modal") && <InterviewScheduleMultiStepForm modalId="schedule-interview-modal" />}
    </div>
  );
};

export default EmployerDashboard;
