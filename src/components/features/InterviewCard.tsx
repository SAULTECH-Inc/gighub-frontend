// Updated Interview Card Component
import React from "react";
import {Calendar as CalendarIcon, Clock3, Phone, Users, Video} from "lucide-react";

export const InterviewCard: React.FC<{ interview: any }> = ({interview}) => {
    const getTypeIcon = (type: string) => {
        const icons = {
            video: Video,
            phone: Phone,
            "in-person": Users,
        };
        return icons[type as keyof typeof icons] || Video;
    };

    const TypeIcon = getTypeIcon(interview.type);

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200">
            <div className="flex items-start gap-3">
                <img
                    src={
                        interview.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidateName)}&background=random`
                    }
                    alt={interview.candidateName}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                {interview.candidateName}
                            </h4>
                            <p className="text-sm text-gray-600">{interview.position}</p>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                            <TypeIcon className="h-4 w-4"/>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3"/>
                            <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock3 className="h-3 w-3"/>
                            <span>{interview.time}</span>
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                        Interviewer: {interview.interviewer}
                    </div>
                </div>
            </div>
        </div>
    );
};
