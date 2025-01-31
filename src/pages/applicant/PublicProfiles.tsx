import { FC } from "react";
import ApplicantNavBar from "../../components/layouts/ApplicantNavBar.tsx";
import AboutUs from "../../components/public-profile/AboutUs.tsx";
import MediaAndGallery from "../../components/public-profile/MediaAndGallery.tsx";
import CurrentJobOpening from "../../components/public-profile/CurrentJobOpening.tsx";
import EmployeesTestimonials from "../../components/public-profile/EmployeesTestimonials.tsx";
import ReviewsAndRatings from "../../components/public-profile/ReviewsAndRatings.tsx";
import ContactInfo from "../../components/public-profile/ContactInfo.tsx";
import DashboardProfileCard from "../../components/public-profile/PublicProfileCard.tsx";


const PublicProfile: FC = () => {
    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            <ApplicantNavBar />
            <div className="flex justify-center bg-gray-100 pt-6 gap-x-2 mx-auto">

                {/* Main Content */}
                <div className="w-full max-w-[1400px] bg-white border-[#E6E6E6] border-[1px] h-auto rounded-[16px] p-8 mx-4">
                    <div className="flex justify-between items-center text-[#6438C2] font-lato text-[20px] pb-4">
                    </div>
                    <DashboardProfileCard />

                    {/* Form */}
                    <form className="space-y-8">
                        <AboutUs/>
                        <MediaAndGallery />
                        <CurrentJobOpening />
                        <EmployeesTestimonials />
                        <ReviewsAndRatings />
                        <ContactInfo/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
