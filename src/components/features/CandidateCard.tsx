// Updated Candidate Card Component
import React from "react";
import {Clock, MapPin, Star} from "lucide-react";

export const CandidateCard: React.FC<{ candidate: any }> = ({candidate}) => {
    const getStatusColor = (status: string) => {
        const colors = {
            new: "bg-blue-100 text-blue-700 border-blue-200",
            reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
            interviewing: "bg-purple-100 text-purple-700 border-purple-200",
            hired: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status as keyof typeof colors] || colors.new;
    };

    return (
        <div
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
            <div className="flex items-start gap-4">
                <div className="relative">
                    <img
                        src={
                            candidate.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`
                        }
                        alt={candidate.name}
                        className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                    />
                    <div
                        className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"/>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                {candidate.name}
                            </h4>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(candidate.status)}`}
                        >
              {candidate.status}
            </span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                        {
                            candidate.country
                            && candidate.city !== 'null' ? (<div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3"/>
                                <span>{candidate.city}, {candidate.country}</span>
                            </div>) : (<div></div>)
                        }
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3"/>
                            <span>{candidate.level} ({candidate.experience})</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-current text-yellow-400"/>
                            <span className="text-sm font-medium text-gray-900">
                {candidate.matchScore}% match
              </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
              {candidate.salary}
            </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                        {candidate.skills
                            ?.slice(0, 3)
                            .map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                >
                  {skill}
                </span>
                            ))}
                        {candidate.skills?.length > 3 && (
                            <span
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                +{candidate.skills.length - 3} more
              </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
