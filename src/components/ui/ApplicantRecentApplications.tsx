import {FC} from "react";
import ApplicationCard from "./ApplicationCard.tsx";
import recentApplicationLogo from "../../assets/images/recentApplicationLogo.png"
const ApplicantRecentApplications: FC = ()=>{
    return <>
        <div className="w-full col-span-8 space-y-4 h-[365px]">
            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-[16px] shadow">
                <h2 className="text-xl font-semibold mb-6">Recent Application</h2>
                <div className="grid gap-y-4">
                    {/* Application 1 */}
                    <ApplicationCard
                        image={recentApplicationLogo}
                        jobTitle="Product Designer"
                        location="Lagos, Nigeria"
                        companyName="Fundy Inc"
                        status="Pending"
                        statusColor="#FFD900"
                        buttonText="View Details"
                    />

                    {/* Application 2 */}
                    <ApplicationCard
                        image={recentApplicationLogo}
                        jobTitle="Product Designer"
                        location="Lagos, Nigeria"
                        companyName="Fundy Inc"
                        status="Interview Scheduled"
                        statusColor="#FD7E14"
                        buttonText="View Details"
                    />

                    {/* Application 3 */}
                    <ApplicationCard
                        image={recentApplicationLogo}
                        jobTitle="Product Designer"
                        location="Lagos, Nigeria"
                        companyName="Fundy Inc"
                        status="Hired"
                        statusColor="#65FF81"
                        buttonText="View Details"
                    />
                </div>
            </div>
        </div>
    </>
}

export default ApplicantRecentApplications;