// Updated Modern Metric Card Component
import React from "react";
import {Briefcase, Calendar, Target, Timer, TrendingDown, TrendingUp, UserCheck, Users} from "lucide-react";

const iconMap = {
    Users,
    Briefcase,
    Calendar,
    UserCheck,
    Target,
    Timer,
};

interface MetricCard {
    id: string;
    title: string;
    value: string | number;
    change: number;
    trend: "up" | "down" | "neutral";
    icon: string;
    color: string;
    bgColor: string;
    description: string;
}
export const ModernMetricCard: React.FC<{
    metric: MetricCard;
    isLoading?: boolean;
}> = ({metric, isLoading = false}) => {
    const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Users;

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div
                    className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <div className="h-4 w-24 rounded-full bg-gray-200"/>
                            <div className="h-8 w-20 rounded-full bg-gray-200"/>
                            <div className="h-3 w-16 rounded-full bg-gray-200"/>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gray-200"/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
            <div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-600">
                        {metric.title}
                    </p>
                    <p className="mb-2 text-3xl font-bold text-gray-900">
                        {metric.value}
                    </p>
                    <div className="flex items-center gap-2">
                        {metric.trend === "up" && (
                            <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                                <TrendingUp className="h-3 w-3 text-green-600"/>
                                <span className="text-xs font-semibold text-green-600">
                  +{metric.change}%
                </span>
                            </div>
                        )}
                        {metric.trend === "down" && (
                            <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1">
                                <TrendingDown className="h-3 w-3 text-red-600"/>
                                <span className="text-xs font-semibold text-red-600">
                  -{metric.change}%
                </span>
                            </div>
                        )}
                        {metric.trend === "neutral" && (
                            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                <span className="text-xs font-semibold text-gray-600">
                  {metric.change}%
                </span>
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{metric.description}</p>
                </div>

                <div
                    className={`rounded-2xl p-4 ${metric.bgColor} transition-transform duration-300 group-hover:scale-110`}
                >
                    <IconComponent className={`h-6 w-6 ${metric.color}`}/>
                </div>
            </div>
        </div>
    );
};
