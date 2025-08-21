// <div className="flex items-center gap-2 mb-4">
//     <Calendar className="w-5 h-5 text-orange-600" />
//     <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
// </div>import React, { useState, useEffect } from 'react';
// import {
//     LayoutDashboard,
//     TrendingUp,
//     Users,
//     Calendar,
//     MessageSquare,
//     Briefcase,
//     Building2,
//     ChevronRight,
//     Plus,
//     Settings,
//     Bell,
//     Search,
//     Filter,
//     Download,
//     Eye,
//     Clock,
//     MapPin,
//     Star,
//     ChevronDown,
//     MoreVertical,
//     DollarSign,
//     Target,
//     Zap,
//     Award,
//     Globe,
//     UserCheck,
//     TrendingDown,
//     Activity,
//     BarChart3,
//     PieChart,
//
//     Mail,
//     Phone
// } from 'lucide-react';
//
// const GigHubEmployerDashboard = () => {
//     const [currentTime, setCurrentTime] = useState(new Date());
//     const [activeTab, setActiveTab] = useState('overview');
//     const [selectedPeriod, setSelectedPeriod] = useState('7d');
//
//     // Mock data - replace with real data
//     const metrics = {
//         totalJobs: 24,
//         activeJobs: 18,
//         totalApplications: 342,
//         newApplications: 28,
//         shortlisted: 45,
//         interviewed: 23,
//         hired: 8,
//         responseRate: 85,
//         averageTimeToHire: 14,
//         budgetSpent: 12500,
//         budgetTotal: 25000
//     };
//
//     const recentApplications = [
//         {
//             id: 1,
//             name: "Sarah Johnson",
//             position: "Senior React Developer",
//             avatar: "SJ",
//             skills: ["React", "TypeScript", "Node.js"],
//             experience: "5 years",
//             location: "Remote",
//             salary: "$95k - $120k",
//             appliedDate: "2 hours ago",
//             status: "new",
//             rating: 4.8
//         },
//         {
//             id: 2,
//             name: "Michael Chen",
//             position: "UI/UX Designer",
//             avatar: "MC",
//             skills: ["Figma", "Sketch", "Prototyping"],
//             experience: "3 years",
//             location: "San Francisco",
//             salary: "$75k - $95k",
//             appliedDate: "4 hours ago",
//             status: "reviewing",
//             rating: 4.6
//         },
//         {
//             id: 3,
//             name: "Emily Rodriguez",
//             position: "Product Manager",
//             avatar: "ER",
//             skills: ["Strategy", "Analytics", "Agile"],
//             experience: "7 years",
//             location: "New York",
//             salary: "$110k - $140k",
//             appliedDate: "1 day ago",
//             status: "shortlisted",
//             rating: 4.9
//         }
//     ];
//
//     const activeJobs = [
//         {
//             id: 1,
//             title: "Senior React Developer",
//             department: "Engineering",
//             posted: "3 days ago",
//             applications: 45,
//             views: 234,
//             status: "active",
//             urgency: "high",
//             salary: "$95k - $120k",
//             type: "Full-time"
//         },
//         {
//             id: 2,
//             title: "UI/UX Designer",
//             department: "Design",
//             posted: "1 week ago",
//             applications: 28,
//             views: 156,
//             status: "active",
//             urgency: "medium",
//             salary: "$75k - $95k",
//             type: "Contract"
//         },
//         {
//             id: 3,
//             title: "Product Manager",
//             department: "Product",
//             posted: "5 days ago",
//             applications: 32,
//             views: 189,
//             status: "paused",
//             urgency: "low",
//             salary: "$110k - $140k",
//             type: "Full-time"
//         }
//     ];
//
//     const upcomingInterviews = [
//         {
//             id: 1,
//             candidate: "Sarah Johnson",
//             position: "Senior React Developer",
//             time: "2:00 PM",
//             date: "Today",
//             type: "Technical",
//             duration: "1 hour",
//             interviewer: "John Smith"
//         },
//         {
//             id: 2,
//             candidate: "Michael Chen",
//             position: "UI/UX Designer",
//             time: "10:00 AM",
//             date: "Tomorrow",
//             type: "Portfolio Review",
//             duration: "45 min",
//             interviewer: "Lisa Wang"
//         }
//     ];
//
//     useEffect(() => {
//         const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//         return () => clearInterval(timer);
//     }, []);
//
//     const getStatusColor = (status) => {
//         switch(status) {
//             case 'new': return 'bg-blue-100 text-blue-800';
//             case 'reviewing': return 'bg-yellow-100 text-yellow-800';
//             case 'shortlisted': return 'bg-green-100 text-green-800';
//             case 'interviewed': return 'bg-purple-100 text-purple-800';
//             case 'hired': return 'bg-emerald-100 text-emerald-800';
//             case 'rejected': return 'bg-red-100 text-red-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };
//
//     const getUrgencyColor = (urgency) => {
//         switch(urgency) {
//             case 'high': return 'bg-red-500';
//             case 'medium': return 'bg-yellow-500';
//             case 'low': return 'bg-green-500';
//             default: return 'bg-gray-500';
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Top Navigation */}
//             <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
//                 <div className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         {/* Logo & Navigation */}
//                         <div className="flex items-center gap-8">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
//                                     <span className="text-white font-bold text-sm">GH</span>
//                                 </div>
//                                 <span className="text-xl font-bold text-gray-900">GigHub</span>
//                             </div>
//
//                             <nav className="hidden md:flex items-center gap-6">
//                                 <button
//                                     onClick={() => setActiveTab('overview')}
//                                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                         activeTab === 'overview' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                                     }`}
//                                 >
//                                     Overview
//                                 </button>
//                                 <button
//                                     onClick={() => setActiveTab('jobs')}
//                                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                         activeTab === 'jobs' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                                     }`}
//                                 >
//                                     Jobs
//                                 </button>
//                                 <button
//                                     onClick={() => setActiveTab('candidates')}
//                                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                         activeTab === 'candidates' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                                     }`}
//                                 >
//                                     Candidates
//                                 </button>
//                                 <button
//                                     onClick={() => setActiveTab('analytics')}
//                                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                         activeTab === 'analytics' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                                     }`}
//                                 >
//                                     Analytics
//                                 </button>
//                             </nav>
//                         </div>
//
//                         {/* Search & Actions */}
//                         <div className="flex items-center gap-4">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search candidates, jobs..."
//                                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                                 />
//                             </div>
//
//                             <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                 <Bell className="w-5 h-5" />
//                                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
//                             </button>
//
//                             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                 <Settings className="w-5 h-5" />
//                             </button>
//
//                             <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                                 TC
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Main Content */}
//             <div className="p-6">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                                 Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}, TechCorp! 👋
//                             </h1>
//                             <p className="text-gray-600">Here's what's happening with your hiring today.</p>
//                         </div>
//
//                         <div className="flex items-center gap-3">
//                             <select
//                                 value={selectedPeriod}
//                                 onChange={(e) => setSelectedPeriod(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             >
//                                 <option value="7d">Last 7 days</option>
//                                 <option value="30d">Last 30 days</option>
//                                 <option value="90d">Last 90 days</option>
//                             </select>
//
//                             <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
//                                 <Plus className="w-4 h-4" />
//                                 Post Job
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Key Metrics */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                                 <Briefcase className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.activeJobs}</h3>
//                         <p className="text-gray-600 text-sm">Active Jobs</p>
//                         <div className="mt-3 text-xs text-gray-500">{metrics.totalJobs} total positions</div>
//                     </div>
//
//                     <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-2 bg-green-100 rounded-lg">
//                                 <Users className="w-5 h-5 text-green-600" />
//                             </div>
//                             <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+{metrics.newApplications}</span>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalApplications}</h3>
//                         <p className="text-gray-600 text-sm">Total Applications</p>
//                         <div className="mt-3 text-xs text-gray-500">{metrics.newApplications} new this week</div>
//                     </div>
//
//                     <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-2 bg-purple-100 rounded-lg">
//                                 <UserCheck className="w-5 h-5 text-purple-600" />
//                             </div>
//                             <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{metrics.responseRate}%</span>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.hired}</h3>
//                         <p className="text-gray-600 text-sm">Successful Hires</p>
//                         <div className="mt-3 text-xs text-gray-500">Avg. {metrics.averageTimeToHire} days to hire</div>
//                     </div>
//
//                     <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-2 bg-orange-100 rounded-lg">
//                                 <DollarSign className="w-5 h-5 text-orange-600" />
//                             </div>
//                             <span className="text-xs text-gray-600">{Math.round((metrics.budgetSpent/metrics.budgetTotal)*100)}% used</span>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">${(metrics.budgetSpent/1000).toFixed(1)}k</h3>
//                         <p className="text-gray-600 text-sm">Recruitment Spend</p>
//                         <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
//                             <div className="bg-orange-500 h-2 rounded-full" style={{width: `${(metrics.budgetSpent/metrics.budgetTotal)*100}%`}}></div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Main Dashboard Grid */}
//                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//                     {/* Left Column - Main Content */}
//                     <div className="xl:col-span-2 space-y-8">
//                         {/* Recent Applications */}
//                         <div className="bg-white rounded-xl border border-gray-200">
//                             <div className="p-6 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 bg-blue-100 rounded-lg">
//                                             <Users className="w-5 h-5 text-blue-600" />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
//                                             <p className="text-sm text-gray-600">{metrics.newApplications} new applications this week</p>
//                                         </div>
//                                     </div>
//                                     <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
//                                         View all
//                                         <ChevronRight className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </div>
//
//                             <div className="p-6">
//                                 <div className="space-y-4">
//                                     {recentApplications.map((application) => (
//                                         <div key={application.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
//                                             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                                                 {application.avatar}
//                                             </div>
//
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center gap-2 mb-1">
//                                                     <h3 className="font-medium text-gray-900 truncate">{application.name}</h3>
//                                                     <div className="flex items-center gap-1">
//                                                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                                                         <span className="text-sm text-gray-600">{application.rating}</span>
//                                                     </div>
//                                                 </div>
//                                                 <p className="text-sm text-gray-600 mb-2">{application.position}</p>
//                                                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                               {application.experience}
//                           </span>
//                                                     <span className="flex items-center gap-1">
//                             <MapPin className="w-3 h-3" />
//                                                         {application.location}
//                           </span>
//                                                     <span className="flex items-center gap-1">
//                             <DollarSign className="w-3 h-3" />
//                                                         {application.salary}
//                           </span>
//                                                 </div>
//                                             </div>
//
//                                             <div className="flex items-center gap-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
//                           {application.status}
//                         </span>
//                                                 <span className="text-xs text-gray-500">{application.appliedDate}</span>
//                                                 <button className="p-1 text-gray-400 hover:text-gray-600">
//                                                     <MoreVertical className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Active Jobs */}
//                         <div className="bg-white rounded-xl border border-gray-200">
//                             <div className="p-6 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 bg-green-100 rounded-lg">
//                                             <Briefcase className="w-5 h-5 text-green-600" />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
//                                             <p className="text-sm text-gray-600">{metrics.activeJobs} active positions</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
//                                             <Filter className="w-4 h-4" />
//                                         </button>
//                                         <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
//                                             Manage all
//                                             <ChevronRight className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="p-6">
//                                 <div className="space-y-4">
//                                     {activeJobs.map((job) => (
//                                         <div key={job.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                             <div className={`w-3 h-3 rounded-full ${getUrgencyColor(job.urgency)}`}></div>
//
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center gap-2 mb-1">
//                                                     <h3 className="font-medium text-gray-900">{job.title}</h3>
//                                                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{job.type}</span>
//                                                 </div>
//                                                 <p className="text-sm text-gray-600 mb-2">{job.department} • {job.salary}</p>
//                                                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                                                     <span>Posted {job.posted}</span>
//                                                     <span className="flex items-center gap-1">
//                             <Users className="w-3 h-3" />
//                                                         {job.applications} applications
//                           </span>
//                                                     <span className="flex items-center gap-1">
//                             <Eye className="w-3 h-3" />
//                                                         {job.views} views
//                           </span>
//                                                 </div>
//                                             </div>
//
//                                             <div className="flex items-center gap-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {job.status}
//                         </span>
//                                                 <button className="p-1 text-gray-400 hover:text-gray-600">
//                                                     <MoreVertical className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Right Column - Sidebar */}
//                     <div className="space-y-6">
//                         {/* Quick Actions */}
//                         <div className="bg-white rounded-xl border border-gray-200 p-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//                             <div className="space-y-3">
//                                 <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <Plus className="w-4 h-4 text-blue-600" />
//                                     </div>
//                                     <div>
//                                         <p className="font-medium text-gray-900">Post New Job</p>
//                                         <p className="text-sm text-gray-600">Create a job posting</p>
//                                     </div>
//                                 </button>
//
//                                 <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                     <div className="p-2 bg-green-100 rounded-lg">
//                                         <Search className="w-4 h-4 text-green-600" />
//                                     </div>
//                                     <div>
//                                         <p className="font-medium text-gray-900">Browse Talent</p>
//                                         <p className="text-sm text-gray-600">Find candidates</p>
//                                     </div>
//                                 </button>
//
//                                 <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                     <div className="p-2 bg-purple-100 rounded-lg">
//                                         <BarChart3 className="w-4 h-4 text-purple-600" />
//                                     </div>
//                                     <div>
//                                         <p className="font-medium text-gray-900">View Analytics</p>
//                                         <p className="text-sm text-gray-600">Performance insights</p>
//                                     </div>
//                                 </button>
//                             </div>
//                         </div>
//
//                         {/* Upcoming Interviews */}
//                         <div className="bg-white rounded-xl border border-gray-200 p-6">
//                             <div className="flex items-center gap-2 mb-4">
//                                 <CalendarIcon className="w-5 h-5 text-orange-600" />
//                                 <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
//                             </div>
//
//                             <div className="space-y-3">
//                                 {upcomingInterviews.map((interview) => (
//                                     <div key={interview.id} className="p-3 border border-gray-200 rounded-lg">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <p className="font-medium text-gray-900 text-sm">{interview.candidate}</p>
//                                             <span className="text-xs text-gray-500">{interview.duration}</span>
//                                         </div>
//                                         <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
//                                         <div className="flex items-center justify-between text-xs text-gray-500">
//                                             <span>{interview.date} at {interview.time}</span>
//                                             <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{interview.type}</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//
//                             <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
//                                 View calendar
//                             </button>
//                         </div>
//
//                         {/* Recent Activity */}
//                         <div className="bg-white rounded-xl border border-gray-200 p-6">
//                             <div className="flex items-center gap-2 mb-4">
//                                 <Activity className="w-5 h-5 text-purple-600" />
//                                 <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//                             </div>
//
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                     <div className="text-sm">
//                                         <p className="text-gray-900">New application received</p>
//                                         <p className="text-gray-500">Sarah Johnson applied for Senior Developer</p>
//                                         <p className="text-gray-400 text-xs">2 hours ago</p>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <div className="text-sm">
//                                         <p className="text-gray-900">Interview scheduled</p>
//                                         <p className="text-gray-500">Michael Chen - UI/UX Designer</p>
//                                         <p className="text-gray-400 text-xs">4 hours ago</p>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                                     <div className="text-sm">
//                                         <p className="text-gray-900">Job posting published</p>
//                                         <p className="text-gray-500">Frontend Engineer position</p>
//                                         <p className="text-gray-400 text-xs">1 day ago</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Performance Tip */}
//                         <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
//                             <div className="flex items-center gap-2 mb-3">
//                                 <Zap className="w-5 h-5 text-purple-600" />
//                                 <h3 className="font-semibold text-gray-900">Performance Tip</h3>
//                             </div>
//                             <p className="text-sm text-gray-700 mb-3">
//                                 Your response rate to applications is 85%. Responding within 24 hours can increase candidate engagement by up to 40%.
//                             </p>
//                             <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
//                                 Learn more →
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default GigHubEmployerDashboard;