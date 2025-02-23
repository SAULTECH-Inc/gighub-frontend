import {FC} from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";
import JobStatCard from "../features/JobStatCard.tsx";

const BelowJobStats: FC = ()=>{
    return <>
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-evenly gap-x-6 gap-y-3">
            <JobStatCard/>
            <ApplicationSummary/>
        </div>

    </>
}

export default BelowJobStats;