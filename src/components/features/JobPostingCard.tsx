// Updated Job Posting Card Component
import React from "react";
import {Globe} from "lucide-react";

export const JobPostingCard: React.FC<{ job: any }> = ({job}) => {
    const getUrgencyColor = (urgency: string) => {
        const colors = {
            high: "bg-red-100 text-red-700 border-red-200",
            medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
            low: "bg-green-100 text-green-700 border-green-200",
        };
        return colors[urgency as keyof typeof colors];
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div>
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.department}</p>
                </div>
                <div className="flex items-center gap-2">
                    {job.remote && (
                        <span
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              <Globe className="mr-1 h-3 w-3"/>
              Remote
            </span>
                    )}
                    <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getUrgencyColor(job.urgency)}`}
                    >
            {job.urgency}
          </span>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{job.applications}</p>
                    <p className="text-xs text-gray-600">Applications</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{job.views}</p>
                    <p className="text-xs text-gray-600">Views</p>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Posted {job.posted}</span>
                <span className="capitalize">{job.type}</span>
            </div>
        </div>
    );
};
