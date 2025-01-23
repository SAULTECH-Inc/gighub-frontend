
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import ApplicationStats from "../components/ui/ApplicationStats.tsx";
import BelowApplicationStats from "../components/ui/BelowApplicationStats.tsx";
import ApplicantRecentApplications from "../components/ui/ApplicantRecentApplications.tsx";
import ApplicantMessages from "../components/ui/ApplicantMessages.tsx";
import ApplicantSchedules from "../components/ui/ApplicantSchedules.tsx";

export const ApplicantDashboard = () => {
    return (
        <>
            <div className="bg-[#F7F7F7]">
                <ApplicantNavBar/>
                <div
                    className="px-6 py-6 bg-gray-100 grid grid-cols-[1024px_396px] gap-6 min-h-screen items-start justify-center">
                    {/* First Column */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <div className="w-full flex justify-center">
                            <ApplicationStats/>
                        </div>
                        <div className="w-full flex justify-center">
                            <BelowApplicationStats/>
                        </div>
                        <div className="w-full flex justify-center">
                            <ApplicantRecentApplications/>
                        </div>
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <div className="w-full flex justify-center">
                            <ApplicantSchedules/>
                        </div>
                        <div className="w-full flex justify-center">
                            <ApplicantMessages/>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};
