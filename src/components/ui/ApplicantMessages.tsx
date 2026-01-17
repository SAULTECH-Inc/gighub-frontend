import { FC, useMemo } from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";
import { ChatMessage } from "../../chat-module/types";
import { formatChatTimestamp } from "../../utils/helpers.ts";
import { MessageCircle, Users, ChevronRight } from "lucide-react";
import { LAYOUT, SHADOWS } from "../../pages/applicant/ApplicantDashboard.tsx";

const ApplicantMessages: FC = () => {
  const { messages, setIsClosed } = useChatStore();
  const { applicant, employer, userType } = useAuth();

  // Memoize filtered messages to prevent unnecessary recalculations
  const unreadMessages = useMemo(() => {
    if (!messages?.length) return [];

    const currentUserEmail =
      userType === UserType.APPLICANT ? applicant?.email : employer?.email;

    return messages.filter(
      (message) => message.sender !== currentUserEmail && !message.read,
    );
  }, [messages, userType, applicant?.email, employer?.email]);

  const displayMessages = unreadMessages.slice(0, 4);
  const hasMoreMessages = unreadMessages.length > 3;
  const totalUnreadCount = messages?.filter((m) => !m.read)?.length || 0;

  const handleSeeAllClick = () => {
    setIsClosed(false);
  };

  const getMessageTimestamp = (message: ChatMessage) => {
    return formatChatTimestamp(new Date(message.createdAt || Date.now()));
  };

  return (
    <div
      className={`h-[31.5%] bg-white ${LAYOUT.cardRadius} ${SHADOWS.card} ${SHADOWS.cardHover} overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-sm">
              <MessageCircle className="h-5 w-5 text-white" />
              {totalUnreadCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                  <span className="text-xs font-bold text-white">
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Messages</h2>
              <p className="mt-1 text-sm text-slate-600">
                Stay connected with employers
              </p>
            </div>
          </div>

          {hasMoreMessages && (
            <button
              onClick={handleSeeAllClick}
              className="group flex items-center space-x-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
              type="button"
            >
              <span>See all</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
                className="group flex cursor-pointer items-start space-x-4 overflow-y-auto rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                    {message.senderAvatar ? (
                      <img
                        className="h-full w-full object-cover"
                        src={message.senderAvatar}
                        alt={`${message.senderName || "User"}'s avatar`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 font-semibold text-slate-500">
                        {(message.senderName || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
                </div>

                {/* Message Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="truncate font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {message.senderName || "Unknown User"}
                    </h3>
                    <div className="flex flex-shrink-0 items-center space-x-2">
                      <span className="text-xs font-medium text-emerald-600">
                        {getMessageTimestamp(message)}
                      </span>
                      <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm" />
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-600 transition-colors group-hover:text-slate-700">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">
              No Messages Yet
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              When you start connecting with employers, your conversations will
              appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {displayMessages.length > 0 && (
        <>
          <div className="border-t border-slate-200" />
          <div className="bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {displayMessages.length} of {unreadMessages.length} unread
                messages
              </span>
              <button
                onClick={handleSeeAllClick}
                className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
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
