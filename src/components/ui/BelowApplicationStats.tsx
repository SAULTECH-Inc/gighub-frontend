import {FC} from "react";
import ApplicationSummary from "./ApplicationSummary.tsx";
import JobMatchCard from "../features/JobMatchCard.tsx";


const BelowApplicationStats: FC = ()=>{
    return <>
        <div className="w-full flex flex-col md:grid md:grid-cols-[60%_35%] md:items-center md:justify-evenly gap-x-6 gap-y-3">
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
