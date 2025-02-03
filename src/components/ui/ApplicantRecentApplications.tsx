import {FC} from "react";
import ApplicationCard from "./ApplicationCard.tsx";
import recentApplicationLogo from "../../assets/images/recentApplicationLogo.png"

const ApplicantRecentApplications: FC = () => {
    return <>
        <div className="w-full col-span-8 space-y-4 h-[365px]">
            {/* Recent Applications */}
            <div className="bg-white p-3 md:p-6 rounded-[16px] shadow">
                <h2 className="text-lg md:text-xl font-semibold mb-6">Recent Application</h2>
                {/*Status indicator*/}
                <div className="md:hidden flex items-center space-x-4 mb-4">
                    <div className="flex justify-evenly items-center gap-x-2">
                     <span
                         className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full flex-shrink-0"
                         style={{backgroundColor: "#D32F2F"}}
                     ></span>
                        <span className="text-[#6B5AED] text-sm">Pending</span>
                    </div>
                    <div className="flex justify-evenly items-center gap-x-2">
                            <span
                                className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full flex-shrink-0"
                                style={{backgroundColor: "#FFD900"}}
                            ></span>


                        <span className="text-[#6B5AED] text-sm">Scheduled</span>
                    </div>
                    <div className="flex justify-evenly items-center gap-x-2">
                          <span
                              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full flex-shrink-0"
                              style={{backgroundColor: "#4CD137"}}
                          ></span>

                        <span className="text-[#6B5AED] text-sm">Hired</span>
                    </div>
                </div>
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