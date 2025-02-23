import React, { useState } from "react";

interface ToggleSwitchProps {
    isOn?: boolean;
    onToggle?: (state: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn = false, onToggle }) => {
    const [enabled, setEnabled] = useState(isOn); // Default is OFF (false)

    const toggleSwitch = () => {
        const newState = !enabled;
        setEnabled(newState);
        if (onToggle) {
            onToggle(newState);
        }
    };

    return (
        <button
            type="button"
            aria-label="Toggle Switch"
            tabIndex={0}
            onClick={toggleSwitch}
            className="w-[45px] h-[24px] flex items-center bg-white border border-[#E6E6E6] rounded-full p-1 transition duration-300"
        >
            {/* Purple toggler that moves */}
            <div
                className={`w-5 h-5 rounded-full shadow-md bg-[#6438C2] transform transition duration-300 ${
                    enabled ? "translate-x-[22px]" : "translate-x-0"
                }`}
            ></div>
        </button>
    );
};

export default ToggleSwitch;
