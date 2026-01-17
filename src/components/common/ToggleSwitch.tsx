import React, { useState, useEffect } from "react";

interface ToggleSwitchProps {
  isOn?: boolean;
  onToggle?: (state: boolean) => void;
  // New optional props for customization
  size?: "sm" | "md" | "lg" | number; // 'number' means a custom rem height
  primaryColor?: string; // Tailwind color class (e.g., 'blue-500') or hex color (e.g., '#4F46E5')
  borderColor?: string; // Tailwind color class or hex color
  trackOffColor?: string; // Tailwind color class or hex color for the track when off
  togglerOffColor?: string; // Tailwind color class or hex color for the toggler when off
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn = false,
  onToggle,
  size = "md",
  primaryColor = "#6438C2", // Default purple
  borderColor = "#E6E6E6", // Default light grey
  trackOffColor = "white", // Default white for track when off
  togglerOffColor = "white", // Default white for toggler when off
  disabled = false,
}) => {
  const [enabled, setEnabled] = useState(isOn);

  useEffect(() => {
    setEnabled(isOn);
  }, [isOn]);

  const toggleSwitch = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  // Define base sizes in rem for different scales
  let trackWidthRem: number;
  let trackHeightRem: number;
  let togglerSizeRem: number;
  let paddingRem: number;

  switch (size) {
    case "sm":
      trackHeightRem = 1.0; // 16px
      trackWidthRem = 2.0; // 32px
      paddingRem = 0.125; // 2px
      break;
    case "md":
      trackHeightRem = 1.25; // 20px
      trackWidthRem = 2.5; // 40px
      paddingRem = 0.125; // 2px
      break;
    case "lg":
      trackHeightRem = 1.5; // 24px
      trackWidthRem = 3.0; // 48px
      paddingRem = 0.125; // 2px
      break;
    default: // Custom size if a number is provided (represents desired height in rem)
      trackHeightRem = 1.25; // Ensure size is positive
      trackWidthRem = trackHeightRem * 2; // Maintain 2:1 aspect ratio for track
      paddingRem = trackHeightRem * 0.1; // 10% of height for padding
      if (paddingRem * 2 >= trackHeightRem) {
        paddingRem = trackHeightRem / 4; // Fallback to 1/4 of height if too big
      }
      break;
  }

  togglerSizeRem = trackHeightRem - 2 * paddingRem;

  if (togglerSizeRem <= 0) {
    togglerSizeRem = trackHeightRem * 0.5; // Fallback to half height if calculation goes wrong
    paddingRem = (trackHeightRem - togglerSizeRem) / 2; // Re-calculate padding
  }

  // Function to determine if a color string is a Tailwind class or a hex/css value
  const isTailwindClass = (color: string) =>
    !color.startsWith("#") && !color.startsWith("rgb");

  // Get the background color for the track
  const getTrackBackgroundColor = () => {
    if (enabled) {
      return isTailwindClass(primaryColor) ? undefined : primaryColor; // Use inline style only for hex/rgb
    } else {
      return isTailwindClass(trackOffColor) ? undefined : trackOffColor;
    }
  };

  // Get the background color for the toggler
  const getTogglerBackgroundColor = () => {
    // Toggler is always white when ON (as per previous design for contrast)
    // If OFF, use togglerOffColor
    return enabled
      ? "white"
      : isTailwindClass(togglerOffColor)
        ? undefined
        : togglerOffColor;
  };

  // Get the border color for the track
  const getBorderColor = () => {
    return isTailwindClass(borderColor) ? undefined : borderColor;
  };

  return (
    <button
      type="button"
      aria-label="Toggle Switch"
      tabIndex={0}
      onClick={toggleSwitch}
      disabled={disabled}
      className={`relative flex items-center rounded-full transition-colors duration-300 focus:ring-2 focus:outline-none focus:ring-[${primaryColor}] focus:ring-opacity-50 ${enabled && isTailwindClass(primaryColor) ? `bg-${primaryColor}` : ""} ${!enabled && isTailwindClass(trackOffColor) ? `bg-${trackOffColor}` : ""} ${isTailwindClass(borderColor) ? `border border-${borderColor}` : "border"} `}
      style={{
        width: `${trackWidthRem}rem`,
        height: `${trackHeightRem}rem`,
        padding: `${paddingRem}rem`,
        backgroundColor: getTrackBackgroundColor(), // For hex/rgb colors
        borderColor: getBorderColor(), // For hex/rgb colors
      }}
    >
      <div
        className={`transform rounded-full shadow-md transition-transform duration-300 ${!enabled && isTailwindClass(togglerOffColor) ? `bg-${togglerOffColor}` : ""} `}
        style={{
          width: `${togglerSizeRem}rem`,
          height: `${togglerSizeRem}rem`,
          backgroundColor: getTogglerBackgroundColor(), // For hex/rgb colors
          transform: enabled
            ? `translateX(${trackWidthRem - togglerSizeRem - 2 * paddingRem}rem)`
            : "translateX(0)",
        }}
      ></div>
    </button>
  );
};

export default ToggleSwitch;
