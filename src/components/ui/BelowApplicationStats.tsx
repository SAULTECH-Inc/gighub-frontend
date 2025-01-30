import JobMatchCard from "../features/JobMatchCard.tsx";
import {FC} from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";

const BelowApplicationStats: FC = ()=>{
    return <>
        <div className="w-full flex items-center justify-evenly gap-x-6">
            <JobMatchCard
                title="Visual Designer"
                company="Facebook"
                tags={['UIUX', 'Blender']}
                description="The Visual Designer conveys design concepts into wireframes and high fidelity, quality prototypes to match project requirements, objectives, and brand guide."
                location="Lagos, Nigeria"
                type="Full-Time"
                applicants={76}
                daysLeft={4}
            />
            <ApplicationSummary/>
        </div>

    </>
}

export default BelowApplicationStats;