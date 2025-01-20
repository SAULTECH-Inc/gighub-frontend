import React from "react";

interface ProfileProgressBarProps {
    completionPercentage: number; // The completion percentage (0 to 100)
}

const ProfileProgressBar: React.FC<ProfileProgressBarProps> = ({
                                                                   completionPercentage,
                                                               }) => {
    // Ensure the percentage stays between 0 and 100
    const normalizedPercentage = Math.min(100, Math.max(0, completionPercentage));

    return (
        <div style={{ width: "100%", maxWidth: "400px", margin: "20px auto" }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Profile Completion
            </h3>
            <div
                style={{
                    background: "#e0e0e0",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "20px",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        width: `${normalizedPercentage}%`,
                        background: normalizedPercentage === 100 ? "#4caf50" : "#2196f3",
                        height: "100%",
                        transition: "width 0.3s ease-in-out",
                    }}
                ></div>
            </div>
            <p
                style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold",
                }}
            >
                {normalizedPercentage}% Complete
            </p>
        </div>
    );
};

export default ProfileProgressBar;
