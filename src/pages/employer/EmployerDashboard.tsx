import React, { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useMetrics } from "../../store/useMetrics.ts";
import { fetchMetrics } from "../../services/api";
import { ApplicationMetrics } from "../../utils/types";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "./EmployerJobMultistepForm.tsx";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";

// Types for the new dashboard
interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

interface CandidateProfile {
  id: string;
  name: string;
  position: string;
  avatar: string;
  skills: string[];
  experience: string;
  location: string;
  status: 'new' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  matchScore: number;
  salary: string;
  availability: string;
}

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewer: string;
  avatar: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  applications: number;
  views: number;
  posted: string;
  status: 'active' | 'paused' | 'closed';
  urgency: 'high' | 'medium' | 'low';
  type: 'full-time' | 'part-time' | 'contract';
  remote: boolean;
}

// Modern Metric Card Component
const ModernMetricCard: React.FC<{ metric: MetricCard; isLoading?: boolean }> = ({
                                                                                   metric,
                                                                                   isLoading = false
                                                                                 }) => {
  const Icon = metric.icon;

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
      {/* Gradient overlay on hover */}
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
          <Icon className={`h-6 w-6 ${metric.color}`} />
        </div>
      </div>
    </div>
  );
};

// Candidate Card Component
const CandidateCard: React.FC<{ candidate: CandidateProfile }> = ({ candidate }) => {
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
            src={candidate.avatar}
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
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
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

// Interview Card Component
const InterviewCard: React.FC<{ interview: Interview }> = ({ interview }) => {
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
          src={interview.avatar}
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

// Job Posting Card Component
const JobPostingCard: React.FC<{ job: JobPosting }> = ({ job }) => {
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
  const { setMetrics, metric } = useMetrics();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const {openModal, closeModal, isModalOpen} = useModalStore();

  // Mock data for the new dashboard
  const dashboardMetrics: MetricCard[] = [
    {
      id: 'total-applications',
      title: 'Total Applications',
      value: '2,847',
      change: 12,
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'vs last month'
    },
    {
      id: 'active-positions',
      title: 'Active Positions',
      value: '24',
      change: 8,
      trend: 'up',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'currently hiring'
    },
    {
      id: 'interviews-scheduled',
      title: 'Interviews Scheduled',
      value: '156',
      change: 15,
      trend: 'up',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'this week'
    },
    {
      id: 'offers-sent',
      title: 'Offers Sent',
      value: '43',
      change: 5,
      trend: 'down',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'pending response'
    },
    {
      id: 'hire-rate',
      title: 'Hire Rate',
      value: '78%',
      change: 3,
      trend: 'up',
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'vs last quarter'
    },
    {
      id: 'avg-time-to-hire',
      title: 'Avg. Time to Hire',
      value: '18 days',
      change: 2,
      trend: 'down',
      icon: Timer,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'improvement'
    }
  ];

  const topCandidates: CandidateProfile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e5b3e0?w=150&h=150&fit=crop&crop=face',
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      experience: '5+ years',
      location: 'San Francisco, CA',
      status: 'interviewing',
      matchScore: 95,
      salary: '$120k-140k',
      availability: 'Immediate'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      experience: '7+ years',
      location: 'New York, NY',
      status: 'new',
      matchScore: 92,
      salary: '$130k-150k',
      availability: '2 weeks'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      experience: '4+ years',
      location: 'Austin, TX',
      status: 'reviewing',
      matchScore: 88,
      salary: '$90k-110k',
      availability: '1 month'
    }
  ];

  const upcomingInterviews: Interview[] = [
    {
      id: '1',
      candidateName: 'Alex Thompson',
      position: 'Backend Developer',
      date: 'Today',
      time: '2:00 PM',
      type: 'video',
      status: 'scheduled',
      interviewer: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      candidateName: 'Maria Garcia',
      position: 'Data Scientist',
      date: 'Tomorrow',
      time: '10:30 AM',
      type: 'video',
      status: 'scheduled',
      interviewer: 'Lisa Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      candidateName: 'David Kim',
      position: 'DevOps Engineer',
      date: 'Friday',
      time: '3:00 PM',
      type: 'in-person',
      status: 'scheduled',
      interviewer: 'Tom Wilson',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const recentJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      applications: 127,
      views: 1243,
      posted: '3 days ago',
      status: 'active',
      urgency: 'high',
      type: 'full-time',
      remote: true
    },
    {
      id: '2',
      title: 'Marketing Manager',
      department: 'Marketing',
      applications: 89,
      views: 756,
      posted: '1 week ago',
      status: 'active',
      urgency: 'medium',
      type: 'full-time',
      remote: false
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      department: 'Design',
      applications: 64,
      views: 432,
      posted: '5 days ago',
      status: 'active',
      urgency: 'low',
      type: 'contract',
      remote: true
    }
  ];

  // Fetch metrics
  const fetchDashboardMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
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
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setMetrics]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

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
        {/* Animated Background Pattern */}
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
        {/* Floating geometric shapes */}
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
                You have 23 new applications and 5 interviews scheduled today
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
                onClick={fetchDashboardMetrics}
                className="rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-3 text-white transition-colors hover:bg-white/30"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon={Plus}
              label="Post New Job"
              onClick={()=>{
                  openModal("post-job-modal");
              }}
              description="Create and publish a new position"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <QuickActionButton
              icon={Calendar}
              label="Schedule Interview"
              onClick={()=>{
                  openModal("schedule-interview-modal");
              }}
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
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {dashboardMetrics.map((metric) => (
              <ModernMetricCard key={metric.id} metric={metric} isLoading={isLoading} />
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
                    <p className="text-sm text-gray-600">Highest-rated candidates this week</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Candidates
                </button>
              </div>
              <div className="space-y-4">
                {topCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>

            {/* Performance Analytics */}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="font-medium text-gray-900">Applications</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">2,847</span>
                    <span className="block text-sm text-gray-600">100%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="font-medium text-gray-900">Screening</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">1,423</span>
                    <span className="block text-sm text-gray-600">50%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="font-medium text-gray-900">Interviews</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">456</span>
                    <span className="block text-sm text-gray-600">16%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="font-medium text-gray-900">Offers</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">89</span>
                    <span className="block text-sm text-gray-600">3.1%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="font-medium text-gray-900">Hired</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">67</span>
                    <span className="block text-sm text-gray-600">2.4%</span>
                  </div>
                </div>
              </div>
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
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View All Activity
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="rounded-full bg-green-100 p-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Sarah Johnson was hired for Senior Frontend Developer</p>
                    <p className="text-sm text-gray-600">by John Smith • 2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Interview scheduled with Michael Chen</p>
                    <p className="text-sm text-gray-600">for Product Manager position • 4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">15 new applications received</p>
                    <p className="text-sm text-gray-600">for UX Designer position • 6 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Briefcase className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New job posting published</p>
                    <p className="text-sm text-gray-600">Backend Developer position • 8 hours ago</p>
                  </div>
                </div>
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
                    <p className="text-sm text-gray-600">5 scheduled</p>
                  </div>
                </div>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Schedule More
                </button>
              </div>
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
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
                    <p className="text-sm text-gray-600">24 open positions</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Manage All
                </button>
              </div>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <JobPostingCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">This Week's Goals</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Interview 15 candidates</span>
                    <span className="text-sm font-medium">12/15</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Send 8 job offers</span>
                    <span className="text-sm font-medium">5/8</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Review 50 applications</span>
                    <span className="text-sm font-medium">43/50</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Insights */}
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
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500 p-1 mt-1">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Optimize Your Job Posts</p>
                      <p className="text-sm text-blue-700">Your "Senior Developer" posting could get 40% more applications with better keywords.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500 p-1 mt-1">
                      <Target className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900 mb-1">Great Hiring Pace</p>
                      <p className="text-sm text-green-700">You're hiring 23% faster than industry average. Keep up the momentum!</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-500 p-1 mt-1">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900 mb-1">Top Candidate Alert</p>
                      <p className="text-sm text-purple-700">3 candidates with 95%+ match scores are waiting for your review.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {
            isModalOpen("post-job-modal") && <EmployerJobMultistepForm modalId="post-job-modal"/>
        }
        {
            isModalOpen("schedule-interview-modal") && <InterviewScheduleMultiStepForm modalId="schedule-interview-modal"/>
        }
    </div>
  );
};

export default EmployerDashboard;