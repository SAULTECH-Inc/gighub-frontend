// Analytics Modal Component
import React, { useState, useEffect } from "react";
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
import { fetchMetrics } from "../../services/api";

interface MetricsData {
    totalApplications: number;
    successfulHires: number;
    avgTimeToHire: number;
    hiringFunnel: { stage: string; count: number; percentage: number; color: string }[];
    topJobs: { title: string; applications: number; hires: number }[];
}

export const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const [selectedTab, setSelectedTab] = useState<"overview" | "hiring" | "performance">("overview");
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchMetrics();
                const data = response?.data;
                if (data) {
                    const totalApps = data.totalApplications || data.applications || 0;
                    const hires = data.successfulHires || data.hires || 0;
                    const avgDays = data.avgTimeToHire || data.averageDaysToHire || 0;

                    // Derive funnel from API or build reasonable defaults from totals
                    const screening = data.screening || Math.round(totalApps * 0.42);
                    const firstInterview = data.firstInterview || Math.round(totalApps * 0.16);
                    const secondInterview = data.secondInterview || Math.round(totalApps * 0.07);
                    const offered = data.offersExtended || Math.round(hires * 1.1);

                    setMetrics({
                        totalApplications: totalApps,
                        successfulHires: hires,
                        avgTimeToHire: avgDays,
                        hiringFunnel: [
                            { stage: "Applications Received", count: totalApps, percentage: 100, color: "bg-blue-500" },
                            { stage: "Screening", count: screening, percentage: totalApps > 0 ? Math.round((screening / totalApps) * 100) : 0, color: "bg-purple-500" },
                            { stage: "First Interview", count: firstInterview, percentage: totalApps > 0 ? Math.round((firstInterview / totalApps) * 100) : 0, color: "bg-indigo-500" },
                            { stage: "Second Interview", count: secondInterview, percentage: totalApps > 0 ? Math.round((secondInterview / totalApps) * 100) : 0, color: "bg-violet-500" },
                            { stage: "Offer Extended", count: offered, percentage: totalApps > 0 ? Math.round((offered / totalApps) * 100) : 0, color: "bg-green-500" },
                            { stage: "Hired", count: hires, percentage: totalApps > 0 ? Math.round((hires / totalApps) * 100) : 0, color: "bg-emerald-500" },
                        ],
                        topJobs: data.topJobs || [],
                    });
                }
            } catch (error) {
                console.error("Failed to load analytics metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isOpen]);

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
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 px-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSelectedTab("overview")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${selectedTab === "overview"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setSelectedTab("hiring")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${selectedTab === "hiring"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Hiring Funnel
                        </button>
                        <button
                            onClick={() => setSelectedTab("performance")}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${selectedTab === "performance"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Performance
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 180px)" }}>
                    {loading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="rounded-2xl border border-gray-200 p-6 animate-pulse">
                                        <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {selectedTab === "overview" && (
                                <div className="space-y-6">
                                    {/* Key Metrics Grid */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Applications</p>
                                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                                        {metrics?.totalApplications?.toLocaleString() || 0}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-blue-100 p-3">
                                                    <Users className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Successful Hires</p>
                                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                                        {metrics?.successfulHires || 0}
                                                    </p>
                                                    {metrics && metrics.totalApplications > 0 && (
                                                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                                            <TrendingUpIcon className="h-4 w-4" />
                                                            <span>{((metrics.successfulHires / metrics.totalApplications) * 100).toFixed(1)}% conversion</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="rounded-xl bg-green-100 p-3">
                                                    <UserCheck className="h-6 w-6 text-green-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                                        {metrics?.avgTimeToHire || '—'} {metrics?.avgTimeToHire ? 'days' : ''}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-purple-100 p-3">
                                                    <Clock className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts Placeholder */}
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                                <LineChart className="h-5 w-5 text-orange-600" />
                                                Application Trends
                                            </h3>
                                            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                                                <p className="text-gray-500">Chart visualization coming soon</p>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                                <PieChart className="h-5 w-5 text-orange-600" />
                                                Application Sources
                                            </h3>
                                            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50">
                                                <p className="text-gray-500">Chart visualization coming soon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTab === "hiring" && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                        <h3 className="mb-6 text-lg font-semibold text-gray-900">Hiring Funnel Analysis</h3>
                                        {metrics && metrics.hiringFunnel.length > 0 ? (
                                            <div className="space-y-4">
                                                {metrics.hiringFunnel.map((stage) => (
                                                    <div key={stage.stage}>
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="font-medium text-gray-900">{stage.stage}</span>
                                                            <span className="text-sm text-gray-600">
                                                                {stage.count.toLocaleString()} ({stage.percentage}%)
                                                            </span>
                                                        </div>
                                                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                                            <div
                                                                className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                                                                style={{ width: `${stage.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center text-gray-500">
                                                No hiring funnel data available yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedTab === "performance" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
                                            {metrics && metrics.topJobs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {metrics.topJobs.map((job, index) => (
                                                        <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{job.title}</p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {job.applications} applications • {job.hires} hires
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-green-600">
                                                                        {job.applications > 0 ? ((job.hires / job.applications) * 100).toFixed(1) : 0}%
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">conversion</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 text-center text-gray-500">
                                                    No job performance data available yet
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Hiring Summary</h3>
                                            <div className="space-y-4">
                                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Total Applications</span>
                                                        <span className="font-bold text-gray-900">{metrics?.totalApplications?.toLocaleString() || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Total Hires</span>
                                                        <span className="font-bold text-gray-900">{metrics?.successfulHires || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Average Time to Hire</span>
                                                        <span className="font-bold text-gray-900">{metrics?.avgTimeToHire || '—'} days</span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Conversion Rate</span>
                                                        <span className="font-bold text-green-600">
                                                            {metrics && metrics.totalApplications > 0
                                                                ? ((metrics.successfulHires / metrics.totalApplications) * 100).toFixed(1)
                                                                : 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
