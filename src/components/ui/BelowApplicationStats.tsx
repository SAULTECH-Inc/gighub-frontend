import JobMatchCard from "./JobMatchCard.tsx";
import {FC} from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";

const BelowApplicationStats: FC = ()=>{
    return <>
        <div className="w-full flex items-center justify-between">
            <div className="h-[382px] w-[70%]">
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
            </div>
            <div className="h-[382px] w-[28%]">
                <ApplicationSummary/>
            </div>
        </div>

    </>
}

export default BelowApplicationStats;