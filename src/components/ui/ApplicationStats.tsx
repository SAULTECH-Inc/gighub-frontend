

import { FC } from "react";
import numeral from "numeral";
import { useMetrics } from "../../store/useMetrics.ts";
import { Send, CheckCircle, Clock } from "lucide-react";
import jobApplied from "../../assets/icons/jobApplied.svg";
import shortlisted from "../../assets/icons/shortlisted.svg";
import pending from "../../assets/icons/pending.svg";
import {LAYOUT, SHADOWS} from "../../pages/applicant/ApplicantDashboard.tsx";

const ApplicationStats: FC = () => {
  const { metric } = useMetrics();

  const stats = [
    {
      title: "Jobs Applied",
      value: metric.jobsApplied,
      icon: jobApplied,
      fallbackIcon: Send,
      iconBg: "bg-emerald-500",
      iconColor: "text-emerald-600",
      bgAccent: "bg-emerald-50"
    },
    {
      title: "Shortlisted",
      value: metric.shortlisted,
      icon: shortlisted,
      fallbackIcon: CheckCircle,
      iconBg: "bg-orange-500",
      iconColor: "text-orange-600",
      bgAccent: "bg-orange-50"
    },
    {
      title: "Pending",
      value: metric.pending,
      icon: pending,
      fallbackIcon: Clock,
      iconBg: "bg-amber-500",
      iconColor: "text-amber-600",
      bgAccent: "bg-amber-50"
    }
  ];

  return (
      <div className={`bg-white ${LAYOUT.cardRadius} ${SHADOWS.card} ${SHADOWS.cardHover} transition-all duration-300`}>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {stats.map((stat, ) => (
              <div
                  key={stat.title}
                  className={`${LAYOUT.cardPadding} group transition-all duration-200 hover:bg-slate-50/50 first:rounded-t-2xl last:rounded-b-2xl md:first:rounded-l-2xl md:first:rounded-tr-none md:last:rounded-r-2xl md:last:rounded-bl-none`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                      {numeral(stat.value).format("0.0a")}
                    </p>
                  </div>

                  <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center ${SHADOWS.sm} group-hover:scale-105 transition-transform duration-200`}>
                    {stat.icon ? (
                        <img
                            src={stat.icon}
                            alt={`${stat.title} icon`}
                            className="w-6 h-6 filter brightness-0 invert"
                        />
                    ) : (
                        <stat.fallbackIcon className="w-6 h-6 text-white" />
                    )}

                    {/* Subtle accent overlay */}
                    <div className={`absolute inset-0 rounded-xl ${stat.bgAccent} opacity-0 group-hover:opacity-20 transition-opacity duration-200`} />
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};


export default ApplicationStats;