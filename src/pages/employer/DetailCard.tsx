import React from "react";

export const DetailCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  className?: string;
}> = ({ icon, title, value, className = "" }) => (
  <div
    className={`flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 ${className}`}
  >
    <div className="mt-1 text-slate-500">{icon}</div>
    <div className="flex-1">
      <p className="mb-1 text-sm font-medium text-slate-600">{title}</p>
      <div className="text-slate-900">{value}</div>
    </div>
  </div>
);
