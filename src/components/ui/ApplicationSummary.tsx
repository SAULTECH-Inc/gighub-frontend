import { FC } from "react";
import { useMetrics } from "../../store/useMetrics.ts";

const ApplicationSummary: FC = () => {
  const { metric } = useMetrics();
  const total = metric.jobsApplied;

  // Guard against division by zero
  const onsitePercent = total ? (metric.onsite / total) * 100 : 0;
  const remotePercent = total ? (metric.remote / total) * 100 : 0;
  const hybridPercent = total ? (metric.hybrid / total) * 100 : 0;
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[16px] bg-white p-4 px-8 pb-20 shadow">
      <h2 className="font-bold-[700] mb-4 flex justify-center font-lato text-xl font-[20px]">
        Application Summary
      </h2>
      <hr className="mx-auto mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Horizontal Bar */}
      <div className="mb-6 flex h-[12px] w-full justify-center space-x-0 overflow-hidden rounded-full">
        <span style={{ width: `${onsitePercent}%` }} className="bg-[#56E5A1]" />
        <span style={{ width: `${remotePercent}%` }} className="bg-[#6438C2]" />
        <span style={{ width: `${hybridPercent}%` }} className="bg-[#FD7E14]" />
      </div>

      {/* List Items */}
      <ul className="space-y-8">
        {/* Onsite */}
        <li className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-[#56E5A1]"></div>
            <span className="text-gray-700 font-[16px]">Onsite</span>
          </div>
          <span className="font-bold text-green-500">{metric.onsite}</span>
        </li>

        {/* Remote */}
        <li className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-[#6438C2]"></div>
            <span className="text-gray-700 font-[16px]">Remote</span>
          </div>
          <span className="font-bold text-blue-500">{metric.remote}</span>
        </li>

        {/* Hybrid */}
        <li className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-[#FD7E14]"></div>
            <span className="text-gray-700 font-[16px]">Hybrid</span>
          </div>
          <span className="text-orange-500 font-bold">{metric.hybrid}</span>
        </li>
      </ul>
    </div>
  );
};

export default ApplicationSummary;
