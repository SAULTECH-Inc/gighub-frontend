import React from 'react';

interface JobMatchCardProps {
    title: string;
    company: string;
    tags: string[];
    description: string;
    location: string;
    type: string;
    applicants: number;
    daysLeft: number;
}

const JobMatchCard: React.FC<JobMatchCardProps> = ({
                                                       title,
                                                       company,
                                                       tags,
                                                       description,
                                                       location,
                                                       type,
                                                       applicants,
                                                       daysLeft,
                                                   }) => {
    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Job Match</h3>
                    <p className="text-sm text-gray-500">Job that matches your profile</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-sm px-4 py-2 rounded-full shadow-md">
                    Check Auto Apply
                    <span className="material-icons">rocket_launch</span>
                </button>
            </div>

            {/* Job Info */}
            <div className="flex items-start gap-4 mb-4">
                {/* Company Logo */}
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    F
                </div>
                {/* Job Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                        <p className="text-sm text-gray-500">{company}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md"
                            >
                {tag}
              </span>
                        ))}
                    </div>
                    <div className="mt-2 text-yellow-500 flex items-center">
                        <span className="material-icons text-sm mr-1">star</span>
                        <span className="material-icons text-sm mr-1">star</span>
                        <span className="material-icons text-sm mr-1">star</span>
                        <span className="material-icons text-sm mr-1">star</span>
                        <span className="material-icons text-sm">star_half</span>
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            {/* Footer Info */}
            <div className="flex justify-between items-center text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-icons">work</span>
                    {type}
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-icons">location_on</span>
                    {location}
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-icons">people</span>
                    {applicants} Applied
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-icons">schedule</span>
                    {daysLeft} days left
                </div>
            </div>

            {/* Apply Button */}
            <div className="mt-6">
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md shadow">
                    Apply
                </button>
            </div>
        </div>
    );
};

export default JobMatchCard;
