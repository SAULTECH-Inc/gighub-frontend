// Error Display Component
import React from "react";
import {AlertCircle} from "lucide-react";

export const ErrorDisplay: React.FC<{ message: string; onRetry?: () => void }> = ({
                                                                                      message,
                                                                                      onRetry,
                                                                                  }) => (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600"/>
            <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error Loading Data</p>
                <p className="mt-1 text-sm text-red-700">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    </div>
);
