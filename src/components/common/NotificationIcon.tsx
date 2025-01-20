import React from "react";

interface NotificationIconProps {
    count?: number; // Optional prop for notification count
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ count = 0 }) => {
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="14" cy="14" r="13.5" fill="white" stroke="#D9D9D9" />
                <path
                    d="M6.89744 16.0772C6.73795 17.1227 7.451 17.8484 8.32404 18.21C11.6711 19.5966 16.3289 19.5966 19.6759 18.21C20.549 17.8484 21.262 17.1227 21.1026 16.0772C21.0046 15.4347 20.5199 14.8996 20.1608 14.3772C19.6905 13.6845 19.6438 12.9288 19.6437 12.125C19.6437 9.0184 17.1169 6.5 14 6.5C10.8831 6.5 8.35635 9.0184 8.35635 12.125C8.35627 12.9288 8.30954 13.6845 7.83921 14.3772C7.48013 14.8996 6.99546 15.4347 6.89744 16.0772Z"
                    stroke="#8E8E8E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11 19.25C11.3439 20.5439 12.5566 21.5 14 21.5C15.4434 21.5 16.6561 20.5439 17 19.25"
                    stroke="#8E8E8E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {count > 0 && (
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
                        fontSize: "10px",
                        fontWeight: "bold",
                    }}
                >
          {count}
        </span>
            )}
        </div>
    );
};

export default NotificationIcon;