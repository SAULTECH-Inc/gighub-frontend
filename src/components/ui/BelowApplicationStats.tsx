import { FC } from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";
import JobMatchCard from "../features/JobMatchCard.tsx";
import {LAYOUT} from "../../pages/applicant/ApplicantDashboard.tsx";

const BelowApplicationStats: FC = () => {
    return (
        <div className={`grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] ${LAYOUT.gridGap}`}>
            <JobMatchCard />
            <ApplicationSummary />
        </div>
    );
};

export default BelowApplicationStats;