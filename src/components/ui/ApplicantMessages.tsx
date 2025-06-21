import { FC, useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";
import { ChatMessage } from "../../chat-module/types";
import { formatChatTimestamp } from "../../utils/helpers.ts";

const ApplicantMessages: FC = () => {
  const { messages, setIsClosed } = useChatStore();
  const { applicant, employer, userType } = useAuth();
  const [myMessages, setMyMessages] = useState<ChatMessage[]>();
  useEffect(() => {
    setMyMessages(
      messages?.filter((message) =>
        userType === UserType.APPLICANT
          ? message.sender !== applicant.email && !message.read
          : message.sender !== employer?.email && !message.read,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
  return (
    <>
      <div className="mx-auto h-[365px] w-full">
        <div className="w-full rounded-[16px] bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold">Messages</h2>
            {myMessages && myMessages?.length > 3 && (
              <button
                onClick={() => setIsClosed(false)}
                className="text-sm text-[#6B5AED]"
              >
                See all
              </button>
            )}
          </div>

          <div>
            {/*Messages*/}
            {myMessages?.slice(0, 4).map((message) => (
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-[50px] w-[50px] rounded-full bg-[#D9D9D9]">
                    <img
                      className="h-full w-full rounded-full"
                      src={message.senderAvatar || ""}
                      alt="sender avatar"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-sm font-medium md:text-lg">
                      {message.senderName}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {message.content}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#56E5A1]">
                    {formatChatTimestamp(
                      new Date(message?.createdAt || new Date()),
                    )}
                  </span>
                  <span className="ml-2 rounded-full bg-[#6B5AED] px-2 py-1 text-xs text-white">
                    2
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantMessages;
