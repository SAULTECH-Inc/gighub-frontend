import React from "react";
import { useChatStore } from "../../store/useChatStore.ts";

const MessageNotificationIcon: React.FC = () => {
  const { unreadCount } = useChatStore();
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        width="27"
        height="27"
        viewBox="125.5 0.5 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer" }}
      >
        <circle cx="139" cy="14" r="13.5" fill="white" stroke="#AFAFAF" />
        <path
          d="M145.584 14.1929C145.584 17.9352 142.412 20.9693 138.5 20.9693C138.04 20.97 137.582 20.9274 137.13 20.8426C136.805 20.7815 136.642 20.751 136.529 20.7683C136.415 20.7857 136.254 20.8712 135.933 21.0423C135.023 21.5263 133.961 21.6972 132.941 21.5074C133.329 21.0302 133.594 20.4578 133.71 19.8441C133.781 19.4687 133.606 19.104 133.343 18.837C132.149 17.6247 131.417 15.991 131.417 14.1929C131.417 10.4507 134.589 7.4165 138.5 7.4165C142.412 7.4165 145.584 10.4507 145.584 14.1929Z"
          stroke="#AFAFAF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M138.497 14.5H138.504M141.327 14.5H141.334M135.667 14.5H135.673"
          stroke="#AFAFAF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "0px",
            background: "#F36863",
            color: "white",
            borderRadius: "50%",
            width: "14px",
            height: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default MessageNotificationIcon;
