import React from "react";

const SearchIcon: React.FC = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
        >
            <path
                d="M14.583 14.5835L18.333 18.3335"
                stroke="#8E8E8E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.667 9.1665C16.667 5.02437 13.3092 1.6665 9.16699 1.6665C5.02486 1.6665 1.66699 5.02437 1.66699 9.1665C1.66699 13.3087 5.02486 16.6665 9.16699 16.6665C13.3092 16.6665 16.667 13.3087 16.667 9.1665Z"
                stroke="#8E8E8E"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default SearchIcon;
