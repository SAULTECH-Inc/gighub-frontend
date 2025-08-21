import { FC, useMemo } from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";
import { ChatMessage } from "../../chat-module/types";
import { formatChatTimestamp } from "../../utils/helpers.ts";
import { MessageCircle, Users, ChevronRight } from "lucide-react";
import {LAYOUT, SHADOWS} from "../../pages/applicant/ApplicantDashboard.tsx";

const ApplicantMessages: FC = () => {
  const { messages, setIsClosed } = useChatStore();
  const { applicant, employer, userType } = useAuth();

  // Memoize filtered messages to prevent unnecessary recalculations
  const unreadMessages = useMemo(() => {
    if (!messages?.length) return [];

    const currentUserEmail = userType === UserType.APPLICANT
        ? applicant?.email
        : employer?.email;

    return messages.filter(
        (message) => message.sender !== currentUserEmail && !message.read
    );
  }, [messages, userType, applicant?.email, employer?.email]);

  const displayMessages = unreadMessages.slice(0, 4);
  const hasMoreMessages = unreadMessages.length > 3;
  const totalUnreadCount = messages?.filter(m => !m.read)?.length || 0;

  const handleSeeAllClick = () => {
    setIsClosed(false);
  };

  const getMessageTimestamp = (message: ChatMessage) => {
    return formatChatTimestamp(new Date(message.createdAt || Date.now()));
  };

  return (
      <div className={`h-[31.5%] bg-white ${LAYOUT.cardRadius} ${SHADOWS.card} ${SHADOWS.cardHover} overflow-hidden hover:shadow-xl transition-all duration-300`}>
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
                {totalUnreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                  </span>
                    </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Stay connected with employers
                </p>
              </div>
            </div>

            {hasMoreMessages && (
                <button
                    onClick={handleSeeAllClick}
                    className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group"
                    type="button"
                >
                  <span>See all</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="p-4">
          {displayMessages.length ? (
              <div className="space-y-4">
                {displayMessages.map((message) => (
                    <div
                        key={message.id || `${message.sender}-${message.createdAt}`}
                        className="overflow-y-auto group flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                          {message.senderAvatar ? (
                              <img
                                  className="w-full h-full object-cover"
                                  src={message.senderAvatar}
                                  alt={`${message.senderName || 'User'}'s avatar`}
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                  }}
                              />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold bg-gradient-to-br from-slate-100 to-slate-200">
                                {(message.senderName || 'U').charAt(0).toUpperCase()}
                              </div>
                          )}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {message.senderName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-emerald-600 font-medium">
                        {getMessageTimestamp(message)}
                      </span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-700 transition-colors">
                          {message.content}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No Messages Yet
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  When you start connecting with employers, your conversations will appear here.
                </p>
              </div>
          )}
        </div>

        {/* Footer */}
        {displayMessages.length > 0 && (
            <>
              <div className="border-t border-slate-200" />
              <div className="p-4 bg-slate-50/50">
                <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {displayMessages.length} of {unreadMessages.length} unread messages
              </span>
                  <button
                      onClick={handleSeeAllClick}
                      className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View All Messages
                  </button>
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default ApplicantMessages;