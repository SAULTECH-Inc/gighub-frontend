// import React, { useState, useEffect, useRef } from 'react';
// import {
//     MessageSquare,
//     Send,
//     Paperclip,
//     MoreVertical,
//     Search,
//     Filter,
//     Star,
//     Archive,
//     Trash2,
//     Reply,
//     Forward,
//     Clock,
//     CheckCircle,
//     Circle,
//     Phone,
//     Video,
//     Calendar,
//     User,
//     Users,
//     Bell,
//     BellOff,
//     Pin,
//     Smile,
//     Image,
//     File,
//     Mic,
//     Plus,
//     X,
//     ChevronDown,
//     ChevronRight,
//     Eye,
//     Download,
//     ExternalLink,
//     AlertCircle,
//     CheckCircle2,
//     Zap
// } from 'lucide-react';
//
// // Mock data for conversations
// const mockConversations = [
//     {
//         id: 1,
//         candidate: {
//             name: "Sarah Johnson",
//             avatar: "SJ",
//             position: "Senior React Developer",
//             email: "sarah.johnson@email.com",
//             status: "online"
//         },
//         lastMessage: {
//             text: "Thank you for the interview opportunity! I'm very excited about the position and look forward to hearing from you.",
//             sender: "candidate",
//             timestamp: "2024-08-10T14:30:00Z",
//             read: false
//         },
//         unreadCount: 2,
//         isPinned: true,
//         isStarred: false,
//         tag: "interview-followup",
//         priority: "high"
//     },
//     {
//         id: 2,
//         candidate: {
//             name: "Michael Chen",
//             avatar: "MC",
//             position: "UI/UX Designer",
//             email: "michael.chen@email.com",
//             status: "away"
//         },
//         lastMessage: {
//             text: "I've uploaded my portfolio case studies to the shared folder. Please let me know if you need any additional information.",
//             sender: "candidate",
//             timestamp: "2024-08-10T11:15:00Z",
//             read: true
//         },
//         unreadCount: 0,
//         isPinned: false,
//         isStarred: true,
//         tag: "portfolio-review",
//         priority: "medium"
//     },
//     {
//         id: 3,
//         candidate: {
//             name: "Emily Rodriguez",
//             avatar: "ER",
//             position: "Product Manager",
//             email: "emily.rodriguez@email.com",
//             status: "offline"
//         },
//         lastMessage: {
//             text: "Can we reschedule our meeting for next week? I have a conflict that came up.",
//             sender: "candidate",
//             timestamp: "2024-08-09T16:45:00Z",
//             read: false
//         },
//         unreadCount: 1,
//         isPinned: false,
//         isStarred: false,
//         tag: "scheduling",
//         priority: "medium"
//     },
//     {
//         id: 4,
//         candidate: {
//             name: "David Kim",
//             avatar: "DK",
//             position: "DevOps Engineer",
//             email: "david.kim@email.com",
//             status: "online"
//         },
//         lastMessage: {
//             text: "Here are the technical assessment results you requested. Looking forward to discussing them in our next call.",
//             sender: "recruiter",
//             timestamp: "2024-08-09T13:20:00Z",
//             read: true
//         },
//         unreadCount: 0,
//         isPinned: false,
//         isStarred: false,
//         tag: "assessment",
//         priority: "low"
//     }
// ];
//
// const mockMessages = [
//     {
//         id: 1,
//         conversationId: 1,
//         sender: "candidate",
//         senderName: "Sarah Johnson",
//         text: "Hi! Thank you for considering my application for the Senior React Developer position. I'm very excited about the opportunity to join your team.",
//         timestamp: "2024-08-10T09:00:00Z",
//         read: true,
//         type: "text"
//     },
//     {
//         id: 2,
//         conversationId: 1,
//         sender: "recruiter",
//         senderName: "You",
//         text: "Hi Sarah! Thank you for your interest. I've reviewed your application and I'm impressed with your experience. Would you be available for a technical interview this week?",
//         timestamp: "2024-08-10T10:30:00Z",
//         read: true,
//         type: "text"
//     },
//     {
//         id: 3,
//         conversationId: 1,
//         sender: "candidate",
//         senderName: "Sarah Johnson",
//         text: "Absolutely! I'm available Tuesday through Friday, preferably in the afternoon. What would work best for your schedule?",
//         timestamp: "2024-08-10T11:00:00Z",
//         read: true,
//         type: "text"
//     },
//     {
//         id: 4,
//         conversationId: 1,
//         sender: "recruiter",
//         senderName: "You",
//         text: "Perfect! Let's schedule it for Wednesday at 2 PM. I'll send you a calendar invite with the Zoom link.",
//         timestamp: "2024-08-10T11:15:00Z",
//         read: true,
//         type: "text"
//     },
//     {
//         id: 5,
//         conversationId: 1,
//         sender: "candidate",
//         senderName: "Sarah Johnson",
//         text: "Thank you for the interview opportunity! I'm very excited about the position and look forward to hearing from you.",
//         timestamp: "2024-08-10T14:30:00Z",
//         read: false,
//         type: "text"
//     }
// ];
//
// const ApplicantMessages = () => {
//     const [conversations, setConversations] = useState(mockConversations);
//     const [selectedConversation, setSelectedConversation] = useState(1);
//     const [messages, setMessages] = useState(mockMessages);
//     const [newMessage, setNewMessage] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [filterBy, setFilterBy] = useState("all");
//     const [isLoading, setIsLoading] = useState(true);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);
//     const messagesEndRef = useRef(null);
//
//     useEffect(() => {
//         // Simulate API loading
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 600);
//
//         return () => clearTimeout(timer);
//     }, []);
//
//     useEffect(() => {
//         // Auto scroll to bottom when new messages arrive
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);
//
//     const currentConversation = conversations.find(c => c.id === selectedConversation);
//     const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);
//
//     const getStatusColor = (status) => {
//         switch(status) {
//             case 'online': return 'bg-green-500';
//             case 'away': return 'bg-yellow-500';
//             case 'offline': return 'bg-gray-400';
//             default: return 'bg-gray-400';
//         }
//     };
//
//     const getTagColor = (tag) => {
//         switch(tag) {
//             case 'interview-followup': return 'bg-blue-100 text-blue-800';
//             case 'portfolio-review': return 'bg-purple-100 text-purple-800';
//             case 'scheduling': return 'bg-orange-100 text-orange-800';
//             case 'assessment': return 'bg-green-100 text-green-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };
//
//     const formatTime = (timestamp) => {
//         const date = new Date(timestamp);
//         const now = new Date();
//         const diffInHours = (now - date) / (1000 * 60 * 60);
//
//         if (diffInHours < 24) {
//             return date.toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });
//         } else if (diffInHours < 48) {
//             return 'Yesterday';
//         } else {
//             return date.toLocaleDateString('en-US', {
//                 month: 'short',
//                 day: 'numeric'
//             });
//         }
//     };
//
//     const handleSendMessage = () => {
//         if (!newMessage.trim()) return;
//
//         const message = {
//             id: messages.length + 1,
//             conversationId: selectedConversation,
//             sender: "recruiter",
//             senderName: "You",
//             text: newMessage,
//             timestamp: new Date().toISOString(),
//             read: true,
//             type: "text"
//         };
//
//         setMessages([...messages, message]);
//         setNewMessage("");
//
//         // Update conversation last message
//         setConversations(prev => prev.map(conv =>
//             conv.id === selectedConversation
//                 ? { ...conv, lastMessage: { ...message, sender: "recruiter" }}
//                 : conv
//         ));
//     };
//
//     const handleMarkAsRead = (conversationId) => {
//         setConversations(prev => prev.map(conv =>
//             conv.id === conversationId
//                 ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true }}
//                 : conv
//         ));
//     };
//
//     const handleToggleStar = (conversationId) => {
//         setConversations(prev => prev.map(conv =>
//             conv.id === conversationId
//                 ? { ...conv, isStarred: !conv.isStarred }
//                 : conv
//         ));
//     };
//
//     const handleTogglePin = (conversationId) => {
//         setConversations(prev => prev.map(conv =>
//             conv.id === conversationId
//                 ? { ...conv, isPinned: !conv.isPinned }
//                 : conv
//         ));
//     };
//
//     const filteredConversations = conversations.filter(conv => {
//         const matchesSearch = conv.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             conv.candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesFilter = filterBy === 'all' ||
//             (filterBy === 'unread' && conv.unreadCount > 0) ||
//             (filterBy === 'starred' && conv.isStarred) ||
//             (filterBy === 'pinned' && conv.isPinned);
//         return matchesSearch && matchesFilter;
//     });
//
//     const ConversationItem = ({ conversation }) => (
//         <div
//             onClick={() => {
//                 setSelectedConversation(conversation.id);
//                 if (conversation.unreadCount > 0) {
//                     handleMarkAsRead(conversation.id);
//                 }
//             }}
//             className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
//                 selectedConversation === conversation.id ? 'bg-purple-50 border-r-2 border-r-purple-600' : ''
//             }`}
//         >
//             <div className="flex items-start gap-3">
//                 {/* Avatar with status */}
//                 <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                         {conversation.candidate.avatar}
//                     </div>
//                     <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.candidate.status)}`}></div>
//                 </div>
//
//                 <div className="flex-1 min-w-0">
//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2">
//                             <h3 className="font-medium text-gray-900 truncate">{conversation.candidate.name}</h3>
//                             {conversation.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
//                             {conversation.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
//                         </div>
//                         <div className="flex items-center gap-1">
//                             <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
//                             {conversation.unreadCount > 0 && (
//                                 <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Position & Tag */}
//                     <div className="flex items-center gap-2 mb-2">
//                         <span className="text-sm text-gray-600 truncate">{conversation.candidate.position}</span>
//                         {conversation.tag && (
//                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(conversation.tag)}`}>
//                 {conversation.tag.replace('-', ' ')}
//               </span>
//                         )}
//                     </div>
//
//                     {/* Last Message */}
//                     <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
//                         {conversation.lastMessage.sender === 'recruiter' && 'You: '}
//                         {conversation.lastMessage.text}
//                     </p>
//                 </div>
//
//                 {/* Actions */}
//                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleToggleStar(conversation.id);
//                         }}
//                         className="p-1 text-gray-400 hover:text-yellow-500 rounded transition-colors"
//                     >
//                         <Star className="w-4 h-4" />
//                     </button>
//                     <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
//                         <MoreVertical className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const MessageBubble = ({ message }) => {
//         const isFromRecruiter = message.sender === 'recruiter';
//
//         return (
//             <div className={`flex ${isFromRecruiter ? 'justify-end' : 'justify-start'} mb-4`}>
//                 <div className={`max-w-xs lg:max-w-md ${isFromRecruiter ? 'order-2' : 'order-1'}`}>
//                     <div className={`px-4 py-2 rounded-lg ${
//                         isFromRecruiter
//                             ? 'bg-purple-600 text-white'
//                             : 'bg-gray-100 text-gray-900'
//                     }`}>
//                         <p className="text-sm">{message.text}</p>
//                     </div>
//                     <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
//                         <span>{formatTime(message.timestamp)}</span>
//                         {isFromRecruiter && (
//                             <CheckCircle2 className={`w-3 h-3 ${message.read ? 'text-blue-500' : 'text-gray-400'}`} />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     if (isLoading) {
//         return (
//             <div className="w-full h-96 bg-white rounded-xl border border-gray-200">
//                 <div className="flex h-full">
//                     {/* Sidebar skeleton */}
//                     <div className="w-80 border-r border-gray-200 p-4 space-y-4">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
//                                 <div className="flex-1 space-y-2">
//                                     <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
//                                     <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//
//                     {/* Main content skeleton */}
//                     <div className="flex-1 p-6">
//                         <div className="space-y-4">
//                             <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
//                             <div className="space-y-3">
//                                 {[1, 2, 3].map((i) => (
//                                     <div key={i} className="flex gap-2">
//                                         <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
//                                         <div className="flex-1 space-y-2">
//                                             <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
//                                             <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="w-full space-y-4">
//             {/* Header */}
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-pink-100 rounded-lg">
//                     <MessageSquare className="w-5 h-5 text-pink-600" />
//                 </div>
//                 <div>
//                     <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
//                     <p className="text-sm text-gray-600">{conversations.filter(c => c.unreadCount > 0).length} unread conversations</p>
//                 </div>
//             </div>
//
//             {/* Messages Interface */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
//                 <div className="flex h-full">
//                     {/* Conversations Sidebar */}
//                     <div className="w-80 border-r border-gray-200 flex flex-col">
//                         {/* Search & Filter */}
//                         <div className="p-4 border-b border-gray-200">
//                             <div className="relative mb-3">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search conversations..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 />
//                             </div>
//
//                             <div className="flex gap-2">
//                                 <select
//                                     value={filterBy}
//                                     onChange={(e) => setFilterBy(e.target.value)}
//                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 >
//                                     <option value="all">All</option>
//                                     <option value="unread">Unread</option>
//                                     <option value="starred">Starred</option>
//                                     <option value="pinned">Pinned</option>
//                                 </select>
//
//                                 <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                     <Filter className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//
//                         {/* Conversations List */}
//                         <div className="flex-1 overflow-y-auto">
//                             {filteredConversations.map((conversation) => (
//                                 <ConversationItem key={conversation.id} conversation={conversation} />
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Chat Area */}
//                     <div className="flex-1 flex flex-col">
//                         {currentConversation ? (
//                             <>
//                                 {/* Chat Header */}
//                                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-3">
//                                             <div className="relative">
//                                                 <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                                                     {currentConversation.candidate.avatar}
//                                                 </div>
//                                                 <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(currentConversation.candidate.status)}`}></div>
//                                             </div>
//
//                                             <div>
//                                                 <h3 className="font-medium text-gray-900">{currentConversation.candidate.name}</h3>
//                                                 <p className="text-sm text-gray-600">{currentConversation.candidate.position}</p>
//                                             </div>
//                                         </div>
//
//                                         <div className="flex items-center gap-2">
//                                             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                                 <Phone className="w-4 h-4" />
//                                             </button>
//                                             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                                 <Video className="w-4 h-4" />
//                                             </button>
//                                             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                                 <Calendar className="w-4 h-4" />
//                                             </button>
//                                             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                                 <MoreVertical className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 {/* Messages */}
//                                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                                     {conversationMessages.map((message) => (
//                                         <MessageBubble key={message.id} message={message} />
//                                     ))}
//
//                                     {isTyping && (
//                                         <div className="flex justify-start">
//                                             <div className="bg-gray-100 px-4 py-2 rounded-lg">
//                                                 <div className="flex items-center gap-1">
//                                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//
//                                     <div ref={messagesEndRef} />
//                                 </div>
//
//                                 {/* Message Input */}
//                                 <div className="p-4 border-t border-gray-200 bg-gray-50">
//                                     <div className="flex items-end gap-3">
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white p-2">
//                                                 <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
//                                                     <Paperclip className="w-4 h-4" />
//                                                 </button>
//
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Type your message..."
//                                                     value={newMessage}
//                                                     onChange={(e) => setNewMessage(e.target.value)}
//                                                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                                                     className="flex-1 text-sm focus:outline-none"
//                                                 />
//
//                                                 <button
//                                                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                                                     className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                                                 >
//                                                     <Smile className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//
//                                         <button
//                                             onClick={handleSendMessage}
//                                             disabled={!newMessage.trim()}
//                                             className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                                         >
//                                             <Send className="w-4 h-4" />
//                                         </button>
//                                     </div>
//
//                                     {/* Quick Actions */}
//                                     <div className="flex items-center gap-2 mt-3">
//                                         <button className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
//                                             <Calendar className="w-3 h-3" />
//                                             Schedule Interview
//                                         </button>
//                                         <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
//                                             <File className="w-3 h-3" />
//                                             Send Documents
//                                         </button>
//                                         <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
//                                             <CheckCircle className="w-3 h-3" />
//                                             Update Status
//                                         </button>
//                                     </div>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="flex-1 flex items-center justify-center">
//                                 <div className="text-center">
//                                     <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                                     <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
//                                     <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                         <MessageSquare className="w-4 h-4 text-blue-600" />
//                         <span className="text-sm font-medium text-gray-700">Total Conversations</span>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">{conversations.length}</p>
//                 </div>
//
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Bell className="w-4 h-4 text-red-600" />
//                         <span className="text-sm font-medium text-gray-700">Unread</span>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">
//                         {conversations.filter(c => c.unreadCount > 0).length}
//                     </p>
//                 </div>
//
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Star className="w-4 h-4 text-yellow-600" />
//                         <span className="text-sm font-medium text-gray-700">Starred</span>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">
//                         {conversations.filter(c => c.isStarred).length}
//                     </p>
//                 </div>
//
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Clock className="w-4 h-4 text-purple-600" />
//                         <span className="text-sm font-medium text-gray-700">Response Time</span>
//                     </div>
//                     <p className="text-xl font-bold text-gray-900">2.3h</p>
//                 </div>
//             </div>
//
//             {/* Communication Tip */}
//             <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Zap className="w-5 h-5 text-pink-600" />
//                     <h4 className="font-semibold text-gray-900">Communication Tip</h4>
//                 </div>
//                 <p className="text-sm text-gray-700">
//                     Respond to candidate messages within 24 hours to maintain engagement. Use quick actions to schedule interviews and send documents efficiently.
//                 </p>
//             </div>
//         </div>
//     );
// };
//
// export default ApplicantMessages;