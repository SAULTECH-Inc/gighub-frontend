import { FC } from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";
import JobStatCard from "../features/JobStatCard.tsx";

const BelowJobStats: FC = () => {
  return (
    <div className="flex w-full flex-col gap-x-6 gap-y-3 lg:flex-row lg:items-center lg:justify-evenly">
      <JobStatCard />
      <ApplicationSummary />
    </div>
  );
};

export default BelowJobStats;
