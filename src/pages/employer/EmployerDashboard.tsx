// EmployerDashboard.tsx - Updated with Analytics Modal and Applications Review Modal

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
  X,
  Search,
  ChevronDown,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp as TrendingUpIcon,
  PieChart,
  LineChart,
} from "lucide-react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
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
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

// Error Display Component
const ErrorDisplay: React.FC<{ message: string; onRetry?: () => void }> = ({
                                                                             message,
                                                                             onRetry,
                                                                           }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">Error Loading Data</p>
        <p className="mt-1 text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Updated Modern Metric Card Component
const ModernMetricCard: React.FC<{
  metric: MetricCard;
  isLoading?: boolean;
}> = ({ metric, isLoading = false }) => {
  const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Users;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
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
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-600">
            {metric.title}
          </p>
          <p className="mb-2 text-3xl font-bold text-gray-900">
            {metric.value}
          </p>
          <div className="flex items-center gap-2">
            {metric.trend === "up" && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">
                  +{metric.change}%
                </span>
              </div>
            )}
            {metric.trend === "down" && (
              <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs font-semibold text-red-600">
                  -{metric.change}%
                </span>
              </div>
            )}
            {metric.trend === "neutral" && (
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                <span className="text-xs font-semibold text-gray-600">
                  {metric.change}%
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">{metric.description}</p>
        </div>

        <div
          className={`rounded-2xl p-4 ${metric.bgColor} transition-transform duration-300 group-hover:scale-110`}
        >
          <IconComponent className={`h-6 w-6 ${metric.color}`} />
        </div>
      </div>
    </div>
  );
};

// Analytics Modal Component
const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                            }) => {
  const [selectedTab, setSelectedTab] = useState<"overview" | "hiring" | "performance">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <p className="mt-1 text-orange-100">Deep dive into your hiring metrics</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "overview"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("hiring")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "hiring"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Hiring Funnel
            </button>
            <button
              onClick={() => setSelectedTab("performance")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "performance"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 180px)" }}>
          {selectedTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Applications</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">1,247</p>
                      <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                        <TrendingUpIcon className="h-4 w-4" />
                        <span>+23% vs last month</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-100 p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Successful Hires</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">48</p>
                      <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                        <TrendingUpIcon className="h-4 w-4" />
                        <span>+12% vs last month</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-green-100 p-3">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">18 days</p>
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <TrendingDown className="h-4 w-4" />
                        <span>-3 days vs last month</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-purple-100 p-3">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <LineChart className="h-5 w-5 text-orange-600" />
                    Application Trends
                  </h3>
                  <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                    <p className="text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <PieChart className="h-5 w-5 text-orange-600" />
                    Application Sources
                  </h3>
                  <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                    <p className="text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "hiring" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">Hiring Funnel Analysis</h3>
                <div className="space-y-4">
                  {[
                    { stage: "Applications Received", count: 1247, percentage: 100, color: "blue" },
                    { stage: "Screening", count: 523, percentage: 42, color: "purple" },
                    { stage: "First Interview", count: 198, percentage: 16, color: "indigo" },
                    { stage: "Second Interview", count: 89, percentage: 7, color: "violet" },
                    { stage: "Offer Extended", count: 52, percentage: 4, color: "green" },
                    { stage: "Hired", count: 48, percentage: 3.8, color: "emerald" },
                  ].map((stage) => (
                    <div key={stage.stage}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-sm text-gray-600">
                          {stage.count} ({stage.percentage}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full bg-${stage.color}-500 transition-all duration-500`}
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Senior Software Engineer", applications: 248, hires: 12 },
                      { title: "Product Manager", applications: 186, hires: 8 },
                      { title: "UX Designer", applications: 142, hires: 6 },
                      { title: "Data Scientist", applications: 128, hires: 5 },
                    ].map((job, index) => (
                      <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-600">
                              {job.applications} applications • {job.hires} hires
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {((job.hires / job.applications) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">conversion</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Recruiter Performance</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah Johnson", interviews: 45, hires: 12, rating: 4.8 },
                      { name: "Michael Chen", interviews: 38, hires: 10, rating: 4.6 },
                      { name: "Emily Rodriguez", interviews: 32, hires: 8, rating: 4.5 },
                      { name: "David Kim", interviews: 28, hires: 7, rating: 4.4 },
                    ].map((recruiter, index) => (
                      <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=random`}
                              alt={recruiter.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{recruiter.name}</p>
                              <p className="text-sm text-gray-600">
                                {recruiter.interviews} interviews • {recruiter.hires} hires
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="font-medium text-gray-900">{recruiter.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Applications Review Modal Component
const ApplicationsReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
                                                                                       isOpen,
                                                                                       onClose,
                                                                                     }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");

  if (!isOpen) return null;

  const mockApplications = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@email.com",
      position: "Senior Software Engineer",
      status: "new",
      matchScore: 95,
      appliedDate: "2 hours ago",
      experience: "8 years",
      location: "San Francisco, CA",
      avatar: null,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      position: "Product Manager",
      status: "reviewing",
      matchScore: 88,
      appliedDate: "5 hours ago",
      experience: "6 years",
      location: "New York, NY",
      avatar: null,
      skills: ["Product Strategy", "Agile", "Data Analysis"],
    },
    {
      id: 3,
      name: "Carol Martinez",
      email: "carol.m@email.com",
      position: "UX Designer",
      status: "interviewing",
      matchScore: 92,
      appliedDate: "1 day ago",
      experience: "5 years",
      location: "Austin, TX",
      avatar: null,
      skills: ["Figma", "User Research", "Prototyping"],
    },
    {
      id: 4,
      name: "David Lee",
      email: "david.lee@email.com",
      position: "Senior Software Engineer",
      status: "new",
      matchScore: 90,
      appliedDate: "1 day ago",
      experience: "7 years",
      location: "Seattle, WA",
      avatar: null,
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
    },
  ];

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchesPosition = selectedPosition === "all" || app.position === selectedPosition;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
      interviewing: "bg-purple-100 text-purple-700 border-purple-200",
      hired: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Review Applications</h2>
            <p className="mt-1 text-purple-100">{filteredApplications.length} applications to review</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Position Filter */}
            <div className="relative">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Positions</option>
                <option value="Senior Software Engineer">Senior Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UX Designer">UX Designer</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 180px)" }}>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={
                      application.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(application.name)}&background=random`
                    }
                    alt={application.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md"
                  />

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                          {application.name}
                        </h4>
                        <p className="text-sm text-gray-600">{application.position}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{application.email}</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{application.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Applied {application.appliedDate}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-current text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {application.matchScore}% match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {application.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.skills.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            +{application.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <button className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                        <span>View Full Profile</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                        <FileText className="h-4 w-4" />
                        <span>Resume</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="py-16 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-900">No applications found</p>
                <p className="mt-1 text-sm text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Candidate Card Component
const CandidateCard: React.FC<{ candidate: any }> = ({ candidate }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
      interviewing: "bg-purple-100 text-purple-700 border-purple-200",
      hired: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={
              candidate.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`
            }
            alt={candidate.name}
            className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
          />
          <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {candidate.name}
              </h4>
              <p className="text-sm text-gray-600">{candidate.position}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(candidate.status)}`}
            >
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
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {candidate.matchScore}% match
              </span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {candidate.salary}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {candidate.skills
              ?.slice(0, 3)
              .map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
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
      "in-person": Users,
    };
    return icons[type as keyof typeof icons] || Video;
  };

  const TypeIcon = getTypeIcon(interview.type);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200">
      <div className="flex items-start gap-3">
        <img
          src={
            interview.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidateName)}&background=random`
          }
          alt={interview.candidateName}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {interview.candidateName}
              </h4>
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
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[urgency as keyof typeof colors];
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{job.title}</h4>
          <p className="text-sm text-gray-600">{job.department}</p>
        </div>
        <div className="flex items-center gap-2">
          {job.remote && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              <Globe className="mr-1 h-3 w-3" />
              Remote
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getUrgencyColor(job.urgency)}`}
          >
            {job.urgency}
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <p className="text-lg font-bold text-gray-900">{job.applications}</p>
          <p className="text-xs text-gray-600">Applications</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
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
        <div className="rounded-xl bg-white/20 p-3 transition-transform group-hover:scale-110">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{label}</h3>
          <p className="mt-1 text-sm text-white/80">{description}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 transform rounded-full bg-white/10" />
    </button>
  );
};

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