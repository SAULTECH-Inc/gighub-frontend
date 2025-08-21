import { FC } from "react";
import { useMetrics } from "../../store/useMetrics.ts";
import { BarChart3, MapPin, Home, Building2 } from "lucide-react";

const ApplicationSummary: FC = () => {
  const { metric } = useMetrics();
  const total = metric.jobsApplied;

  // Guard against division by zero
  const onsitePercent = total ? (metric.onsite / total) * 100 : 0;
  const remotePercent = total ? (metric.remote / total) * 100 : 0;
  const hybridPercent = total ? (metric.hybrid / total) * 100 : 0;

  const workTypes = [
    {
      name: "Onsite",
      value: metric.onsite,
      percent: onsitePercent,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      icon: Building2,
    },
    {
      name: "Remote",
      value: metric.remote,
      percent: remotePercent,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      icon: Home,
    },
    {
      name: "Hybrid",
      value: metric.hybrid,
      percent: hybridPercent,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      icon: MapPin,
    },
  ];

  return (
      <div className="h-full relative overflow-hidden rounded-2xl bg-white shadow border border-slate-100 hover:shadow-xl transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-50 to-transparent"></div>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Work Preference
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
              {workTypes.map((type, index) => (
                  <div
                      key={index}
                      className={`${type.color} transition-all duration-700 ease-out`}
                      style={{
                        width: `${type.percent}%`,
                        animationDelay: `${index * 150}ms`
                      }}
                  />
              ))}
            </div>

            {/* Percentage labels */}
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-slate-100"></div>

        {/* Stats List */}
        <div className="p-6 pt-4">
          <div className="space-y-4">
            {workTypes.map((type, index) => (
                <div
                    key={index}
                    className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${type.lightColor} transition-all duration-200 group-hover:scale-110`}>
                      <type.icon className={`w-4 h-4 ${type.textColor}`} />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${type.color} shadow-sm`}></div>
                      <span className="font-medium text-slate-700">{type.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${type.textColor}`}>
                    {type.value}
                  </span>
                      <span className="text-sm text-slate-500">
                    ({type.percent.toFixed(1)}%)
                  </span>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Applications</span>
              <span className="font-bold text-slate-800">{total}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ApplicationSummary;