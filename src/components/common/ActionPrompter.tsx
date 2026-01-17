import React from "react";

interface ActionPrompterProps {
  open: boolean;
  message: string;
  onAnswer: (confirmed: boolean) => void;
}

const ActionPrompter: React.FC<ActionPrompterProps> = ({
  open,
  message,
  onAnswer,
}) => {
  if (!open) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="animate-scale-in w-full max-w-xs rounded-xl bg-white p-5 shadow-2xl">
        <div className="space-y-4 text-center">
          {/* Icon Section */}
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-[#FD7E14]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Message Text */}
          <p className="text-base leading-relaxed font-medium text-[#000000]">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="rounded-lg border border-transparent px-4 py-2.5 font-medium text-[#8E8E8E] transition-all duration-200 hover:border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="rounded-lg bg-[#56E5A1] px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#45C48B] hover:shadow-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPrompter;
