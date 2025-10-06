// import React, { useState, useEffect } from 'react';
// import {
//   Users,
//   Star,
//   MapPin,
//   Clock,
//   DollarSign,
//   Eye,
//   Download,
//   MessageSquare,
//   Calendar,
//   MoreVertical,
//   Filter,
//   Search,
//   ChevronDown,
//   ChevronRight,
//   Briefcase,
//   GraduationCap,
//   Award,
//   Globe,
//   Phone,
//   Mail,
//   Github,
//   ExternalLink,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ThumbsUp,
//   ThumbsDown,
//   BookmarkPlus,
//   Share
// } from 'lucide-react';
//
// // Mock data for recent applications
// const mockApplications = [
//   {
//     id: 1,
//     candidate: {
//       name: "Sarah Johnson",
//       email: "sarah.johnson@email.com",
//       phone: "+1 (555) 123-4567",
//       avatar: "SJ",
//       title: "Senior Frontend Developer",
//       location: "San Francisco, CA",
//       experience: "5 years",
//       education: "MIT - Computer Science",
//       rating: 4.8,
//       profileViews: 234,
//       linkedin: "linkedin.com/in/sarahjohnson",
//       github: "github.com/sarahjohnson",
//       portfolio: "sarahjohnson.dev"
//     },
//     application: {
//       jobTitle: "Senior React Developer",
//       department: "Engineering",
//       appliedDate: "2 hours ago",
//       status: "new",
//       priority: "high",
//       salaryExpectation: "$95k - $120k",
//       availability: "Immediate",
//       coverLetter: "I'm excited to bring my 5 years of React experience to your innovative team...",
//       matchScore: 92
//     },
//     skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
//     achievements: [
//       "Led development of 3 major product features",
//       "Improved app performance by 40%",
//       "Mentored 5 junior developers"
//     ],
//     previousRoles: [
//       { company: "TechCorp", role: "Frontend Lead", duration: "2 years" },
//       { company: "StartupXYZ", role: "React Developer", duration: "3 years" }
//     ]
//   },
//   {
//     id: 2,
//     candidate: {
//       name: "Michael Chen",
//       email: "michael.chen@email.com",
//       phone: "+1 (555) 987-6543",
//       avatar: "MC",
//       title: "Senior UI/UX Designer",
//       location: "New York, NY",
//       experience: "4 years",
//       education: "RISD - Design",
//       rating: 4.6,
//       profileViews: 189,
//       linkedin: "linkedin.com/in/michaelchen",
//       portfolio: "michaelchen.design"
//     },
//     application: {
//       jobTitle: "UI/UX Designer",
//       department: "Design",
//       appliedDate: "4 hours ago",
//       status: "reviewing",
//       priority: "medium",
//       salaryExpectation: "$75k - $95k",
//       availability: "2 weeks notice",
//       coverLetter: "With 4 years of design experience, I specialize in creating user-centered designs...",
//       matchScore: 87
//     },
//     skills: ["Figma", "Sketch", "Prototyping", "User Research", "Design Systems"],
//     achievements: [
//       "Designed award-winning mobile app",
//       "Increased user engagement by 35%",
//       "Built comprehensive design system"
//     ],
//     previousRoles: [
//       { company: "DesignStudio", role: "Senior Designer", duration: "2 years" },
//       { company: "AgencyABC", role: "UX Designer", duration: "2 years" }
//     ]
//   },
//   {
//     id: 3,
//     candidate: {
//       name: "Emily Rodriguez",
//       email: "emily.rodriguez@email.com",
//       phone: "+1 (555) 456-7890",
//       avatar: "ER",
//       title: "Product Manager",
//       location: "Austin, TX",
//       experience: "6 years",
//       education: "Stanford - MBA",
//       rating: 4.9,
//       profileViews: 312,
//       linkedin: "linkedin.com/in/emilyrodriguez"
//     },
//     application: {
//       jobTitle: "Senior Product Manager",
//       department: "Product",
//       appliedDate: "1 day ago",
//       status: "shortlisted",
//       priority: "high",
//       salaryExpectation: "$110k - $140k",
//       availability: "1 month notice",
//       coverLetter: "I'm passionate about building products that solve real user problems...",
//       matchScore: 95
//     },
//     skills: ["Product Strategy", "Analytics", "Agile", "User Research", "SQL"],
//     achievements: [
//       "Launched 5 successful products",
//       "Increased revenue by $2M annually",
//       "Led cross-functional team of 12"
//     ],
//     previousRoles: [
//       { company: "ProductCorp", role: "Senior PM", duration: "3 years" },
//       { company: "TechGiant", role: "Product Manager", duration: "3 years" }
//     ]
//   },
//   {
//     id: 4,
//     candidate: {
//       name: "David Kim",
//       email: "david.kim@email.com",
//       phone: "+1 (555) 321-0987",
//       avatar: "DK",
//       title: "DevOps Engineer",
//       location: "Seattle, WA",
//       experience: "4 years",
//       education: "UC Berkeley - CS",
//       rating: 4.4,
//       profileViews: 156,
//       linkedin: "linkedin.com/in/davidkim",
//       github: "github.com/davidkim"
//     },
//     application: {
//       jobTitle: "DevOps Engineer",
//       department: "Engineering",
//       appliedDate: "2 days ago",
//       status: "interviewed",
//       priority: "medium",
//       salaryExpectation: "$85k - $110k",
//       availability: "3 weeks notice",
//       coverLetter: "I have extensive experience in cloud infrastructure and automation...",
//       matchScore: 83
//     },
//     skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python", "CI/CD"],
//     achievements: [
//       "Reduced deployment time by 60%",
//       "Managed infrastructure for 1M+ users",
//       "Implemented security best practices"
//     ],
//     previousRoles: [
//       { company: "CloudTech", role: "DevOps Engineer", duration: "2 years" },
//       { company: "StartupCloud", role: "Infrastructure Engineer", duration: "2 years" }
//     ]
//   }
// ];
//
// const ApplicantRecentApplications = () => {
//   const [applications, setApplications] = useState(mockApplications);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('recent');
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     // Simulate API loading
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//
//     return () => clearTimeout(timer);
//   }, []);
//
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
//       case 'interviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'offered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       case 'hired': return 'bg-green-100 text-green-800 border-green-200';
//       case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
//   const getMatchScoreColor = (score) => {
//     if (score >= 90) return 'text-green-600 bg-green-100';
//     if (score >= 75) return 'text-blue-600 bg-blue-100';
//     if (score >= 60) return 'text-yellow-600 bg-yellow-100';
//     return 'text-red-600 bg-red-100';
//   };
//
//   const handleStatusChange = (applicationId, newStatus) => {
//     setApplications(prev => prev.map(app =>
//       app.id === applicationId
//         ? { ...app, application: { ...app.application, status: newStatus }}
//         : app
//     ));
//   };
//
//   const ApplicationCard = ({ application, isExpanded, onToggle }) => {
//     const { candidate, application: appData } = application;
//
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
//         {/* Main Card Content */}
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-start gap-4">
//               {/* Priority Indicator */}
//               <div className={`w-1 h-16 rounded-full ${getPriorityColor(appData.priority)}`}></div>
//
//               {/* Avatar & Basic Info */}
//               <div className="flex items-start gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                   {candidate.avatar}
//                 </div>
//
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
//                     <div className="flex items-center gap-1">
//                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm font-medium text-gray-700">{candidate.rating}</span>
//                     </div>
//                   </div>
//
//                   <p className="text-gray-600 mb-2">{candidate.title}</p>
//
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <MapPin className="w-3 h-3" />
//                       {candidate.location}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Briefcase className="w-3 h-3" />
//                       {candidate.experience}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {appData.appliedDate}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//
//             {/* Status & Actions */}
//             <div className="flex items-center gap-3">
//               <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(appData.matchScore)}`}>
//                 {appData.matchScore}% match
//               </div>
//
//               <select
//                 value={appData.status}
//                 onChange={(e) => handleStatusChange(application.id, e.target.value)}
//                 className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appData.status)} focus:outline-none focus:ring-2 focus:ring-purple-500`}
//               >
//                 <option value="new">New</option>
//                 <option value="reviewing">Reviewing</option>
//                 <option value="shortlisted">Shortlisted</option>
//                 <option value="interviewed">Interviewed</option>
//                 <option value="offered">Offered</option>
//                 <option value="hired">Hired</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//
//               <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <MoreVertical className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//
//           {/* Job & Salary Info */}
//           <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
//             <div>
//               <p className="font-medium text-gray-900">{appData.jobTitle}</p>
//               <p className="text-sm text-gray-600">{appData.department}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-medium text-gray-900">{appData.salaryExpectation}</p>
//               <p className="text-sm text-gray-600">Expected salary</p>
//             </div>
//           </div>
//
//           {/* Skills */}
//           <div className="mb-4">
//             <p className="text-sm font-medium text-gray-700 mb-2">Key Skills</p>
//             <div className="flex flex-wrap gap-2">
//               {application.skills.slice(0, 5).map((skill, index) => (
//                 <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
//                   {skill}
//                 </span>
//               ))}
//               {application.skills.length > 5 && (
//                 <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
//                   +{application.skills.length - 5} more
//                 </span>
//               )}
//             </div>
//           </div>
//
//           {/* Quick Actions */}
//           <div className="flex items-center gap-2">
//             <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
//               <Eye className="w-4 h-4" />
//               View Profile
//             </button>
//
//             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//               <MessageSquare className="w-4 h-4" />
//               Message
//             </button>
//
//             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//               <Calendar className="w-4 h-4" />
//               Schedule
//             </button>
//
//             <button
//               onClick={onToggle}
//               className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
//             >
//               {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//               {isExpanded ? 'Less' : 'More'}
//             </button>
//           </div>
//         </div>
//
//         {/* Expanded Content */}
//         {isExpanded && (
//           <div className="border-t border-gray-200 bg-gray-50">
//             <div className="p-6 space-y-6">
//               {/* Contact Information */}
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Mail className="w-4 h-4 text-gray-400" />
//                     <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:text-blue-700">
//                       {candidate.email}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Phone className="w-4 h-4 text-gray-400" />
//                     <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:text-blue-700">
//                       {candidate.phone}
//                     </a>
//                   </div>
//                   {candidate.linkedin && (
//                     <div className="flex items-center gap-2 text-sm">
//                       <Globe className="w-4 h-4 text-gray-400" />
//                       <a href={`https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
//                         LinkedIn <ExternalLink className="w-3 h-3" />
//                       </a>
//                     </div>
//                   )} <ExternalLink className="w-3 h-3" />
//                 </a>
//               </div>
//               )}
//               {candidate.portfolio && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <Globe className="w-4 h-4 text-gray-400" />
//                   <a href={`https://${candidate.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
//                     Portfolio <ExternalLink className="w-3 h-3" />
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//
//         {/* Education & Experience */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//           <h4 className="font-medium text-gray-900 mb-3">Education</h4>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//           <GraduationCap className="w-4 h-4" />
//           <span>{candidate.education}</span>
//   </div>
//   </div>
//
//     <div>
//       <h4 className="font-medium text-gray-900 mb-3">Previous Roles</h4>
//       <div className="space-y-2">
//         {application.previousRoles.map((role, index) => (
//           <div key={index} className="text-sm">
//             <p className="font-medium text-gray-900">{role.role}</p>
//             <p className="text-gray-600">{role.company} • {role.duration}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
//
//     {/* Achievements */}
//     <div>
//       <h4 className="font-medium text-gray-900 mb-3">Key Achievements</h4>
//       <ul className="space-y-2">
//         {application.achievements.map((achievement, index) => (
//           <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
//             <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
//             <span>{achievement}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//
//     {/* Cover Letter Preview */}
//     <div>
//       <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
//       <div className="bg-white p-4 rounded-lg border border-gray-200">
//         <p className="text-sm text-gray-700 leading-relaxed">
//           {appData.coverLetter}
//         </p>
//         <button className="text-sm text-purple-600 hover:text-purple-700 mt-2">
//           Read full cover letter →
//         </button>
//       </div>
//     </div>
//
//     {/* Additional Actions */}
//     <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
//       <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
//         <CheckCircle className="w-4 h-4" />
//         Approve
//       </button>
//
//       <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
//         <XCircle className="w-4 h-4" />
//         Reject
//       </button>
//
//       <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//         <Download className="w-4 h-4" />
//         Download Resume
//       </button>
//
//       <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//         <BookmarkPlus className="w-4 h-4" />
//         Save for Later
//       </button>
//
//       <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//         <Share className="w-4 h-4" />
//         Share
//       </button>
//     </div>
//   </div>
//   </div>
//   )}
// </div>
// );
// };
//
// const filteredApplications = applications.filter(app => {
//   const matchesStatus = selectedStatus === 'all' || app.application.status === selectedStatus;
//   const matchesSearch = app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     app.application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
//   return matchesStatus && matchesSearch;
// });
//
// if (isLoading) {
//   return (
//     <div className="w-full space-y-6">
//       {/* Header Skeleton */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
//         <div className="space-y-2">
//           <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
//           <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
//         </div>
//       </div>
//
//       {/* Application Cards Skeleton */}
//       <div className="space-y-4">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="flex items-start gap-4 mb-4">
//               <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
//               <div className="flex-1 space-y-2">
//                 <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-64 h-3 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//               <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//             <div className="space-y-3">
//               <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
//               <div className="flex gap-2">
//                 {[1, 2, 3, 4].map((j) => (
//                   <div key={j} className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// return (
//   <div className="w-full space-y-6">
//     {/* Header */}
//     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-purple-100 rounded-lg">
//           <Users className="w-5 h-5 text-purple-600" />
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
//           <p className="text-sm text-gray-600">{filteredApplications.length} applications awaiting review</p>
//         </div>
//       </div>
//
//       <div className="flex items-center gap-3">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search candidates..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//
//         {/* Status Filter */}
//         <select
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Status</option>
//           <option value="new">New</option>
//           <option value="reviewing">Reviewing</option>
//           <option value="shortlisted">Shortlisted</option>
//           <option value="interviewed">Interviewed</option>
//         </select>
//
//         {/* Sort */}
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="recent">Most Recent</option>
//           <option value="match">Best Match</option>
//           <option value="rating">Highest Rated</option>
//         </select>
//
//         <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//           <Filter className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//
//     {/* Applications List */}
//     <div className="space-y-4">
//       {filteredApplications.map((application) => (
//         <ApplicationCard
//           key={application.id}
//           application={application}
//           isExpanded={expandedCard === application.id}
//           onToggle={() => setExpandedCard(expandedCard === application.id ? null : application.id)}
//         />
//       ))}
//     </div>
//
//     {/* Empty State */}
//     {filteredApplications.length === 0 && (
//       <div className="text-center py-12">
//         <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
//         <p className="text-gray-600">Try adjusting your filters or search terms.</p>
//       </div>
//     )}
//
//     {/* Load More */}
//     {filteredApplications.length > 0 && (
//       <div className="text-center pt-6">
//         <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
//           Load More Applications
//         </button>
//       </div>
//     )}
//   </div>
// );
// };
//
// export default ApplicantRecentApplications;
