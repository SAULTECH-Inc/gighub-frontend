import { useState } from "react";
import {
  AlertTriangle,
  Award,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  Mail,
  MessageCircle,
  PlayCircle,
  Search,
  TrendingUp,
  XCircle
} from "lucide-react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile } from "../../utils/constants.ts";

interface Assessment{
  id: number;
  jobTitle: string;
  company: string;
  status: 'not_taken' | 'partially_completed' | 'passed' | 'failed' | 'expired';
  dueDate: Date;
  assignedDate: Date;
  completedDate?: Date;
  duration: number; // in minutes
  tests: string[];
  progress: number; // percentage 0-100
  score?: number | null;
  urgency: 'low' | 'medium' | 'high'; // based on due date proximity
}


interface StatusConfig{
  label: string;
  color: string;
  icon: JSX.Element;
}
const ApplicantAssessmentPage = () => {
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment>();
  const [reminderSettings, setReminderSettings] = useState({
    email: true,
    push: true,
    whatsapp: false
  });

  const assessments: Assessment[] = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'not_taken',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      tests: ['React Advanced', 'JavaScript Fundamentals', 'System Design'],
      progress: 0,
      urgency: 'high'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'StartupHub',
      status: 'partially_completed',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      duration: 120,
      tests: ['Node.js Assessment', 'Database Design', 'API Development'],
      progress: 66,
      score: null,
      urgency: 'medium'
    },
    {
      id: 3,
      jobTitle: 'UI/UX Designer',
      company: 'DesignWorks',
      status: 'passed',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      duration: 60,
      tests: ['Design Thinking', 'Figma Skills'],
      progress: 100,
      score: 87,
      urgency: 'low'
    },
    {
      id: 4,
      jobTitle: 'Backend Developer',
      company: 'CloudSystems',
      status: 'failed',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      duration: 75,
      tests: ['Python Advanced', 'System Architecture'],
      progress: 100,
      score: 58,
      urgency: 'low'
    },
    {
      id: 5,
      jobTitle: 'Product Manager',
      company: 'InnovateLabs',
      status: 'expired',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      duration: 45,
      tests: ['Product Strategy', 'Market Analysis'],
      progress: 0,
      urgency: 'low'
    },
    {
      id: 6,
      jobTitle: 'DevOps Engineer',
      company: 'ScaleOps',
      status: 'not_taken',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      assignedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      duration: 90,
      tests: ['Docker & Kubernetes', 'CI/CD Pipeline', 'Cloud Infrastructure'],
      progress: 0,
      urgency: 'high'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: StatusConfig } = {
      not_taken: {
        label: 'Not Started',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <PlayCircle size={16} />
      },
      partially_completed: {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <Clock size={16} />
      },
      passed: {
        label: 'Passed',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <CheckCircle size={16} />
      },
      failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: <XCircle size={16} />
      },
      expired: {
        label: 'Expired',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: <AlertTriangle size={16} />
      }
    };
    return configs[status] || configs.not_taken;
  };

  const getDaysRemaining = (dueDate: Date): number => {
    const now = new Date().getTime();
    const due = dueDate.getTime();
    const diffInMs = due - now;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };


  const getUrgencyColor = (urgency: string) => {
    return urgency === 'high' ? 'text-red-600' : urgency === 'medium' ? 'text-orange-600' : 'text-gray-600';
  };

  const sortAssessments = (assessments: Assessment[]) => {
    let sorted = [...assessments];

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.assignedDate.getTime() - a.assignedDate.getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => a.assignedDate.getTime() - b.assignedDate.getTime());
        break;
      case 'deadline':
        sorted.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
        break;
      case 'score':
        sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      default:
        break;
    }

    if (filterStatus !== 'all') {
      sorted = sorted.filter(a => a.status === filterStatus);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      sorted = sorted.filter(
        a =>
          a.jobTitle.toLowerCase().includes(lower) ||
          a.company.toLowerCase().includes(lower)
      );
    }

    return sorted;
  };


  const getStats = () => {
    return {
      total: assessments.length,
      pending: assessments.filter(a => a.status === 'not_taken' || a.status === 'partially_completed').length,
      passed: assessments.filter(a => a.status === 'passed').length,
      avgScore: Math.round(assessments.filter(a => a.score).reduce((sum, a) => sum + (a?.score || 0), 0) / assessments.filter(a => a.score).length) || 0
    };
  };

  const stats = getStats();
  const sortedAssessments = sortAssessments(assessments);

  const ReminderModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-[#222222] mb-4">Set Reminder</h3>
        <p className="text-sm text-gray-600 mb-6">
          Choose how you'd like to be reminded about: <strong>{selectedAssessment?.jobTitle}</strong>
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={reminderSettings.email}
              onChange={(e) => setReminderSettings({...reminderSettings, email: e.target.checked})}
              className="w-5 h-5 text-[#6A0DAD] rounded focus:ring-[#6A0DAD]"
            />
            <Mail className="text-[#6A0DAD]" size={20} />
            <div className="flex-1">
              <div className="font-medium text-[#222222]">Email Reminder</div>
              <div className="text-xs text-gray-600">Get reminders via email</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={reminderSettings.push}
              onChange={(e) => setReminderSettings({...reminderSettings, push: e.target.checked})}
              className="w-5 h-5 text-[#6A0DAD] rounded focus:ring-[#6A0DAD]"
            />
            <Bell className="text-[#6A0DAD]" size={20} />
            <div className="flex-1">
              <div className="font-medium text-[#222222]">Push Notification</div>
              <div className="text-xs text-gray-600">Get push notifications on your device</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={reminderSettings.whatsapp}
              onChange={(e) => setReminderSettings({...reminderSettings, whatsapp: e.target.checked})}
              className="w-5 h-5 text-[#6A0DAD] rounded focus:ring-[#6A0DAD]"
            />
            <MessageCircle className="text-[#6A0DAD]" size={20} />
            <div className="flex-1">
              <div className="font-medium text-[#222222]">WhatsApp</div>
              <div className="text-xs text-gray-600">Get reminders on WhatsApp</div>
            </div>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Default reminders will be sent 3 days, 1 day, and 3 hours before the deadline.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowReminderModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Reminder settings saved!');
              setShowReminderModal(false);
            }}
            className="flex-1 px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">My Assessments</h1>
          <p className="text-gray-600">Track and complete your job assessments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Assessments</span>
              <Award className="text-[#6A0DAD]" size={20} />
            </div>
            <div className="text-3xl font-bold text-[#222222]">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <Clock className="text-orange-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Passed</span>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.passed}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Average Score</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.avgScore}%</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] appearance-none bg-white cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="deadline">By Deadline</option>
                  <option value="score">By Score</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="not_taken">Not Started</option>
                  <option value="partially_completed">In Progress</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {sortedAssessments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No assessments found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            sortedAssessments.map(assessment => {
              const statusConfig = getStatusConfig(assessment.status);
              const daysRemaining = getDaysRemaining(assessment.dueDate);
              const isUrgent = daysRemaining <= 2 && assessment.status !== 'passed' && assessment.status !== 'failed' && assessment.status !== 'expired';

              return (
                <div
                  key={assessment.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                    isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#222222]">{assessment.jobTitle}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                          {isUrgent && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                              <AlertTriangle size={14} />
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{assessment.company}</p>
                      </div>

                      {assessment.score !== null && assessment.score !== undefined && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-[#6A0DAD]">{assessment.score}%</div>
                          <div className="text-xs text-gray-600">Score</div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {assessment.progress > 0 && assessment.progress < 100 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-[#6A0DAD]">{assessment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#6A0DAD] h-2 rounded-full transition-all"
                            style={{ width: `${assessment.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Test Details */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Includes:</div>
                      <div className="flex flex-wrap gap-2">
                        {assessment.tests.map((test, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-50 text-[#6438c2] rounded-full text-xs font-medium">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="text-gray-400" size={16} />
                        <span className="text-gray-600">{assessment.duration} mins</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="text-gray-400" size={16} />
                        <span className={`${
                          assessment.status === 'not_taken' || assessment.status === 'partially_completed'
                            ? getUrgencyColor(assessment.urgency)
                            : 'text-gray-600'
                        }`}>
                          {assessment.status === 'not_taken' || assessment.status === 'partially_completed'
                            ? `${daysRemaining > 0 ? `${daysRemaining}d left` : 'Due today'}`
                            : assessment.completedDate
                              ? `Completed ${Math.ceil((new Date().getTime() - assessment.completedDate.getTime()) / (1000 * 60 * 60 * 24))}d ago`
                              : `Expired ${Math.abs(daysRemaining)}d ago`
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Assigned: {Math.ceil((new Date().getTime() - assessment.assignedDate.getTime()) / (1000 * 60 * 60 * 24))}d ago</span>
                      </div>

                      {assessment.status === 'not_taken' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Due: {assessment.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      {(assessment.status === 'not_taken' || assessment.status === 'partially_completed') && (
                        <>
                          <button
                            onClick={() => alert(`Starting assessment: ${assessment.jobTitle}`)}
                            className="px-6 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] transition-colors font-medium inline-flex items-center gap-2"
                          >
                            <PlayCircle size={18} />
                            {assessment.status === 'partially_completed' ? 'Continue' : 'Start'} Assessment
                          </button>

                          <button
                            onClick={() => {
                              setSelectedAssessment(assessment);
                              setShowReminderModal(true);
                            }}
                            className="px-6 py-2 border border-[#6A0DAD] text-[#6A0DAD] rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center gap-2"
                          >
                            <Bell size={18} />
                            Set Reminder
                          </button>
                        </>
                      )}

                      {(assessment.status === 'passed' || assessment.status === 'failed') && (
                        <button
                          onClick={() => alert(`Viewing results for: ${assessment.jobTitle}`)}
                          className="px-6 py-2 border border-[#6A0DAD] text-[#6A0DAD] rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View Results
                        </button>
                      )}

                      {assessment.status === 'expired' && (
                        <span className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium inline-flex items-center gap-2">
                          <AlertTriangle size={18} />
                          Assessment Expired
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Urgent Banner */}
                  {isUrgent && (
                    <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={20} />
                        <span className="font-medium">
                          {daysRemaining === 0 ? 'Due today!' : `Only ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining!`}
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Starting urgent assessment: ${assessment.jobTitle}`)}
                        className="px-4 py-1 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                      >
                        Take Now
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && <ReminderModal />}
    </div>
  );
};

export default ApplicantAssessmentPage;
