import { FC } from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";
import JobMatchCard from "../features/JobMatchCard.tsx";

const BelowApplicationStats: FC = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-x-4 gap-y-4 md:grid md:grid-cols-[63%_35%] md:items-center md:justify-evenly">
        <JobMatchCard />
        <ApplicationSummary />
      </div>
    </>
  );
};

export default BelowApplicationStats;
