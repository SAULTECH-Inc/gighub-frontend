// Quick Action Button Component
import React from "react";

export const QuickActionButton: React.FC<{
    icon: React.ComponentType<any>;
    label: string;
    description: string;
    color: string;
    onClick?: () => void;
}> = ({icon: Icon, label, description, color, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${color}`}
        >
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/20 p-3 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white"/>
                </div>
                <div>
                    <h3 className="font-semibold text-white">{label}</h3>
                    <p className="mt-1 text-sm text-white/80">{description}</p>
                </div>
            </div>
            <div
                className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 transform rounded-full bg-white/10"/>
        </button>
    );
};
