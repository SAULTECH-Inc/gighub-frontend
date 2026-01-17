// import React, { useState, useEffect } from 'react';
// import {
//   Briefcase,
//   Users,
//   UserCheck,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Activity,
//   Clock,
//   Target,
//   Award,
//   BarChart3,
//   Eye
// } from 'lucide-react';
//
// // Mock data - replace with real API data
// const mockMetrics = {
//   activeJobs: { current: 18, previous: 16, change: 12.5 },
//   totalApplications: { current: 342, previous: 314, change: 8.9 },
//   successfulHires: { current: 8, previous: 6, change: 33.3 },
//   recruitmentSpend: { current: 12500, total: 25000, previous: 11200, change: 11.6 },
//   responseRate: 85,
//   averageTimeToHire: 14,
//   newApplicationsThisWeek: 28,
//   shortlisted: 45,
//   interviewed: 23
// };
//
// const ApplicationStats = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [metrics, setMetrics] = useState(mockMetrics);
//   const [animatedValues, setAnimatedValues] = useState({
//     activeJobs: 0,
//     totalApplications: 0,
//     successfulHires: 0,
//     recruitmentSpend: 0
//   });
//
//   // Simulate API loading and animate counters
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//
//     // Animate counters
//     const animateCounters = () => {
//       const duration = 2000;
//       const steps = 60;
//       const stepDuration = duration / steps;
//
//       let currentStep = 0;
//       const interval = setInterval(() => {
//         currentStep++;
//         const progress = currentStep / steps;
//
//         setAnimatedValues({
//           activeJobs: Math.floor(metrics.activeJobs.current * progress),
//           totalApplications: Math.floor(metrics.totalApplications.current * progress),
//           successfulHires: Math.floor(metrics.successfulHires.current * progress),
//           recruitmentSpend: Math.floor(metrics.recruitmentSpend.current * progress)
//         });
//
//         if (currentStep >= steps) {
//           clearInterval(interval);
//           setAnimatedValues({
//             activeJobs: metrics.activeJobs.current,
//             totalApplications: metrics.totalApplications.current,
//             successfulHires: metrics.successfulHires.current,
//             recruitmentSpend: metrics.recruitmentSpend.current
//           });
//         }
//       }, stepDuration);
//     };
//
//     if (!isLoading) {
//       animateCounters();
//     }
//
//     return () => clearTimeout(timer);
//   }, [isLoading]);
//
//   const formatChange = (change) => {
//     const isPositive = change > 0;
//     return {
//       isPositive,
//       formatted: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
//       color: isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
//     };
//   };
//
//   const formatCurrency = (amount) => {
//     if (amount >= 1000) {
//       return `$${(amount / 1000).toFixed(1)}k`;
//     }
//     return `$${amount}`;
//   };
//
//   const StatCard = ({ icon: Icon, title, value, subtitle, change, color, progress, isLoading }) => {
//     const changeData = formatChange(change);
//
//     return (
//       <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className={`p-3 rounded-xl ${color.bg} group-hover:scale-110 transition-transform duration-300`}>
//             <Icon className={`w-6 h-6 ${color.icon}`} />
//           </div>
//
//           {isLoading ? (
//             <div className="w-12 h-5 bg-gray-200 rounded-full animate-pulse"></div>
//           ) : (
//             <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${changeData.color}`}>
//               {changeData.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//               {changeData.formatted}
//             </span>
//           )}
//         </div>
//
//         {/* Main Value */}
//         {isLoading ? (
//           <div className="space-y-2 mb-4">
//             <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
//             <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
//           </div>
//         ) : (
//           <>
//             <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
//               {typeof value === 'string' ? value : value.toLocaleString()}
//             </h3>
//             <p className="text-gray-600 text-sm font-medium">{title}</p>
//           </>
//         )}
//
//         {/* Subtitle */}
//         {subtitle && (
//           <div className="mt-3 text-xs text-gray-500">
//             {isLoading ? (
//               <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
//             ) : (
//               subtitle
//             )}
//           </div>
//         )}
//
//         {/* Progress Bar (for budget) */}
//         {progress && !isLoading && (
//           <div className="mt-4">
//             <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
//               <span>Budget Used</span>
//               <span>{Math.round(progress)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className={`h-2 rounded-full transition-all duration-1000 ease-out ${
//                   progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'
//                 }`}
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
//
//   const statsData = [
//     {
//       icon: Briefcase,
//       title: "Active Jobs",
//       value: animatedValues.activeJobs,
//       subtitle: `${metrics.activeJobs.current + 6} total positions`,
//       change: metrics.activeJobs.change,
//       color: { bg: 'bg-blue-100', icon: 'text-blue-600' }
//     },
//     {
//       icon: Users,
//       title: "Total Applications",
//       value: animatedValues.totalApplications,
//       subtitle: `${metrics.newApplicationsThisWeek} new this week`,
//       change: metrics.totalApplications.change,
//       color: { bg: 'bg-green-100', icon: 'text-green-600' }
//     },
//     {
//       icon: UserCheck,
//       title: "Successful Hires",
//       value: animatedValues.successfulHires,
//       subtitle: `Avg. ${metrics.averageTimeToHire} days to hire`,
//       change: metrics.successfulHires.change,
//       color: { bg: 'bg-purple-100', icon: 'text-purple-600' }
//     },
//     {
//       icon: DollarSign,
//       title: "Recruitment Spend",
//       value: formatCurrency(animatedValues.recruitmentSpend),
//       subtitle: `of ${formatCurrency(metrics.recruitmentSpend.total)} budget`,
//       change: metrics.recruitmentSpend.change,
//       progress: (metrics.recruitmentSpend.current / metrics.recruitmentSpend.total) * 100,
//       color: { bg: 'bg-orange-100', icon: 'text-orange-600' }
//     }
//   ];
//
//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-100 rounded-lg">
//             <BarChart3 className="w-5 h-5 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Application Analytics</h2>
//             <p className="text-sm text-gray-600">Key metrics for your recruitment performance</p>
//           </div>
//         </div>
//
//         <div className="flex items-center gap-2">
//           <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
//             <option value="7d">Last 7 days</option>
//             <option value="30d">Last 30 days</option>
//             <option value="90d">Last 90 days</option>
//           </select>
//
//           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//             <Eye className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsData.map((stat, index) => (
//           <StatCard
//             key={index}
//             icon={stat.icon}
//             title={stat.title}
//             value={stat.value}
//             subtitle={stat.subtitle}
//             change={stat.change}
//             color={stat.color}
//             progress={stat.progress}
//             isLoading={isLoading}
//           />
//         ))}
//       </div>
//
//       {/* Additional Quick Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Target className="w-4 h-4 text-blue-600" />
//             <span className="text-sm font-medium text-gray-700">Response Rate</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">{metrics.responseRate}%</p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Activity className="w-4 h-4 text-green-600" />
//             <span className="text-sm font-medium text-gray-700">Shortlisted</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">{metrics.shortlisted}</p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Clock className="w-4 h-4 text-purple-600" />
//             <span className="text-sm font-medium text-gray-700">Interviewed</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">{metrics.interviewed}</p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Award className="w-4 h-4 text-orange-600" />
//             <span className="text-sm font-medium text-gray-700">Avg. Time to Hire</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">{metrics.averageTimeToHire}d</p>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ApplicationStats;
