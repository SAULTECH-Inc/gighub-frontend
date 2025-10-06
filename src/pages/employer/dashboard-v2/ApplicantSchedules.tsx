// import React, { useState, useEffect } from 'react';
// import {
//   Calendar,
//   Clock,
//   Users,
//   Video,
//   MapPin,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Copy,
//   ExternalLink,
//   AlertCircle,
//   CheckCircle,
//   Phone,
//   Monitor,
//   Building,
//   Filter,
//   Search,
//   Bell,
//   User,
//   Mail,
//   Timer,
//   CalendarDays,
//   Zap
// } from 'lucide-react';
//
// // Mock data for interviews and meetings
// const mockSchedules = [
//   {
//     id: 1,
//     title: "Technical Interview - Sarah Johnson",
//     candidate: {
//       name: "Sarah Johnson",
//       avatar: "SJ",
//       position: "Senior React Developer",
//       email: "sarah.johnson@email.com"
//     },
//     date: "2024-08-10",
//     time: "14:00",
//     duration: 60,
//     type: "technical",
//     format: "video",
//     status: "confirmed",
//     interviewer: "John Smith",
//     interviewerRole: "Senior Engineer",
//     location: "Zoom Meeting",
//     meetingLink: "https://zoom.us/j/123456789",
//     notes: "Focus on React patterns and system design",
//     reminder: "15min",
//     priority: "high"
//   },
//   {
//     id: 2,
//     title: "Portfolio Review - Michael Chen",
//     candidate: {
//       name: "Michael Chen",
//       avatar: "MC",
//       position: "UI/UX Designer",
//       email: "michael.chen@email.com"
//     },
//     date: "2024-08-11",
//     time: "10:00",
//     duration: 45,
//     type: "portfolio",
//     format: "video",
//     status: "pending",
//     interviewer: "Lisa Wang",
//     interviewerRole: "Design Lead",
//     location: "Google Meet",
//     meetingLink: "https://meet.google.com/abc-defg-hij",
//     notes: "Review design portfolio and case studies",
//     reminder: "30min",
//     priority: "medium"
//   },
//   {
//     id: 3,
//     title: "Final Interview - Emily Rodriguez",
//     candidate: {
//       name: "Emily Rodriguez",
//       avatar: "ER",
//       position: "Product Manager",
//       email: "emily.rodriguez@email.com"
//     },
//     date: "2024-08-11",
//     time: "15:30",
//     duration: 90,
//     type: "final",
//     format: "in-person",
//     status: "confirmed",
//     interviewer: "David Wilson",
//     interviewerRole: "VP Product",
//     location: "Conference Room A",
//     notes: "Product strategy discussion and culture fit",
//     reminder: "1hour",
//     priority: "high"
//   },
//   {
//     id: 4,
//     title: "Phone Screening - Alex Thompson",
//     candidate: {
//       name: "Alex Thompson",
//       avatar: "AT",
//       position: "Backend Developer",
//       email: "alex.thompson@email.com"
//     },
//     date: "2024-08-12",
//     time: "09:30",
//     duration: 30,
//     type: "screening",
//     format: "phone",
//     status: "confirmed",
//     interviewer: "Sarah Lee",
//     interviewerRole: "Tech Recruiter",
//     location: "Phone Call",
//     notes: "Initial screening and requirements discussion",
//     reminder: "10min",
//     priority: "low"
//   },
//   {
//     id: 5,
//     title: "Team Meet - David Kim",
//     candidate: {
//       name: "David Kim",
//       avatar: "DK",
//       position: "DevOps Engineer",
//       email: "david.kim@email.com"
//     },
//     date: "2024-08-12",
//     time: "16:00",
//     duration: 60,
//     type: "team",
//     format: "video",
//     status: "rescheduled",
//     interviewer: "Engineering Team",
//     interviewerRole: "Multiple Interviewers",
//     location: "Teams Meeting",
//     meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
//     notes: "Meet the team and discuss collaboration",
//     reminder: "15min",
//     priority: "medium"
//   }
// ];
//
// const mockUpcomingDays = [
//   { date: "2024-08-10", day: "Today", count: 1 },
//   { date: "2024-08-11", day: "Tomorrow", count: 2 },
//   { date: "2024-08-12", day: "Monday", count: 2 },
//   { date: "2024-08-13", day: "Tuesday", count: 0 },
//   { date: "2024-08-14", day: "Wednesday", count: 1 },
//   { date: "2024-08-15", day: "Thursday", count: 0 },
//   { date: "2024-08-16", day: "Friday", count: 3 }
// ];
//
// const ApplicantSchedules = () => {
//   const [schedules, setSchedules] = useState(mockSchedules);
//   const [selectedDate, setSelectedDate] = useState("2024-08-10");
//   const [viewMode, setViewMode] = useState("list"); // list, calendar
//   const [filterType, setFilterType] = useState("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [showNewScheduleModal, setShowNewScheduleModal] = useState(false);
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
//       case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'rescheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };
//
//   const getTypeIcon = (type) => {
//     switch(type) {
//       case 'technical': return <Monitor className="w-4 h-4" />;
//       case 'portfolio': return <User className="w-4 h-4" />;
//       case 'final': return <Users className="w-4 h-4" />;
//       case 'screening': return <Phone className="w-4 h-4" />;
//       case 'team': return <Users className="w-4 h-4" />;
//       default: return <Calendar className="w-4 h-4" />;
//     }
//   };
//
//   const getFormatIcon = (format) => {
//     switch(format) {
//       case 'video': return <Video className="w-4 h-4 text-blue-600" />;
//       case 'phone': return <Phone className="w-4 h-4 text-green-600" />;
//       case 'in-person': return <Building className="w-4 h-4 text-purple-600" />;
//       default: return <Calendar className="w-4 h-4" />;
//     }
//   };
//
//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case 'high': return 'bg-red-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'low': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };
//
//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour % 12 || 12;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };
//
//   const formatDuration = (duration) => {
//     if (duration < 60) return `${duration}min`;
//     const hours = Math.floor(duration / 60);
//     const mins = duration % 60;
//     return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
//   };
//
//   const todaysSchedules = schedules.filter(schedule => schedule.date === selectedDate);
//   const upcomingSchedules = schedules.filter(schedule =>
//     new Date(schedule.date) >= new Date() && schedule.date !== selectedDate
//   ).slice(0, 3);
//
//   const ScheduleCard = ({ schedule, isCompact = false }) => (
//     <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ${isCompact ? 'p-4' : 'p-6'}`}>
//       {/* Header */}
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-start gap-3">
//           <div className={`w-1 h-12 rounded-full ${getPriorityColor(schedule.priority)}`}></div>
//
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               {getTypeIcon(schedule.type)}
//               <h3 className={`font-semibold text-gray-900 ${isCompact ? 'text-sm' : 'text-base'}`}>
//                 {schedule.title}
//               </h3>
//             </div>
//
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
//                 {schedule.candidate.avatar}
//               </div>
//               <span>{schedule.candidate.name}</span>
//               <span className="text-gray-400">•</span>
//               <span>{schedule.candidate.position}</span>
//             </div>
//           </div>
//         </div>
//
//         <div className="flex items-center gap-2">
//           <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
//             {schedule.status}
//           </span>
//
//           <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
//             <MoreVertical className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//
//       {/* Time & Duration */}
//       <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
//         <div className="flex items-center gap-1">
//           <Clock className="w-4 h-4" />
//           <span>{formatTime(schedule.time)}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Timer className="w-4 h-4" />
//           <span>{formatDuration(schedule.duration)}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           {getFormatIcon(schedule.format)}
//           <span className="capitalize">{schedule.format}</span>
//         </div>
//       </div>
//
//       {/* Location/Meeting Link */}
//       <div className="flex items-center gap-2 mb-3 text-sm">
//         <MapPin className="w-4 h-4 text-gray-400" />
//         {schedule.meetingLink ? (
//           <a
//             href={schedule.meetingLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
//           >
//             {schedule.location}
//             <ExternalLink className="w-3 h-3" />
//           </a>
//         ) : (
//           <span className="text-gray-600">{schedule.location}</span>
//         )}
//       </div>
//
//       {/* Interviewer */}
//       <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
//         <User className="w-4 h-4" />
//         <span>{schedule.interviewer}</span>
//         <span className="text-gray-400">•</span>
//         <span>{schedule.interviewerRole}</span>
//       </div>
//
//       {/* Notes */}
//       {schedule.notes && !isCompact && (
//         <div className="bg-gray-50 p-3 rounded-lg mb-3">
//           <p className="text-sm text-gray-700">{schedule.notes}</p>
//         </div>
//       )}
//
//       {/* Actions */}
//       <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
//         <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
//           <Video className="w-4 h-4" />
//           Join
//         </button>
//
//         <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//           <Mail className="w-4 h-4" />
//           Email
//         </button>
//
//         <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//           <Edit className="w-4 h-4" />
//           Edit
//         </button>
//
//         <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//           <Copy className="w-4 h-4" />
//           Copy Link
//         </button>
//       </div>
//     </div>
//   );
//
//   const DayNavigation = () => (
//     <div className="flex items-center gap-2 mb-6">
//       <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//         <ChevronLeft className="w-4 h-4" />
//       </button>
//
//       <div className="flex items-center gap-2 overflow-x-auto">
//         {mockUpcomingDays.map((day) => (
//           <button
//             key={day.date}
//             onClick={() => setSelectedDate(day.date)}
//             className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               selectedDate === day.date
//                 ? 'bg-purple-600 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <div className="text-center">
//               <div>{day.day}</div>
//               {day.count > 0 && (
//                 <div className={`text-xs mt-1 ${
//                   selectedDate === day.date ? 'text-purple-200' : 'text-gray-500'
//                 }`}>
//                   {day.count} interview{day.count !== 1 ? 's' : ''}
//                 </div>
//               )}
//             </div>
//           </button>
//         ))}
//       </div>
//
//       <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//         <ChevronRight className="w-4 h-4" />
//       </button>
//     </div>
//   );
//
//   if (isLoading) {
//     return (
//       <div className="w-full space-y-6">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
//           <div className="space-y-2">
//             <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
//             <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
//           </div>
//         </div>
//
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
//               <div className="space-y-3">
//                 <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="flex gap-2">
//                   <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
//                   <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
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
//     <div className="w-full space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-orange-100 rounded-lg">
//             <Calendar className="w-5 h-5 text-orange-600" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
//             <p className="text-sm text-gray-600">{schedules.length} scheduled this week</p>
//           </div>
//         </div>
//
//         <div className="flex items-center gap-2">
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="all">All Types</option>
//             <option value="technical">Technical</option>
//             <option value="portfolio">Portfolio</option>
//             <option value="final">Final</option>
//             <option value="screening">Screening</option>
//           </select>
//
//           <button
//             onClick={() => setShowNewScheduleModal(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
//           >
//             <Plus className="w-4 h-4" />
//             Schedule
//           </button>
//         </div>
//       </div>
//
//       {/* Day Navigation */}
//       <DayNavigation />
//
//       {/* Today's Schedule */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {selectedDate === "2024-08-10" ? "Today's Interviews" : `Interviews for ${mockUpcomingDays.find(d => d.date === selectedDate)?.day}`}
//           </h3>
//           <span className="text-sm text-gray-600">{todaysSchedules.length} scheduled</span>
//         </div>
//
//         {todaysSchedules.length > 0 ? (
//           <div className="space-y-4">
//             {todaysSchedules.map((schedule) => (
//               <ScheduleCard key={schedule.id} schedule={schedule} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
//             <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <h4 className="font-medium text-gray-900 mb-1">No interviews scheduled</h4>
//             <p className="text-gray-600 text-sm">This day is free for scheduling new interviews</p>
//           </div>
//         )}
//       </div>
//
//       {/* Upcoming This Week */}
//       {upcomingSchedules.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Up This Week</h3>
//           <div className="space-y-3">
//             {upcomingSchedules.map((schedule) => (
//               <ScheduleCard key={schedule.id} schedule={schedule} isCompact={true} />
//             ))}
//           </div>
//         </div>
//       )}
//
//       {/* Quick Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <CalendarDays className="w-4 h-4 text-blue-600" />
//             <span className="text-sm font-medium text-gray-700">This Week</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">{schedules.length}</p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <CheckCircle className="w-4 h-4 text-green-600" />
//             <span className="text-sm font-medium text-gray-700">Confirmed</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">
//             {schedules.filter(s => s.status === 'confirmed').length}
//           </p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <AlertCircle className="w-4 h-4 text-yellow-600" />
//             <span className="text-sm font-medium text-gray-700">Pending</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">
//             {schedules.filter(s => s.status === 'pending').length}
//           </p>
//         </div>
//
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Video className="w-4 h-4 text-purple-600" />
//             <span className="text-sm font-medium text-gray-700">Virtual</span>
//           </div>
//           <p className="text-xl font-bold text-gray-900">
//             {schedules.filter(s => s.format === 'video').length}
//           </p>
//         </div>
//       </div>
//
//       {/* Pro Tip */}
//       <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
//         <div className="flex items-center gap-2 mb-2">
//           <Zap className="w-5 h-5 text-orange-600" />
//           <h4 className="font-semibold text-gray-900">Scheduling Tip</h4>
//         </div>
//         <p className="text-sm text-gray-700">
//           Send calendar invites 24 hours before interviews and include meeting links, agenda, and interviewer contact information to improve show-up rates.
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export default ApplicantSchedules;
