import { ClockLoader } from "react-spinners";
import React from "react";

interface ClockSpinnerProp {
  isLoading: boolean;
}
export const ClockSpinner: React.FC<ClockSpinnerProp> = ({ isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <ClockLoader
        color="#6438C2"
        loading={isLoading}
        size={50}
        aria-label="Loading spinner"
        data-testid="loader"
      />
    </div>
  );
};
