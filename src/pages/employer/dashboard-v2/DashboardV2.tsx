// import React, { useState, useEffect } from 'react';
// import {
//   LayoutDashboard,
//   TrendingUp,
//   Users,
//   Calendar,
//   MessageSquare,
//   Briefcase,
//   Building2,
//   ChevronRight,
//   Plus,
//   Settings,
//   Bell,
//   Search,
//   Filter,
//   Download,
//   Eye,
//   Clock,
//   MapPin,
//   Star,
//   ChevronDown,
//   MoreVertical,
//   DollarSign,
//   Target,
//   Zap,
//   Award,
//   Globe,
//   UserCheck,
//   TrendingDown,
//   Activity,
//   BarChart3,
//   PieChart,
//   Phone,
//   Mail,
//   Edit3,
//   Save,
//   CheckCircle2
// } from 'lucide-react';
//
// // Import our created components (in real implementation, these would be separate files)
// // For this demo, I'll include simplified versions inline
//
// const ApplicationStats = () => {
//   const [metrics] = useState({
//     activeJobs: 18,
//     totalApplications: 342,
//     successfulHires: 8,
//     recruitmentSpend: 12500,
//     budgetTotal: 25000
//   });
//
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-2 bg-blue-100 rounded-lg">
//             <Briefcase className="w-5 h-5 text-blue-600" />
//           </div>
//           <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.activeJobs}</h3>
//         <p className="text-gray-600 text-sm">Active Jobs</p>
//         <div className="mt-3 text-xs text-gray-500">24 total positions</div>
//       </div>
//
//       <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-2 bg-green-100 rounded-lg">
//             <Users className="w-5 h-5 text-green-600" />
//           </div>
//           <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+28</span>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalApplications}</h3>
//         <p className="text-gray-600 text-sm">Total Applications</p>
//         <div className="mt-3 text-xs text-gray-500">28 new this week</div>
//       </div>
//
//       <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-2 bg-purple-100 rounded-lg">
//             <UserCheck className="w-5 h-5 text-purple-600" />
//           </div>
//           <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">85%</span>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.successfulHires}</h3>
//         <p className="text-gray-600 text-sm">Successful Hires</p>
//         <div className="mt-3 text-xs text-gray-500">Avg. 14 days to hire</div>
//       </div>
//
//       <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-2 bg-orange-100 rounded-lg">
//             <DollarSign className="w-5 h-5 text-orange-600" />
//           </div>
//           <span className="text-xs text-gray-600">{Math.round((metrics.recruitmentSpend/metrics.budgetTotal)*100)}% used</span>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-1">${(metrics.recruitmentSpend/1000).toFixed(1)}k</h3>
//         <p className="text-gray-600 text-sm">Recruitment Spend</p>
//         <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
//           <div className="bg-orange-500 h-2 rounded-full" style={{width: `${(metrics.recruitmentSpend/metrics.budgetTotal)*100}%`}}></div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// const BelowJobStats = () => {
//   const jobs = [
//     {
//       title: "Senior React Developer",
//       department: "Engineering",
//       applications: 45,
//       views: 234,
//       conversionRate: 19.2,
//       status: "active",
//       salary: "$95k - $120k"
//     },
//     {
//       title: "Product Manager",
//       department: "Product",
//       applications: 32,
//       views: 189,
//       conversionRate: 16.9,
//       status: "active",
//       salary: "$110k - $140k"
//     },
//     {
//       title: "UI/UX Designer",
//       department: "Design",
//       applications: 28,
//       views: 156,
//       conversionRate: 17.9,
//       status: "active",
//       salary: "$75k - $95k"
//     }
//   ];
//
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-green-100 rounded-lg">
//             <Briefcase className="w-5 h-5 text-green-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
//             <p className="text-sm text-gray-600">18 active positions</p>
//           </div>
//         </div>
//         <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
//           View all
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//
//       <div className="space-y-4">
//         {jobs.map((job, index) => (
//           <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//
//             <div className="flex-1 min-w-0">
//               <h3 className="font-medium text-gray-900">{job.title}</h3>
//               <p className="text-sm text-gray-600 mb-2">{job.department} • {job.salary}</p>
//               <div className="flex items-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <Users className="w-3 h-3" />
//                   {job.applications} applications
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Eye className="w-3 h-3" />
//                   {job.views} views
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Target className="w-3 h-3" />
//                   {job.conversionRate}% conversion
//                 </span>
//               </div>
//             </div>
//
//             <button className="p-1 text-gray-400 hover:text-gray-600">
//               <MoreVertical className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// const ApplicantRecentApplications = () => {
//   const applications = [
//     {
//       name: "Sarah Johnson",
//       avatar: "SJ",
//       position: "Senior React Developer",
//       location: "Remote",
//       salary: "$95k - $120k",
//       appliedDate: "2 hours ago",
//       status: "new",
//       rating: 4.8,
//       skills: ["React", "TypeScript", "Node.js"]
//     },
//     {
//       name: "Michael Chen",
//       avatar: "MC",
//       position: "UI/UX Designer",
//       location: "San Francisco",
//       salary: "$75k - $95k",
//       appliedDate: "4 hours ago",
//       status: "reviewing",
//       rating: 4.6,
//       skills: ["Figma", "Sketch", "Prototyping"]
//     },
//     {
//       name: "Emily Rodriguez",
//       avatar: "ER",
//       position: "Product Manager",
//       location: "New York",
//       salary: "$110k - $140k",
//       appliedDate: "1 day ago",
//       status: "shortlisted",
//       rating: 4.9,
//       skills: ["Strategy", "Analytics", "Agile"]
//     }
//   ];
//
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'new': return 'bg-blue-100 text-blue-800';
//       case 'reviewing': return 'bg-yellow-100 text-yellow-800';
//       case 'shortlisted': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };
//
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-100 rounded-lg">
//             <Users className="w-5 h-5 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
//             <p className="text-sm text-gray-600">28 new applications this week</p>
//           </div>
//         </div>
//         <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
//           View all
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//
//       <div className="space-y-4">
//         {applications.map((application, index) => (
//           <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
//             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//               {application.avatar}
//             </div>
//
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="font-medium text-gray-900 truncate">{application.name}</h3>
//                 <div className="flex items-center gap-1">
//                   <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                   <span className="text-sm text-gray-600">{application.rating}</span>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mb-2">{application.position}</p>
//               <div className="flex items-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <MapPin className="w-3 h-3" />
//                   {application.location}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <DollarSign className="w-3 h-3" />
//                   {application.salary}
//                 </span>
//               </div>
//             </div>
//
//             <div className="flex items-center gap-3">
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
//                 {application.status}
//               </span>
//               <span className="text-xs text-gray-500">{application.appliedDate}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// const ApplicantSchedules = () => {
//   const interviews = [
//     {
//       candidate: "Sarah Johnson",
//       position: "Senior React Developer",
//       time: "2:00 PM",
//       date: "Today",
//       type: "Technical",
//       duration: "1 hour"
//     },
//     {
//       candidate: "Michael Chen",
//       position: "UI/UX Designer",
//       time: "10:00 AM",
//       date: "Tomorrow",
//       type: "Portfolio Review",
//       duration: "45 min"
//     }
//   ];
//
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <Calendar className="w-5 h-5 text-orange-600" />
//         <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
//       </div>
//
//       <div className="space-y-3">
//         {interviews.map((interview, index) => (
//           <div key={index} className="p-3 border border-gray-200 rounded-lg">
//             <div className="flex items-center justify-between mb-2">
//               <p className="font-medium text-gray-900 text-sm">{interview.candidate}</p>
//               <span className="text-xs text-gray-500">{interview.duration}</span>
//             </div>
//             <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
//             <div className="flex items-center justify-between text-xs text-gray-500">
//               <span>{interview.date} at {interview.time}</span>
//               <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{interview.type}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//
//       <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
//         View calendar
//       </button>
//     </div>
//   );
// };
//
// const ApplicantMessages = () => {
//   const conversations = [
//     {
//       name: "Sarah Johnson",
//       avatar: "SJ",
//       lastMessage: "Thank you for the interview opportunity!",
//       time: "2m ago",
//       unread: true
//     },
//     {
//       name: "Michael Chen",
//       avatar: "MC",
//       lastMessage: "I've uploaded my portfolio case studies.",
//       time: "1h ago",
//       unread: false
//     },
//     {
//       name: "Emily Rodriguez",
//       avatar: "ER",
//       lastMessage: "Can we reschedule our meeting?",
//       time: "1d ago",
//       unread: true
//     }
//   ];
//
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <MessageSquare className="w-5 h-5 text-pink-600" />
//         <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
//       </div>
//
//       <div className="space-y-3">
//         {conversations.map((conversation, index) => (
//           <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
//                 {conversation.avatar}
//               </div>
//               {conversation.unread && (
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//               )}
//             </div>
//
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between mb-1">
//                 <h4 className="font-medium text-gray-900 text-sm truncate">{conversation.name}</h4>
//                 <span className="text-xs text-gray-500">{conversation.time}</span>
//               </div>
//               <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
//                 {conversation.lastMessage}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//
//       <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
//         View all messages
//       </button>
//     </div>
//   );
// };
//
// const GigHubEmployerDashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [activeTab, setActiveTab] = useState('overview');
//   const [selectedPeriod, setSelectedPeriod] = useState('7d');
//
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);
//
//   const quickActions = [
//     {
//       title: "Post New Job",
//       description: "Create a new job posting",
//       icon: Plus,
//       color: "bg-blue-500 hover:bg-blue-600"
//     },
//     {
//       title: "View Applications",
//       description: "Review candidate applications",
//       icon: Users,
//       color: "bg-green-500 hover:bg-green-600"
//     },
//     {
//       title: "Schedule Interview",
//       description: "Schedule interviews with candidates",
//       icon: Calendar,
//       color: "bg-purple-500 hover:bg-purple-600"
//     },
//     {
//       title: "Company Profile",
//       description: "Update company information",
//       icon: Building2,
//       color: "bg-orange-500 hover:bg-orange-600"
//     }
//   ];
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Logo & Navigation */}
//             <div className="flex items-center gap-8">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">GH</span>
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">GigHub</span>
//               </div>
//
//               <nav className="hidden md:flex items-center gap-6">
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === 'overview' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('jobs')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === 'jobs' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Jobs
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('candidates')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === 'candidates' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Candidates
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('analytics')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === 'analytics' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Analytics
//                 </button>
//               </nav>
//             </div>
//
//             {/* Search & Actions */}
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search candidates, jobs..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
//
//               <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
//               </button>
//
//               <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Settings className="w-5 h-5" />
//               </button>
//
//               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                 TC
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Main Content */}
//       <div className="p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}, TechCorp! 👋
//               </h1>
//               <p className="text-gray-600">Here's what's happening with your hiring today.</p>
//             </div>
//
//             <div className="flex items-center gap-3">
//               <select
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//               >
//                 <option value="7d">Last 7 days</option>
//                 <option value="30d">Last 30 days</option>
//                 <option value="90d">Last 90 days</option>
//               </select>
//
//               <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
//                 <Plus className="w-4 h-4" />
//                 Post Job
//               </button>
//             </div>
//           </div>
//         </div>
//
//         {/* Quick Actions Bar */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
//             <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
//               View all
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {quickActions.map((action, index) => {
//               const IconComponent = action.icon;
//               return (
//                 <button
//                   key={index}
//                   className="group p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 text-left"
//                 >
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className={`p-2 rounded-lg ${action.color} transition-colors duration-200`}>
//                       <IconComponent className="w-4 h-4 text-white" />
//                     </div>
//                     <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
//                   </div>
//                   <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
//                     {action.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {action.description}
//                   </p>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//
//         {/* Key Metrics */}
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <BarChart3 className="w-5 h-5 text-blue-600" />
//             <h2 className="text-lg font-semibold text-gray-900">Application Analytics</h2>
//           </div>
//           <ApplicationStats />
//         </div>
//
//         {/* Main Dashboard Grid */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Left Column - Main Content */}
//           <div className="xl:col-span-2 space-y-8">
//             <BelowJobStats />
//             <ApplicantRecentApplications />
//           </div>
//
//           {/* Right Column - Sidebar */}
//           <div className="space-y-6">
//             <ApplicantSchedules />
//             <ApplicantMessages />
//
//             {/* Performance Tip */}
//             <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
//               <div className="flex items-center gap-2 mb-3">
//                 <Zap className="w-5 h-5 text-purple-600" />
//                 <h3 className="font-semibold text-gray-900">Performance Tip</h3>
//               </div>
//               <p className="text-sm text-gray-700 mb-3">
//                 Your response rate to applications is 85%. Responding within 24 hours can increase candidate engagement by up to 40%.
//               </p>
//               <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
//                 Learn more →
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default GigHubEmployerDashboard;
