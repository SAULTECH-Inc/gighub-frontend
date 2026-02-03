// Analytics Modal Component
import React, {useState} from "react";
import {
    Clock,
    LineChart,
    PieChart,
    Star,
    TrendingDown,
    TrendingUp as TrendingUpIcon,
    UserCheck,
    Users,
    X
} from "lucide-react";

export const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
                                                                                       isOpen,
                                                                                       onClose,
                                                                                   }) => {
    const [selectedTab, setSelectedTab] = useState<"overview" | "hiring" | "performance">("overview");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                        <p className="mt-1 text-orange-100">Deep dive into your hiring metrics</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                    >
                        <X className="h-6 w-6"/>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 px-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSelectedTab("overview")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "overview"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setSelectedTab("hiring")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "hiring"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Hiring Funnel
                        </button>
                        <button
                            onClick={() => setSelectedTab("performance")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "performance"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Performance
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8" style={{maxHeight: "calc(90vh - 180px)"}}>
                    {selectedTab === "overview" && (
                        <div className="space-y-6">
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div
                                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Applications</p>
                                            <p className="mt-2 text-3xl font-bold text-gray-900">1,247</p>
                                            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                                <TrendingUpIcon className="h-4 w-4"/>
                                                <span>+23% vs last month</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-blue-100 p-3">
                                            <Users className="h-6 w-6 text-blue-600"/>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Successful Hires</p>
                                            <p className="mt-2 text-3xl font-bold text-gray-900">48</p>
                                            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                                <TrendingUpIcon className="h-4 w-4"/>
                                                <span>+12% vs last month</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-green-100 p-3">
                                            <UserCheck className="h-6 w-6 text-green-600"/>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                                            <p className="mt-2 text-3xl font-bold text-gray-900">18 days</p>
                                            <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                                                <TrendingDown className="h-4 w-4"/>
                                                <span>-3 days vs last month</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-purple-100 p-3">
                                            <Clock className="h-6 w-6 text-purple-600"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Placeholder */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                        <LineChart className="h-5 w-5 text-orange-600"/>
                                        Application Trends
                                    </h3>
                                    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                                        <p className="text-gray-500">Chart visualization placeholder</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                        <PieChart className="h-5 w-5 text-orange-600"/>
                                        Application Sources
                                    </h3>
                                    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                                        <p className="text-gray-500">Chart visualization placeholder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === "hiring" && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-6 text-lg font-semibold text-gray-900">Hiring Funnel Analysis</h3>
                                <div className="space-y-4">
                                    {[
                                        {stage: "Applications Received", count: 1247, percentage: 100, color: "blue"},
                                        {stage: "Screening", count: 523, percentage: 42, color: "purple"},
                                        {stage: "First Interview", count: 198, percentage: 16, color: "indigo"},
                                        {stage: "Second Interview", count: 89, percentage: 7, color: "violet"},
                                        {stage: "Offer Extended", count: 52, percentage: 4, color: "green"},
                                        {stage: "Hired", count: 48, percentage: 3.8, color: "emerald"},
                                    ].map((stage) => (
                                        <div key={stage.stage}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{stage.stage}</span>
                                                <span className="text-sm text-gray-600">
                          {stage.count} ({stage.percentage}%)
                        </span>
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full bg-${stage.color}-500 transition-all duration-500`}
                                                    style={{width: `${stage.percentage}%`}}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === "performance" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
                                    <div className="space-y-3">
                                        {[
                                            {title: "Senior Software Engineer", applications: 248, hires: 12},
                                            {title: "Product Manager", applications: 186, hires: 8},
                                            {title: "UX Designer", applications: 142, hires: 6},
                                            {title: "Data Scientist", applications: 128, hires: 5},
                                        ].map((job, index) => (
                                            <div key={index}
                                                 className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{job.title}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {job.applications} applications • {job.hires} hires
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-green-600">
                                                            {((job.hires / job.applications) * 100).toFixed(1)}%
                                                        </p>
                                                        <p className="text-xs text-gray-500">conversion</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Recruiter Performance</h3>
                                    <div className="space-y-3">
                                        {[
                                            {name: "Sarah Johnson", interviews: 45, hires: 12, rating: 4.8},
                                            {name: "Michael Chen", interviews: 38, hires: 10, rating: 4.6},
                                            {name: "Emily Rodriguez", interviews: 32, hires: 8, rating: 4.5},
                                            {name: "David Kim", interviews: 28, hires: 7, rating: 4.4},
                                        ].map((recruiter, index) => (
                                            <div key={index}
                                                 className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=random`}
                                                            alt={recruiter.name}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{recruiter.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {recruiter.interviews} interviews
                                                                • {recruiter.hires} hires
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-current text-yellow-400"/>
                                                        <span
                                                            className="font-medium text-gray-900">{recruiter.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
