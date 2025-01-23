
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
                <ApplicantNavBar />
                <div className="p-6 bg-gray-100 grid-cols-2 min-h-screen">
                    <div className="w-full">
                        <ApplicationStats/>
                        <BelowApplicationStats/>
                        <ApplicantRecentApplications/>
                    </div>
                    <div className="w-full">
                        <ApplicantSchedules/>
                        <ApplicantMessages/>
                    </div>
                </div>
            </div>
        </>
    );
};
