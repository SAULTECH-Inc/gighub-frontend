// import React, { useState, useEffect } from 'react';
// import {
//   Briefcase,
//   TrendingUp,
//   TrendingDown,
//   Eye,
//   Users,
//   Clock,
//   MapPin,
//   DollarSign,
//   Filter,
//   MoreVertical,
//   Calendar,
//   Target,
//   Zap,
//   AlertCircle,
//   CheckCircle,
//   Pause,
//   Play,
//   Edit,
//   BarChart3,
//   PieChart,
//   Activity
// } from 'lucide-react';
//
// // Mock data for job performance
// const mockJobStats = {
//   topPerformingJobs: [
//     {
//       id: 1,
//       title: "Senior React Developer",
//       department: "Engineering",
//       posted: "3 days ago",
//       applications: 45,
//       views: 234,
//       conversionRate: 19.2,
//       status: "active",
//       urgency: "high",
//       salary: "$95k - $120k",
//       location: "Remote",
//       type: "Full-time",
//       applicationsToday: 8,
//       trend: "up"
//     },
//     {
//       id: 2,
//       title: "Product Manager",
//       department: "Product",
//       posted: "5 days ago",
//       applications: 32,
//       views: 189,
//       conversionRate: 16.9,
//       status: "active",
//       urgency: "medium",
//       salary: "$110k - $140k",
//       location: "San Francisco",
//       type: "Full-time",
//       applicationsToday: 3,
//       trend: "up"
//     },
//     {
//       id: 3,
//       title: "UI/UX Designer",
//       department: "Design",
//       posted: "1 week ago",
//       applications: 28,
//       views: 156,
//       conversionRate: 17.9,
//       status: "active",
//       urgency: "low",
//       salary: "$75k - $95k",
//       location: "New York",
//       type: "Contract",
//       applicationsToday: 2,
//       trend: "down"
//     },
//     {
//       id: 4,
//       title: "DevOps Engineer",
//       department: "Engineering",
//       posted: "2 weeks ago",
//       applications: 15,
//       views: 98,
//       conversionRate: 15.3,
//       status: "paused",
//       urgency: "low",
//       salary: "$85k - $110k",
//       location: "Remote",
//       type: "Full-time",
//       applicationsToday: 0,
//       trend: "stable"
//     }
//   ],
//   hiringPipeline: {
//     applied: 342,
//     screening: 89,
//     interviewed: 45,
//     offered: 12,
//     hired: 8
//   },
//   jobTypeDistribution: {
//     fullTime: 68,
//     contract: 22,
//     partTime: 10
//   },
//   locationStats: {
//     remote: 45,
//     onsite: 35,
//     hybrid: 20
//   }
// };
//
// const BelowJobStats = () => {
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('applications');
//   const [isLoading, setIsLoading] = useState(true);
//   const [jobStats, setJobStats] = useState(mockJobStats);
//
//   useEffect(() => {
//     // Simulate API loading
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//
//     return () => clearTimeout(timer);
//   }, []);
//
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'paused': return 'bg-yellow-100 text-yellow-800';
//       case 'closed': return 'bg-gray-100 text-gray-800';
//       case 'draft': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };
//
//   const getUrgencyColor = (urgency) => {
//     switch(urgency) {
//       case 'high': return 'bg-red-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'low': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };
//
//   const getTrendIcon = (trend) => {
//     switch(trend) {
//       case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
//       case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
//       default: return <Activity className="w-4 h-4 text-gray-600" />;
//     }
//   };
//
//   const JobCard = ({ job }) => (
//     <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-start gap-3">
//           <div className={`w-3 h-3 rounded-full mt-2 ${getUrgencyColor(job.urgency)}`}></div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
//               {job.title}
//             </h3>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="text-sm text-gray-600">{job.department}</span>
//               <span className="text-xs text-gray-400">•</span>
//               <span className="text-xs text-gray-500">{job.type}</span>
//             </div>
//           </div>
//         </div>
//
//         <div className="flex items-center gap-2">
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
//             {job.status}
//           </span>
//           <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all">
//             <MoreVertical className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//
//       {/* Job Details */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <MapPin className="w-4 h-4" />
//           <span>{job.location}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <DollarSign className="w-4 h-4" />
//           <span>{job.salary}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Clock className="w-4 h-4" />
//           <span>Posted {job.posted}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           {getTrendIcon(job.trend)}
//           <span>{job.applicationsToday} today</span>
//         </div>
//       </div>
//
//       {/* Performance Metrics */}
//       <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 mb-1">
//             <Users className="w-4 h-4 text-blue-600" />
//             <span className="text-xl font-bold text-gray-900">{job.applications}</span>
//           </div>
//           <p className="text-xs text-gray-600">Applications</p>
//         </div>
//
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 mb-1">
//             <Eye className="w-4 h-4 text-green-600" />
//             <span className="text-xl font-bold text-gray-900">{job.views}</span>
//           </div>
//           <p className="text-xs text-gray-600">Views</p>
//         </div>
//
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 mb-1">
//             <Target className="w-4 h-4 text-purple-600" />
//             <span className="text-xl font-bold text-gray-900">{job.conversionRate}%</span>
//           </div>
//           <p className="text-xs text-gray-600">Conversion</p>
//         </div>
//       </div>
//
//       {/* Quick Actions */}
//       <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
//         <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
//           <Eye className="w-4 h-4" />
//           View Details
//         </button>
//         <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//           <Edit className="w-4 h-4" />
//         </button>
//         <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//           {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//         </button>
//       </div>
//     </div>
//   );
//
//   const PipelineStage = ({ stage, count, percentage, isLast }) => (
//     <div className="flex-1">
//       <div className="text-center">
//         <div className="relative">
//           <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//             {count}
//           </div>
//           {!isLast && (
//             <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2">
//               <div
//                 className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
//                 style={{ width: `${percentage}%` }}
//               ></div>
//             </div>
//           )}
//         </div>
//         <h4 className="font-medium text-gray-900 mt-3 capitalize">{stage}</h4>
//         <p className="text-sm text-gray-600">{percentage}% of total</p>
//       </div>
//     </div>
//   );
//
//   if (isLoading) {
//     return (
//       <div className="w-full space-y-6">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
//           <div className="space-y-2">
//             <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
//             <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
//           </div>
//         </div>
//
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
//               <div className="space-y-4">
//                 <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
//                   <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="w-full space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-green-100 rounded-lg">
//             <Briefcase className="w-5 h-5 text-green-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Job Performance</h2>
//             <p className="text-sm text-gray-600">Detailed analytics for your active job postings</p>
//           </div>
//         </div>
//
//         <div className="flex items-center gap-3">
//           <select
//             value={selectedFilter}
//             onChange={(e) => setSelectedFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="all">All Jobs</option>
//             <option value="active">Active Only</option>
//             <option value="high-urgency">High Urgency</option>
//             <option value="recent">Recently Posted</option>
//           </select>
//
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="applications">By Applications</option>
//             <option value="views">By Views</option>
//             <option value="conversion">By Conversion Rate</option>
//             <option value="recent">By Date Posted</option>
//           </select>
//
//           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//             <Filter className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//
//       {/* Hiring Pipeline */}
//       <div className="bg-white p-6 rounded-xl border border-gray-200">
//         <div className="flex items-center gap-2 mb-6">
//           <BarChart3 className="w-5 h-5 text-purple-600" />
//           <h3 className="text-lg font-semibold text-gray-900">Hiring Pipeline</h3>
//         </div>
//
//         <div className="flex items-center justify-between">
//           {Object.entries(jobStats.hiringPipeline).map(([stage, count], index, array) => (
//             <PipelineStage
//               key={stage}
//               stage={stage}
//               count={count}
//               percentage={Math.round((count / jobStats.hiringPipeline.applied) * 100)}
//               isLast={index === array.length - 1}
//             />
//           ))}
//         </div>
//       </div>
//
//       {/* Job Performance Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {jobStats.topPerformingJobs.map((job) => (
//           <JobCard key={job.id} job={job} />
//         ))}
//       </div>
//
//       {/* Additional Analytics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Job Type Distribution */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             <PieChart className="w-5 h-5 text-blue-600" />
//             <h3 className="font-semibold text-gray-900">Job Types</h3>
//           </div>
//
//           <div className="space-y-3">
//             {Object.entries(jobStats.jobTypeDistribution).map(([type, percentage]) => (
//               <div key={type} className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//
//         {/* Location Distribution */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             <MapPin className="w-5 h-5 text-green-600" />
//             <h3 className="font-semibold text-gray-900">Work Locations</h3>
//           </div>
//
//           <div className="space-y-3">
//             {Object.entries(jobStats.locationStats).map(([location, percentage]) => (
//               <div key={location} className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600 capitalize">{location}</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-green-500 h-2 rounded-full transition-all duration-1000"
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//
//         {/* Performance Insights */}
//         <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
//           <div className="flex items-center gap-2 mb-4">
//             <Zap className="w-5 h-5 text-purple-600" />
//             <h3 className="font-semibold text-gray-900">Performance Insights</h3>
//           </div>
//
//           <div className="space-y-3">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
//               <div className="text-sm">
//                 <p className="text-gray-900 font-medium">DevOps Engineer</p>
//                 <p className="text-gray-600">Low application rate. Consider adjusting requirements.</p>
//               </div>
//             </div>
//
//             <div className="flex items-start gap-2">
//               <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
//               <div className="text-sm">
//                 <p className="text-gray-900 font-medium">React Developer</p>
//                 <p className="text-gray-600">High conversion rate! Great job description.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default BelowJobStats;
